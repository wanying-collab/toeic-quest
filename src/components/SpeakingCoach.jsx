import { useEffect, useMemo, useRef, useState } from "react";

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalizeText(text).split(" ").filter(Boolean);
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let row = 0; row <= a.length; row += 1) {
    matrix[row][0] = row;
  }
  for (let col = 0; col <= b.length; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row <= a.length; row += 1) {
    for (let col = 1; col <= b.length; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function similarityScore(source, target) {
  const normalizedSource = normalizeText(source);
  const normalizedTarget = normalizeText(target);

  if (!normalizedSource || !normalizedTarget) {
    return 0;
  }

  const distance = levenshtein(normalizedSource, normalizedTarget);
  return Math.max(
    0,
    Math.round((1 - distance / Math.max(normalizedSource.length, normalizedTarget.length)) * 100),
  );
}

function analyzeShadowing(targetText, transcript, durationSeconds, confidence = 0.7) {
  const targetTokens = tokenize(targetText);
  const spokenTokens = tokenize(transcript);
  const matchedTokens = targetTokens.filter((token) => spokenTokens.includes(token));
  const missingTokens = targetTokens.filter((token) => !spokenTokens.includes(token));
  const completeness = Math.round((matchedTokens.length / Math.max(1, targetTokens.length)) * 100);
  const pronunciation = Math.round(similarityScore(transcript, targetText) * 0.7 + confidence * 30);
  const idealDuration = Math.max(1.2, targetTokens.length * 0.7);
  const durationGap = Math.abs(durationSeconds - idealDuration);
  const fluencyBase = Math.max(0, 100 - Math.round((durationGap / idealDuration) * 45));
  const fillerPenalty = (spokenTokens.filter((token) => ["uh", "um", "er"].includes(token)).length ?? 0) * 8;
  const fluency = Math.max(0, fluencyBase - fillerPenalty);
  const overall = Math.round(pronunciation * 0.4 + fluency * 0.3 + completeness * 0.3);

  const suggestions = [];
  if (missingTokens.length > 0) {
    suggestions.push(`Try to clearly say: ${missingTokens.slice(0, 4).join(", ")}`);
  }
  if (pronunciation < 75) {
    suggestions.push("Slow down a little and copy the stress pattern of the model audio.");
  }
  if (fluency < 70) {
    suggestions.push("Keep a steady pace and avoid stopping between small chunks.");
  }

  return {
    pronunciation,
    fluency,
    completeness,
    overall,
    missingTokens,
    suggestions,
  };
}

function analyzeInterview(response, keywords, durationSeconds, confidence = 0.7) {
  const spokenTokens = tokenize(response);
  const coveredKeywords = keywords.filter((keyword) =>
    normalizeText(response).includes(normalizeText(keyword)),
  );
  const completeness = Math.round(
    ((coveredKeywords.length / Math.max(1, keywords.length)) * 70 +
      Math.min(spokenTokens.length / 35, 1) * 30),
  );
  const pronunciation = Math.round(confidence * 100 * 0.65 + Math.min(spokenTokens.length * 2, 35));
  const idealDuration = 18;
  const durationGap = Math.abs(durationSeconds - idealDuration);
  const fluency = Math.max(0, 100 - Math.round((durationGap / idealDuration) * 35));
  const overall = Math.round(pronunciation * 0.35 + fluency * 0.3 + completeness * 0.35);

  const suggestions = [];
  if (coveredKeywords.length < keywords.length) {
    suggestions.push(`Try adding these ideas: ${keywords.filter((item) => !coveredKeywords.includes(item)).join(", ")}`);
  }
  if (spokenTokens.length < 18) {
    suggestions.push("Add one more detail or example so your answer feels more complete.");
  }
  if (fluency < 70) {
    suggestions.push("Keep your answer flowing for one more sentence before stopping.");
  }

  return {
    pronunciation,
    fluency,
    completeness,
    overall,
    coveredKeywords,
    suggestions,
  };
}

const interviewPrompts = [
  {
    id: "int-1",
    title: "Self Introduction",
    question: "Please introduce yourself and explain your current work or study focus.",
    keywords: ["work", "study", "responsible", "goal"],
    tip: "Use 3 parts: who you are, what you do, and what you want to improve.",
  },
  {
    id: "int-2",
    title: "Manufacturing Background",
    question: "Describe your experience with production, inventory, or scheduling.",
    keywords: ["production", "inventory", "schedule", "improve"],
    tip: "Mention at least one process you know and one improvement you want to make.",
  },
  {
    id: "int-3",
    title: "Customer Problem",
    question: "How would you respond if a customer reported a delayed shipment?",
    keywords: ["apologize", "shipment", "check", "update"],
    tip: "Show empathy first, then explain the next action.",
  },
  {
    id: "int-4",
    title: "Career Goal",
    question: "What kind of job do you hope to do after improving your English?",
    keywords: ["job", "English", "future", "improve"],
    tip: "Use future tense and connect the answer to TOEIC goals.",
  },
];

function SpeakingCoach({ words, patterns, onSpeak, onRecordAnswer }) {
  const wordTargets = useMemo(
    () =>
      words
        .filter((item) => !item.word.includes(" "))
        .slice(0, 120)
        .map((item) => ({
          id: item.id,
          title: item.word,
          subtitle: item.meaning,
          text: item.word,
          category: item.category,
          relatedWordId: item.id,
        })),
    [words],
  );

  const sentenceTargets = useMemo(
    () =>
      patterns.slice(0, 120).map((item) => ({
        id: item.id,
        title: item.pattern,
        subtitle: item.exampleZh,
        text: item.example,
        category: item.category,
      })),
    [patterns],
  );

  const [tab, setTab] = useState("pronunciation");
  const [wordIndex, setWordIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [interviewIndex, setInterviewIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [audioSupported, setAudioSupported] = useState(true);
  const [recordedUrl, setRecordedUrl] = useState("");
  const [result, setResult] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const startTimeRef = useRef(0);
  const confidenceRef = useRef(0.7);

  const activeWord = wordTargets[wordIndex];
  const activeSentence = sentenceTargets[sentenceIndex];
  const activeInterview = interviewPrompts[interviewIndex];

  useEffect(() => () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, [recordedUrl]);

  const resetSession = () => {
    setTranscript("");
    setResult(null);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedUrl("");
  };

  const stopStreams = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
  };

  const handleTabChange = (nextTab) => {
    if (isRecording) {
      stopStreams();
    }
    setTab(nextTab);
    resetSession();
  };

  const startRecording = async () => {
    resetSession();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setAudioSupported(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
      };

      recorder.start();
      recorderRef.current = recorder;
      startTimeRef.current = Date.now();
      confidenceRef.current = 0.7;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.onresult = (event) => {
          let nextTranscript = "";
          let confidenceTotal = 0;
          let confidenceCount = 0;

          for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const resultItem = event.results[index][0];
            nextTranscript += `${resultItem.transcript} `;
            if (typeof resultItem.confidence === "number" && resultItem.confidence > 0) {
              confidenceTotal += resultItem.confidence;
              confidenceCount += 1;
            }
          }

          if (confidenceCount > 0) {
            confidenceRef.current = confidenceTotal / confidenceCount;
          }

          setTranscript(nextTranscript.trim());
        };
        recognition.onerror = () => {
          setRecognitionSupported(false);
        };
        recognition.start();
        recognitionRef.current = recognition;
      } else {
        setRecognitionSupported(false);
      }

      setIsRecording(true);
    } catch {
      setAudioSupported(false);
    }
  };

  const stopRecording = () => {
    stopStreams();
  };

  const scoreCurrentPractice = () => {
    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    let analysis = null;
    let prompt = "";
    let reason = "";
    let category = "";
    let relatedWordId;

    if (tab === "pronunciation") {
      prompt = activeWord.text;
      category = "Pronunciation";
      relatedWordId = activeWord.relatedWordId;
      analysis = analyzeShadowing(activeWord.text, transcript, durationSeconds, confidenceRef.current);
      reason = `Target word: ${activeWord.text}`;
    } else if (tab === "shadowing") {
      prompt = activeSentence.text;
      category = "Shadowing";
      analysis = analyzeShadowing(activeSentence.text, transcript, durationSeconds, confidenceRef.current);
      reason = `Target sentence: ${activeSentence.text}`;
    } else {
      prompt = activeInterview.question;
      category = "Interview Practice";
      analysis = analyzeInterview(transcript, activeInterview.keywords, durationSeconds, confidenceRef.current);
      reason = activeInterview.tip;
    }

    setResult({
      ...analysis,
      durationSeconds,
    });

    onRecordAnswer({
      domain: "speaking",
      itemId:
        tab === "pronunciation"
          ? `speaking-${activeWord.id}`
          : tab === "shadowing"
            ? `shadow-${activeSentence.id}`
            : `interview-${activeInterview.id}`,
      relatedWordId,
      category,
      prompt,
      correct: analysis.overall >= 70,
      userAnswer: transcript || "(no transcript captured)",
      correctAnswer: prompt,
      explanationZh: `Pronunciation ${analysis.pronunciation} / Fluency ${analysis.fluency} / Completeness ${analysis.completeness}`,
      reason,
    });
  };

  return (
    <section className="page-shell">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">AI Speaking Lab</p>
          <h2>發音、跟讀、口說一起練</h2>
          <p className="hero-description">
            這裡會用瀏覽器的語音播放、錄音和語音辨識，幫你練單字發音、句子 shadowing 和英文面試回答。
          </p>
        </div>
      </div>

      <div className="quest-card filter-bar">
        <div className="tabs">
          <button
            type="button"
            className={`tab-button ${tab === "pronunciation" ? "active" : ""}`}
            onClick={() => handleTabChange("pronunciation")}
          >
            Pronunciation Coach
          </button>
          <button
            type="button"
            className={`tab-button ${tab === "shadowing" ? "active" : ""}`}
            onClick={() => handleTabChange("shadowing")}
          >
            Shadowing Coach
          </button>
          <button
            type="button"
            className={`tab-button ${tab === "interview" ? "active" : ""}`}
            onClick={() => handleTabChange("interview")}
          >
            Interview Practice
          </button>
        </div>
      </div>

      {tab === "pronunciation" && activeWord && (
        <article className="quest-card resource-card">
          <p className="eyebrow">{activeWord.category}</p>
          <h3>{activeWord.title}</h3>
          <p className="word-meaning">{activeWord.subtitle}</p>
          <div className="card-row">
            <button type="button" className="secondary-button" onClick={() => onSpeak(activeWord.text)}>
              Play Word
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setWordIndex((value) => (value + 1) % wordTargets.length);
                resetSession();
              }}
            >
              Next Word
            </button>
          </div>
        </article>
      )}

      {tab === "shadowing" && activeSentence && (
        <article className="quest-card resource-card">
          <p className="eyebrow">{activeSentence.category}</p>
          <h3>{activeSentence.title}</h3>
          <p className="word-example-zh">{activeSentence.subtitle}</p>
          <div className="card-row">
            <button type="button" className="secondary-button" onClick={() => onSpeak(activeSentence.text)}>
              Play Sentence
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setSentenceIndex((value) => (value + 1) % sentenceTargets.length);
                resetSession();
              }}
            >
              Next Sentence
            </button>
          </div>
        </article>
      )}

      {tab === "interview" && activeInterview && (
        <article className="quest-card resource-card">
          <p className="eyebrow">Interview Practice</p>
          <h3>{activeInterview.title}</h3>
          <p>{activeInterview.question}</p>
          <div className="tip-box">
            <strong>Answer tip</strong>
            <p>{activeInterview.tip}</p>
            <p>Keywords: {activeInterview.keywords.join(" / ")}</p>
          </div>
          <div className="card-row">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setInterviewIndex((value) => (value + 1) % interviewPrompts.length);
                resetSession();
              }}
            >
              Next Prompt
            </button>
          </div>
        </article>
      )}

      <article className="quest-card">
        <div className="card-row">
          {!isRecording ? (
            <button type="button" className="primary-button" onClick={startRecording}>
              Start Recording
            </button>
          ) : (
            <button type="button" className="primary-button" onClick={stopRecording}>
              Stop Recording
            </button>
          )}
          <button
            type="button"
            className="secondary-button"
            onClick={scoreCurrentPractice}
            disabled={isRecording || !transcript.trim()}
          >
            Score My Voice
          </button>
        </div>

        {!audioSupported && (
          <p className="feedback-inline warn">
            This browser does not allow recording right now. Try granting microphone access.
          </p>
        )}
        {!recognitionSupported && (
          <p className="feedback-inline warn">
            Speech recognition is limited in this browser, so transcript accuracy may be lower.
          </p>
        )}

        <div className="tip-box">
          <strong>Your transcript</strong>
          <p>{transcript || "Start recording and speak after listening to the model audio."}</p>
        </div>

        {recordedUrl && (
          <div className="tip-box">
            <strong>Your recording</strong>
            <audio controls src={recordedUrl} />
          </div>
        )}

        {result && (
          <div className="dashboard-grid">
            <div className="metric-card">
              <span>Pronunciation</span>
              <strong>{result.pronunciation}</strong>
            </div>
            <div className="metric-card">
              <span>Fluency</span>
              <strong>{result.fluency}</strong>
            </div>
            <div className="metric-card">
              <span>Completeness</span>
              <strong>{result.completeness}</strong>
            </div>
            <div className="metric-card">
              <span>Overall</span>
              <strong>{result.overall}</strong>
            </div>
            <div className="metric-card">
              <span>Duration</span>
              <strong>{result.durationSeconds}s</strong>
            </div>
          </div>
        )}

        {result?.suggestions?.length > 0 && (
          <div className="tip-box">
            <strong>Coach feedback</strong>
            <ul>
              {result.suggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </section>
  );
}

export default SpeakingCoach;
