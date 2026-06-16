function toCountMap(items, getKey) {
  return items.reduce((map, item) => {
    const key = getKey(item);
    if (!key) {
      return map;
    }
    map[key] = (map[key] ?? 0) + 1;
    return map;
  }, {});
}

export function buildAdaptiveProfile(answerLog = [], mistakes = [], reviewMap = {}) {
  const recent50 = answerLog.slice(-50);
  const recentWrong = answerLog.filter((item) => !item.correct).slice(-30);
  const recentCorrect = answerLog.filter((item) => item.correct).slice(-30);

  return {
    recentItemCounts: toCountMap(recent50, (item) => `${item.domain}:${item.itemId}`),
    recentWordCounts: toCountMap(recent50, (item) => item.relatedWordId),
    recentWrongWordCounts: toCountMap(recentWrong, (item) => item.relatedWordId),
    recentCorrectWordCounts: toCountMap(recentCorrect, (item) => item.relatedWordId),
    recentWrongCategoryCounts: toCountMap(recentWrong, (item) => item.category),
    mistakeCounts: mistakes.reduce((map, item) => {
      map[`${item.domain}:${item.itemId}`] = item.wrongCount;
      return map;
    }, {}),
    reviewMap,
  };
}

export function weightedPick(items, getWeight) {
  if (!items.length) {
    return null;
  }

  const weighted = items.map((item) => ({
    item,
    weight: Math.max(0.01, getWeight(item)),
  }));

  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let pointer = Math.random() * total;

  for (let index = 0; index < weighted.length; index += 1) {
    pointer -= weighted[index].weight;
    if (pointer <= 0) {
      return weighted[index].item;
    }
  }

  return weighted[weighted.length - 1].item;
}

export function pickAdaptiveItem(items, profile, config = {}) {
  const {
    domain = "general",
    getItemId = (item) => item.id,
    getRelatedWordId = (item) => item.relatedWordId ?? item.id,
    getCategory = (item) => item.category,
    getReviewKey = (item) => `${domain}:${getItemId(item)}`,
    getIsMastered = (item) => Boolean(item.mastered),
  } = config;

  return weightedPick(items, (item) => {
    const itemId = `${domain}:${getItemId(item)}`;
    const wordId = getRelatedWordId(item);
    const category = getCategory(item);
    const reviewKey = getReviewKey(item);
    const reviewEntry = profile.reviewMap?.[reviewKey];

    let weight = 1;

    const recentItemCount = profile.recentItemCounts?.[itemId] ?? 0;
    const recentWordCount = wordId ? profile.recentWordCounts?.[wordId] ?? 0 : 0;
    const recentWrongWordCount = wordId ? profile.recentWrongWordCounts?.[wordId] ?? 0 : 0;
    const recentCorrectWordCount = wordId ? profile.recentCorrectWordCounts?.[wordId] ?? 0 : 0;
    const recentWrongCategoryCount = category ? profile.recentWrongCategoryCounts?.[category] ?? 0 : 0;
    const mistakeCount = profile.mistakeCounts?.[itemId] ?? 0;

    if (recentItemCount > 0) {
      weight *= 0.04;
    }

    if (recentWordCount > 0) {
      weight *= 0.15;
    }

    if (recentWrongWordCount > 0) {
      weight *= 2.2 + recentWrongWordCount * 0.55;
    }

    if (recentCorrectWordCount > 0) {
      weight *= 0.45;
    }

    if (recentWrongCategoryCount > 0) {
      weight *= 1 + recentWrongCategoryCount * 0.2;
    }

    if (mistakeCount > 0) {
      weight *= 1 + Math.min(mistakeCount, 6) * 0.25;
    }

    if (reviewEntry && reviewEntry.mastered) {
      weight *= 0.35;
    } else if (reviewEntry?.nextReviewAt) {
      weight *= 1.15;
    }

    if (getIsMastered(item)) {
      weight *= 0.35;
    }

    return weight;
  });
}
