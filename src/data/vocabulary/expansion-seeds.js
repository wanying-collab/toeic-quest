function parseSeedRows(source) {
  return source
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [word, meaning, partOfSpeech, category, level, frequency, collocations] = line.split("|");
      return {
        word,
        meaning,
        partOfSpeech,
        category,
        level,
        frequency: Number(frequency),
        collocations: (collocations ?? "")
          .split(";")
          .map((item) => item.trim())
          .filter(Boolean),
      };
    });
}

const officeRows = `
access|存取權限|noun|Office|easy|4|grant access;restrict access
allocation|分配|noun|Office|normal|4|review the allocation;adjust the allocation
announcement|公告|noun|Office|easy|4|post the announcement;review the announcement
archive|歸檔|verb|Office|easy|4|archive the records;archive the contract
arrangement|安排|noun|Office|normal|4|confirm the arrangement;adjust the arrangement
bulletin|公告欄通知|noun|Office|easy|3|post the bulletin;read the bulletin
calendar|行事曆|noun|Office|easy|4|update the calendar;check the calendar
clerk|辦事員|noun|Office|easy|3|assist the clerk;contact the clerk
code|代碼|noun|Office|normal|3|enter the code;verify the code
confirmation|確認通知|noun|Office|easy|4|send the confirmation;check the confirmation
copy|副本|noun|Office|easy|4|make a copy;file the copy
courier|快遞員|noun|Office|normal|3|contact the courier;track the courier
credential|憑證|noun|Office|green|3|verify the credential;renew the credential
desk|辦公桌|noun|Office|easy|3|clean the desk;arrange the desk
directory|名錄|noun|Office|normal|3|update the directory;check the directory
duplicate|副本|noun|Office|normal|3|prepare the duplicate;store the duplicate
entry|條目|noun|Office|easy|3|check the entry;update the entry
extension|分機號碼|noun|Office|easy|3|dial the extension;confirm the extension
fax|傳真|noun|Office|easy|2|send the fax;review the fax
handbook|手冊|noun|Office|normal|3|read the handbook;update the handbook
header|標題列|noun|Office|normal|2|check the header;edit the header
index|索引|noun|Office|normal|3|update the index;review the index
input|輸入資料|noun|Office|normal|3|check the input;correct the input
instruction|指示|noun|Office|easy|4|follow the instruction;review the instruction
intercom|對講機|noun|Office|normal|2|use the intercom;check the intercom
label|標籤|noun|Office|easy|3|print the label;attach the label
locker|置物櫃|noun|Office|easy|2|open the locker;lock the locker
log|紀錄|noun|Office|normal|3|update the log;review the log
manual|手冊|noun|Office|normal|4|read the manual;revise the manual
notice|通知|noun|Office|easy|4|read the notice;post the notice
office|辦公室|noun|Office|easy|5|open the office;clean the office
organizer|收納盒；主辦者|noun|Office|normal|2|use the organizer;prepare the organizer
outlet|插座；通路|noun|Office|normal|3|check the outlet;repair the outlet
paperwork|文書作業|noun|Office|normal|4|complete the paperwork;review the paperwork
paragraph|段落|noun|Office|easy|2|revise the paragraph;read the paragraph
permission|許可|noun|Office|normal|4|request permission;grant permission
placement|放置位置；安排|noun|Office|green|3|check the placement;change the placement
priority|優先順序|noun|Office|normal|4|set the priority;review the priority
procedure|程序|noun|Office|normal|4|follow the procedure;update the procedure
reception|接待處|noun|Office|easy|4|call the reception;visit the reception
record|紀錄|noun|Office|easy|4|update the record;review the record
register|登記簿|noun|Office|normal|3|check the register;sign the register
reminder|提醒事項|noun|Office|easy|4|send a reminder;set the reminder
revision|修訂版|noun|Office|normal|3|review the revision;submit the revision
routine|例行工作|noun|Office|normal|3|follow the routine;improve the routine
shelf|架子|noun|Office|easy|2|clean the shelf;arrange the shelf
stamp|印章；郵票|noun|Office|easy|2|use the stamp;buy the stamp
submission|提交資料|noun|Office|normal|4|review the submission;confirm the submission
switchboard|總機|noun|Office|green|2|call the switchboard;check the switchboard
task|任務|noun|Office|easy|4|finish the task;assign the task
template|範本|noun|Office|normal|4|update the template;use the template
tray|文件盤|noun|Office|easy|2|place the tray;clean the tray
verification|驗證|noun|Office|green|3|complete the verification;check the verification
visitor|訪客|noun|Office|easy|4|greet the visitor;register the visitor
worksheet|工作表|noun|Office|easy|3|complete the worksheet;review the worksheet
workspace|工作區|noun|Office|easy|3|organize the workspace;prepare the workspace
attendance|出席情況|noun|Office|normal|3|check attendance;record attendance
checkpoint|檢查點|noun|Office|green|2|review the checkpoint;reach the checkpoint
checkpointing|檢查流程|noun|Office|blue|1|review the checkpointing;improve the checkpointing
dispatch|派送通知|noun|Office|normal|3|review the dispatch;confirm the dispatch
excerpt|摘錄|noun|Office|green|2|read the excerpt;share the excerpt
filing|歸檔作業|noun|Office|normal|3|improve the filing;check the filing
heading|標題|noun|Office|easy|2|edit the heading;read the heading
notation|註記|noun|Office|green|2|review the notation;add the notation
packet|資料包|noun|Office|normal|3|prepare the packet;deliver the packet
portfolio|資料作品集|noun|Office|green|3|review the portfolio;update the portfolio
scan|掃描|verb|Office|easy|3|scan the document;scan the receipt
sort|分類整理|verb|Office|easy|3|sort the files;sort the mail
verify|核對|verb|Office|normal|4|verify the details;verify the record
wrap|包裝|verb|Office|easy|2|wrap the package;wrap the samples
`;

const businessRows = `
affiliate|關係企業|noun|Business|green|3|review the affiliate;contact the affiliate
alliance|聯盟|noun|Business|green|3|form an alliance;review the alliance
ambition|企圖心|noun|Business|normal|2|discuss the ambition;encourage the ambition
authorization|授權|noun|Business|green|4|request authorization;grant authorization
branch|分公司|noun|Business|easy|4|open a branch;visit the branch
broker|經紀人|noun|Business|green|3|contact the broker;consult the broker
commerce|商業活動|noun|Business|normal|3|study commerce;support commerce
commitment|承諾|noun|Business|normal|4|honor the commitment;review the commitment
competitor|競爭對手|noun|Business|normal|4|analyze the competitor;monitor the competitor
consultant|顧問|noun|Business|normal|4|hire a consultant;consult the consultant
consumer|消費者|noun|Business|easy|4|survey the consumer;understand the consumer
cooperation|合作|noun|Business|normal|4|promote cooperation;improve cooperation
corporation|公司；法人|noun|Business|normal|4|establish the corporation;review the corporation
credibility|可信度|noun|Business|green|3|build credibility;improve credibility
delegation|委派；代表團|noun|Business|green|3|welcome the delegation;lead the delegation
demand|需求|noun|Business|easy|5|estimate demand;measure demand
entrepreneur|創業者|noun|Business|green|3|support the entrepreneur;interview the entrepreneur
expansion|擴張|noun|Business|normal|4|plan the expansion;approve the expansion
exposure|曝光度|noun|Business|green|3|increase exposure;measure exposure
franchise|加盟權|noun|Business|green|3|purchase the franchise;manage the franchise
goal|目標|noun|Business|easy|5|set the goal;review the goal
growth|成長|noun|Business|easy|5|support growth;measure growth
incentive|獎勵措施|noun|Business|normal|4|offer an incentive;review the incentive
initiative|計畫；主動性|noun|Business|normal|4|launch the initiative;support the initiative
insight|洞察|noun|Business|green|3|share the insight;gain insight
leadership|領導力|noun|Business|normal|4|develop leadership;show leadership
manager|經理|noun|Business|easy|5|consult the manager;inform the manager
mission|使命|noun|Business|normal|3|review the mission;share the mission
objective|目標|noun|Business|normal|4|define the objective;meet the objective
operation|營運|noun|Business|normal|4|improve the operation;review the operation
ownership|所有權|noun|Business|green|3|confirm ownership;transfer ownership
partner|合作夥伴|noun|Business|easy|4|contact the partner;meet the partner
partnership|合作關係|noun|Business|normal|4|build the partnership;renew the partnership
performance|表現；績效|noun|Business|easy|5|review performance;improve performance
perspective|觀點|noun|Business|green|3|share the perspective;consider the perspective
position|職位；立場|noun|Business|easy|4|accept the position;discuss the position
potential|潛力|noun|Business|normal|4|assess the potential;reach the potential
practice|做法；實務|noun|Business|normal|3|review the practice;improve the practice
principal|負責人；本金|noun|Business|green|2|contact the principal;confirm the principal
profitability|獲利能力|noun|Business|green|4|improve profitability;measure profitability
projection|預估數字|noun|Business|green|3|review the projection;update the projection
reputation|聲譽|noun|Business|normal|4|protect the reputation;build the reputation
resource|資源|noun|Business|easy|4|allocate the resource;review the resource
responsibility|責任|noun|Business|easy|4|accept responsibility;share responsibility
retailer|零售商|noun|Business|normal|3|contact the retailer;support the retailer
sector|產業部門|noun|Business|green|3|study the sector;enter the sector
sponsor|贊助者|noun|Business|normal|3|thank the sponsor;contact the sponsor
stability|穩定性|noun|Business|green|3|maintain stability;improve stability
status|狀態；身分|noun|Business|easy|4|check the status;update the status
tactic|策略手法|noun|Business|green|3|review the tactic;adjust the tactic
turnover|營業額；人員流動率|noun|Business|green|3|reduce turnover;measure turnover
venture|新事業；風險投資|noun|Business|green|3|launch the venture;finance the venture
vision|願景|noun|Business|normal|4|share the vision;define the vision
workload|工作量|noun|Business|normal|4|reduce the workload;review the workload
workplace|工作場所|noun|Business|easy|4|improve the workplace;inspect the workplace
ambitious|有企圖心的|adjective|Business|normal|3|support the ambitious plan;review the ambitious target
commercial|商業的|adjective|Business|normal|3|review the commercial plan;prepare the commercial launch
competitive|有競爭力的|adjective|Business|normal|4|maintain the competitive edge;improve the competitive offer
consistent|一致的|adjective|Business|normal|4|deliver consistent service;maintain consistent quality
efficient|有效率的|adjective|Business|easy|4|maintain efficient service;build an efficient process
flexible|彈性的|adjective|Business|easy|3|offer flexible terms;create a flexible schedule
global|全球的|adjective|Business|easy|4|review the global strategy;enter the global market
innovative|創新的|adjective|Business|normal|4|develop an innovative solution;launch an innovative product
profitable|有利可圖的|adjective|Business|green|4|build a profitable business;maintain a profitable model
strategic|策略性的|adjective|Business|green|4|review the strategic plan;support the strategic goal
authorize|授權|verb|Business|green|4|authorize the payment;authorize the purchase
coordinate|協調|verb|Business|normal|4|coordinate the launch;coordinate the schedule
delegate|委派|verb|Business|normal|4|delegate the task;delegate the review
expand|擴展|verb|Business|normal|4|expand the business;expand the service
forecast|預測|verb|Business|normal|4|forecast the demand;forecast the revenue
invest|投資|verb|Business|normal|4|invest in technology;invest in training
partner|合作|verb|Business|green|3|partner with a vendor;partner with a client
promote|推廣；升遷|verb|Business|normal|4|promote the brand;promote the product
`;

const financeRows = `
accountant|會計師|noun|Finance|normal|4|consult the accountant;hire the accountant
accrual|應計項目|noun|Accounting|blue|2|record the accrual;review the accrual
asset|資產|noun|Finance|normal|5|review the asset;record the asset
bankruptcy|破產|noun|Finance|blue|2|avoid bankruptcy;review the bankruptcy
billing|帳單作業|noun|Accounting|normal|4|review the billing;update the billing
bonus|獎金|noun|Finance|easy|4|approve the bonus;calculate the bonus
brokerage|經紀業務|noun|Banking|green|2|review the brokerage;contact the brokerage
capital|資本|noun|Finance|normal|5|raise capital;review the capital
cash|現金|noun|Finance|easy|5|count the cash;deposit the cash
commission|佣金|noun|Finance|normal|4|calculate the commission;pay the commission
cost|成本|noun|Finance|easy|5|reduce the cost;estimate the cost
creditworthiness|信用評等|noun|Banking|blue|2|assess creditworthiness;review creditworthiness
currency|貨幣|noun|Finance|normal|4|exchange the currency;check the currency
deficit|赤字|noun|Finance|green|4|reduce the deficit;report the deficit
deposit|存款|noun|Banking|easy|4|make a deposit;confirm the deposit
disbursement|撥款|noun|Accounting|green|3|approve the disbursement;track the disbursement
earnings|收益|noun|Finance|normal|4|report the earnings;increase the earnings
expenditure|支出|noun|Finance|green|4|review the expenditure;control the expenditure
fee|費用|noun|Finance|easy|4|pay the fee;reduce the fee
fiscal|財政的|adjective|Finance|green|4|review the fiscal plan;prepare the fiscal report
fund|基金；資金|noun|Finance|easy|4|manage the fund;raise the fund
funding|資金挹注|noun|Finance|normal|4|secure funding;review the funding
gain|收益|noun|Finance|normal|3|report the gain;measure the gain
income|收入|noun|Finance|easy|4|report the income;verify the income
inflation|通貨膨脹|noun|Finance|green|4|monitor inflation;measure inflation
installment|分期付款|noun|Finance|normal|4|pay the installment;review the installment
interest|利息|noun|Banking|easy|5|calculate the interest;pay the interest
investment|投資|noun|Finance|normal|5|review the investment;increase the investment
investor|投資人|noun|Finance|normal|4|update the investor;meet the investor
loan|貸款|noun|Banking|easy|5|approve the loan;apply for the loan
loss|損失|noun|Finance|normal|4|report the loss;reduce the loss
margin|利潤空間|noun|Finance|green|4|increase the margin;review the margin
maturity|到期日|noun|Banking|green|3|check the maturity;extend the maturity
net|淨額的|adjective|Finance|normal|3|review the net income;calculate the net profit
overdraft|透支|noun|Banking|green|3|avoid the overdraft;review the overdraft
pension|退休金|noun|Finance|green|3|review the pension;fund the pension
pricing|定價|noun|Finance|normal|4|review the pricing;adjust the pricing
principal|本金|noun|Banking|normal|4|pay the principal;review the principal
rebate|回扣；折讓|noun|Finance|normal|3|request the rebate;apply the rebate
remittance|匯款|noun|Banking|green|3|confirm the remittance;track the remittance
reserve|準備金|noun|Finance|green|4|increase the reserve;review the reserve
savings|存款；節省|noun|Banking|easy|4|build savings;protect the savings
securities|有價證券|noun|Banking|blue|2|trade the securities;review the securities
solvency|償付能力|noun|Insurance|blue|2|assess solvency;maintain solvency
subsidy|補助金|noun|Finance|green|3|apply for the subsidy;review the subsidy
surplus|盈餘|noun|Finance|green|3|report the surplus;manage the surplus
taxation|課稅制度|noun|Accounting|green|4|review the taxation;study the taxation
voucher|憑證；代金券|noun|Accounting|normal|4|check the voucher;issue the voucher
withdrawal|提款；撤回|noun|Banking|normal|4|confirm the withdrawal;process the withdrawal
withholding|預扣|noun|Accounting|blue|2|review the withholding;calculate the withholding
yield|收益率|noun|Finance|green|3|increase the yield;compare the yield
annuity|年金|noun|Insurance|blue|2|review the annuity;purchase the annuity
appreciation|增值|noun|Finance|green|3|report the appreciation;measure the appreciation
bookkeeping|記帳作業|noun|Accounting|green|3|review the bookkeeping;improve the bookkeeping
budgeting|預算編列|noun|Finance|normal|4|improve the budgeting;review the budgeting
cashier|出納員|noun|Finance|easy|3|contact the cashier;assist the cashier
creditor|債權人|noun|Finance|green|3|inform the creditor;repay the creditor
debtor|債務人|noun|Finance|green|3|contact the debtor;review the debtor
diversification|多元配置|noun|Finance|blue|3|review the diversification;plan the diversification
financing|融資|noun|Finance|green|4|arrange the financing;review the financing
guarantor|保證人|noun|Banking|green|3|contact the guarantor;confirm the guarantor
holdings|持有資產|noun|Finance|green|3|review the holdings;increase the holdings
liquidity|流動性|noun|Finance|green|4|monitor liquidity;improve liquidity
monetary|貨幣的|adjective|Finance|green|3|review the monetary policy;study the monetary trend
payable|應付的|adjective|Accounting|green|4|review the payable amount;update the payable balance
payee|收款人|noun|Banking|normal|3|confirm the payee;change the payee
payor|付款人|noun|Banking|green|2|identify the payor;review the payor
receipt|收據|noun|Finance|easy|5|check the receipt;print the receipt
revenue|營收|noun|Finance|easy|5|increase revenue;report revenue
statement|對帳單；聲明|noun|Finance|easy|4|review the statement;print the statement
tax|稅金|noun|Finance|easy|5|pay tax;calculate tax
transaction|交易|noun|Finance|easy|5|record the transaction;complete the transaction
treasury|財務部門；國庫|noun|Finance|green|3|consult the treasury;review the treasury
valuation|估值|noun|Finance|blue|4|review the valuation;update the valuation
write-off|呆帳沖銷|noun|Accounting|blue|2|approve the write-off;record the write-off
audit|稽核|noun|Accounting|green|5|conduct the audit;review the audit
budget|預算|noun|Finance|easy|5|review the budget;approve the budget
expense|費用|noun|Finance|easy|5|track the expense;reduce the expense
invoice|發票|noun|Finance|easy|5|issue an invoice;pay an invoice
payment|付款|noun|Finance|easy|5|process the payment;confirm the payment
profit|利潤|noun|Finance|easy|5|increase the profit;report the profit
salary|薪資|noun|Finance|easy|4|adjust the salary;review the salary
`;

const purchasingRows = `
availability|可取得性|noun|Purchasing|normal|4|check availability;confirm availability
bidder|投標者|noun|Purchasing|green|3|evaluate the bidder;contact the bidder
buyer|買方|noun|Purchasing|easy|4|contact the buyer;support the buyer
commodity|商品；原料|noun|Purchasing|green|3|purchase the commodity;track the commodity
consignment|寄售貨物|noun|Purchasing|green|3|check the consignment;receive the consignment
criterion|標準|noun|Purchasing|normal|4|review the criterion;set the criterion
demand|需求量|noun|Purchasing|easy|5|estimate demand;confirm demand
exporter|出口商|noun|Purchasing|green|3|contact the exporter;select the exporter
importer|進口商|noun|Purchasing|green|3|contact the importer;support the importer
intake|進貨量|noun|Purchasing|normal|3|review the intake;increase the intake
lot|批次|noun|Purchasing|normal|3|inspect the lot;ship the lot
minimum|最低數量|noun|Purchasing|normal|3|meet the minimum;review the minimum
offer|報價；提議|noun|Purchasing|easy|4|review the offer;accept the offer
option|選項|noun|Purchasing|easy|4|compare the option;select the option
packing|包裝作業|noun|Purchasing|normal|3|review the packing;improve the packing
parcel|包裹|noun|Purchasing|easy|4|track the parcel;receive the parcel
purchaser|採購人員|noun|Purchasing|normal|3|contact the purchaser;support the purchaser
quantity|數量|noun|Purchasing|easy|4|confirm the quantity;adjust the quantity
quota|配額|noun|Purchasing|green|3|review the quota;meet the quota
requirement|需求條件|noun|Purchasing|normal|4|confirm the requirement;review the requirement
restock|補貨|verb|Purchasing|easy|4|restock the shelves;restock the item
return|退貨|noun|Purchasing|easy|4|process the return;approve the return
selection|挑選結果|noun|Purchasing|normal|4|review the selection;finalize the selection
sourcing|採購來源開發|noun|Purchasing|green|4|improve the sourcing;review the sourcing
subcontractor|分包商|noun|Purchasing|green|3|contact the subcontractor;evaluate the subcontractor
substitute|替代品|noun|Purchasing|normal|3|find a substitute;approve the substitute
tender|標案|noun|Purchasing|green|4|prepare the tender;review the tender
unit|單位；單件|noun|Purchasing|easy|3|count the unit;price the unit
backlog|積壓訂單|noun|Supply Chain|green|4|reduce the backlog;review the backlog
carton|紙箱|noun|Supply Chain|easy|3|label the carton;store the carton
checklist|檢核表|noun|Supply Chain|easy|3|review the checklist;update the checklist
consignee|收貨人|noun|Supply Chain|green|3|contact the consignee;inform the consignee
consigner|發貨人|noun|Supply Chain|green|3|confirm the consigner;contact the consigner
container|貨櫃；容器|noun|Supply Chain|easy|4|load the container;inspect the container
criterion|評選標準|noun|Supply Chain|normal|4|review the criterion;define the criterion
fulfillment|履約出貨|noun|Supply Chain|green|4|improve the fulfillment;track the fulfillment
indicator|指標|noun|Supply Chain|normal|4|review the indicator;monitor the indicator
intake|收料量|noun|Supply Chain|normal|3|review the intake;record the intake
inventory|庫存|noun|Supply Chain|easy|5|check inventory;update inventory
lead time|前置時間|noun|Supply Chain|green|5|reduce lead time;review lead time
procurement|採購作業|noun|Supply Chain|green|5|review procurement;improve procurement
quotation|報價單|noun|Supply Chain|normal|5|request a quotation;review the quotation
replenishment|補貨作業|noun|Supply Chain|green|4|plan replenishment;review replenishment
requisition|申購單|noun|Supply Chain|green|4|submit the requisition;approve the requisition
restriction|限制條件|noun|Supply Chain|normal|3|review the restriction;remove the restriction
shortage|短缺|noun|Supply Chain|easy|4|report the shortage;avoid the shortage
specification|規格|noun|Supply Chain|green|4|check the specification;review the specification
stock|存貨|noun|Supply Chain|easy|4|count the stock;review the stock
supply|供應品|noun|Supply Chain|easy|4|order the supply;track the supply
supplier|供應商|noun|Supply Chain|easy|5|contact the supplier;evaluate the supplier
vendor|供應廠商|noun|Supply Chain|easy|4|contact the vendor;approve the vendor
wholesaler|批發商|noun|Supply Chain|normal|3|contact the wholesaler;select the wholesaler
`;

const logisticsRows = `
carrier|承運商|noun|Logistics|easy|4|contact the carrier;confirm the carrier
cartage|短程運輸|noun|Logistics|blue|2|review the cartage;arrange the cartage
checkpoint|查驗點|noun|Logistics|normal|3|reach the checkpoint;review the checkpoint
consignment|貨件|noun|Logistics|green|4|track the consignment;receive the consignment
container|貨櫃|noun|Logistics|easy|4|load the container;seal the container
customs|海關|noun|Logistics|easy|4|clear customs;contact customs
delivery|交貨|noun|Logistics|easy|5|confirm the delivery;track the delivery
distribution|配送|noun|Logistics|normal|4|improve the distribution;review the distribution
documentation|單證資料|noun|Logistics|green|4|prepare the documentation;review the documentation
dock|碼頭；裝卸區|noun|Logistics|normal|3|arrive at the dock;inspect the dock
forwarding|轉運作業|noun|Logistics|green|3|arrange the forwarding;review the forwarding
freight|貨運|noun|Logistics|easy|4|book the freight;track the freight
handler|搬運人員|noun|Logistics|normal|3|contact the handler;support the handler
handling|搬運作業|noun|Logistics|normal|4|improve the handling;review the handling
harbor|港口|noun|Logistics|easy|3|arrive at the harbor;leave the harbor
inbound|到貨的|adjective|Logistics|normal|3|review the inbound schedule;track the inbound cargo
loading|裝載作業|noun|Logistics|easy|4|check the loading;monitor the loading
manifest|載貨清單|noun|Logistics|normal|4|review the manifest;prepare the manifest
movement|移動流程|noun|Logistics|normal|3|track the movement;control the movement
outbound|出貨的|adjective|Logistics|normal|3|review the outbound shipment;confirm the outbound schedule
pallet|棧板|noun|Logistics|easy|4|load the pallet;inspect the pallet
pickup|取件|noun|Logistics|easy|4|schedule the pickup;confirm the pickup
port|港口|noun|Logistics|easy|4|arrive at the port;leave the port
receiver|收件人|noun|Logistics|easy|3|inform the receiver;contact the receiver
route|路線|noun|Logistics|easy|4|change the route;review the route
seal|封條|noun|Logistics|normal|3|check the seal;attach the seal
sorting|分揀作業|noun|Logistics|normal|3|improve the sorting;review the sorting
terminal|轉運站|noun|Logistics|easy|4|arrive at the terminal;check the terminal
tracking|追蹤資訊|noun|Logistics|easy|4|check the tracking;update the tracking
traffic|運輸流量|noun|Logistics|normal|3|monitor traffic;avoid traffic
transport|運輸|noun|Logistics|easy|4|arrange the transport;review the transport
transporter|運輸業者|noun|Logistics|green|3|contact the transporter;evaluate the transporter
unloading|卸貨作業|noun|Logistics|normal|4|monitor the unloading;review the unloading
vessel|船舶|noun|Logistics|green|3|track the vessel;load the vessel
volume|貨量|noun|Logistics|normal|4|measure the volume;increase the volume
warehouse|倉庫|noun|Logistics|easy|5|check the warehouse;inspect the warehouse
airwaybill|空運提單|noun|Logistics|blue|2|review the airwaybill;print the airwaybill
clearance|清關|noun|Logistics|green|4|complete the clearance;track the clearance
courier|快遞服務|noun|Logistics|easy|4|book the courier;track the courier
depot|集散站|noun|Logistics|normal|3|arrive at the depot;inspect the depot
dispatch|發運|noun|Logistics|normal|4|confirm the dispatch;review the dispatch
drayage|短途拖運|noun|Logistics|advanced|1|review the drayage;arrange the drayage
export|出口|noun|Logistics|easy|4|increase the export;review the export
import|進口|noun|Logistics|easy|4|review the import;confirm the import
inventory control|庫存控制|noun|Logistics|green|5|improve inventory control;review inventory control
location|位置|noun|Logistics|easy|3|confirm the location;update the location
packing|裝箱作業|noun|Logistics|easy|3|review the packing;improve the packing
shipment|貨件；出貨|noun|Logistics|easy|5|track the shipment;prepare the shipment
storage|存放空間|noun|Logistics|easy|3|review the storage;expand the storage
transit|運送途中|noun|Logistics|normal|4|track the transit;confirm the transit
unload|卸下|verb|Logistics|easy|3|unload the truck;unload the pallet
weigh|秤重|verb|Logistics|easy|2|weigh the package;weigh the cargo
`;

const manufacturingRows = `
adjustment|調整|noun|Manufacturing|normal|4|review the adjustment;make the adjustment
apparatus|儀器設備|noun|Manufacturing|green|3|inspect the apparatus;install the apparatus
assembly|組裝|noun|Manufacturing|easy|4|review the assembly;improve the assembly
automation|自動化|noun|Manufacturing|green|4|improve automation;review automation
capacity|產能|noun|Manufacturing|normal|4|increase the capacity;review the capacity
circuit|電路|noun|Engineering|green|3|inspect the circuit;repair the circuit
coating|塗層|noun|Manufacturing|green|3|inspect the coating;apply the coating
component|零組件|noun|Manufacturing|easy|4|inspect the component;replace the component
compressor|壓縮機|noun|Maintenance|green|3|repair the compressor;inspect the compressor
conveyor|輸送帶|noun|Manufacturing|normal|3|inspect the conveyor;restart the conveyor
defect|瑕疵|noun|Quality Control|easy|4|report the defect;reduce the defect
density|密度|noun|Engineering|green|3|measure the density;review the density
dimension|尺寸|noun|Engineering|normal|4|check the dimension;adjust the dimension
efficiency|效率|noun|Manufacturing|normal|4|improve efficiency;measure efficiency
electrician|電工|noun|Maintenance|normal|3|call the electrician;consult the electrician
electronics|電子設備|noun|Engineering|green|3|inspect the electronics;update the electronics
emission|排放|noun|Manufacturing|green|3|reduce the emission;monitor the emission
enclosure|外殼|noun|Engineering|green|2|inspect the enclosure;replace the enclosure
equipment|設備|noun|Manufacturing|easy|5|inspect the equipment;maintain the equipment
fabrication|製造加工|noun|Manufacturing|green|3|review the fabrication;improve the fabrication
facility|設施|noun|Manufacturing|easy|4|inspect the facility;expand the facility
failure|故障|noun|Maintenance|normal|4|report the failure;prevent the failure
filter|濾網|noun|Maintenance|easy|3|replace the filter;clean the filter
fixture|治具|noun|Manufacturing|green|3|check the fixture;prepare the fixture
frequency|頻率|noun|Engineering|normal|3|adjust the frequency;check the frequency
gauge|量規|noun|Engineering|green|3|check the gauge;calibrate the gauge
generator|發電機|noun|Maintenance|green|3|repair the generator;inspect the generator
inspection|檢驗|noun|Quality Control|normal|4|conduct the inspection;review the inspection
installer|安裝人員|noun|Maintenance|normal|3|contact the installer;support the installer
instrumentation|儀控設備|noun|Engineering|blue|2|review the instrumentation;upgrade the instrumentation
interface|介面|noun|Engineering|green|3|check the interface;update the interface
labor|勞力成本|noun|Manufacturing|normal|3|control the labor;review the labor
layout|佈局|noun|Manufacturing|normal|3|review the layout;improve the layout
machine|機器|noun|Manufacturing|easy|5|inspect the machine;repair the machine
machinery|機械設備|noun|Manufacturing|normal|4|review the machinery;maintain the machinery
mechanic|維修技師|noun|Maintenance|normal|3|call the mechanic;consult the mechanic
module|模組|noun|Engineering|normal|3|test the module;replace the module
nozzle|噴嘴|noun|Manufacturing|green|2|clean the nozzle;replace the nozzle
operation|操作|noun|Manufacturing|normal|4|review the operation;improve the operation
output|產出量|noun|Manufacturing|normal|4|increase the output;measure the output
panel|面板|noun|Engineering|easy|3|check the panel;replace the panel
plant|工廠|noun|Manufacturing|easy|4|visit the plant;expand the plant
pressure|壓力|noun|Engineering|normal|3|measure the pressure;adjust the pressure
processor|處理器|noun|Technology|green|3|upgrade the processor;test the processor
product|產品|noun|Manufacturing|easy|5|launch the product;inspect the product
production|生產|noun|Manufacturing|normal|5|increase production;review production
productivity|生產力|noun|Manufacturing|green|4|improve productivity;measure productivity
prototype|原型|noun|Engineering|green|4|build the prototype;test the prototype
pump|幫浦|noun|Maintenance|normal|3|repair the pump;inspect the pump
quality|品質|noun|Quality Control|easy|5|improve quality;review quality
quantity|數量|noun|Manufacturing|easy|4|check the quantity;adjust the quantity
reliability|可靠度|noun|Engineering|green|4|improve reliability;test the reliability
replacement|更換品|noun|Maintenance|normal|4|approve the replacement;install the replacement
sensor|感測器|noun|Engineering|normal|3|test the sensor;replace the sensor
simulation|模擬|noun|Engineering|green|3|run the simulation;review the simulation
spare|備品|noun|Maintenance|easy|3|order the spare;store the spare
stability|穩定性|noun|Manufacturing|green|3|improve stability;monitor stability
substance|材料物質|noun|Manufacturing|green|2|inspect the substance;handle the substance
technician|技術員|noun|Manufacturing|easy|4|contact the technician;train the technician
tolerance|容許誤差|noun|Quality Control|green|4|check the tolerance;reduce the tolerance
tooling|模具工裝|noun|Manufacturing|blue|2|review the tooling;prepare the tooling
utility|公用設備|noun|Manufacturing|normal|3|check the utility;review the utility
valve|閥門|noun|Maintenance|normal|3|inspect the valve;replace the valve
vibration|震動|noun|Engineering|green|3|measure the vibration;reduce the vibration
voltage|電壓|noun|Engineering|normal|3|check the voltage;adjust the voltage
welding|焊接|noun|Manufacturing|normal|3|inspect the welding;improve the welding
wiring|配線|noun|Maintenance|normal|3|check the wiring;repair the wiring
calibrate|校正|verb|Engineering|normal|4|calibrate the equipment;calibrate the sensor
diagnose|診斷|verb|Maintenance|normal|4|diagnose the problem;diagnose the failure
inspect|檢查|verb|Manufacturing|easy|4|inspect the machine;inspect the sample
lubricate|潤滑|verb|Maintenance|green|3|lubricate the parts;lubricate the chain
maintain|維護|verb|Maintenance|easy|5|maintain the system;maintain the machine
monitor|監控|verb|Manufacturing|easy|4|monitor the temperature;monitor the line
overhaul|大修|verb|Maintenance|green|3|overhaul the engine;overhaul the unit
repair|維修|verb|Maintenance|easy|5|repair the device;repair the roof
replace|更換|verb|Maintenance|easy|4|replace the filter;replace the part
restore|恢復|verb|Maintenance|normal|3|restore the service;restore the system
serviceable|可維修的|adjective|Maintenance|green|2|review the serviceable condition;keep the serviceable unit
shutdown|停機|noun|Manufacturing|normal|4|schedule the shutdown;review the shutdown
troubleshoot|排除故障|verb|Maintenance|green|4|troubleshoot the network;troubleshoot the printer
upgrade|升級|verb|Technology|normal|4|upgrade the software;upgrade the equipment
workflow|工作流程|noun|Manufacturing|normal|4|improve the workflow;review the workflow
yield|良率|noun|Manufacturing|green|4|improve the yield;measure the yield
`;

const technologyRows = `
algorithm|演算法|noun|Technology|green|3|review the algorithm;improve the algorithm
application|應用程式|noun|Technology|easy|4|install the application;update the application
backup|備份|noun|Technology|easy|4|run the backup;check the backup
browser|瀏覽器|noun|Technology|easy|3|open the browser;update the browser
cable|線材|noun|Technology|easy|3|check the cable;replace the cable
cloud|雲端平台|noun|Technology|normal|4|move to the cloud;manage the cloud
compatibility|相容性|noun|Technology|green|4|check compatibility;improve compatibility
configuration|設定|noun|Technology|normal|4|review the configuration;update the configuration
connectivity|連線能力|noun|Technology|green|3|check connectivity;improve connectivity
console|主控台|noun|Technology|normal|3|open the console;check the console
device|裝置|noun|Technology|easy|4|restart the device;replace the device
digital|數位的|adjective|Technology|easy|4|build a digital system;review the digital strategy
disk|磁碟|noun|Technology|easy|3|check the disk;replace the disk
domain|網域|noun|Technology|normal|3|renew the domain;check the domain
firewall|防火牆|noun|Technology|green|4|configure the firewall;check the firewall
framework|框架|noun|Technology|green|3|review the framework;build the framework
hardware|硬體|noun|Technology|easy|4|upgrade the hardware;inspect the hardware
hosting|主機代管|noun|Technology|green|3|review the hosting;change the hosting
installation|安裝作業|noun|Technology|normal|4|complete the installation;check the installation
license|授權許可|noun|Technology|normal|4|renew the license;verify the license
login|登入|noun|Technology|easy|3|check the login;reset the login
malware|惡意程式|noun|Technology|green|3|detect the malware;remove the malware
memory|記憶體|noun|Technology|easy|3|upgrade the memory;check the memory
network|網路|noun|Technology|easy|4|monitor the network;repair the network
outage|系統中斷|noun|Technology|normal|4|report the outage;prevent the outage
password|密碼|noun|Technology|easy|4|reset the password;protect the password
patch|修補程式|noun|Technology|normal|3|install the patch;test the patch
platform|平台|noun|Technology|normal|4|launch the platform;improve the platform
portal|入口網站|noun|Technology|normal|3|open the portal;update the portal
program|程式|noun|Technology|easy|3|install the program;test the program
reboot|重新啟動|verb|Technology|easy|3|reboot the system;reboot the server
security|安全性|noun|Technology|easy|4|improve security;review security
server|伺服器|noun|Technology|easy|4|restart the server;upgrade the server
software|軟體|noun|Technology|easy|4|update the software;install the software
synchronization|同步作業|noun|Technology|green|3|check the synchronization;improve the synchronization
system|系統|noun|Technology|easy|5|update the system;monitor the system
upload|上傳|verb|Technology|easy|3|upload the file;upload the report
user|使用者|noun|Technology|easy|4|support the user;notify the user
username|使用者名稱|noun|Technology|easy|3|enter the username;verify the username
version|版本|noun|Technology|easy|3|check the version;update the version
wireless|無線的|adjective|Technology|normal|3|install the wireless network;check the wireless signal
`;

const travelRows = `
accommodation|住宿|noun|Travel|easy|4|book the accommodation;confirm the accommodation
admission|入場費|noun|Travel|normal|3|pay the admission;check the admission
airline|航空公司|noun|Airport|easy|4|contact the airline;choose the airline
aisle|走道|noun|Airport|easy|2|walk down the aisle;keep the aisle clear
arrival|抵達|noun|Airport|easy|4|confirm the arrival;check the arrival
banquet|宴會|noun|Dining|normal|3|prepare the banquet;attend the banquet
boarding|登機|noun|Airport|easy|4|confirm the boarding;check the boarding
brochure|小冊子|noun|Travel|easy|3|read the brochure;pick up the brochure
cabin|機艙|noun|Airport|easy|3|enter the cabin;clean the cabin
cancellation|取消|noun|Travel|normal|4|confirm the cancellation;process the cancellation
concierge|禮賓人員|noun|Hotel|green|3|ask the concierge;contact the concierge
cruise|遊輪旅遊|noun|Travel|normal|3|book the cruise;enjoy the cruise
departure|出發|noun|Airport|easy|4|confirm the departure;check the departure
destination|目的地|noun|Travel|easy|4|reach the destination;change the destination
excursion|短途旅遊|noun|Travel|green|3|join the excursion;book the excursion
fare|票價|noun|Travel|easy|4|check the fare;pay the fare
ferry|渡輪|noun|Travel|normal|3|board the ferry;miss the ferry
flight|航班|noun|Airport|easy|5|check the flight;book the flight
guest|旅客；房客|noun|Hotel|easy|4|welcome the guest;assist the guest
guide|導覽員|noun|Travel|easy|3|meet the guide;follow the guide
hostel|青年旅館|noun|Travel|normal|2|book the hostel;stay at the hostel
lounge|休息室|noun|Airport|normal|3|wait in the lounge;enter the lounge
passport|護照|noun|Travel|easy|4|check the passport;renew the passport
platform|月台|noun|Travel|easy|3|go to the platform;check the platform
reception|櫃台接待|noun|Hotel|easy|4|call the reception;visit the reception
reservation|預訂|noun|Hotel|easy|5|confirm the reservation;cancel the reservation
resort|度假村|noun|Travel|normal|3|book the resort;stay at the resort
seat|座位|noun|Airport|easy|4|reserve the seat;change the seat
stopover|中途停留|noun|Travel|green|3|schedule the stopover;extend the stopover
suite|套房|noun|Hotel|normal|3|upgrade the suite;book the suite
terminal|航廈|noun|Airport|easy|4|arrive at the terminal;check the terminal
tour|行程|noun|Travel|easy|4|book the tour;join the tour
traveler|旅客|noun|Travel|easy|4|assist the traveler;guide the traveler
vacation|假期|noun|Travel|easy|4|plan the vacation;enjoy the vacation
venue|場地|noun|Travel|normal|3|confirm the venue;inspect the venue
welcome|歡迎|noun|Hotel|easy|3|prepare the welcome;share the welcome
breakfast|早餐|noun|Dining|easy|4|serve breakfast;order breakfast
buffet|自助餐|noun|Dining|easy|3|prepare the buffet;enjoy the buffet
checkout|退房|noun|Hotel|easy|3|complete the checkout;confirm the checkout
housekeeping|房務清潔|noun|Hotel|normal|3|call housekeeping;improve housekeeping
occupancy|住房率|noun|Hotel|green|3|check the occupancy;increase the occupancy
passport control|護照查驗|noun|Airport|green|3|pass passport control;reach passport control
restaurant|餐廳|noun|Dining|easy|4|book the restaurant;visit the restaurant
snack|點心|noun|Dining|easy|2|order the snack;serve the snack
tourism|觀光產業|noun|Travel|normal|4|support tourism;promote tourism
`;

const serviceRows = `
acknowledgment|確認回覆|noun|Customer Service|normal|3|send the acknowledgment;check the acknowledgment
apology|道歉|noun|Customer Service|easy|4|offer an apology;accept the apology
assistance|協助|noun|Customer Service|easy|4|request assistance;provide assistance
assurance|保證|noun|Customer Service|normal|3|give assurance;seek assurance
callback|回電|noun|Customer Service|normal|3|schedule the callback;confirm the callback
care|照顧；服務|noun|Customer Service|easy|3|provide care;improve care
claim|申訴；索賠|noun|Customer Service|normal|4|file the claim;review the claim
convenience|便利性|noun|Customer Service|normal|3|improve convenience;offer convenience
correction|更正|noun|Customer Service|normal|3|issue the correction;review the correction
empathy|同理心|noun|Customer Service|green|3|show empathy;practice empathy
explanation|說明|noun|Customer Service|easy|4|provide the explanation;read the explanation
guidance|指引|noun|Customer Service|normal|4|provide guidance;request guidance
helpline|客服專線|noun|Customer Service|normal|3|call the helpline;update the helpline
hotline|熱線電話|noun|Customer Service|easy|3|call the hotline;answer the hotline
incident|事件|noun|Customer Service|normal|4|report the incident;review the incident
inconvenience|不便|noun|Customer Service|normal|4|apologize for the inconvenience;reduce the inconvenience
interaction|互動|noun|Customer Service|normal|3|review the interaction;improve the interaction
loyalty|忠誠度|noun|Customer Service|normal|4|build loyalty;measure loyalty
notification|通知|noun|Customer Service|easy|4|send the notification;check the notification
recovery|補救處理|noun|Customer Service|green|3|plan the recovery;review the recovery
replacement|替換品|noun|Customer Service|normal|4|send the replacement;request the replacement
resolution|解決方案|noun|Customer Service|normal|4|confirm the resolution;review the resolution
survey|問卷調查|noun|Customer Service|easy|4|send the survey;review the survey
trouble|問題|noun|Customer Service|easy|3|report the trouble;solve the trouble
waiting|等待時間|noun|Customer Service|normal|3|reduce the waiting;measure the waiting
warranty|保固|noun|Customer Service|normal|4|check the warranty;extend the warranty
welcome|接待|noun|Customer Service|easy|3|prepare the welcome;improve the welcome
assist|協助|verb|Customer Service|easy|4|assist the customer;assist the guest
clarify|釐清|verb|Customer Service|normal|4|clarify the issue;clarify the request
handle|處理|verb|Customer Service|easy|4|handle the complaint;handle the request
resolve|解決|verb|Customer Service|easy|4|resolve the issue;resolve the complaint
support|支援|verb|Customer Service|easy|4|support the client;support the user
refund|退款|noun|Customer Service|easy|5|issue the refund;request the refund
response|回應|noun|Customer Service|easy|4|send the response;review the response
satisfaction|滿意度|noun|Customer Service|easy|4|improve satisfaction;measure satisfaction
solution|解決方案|noun|Customer Service|easy|4|offer the solution;review the solution
service|服務|noun|Customer Service|easy|5|improve the service;review the service
`;

const healthcareRows = `
ambulance|救護車|noun|Healthcare|easy|3|call the ambulance;wait for the ambulance
clinic|診所|noun|Healthcare|easy|4|visit the clinic;contact the clinic
consultation|諮詢；看診|noun|Healthcare|normal|4|schedule the consultation;attend the consultation
doctor|醫生|noun|Healthcare|easy|4|consult the doctor;call the doctor
emergency|緊急狀況|noun|Healthcare|easy|4|report the emergency;handle the emergency
examination|檢查|noun|Healthcare|normal|4|schedule the examination;review the examination
fever|發燒|noun|Healthcare|easy|3|check the fever;report the fever
health|健康|noun|Healthcare|easy|4|protect health;improve health
hospital|醫院|noun|Healthcare|easy|4|visit the hospital;contact the hospital
laboratory|實驗室|noun|Healthcare|normal|3|visit the laboratory;check the laboratory
medicine|藥品|noun|Healthcare|easy|4|take the medicine;check the medicine
nurse|護理師|noun|Healthcare|easy|4|call the nurse;consult the nurse
patient|病患|noun|Healthcare|easy|4|assist the patient;check the patient
pharmacy|藥局|noun|Healthcare|normal|3|visit the pharmacy;contact the pharmacy
physician|醫師|noun|Healthcare|green|3|consult the physician;meet the physician
prevention|預防|noun|Healthcare|normal|4|improve prevention;review the prevention
recovery|康復|noun|Healthcare|normal|4|support recovery;monitor recovery
referral|轉介|noun|Healthcare|green|3|prepare the referral;review the referral
specialist|專科醫師|noun|Healthcare|normal|3|consult the specialist;meet the specialist
symptom|症狀|noun|Healthcare|easy|4|check the symptom;report the symptom
therapy|治療|noun|Healthcare|normal|4|begin the therapy;review the therapy
treatment|治療方式|noun|Healthcare|easy|4|review the treatment;continue the treatment
vaccine|疫苗|noun|Healthcare|easy|4|receive the vaccine;store the vaccine
wellness|健康狀態|noun|Healthcare|green|3|promote wellness;support wellness
admission|住院手續|noun|Healthcare|normal|3|complete the admission;review the admission
discharge|出院|noun|Healthcare|normal|3|prepare the discharge;confirm the discharge
medical|醫療的|adjective|Healthcare|easy|4|review the medical record;prepare the medical form
preventive|預防性的|adjective|Healthcare|green|3|review the preventive program;support the preventive plan
rehabilitation|復健|noun|Healthcare|green|3|continue rehabilitation;review rehabilitation
`;

const meetingRows = `
chairperson|主席|noun|Meeting|normal|3|elect the chairperson;contact the chairperson
convention|大會；年會|noun|Meeting|green|3|attend the convention;plan the convention
coordination|協調|noun|Meeting|normal|4|improve the coordination;review the coordination
dialogue|對話|noun|Meeting|normal|3|continue the dialogue;start the dialogue
forum|論壇|noun|Meeting|normal|3|join the forum;host the forum
handout|講義|noun|Meeting|easy|3|prepare the handout;share the handout
keynote|主題演講|noun|Meeting|green|3|attend the keynote;prepare the keynote
moderator|主持人|noun|Meeting|normal|3|ask the moderator;thank the moderator
negotiation|協商|noun|Meeting|green|4|continue the negotiation;review the negotiation
overview|概覽|noun|Meeting|easy|4|give the overview;read the overview
participation|參與|noun|Meeting|normal|4|encourage participation;measure participation
poll|投票調查|noun|Meeting|normal|3|start the poll;review the poll
proceeding|會議紀錄|noun|Meeting|green|3|review the proceeding;file the proceeding
questionnaire|問卷|noun|Meeting|normal|3|share the questionnaire;collect the questionnaire
remark|意見；發言|noun|Meeting|normal|3|hear the remark;record the remark
roundtable|圓桌會議|noun|Meeting|green|3|join the roundtable;host the roundtable
seminar|研討會|noun|Meeting|easy|4|attend the seminar;host the seminar
speaker|講者|noun|Meeting|easy|4|introduce the speaker;contact the speaker
teleconference|電話會議|noun|Meeting|green|3|join the teleconference;schedule the teleconference
topic|主題|noun|Meeting|easy|4|discuss the topic;review the topic
venue|會場|noun|Meeting|normal|3|confirm the venue;visit the venue
`;

const humanResourcesRows = `
certification|證照|noun|Human Resources|normal|4|review the certification;obtain the certification
dismissal|解雇|noun|Human Resources|green|3|review the dismissal;avoid the dismissal
evaluation|評估|noun|Human Resources|normal|4|complete the evaluation;review the evaluation
experience|經驗|noun|Human Resources|easy|4|describe the experience;review the experience
internship|實習|noun|Human Resources|normal|3|offer the internship;complete the internship
joining|報到|noun|Human Resources|normal|3|confirm the joining;prepare the joining
leave|請假|noun|Human Resources|easy|4|approve the leave;request the leave
probation|試用期|noun|Human Resources|normal|4|complete the probation;extend the probation
profession|職業|noun|Human Resources|normal|3|choose the profession;study the profession
qualification|資格|noun|Human Resources|normal|4|review the qualification;meet the qualification
referral|推薦|noun|Human Resources|normal|3|review the referral;submit the referral
resignation|辭職|noun|Human Resources|normal|4|accept the resignation;announce the resignation
retirement|退休|noun|Human Resources|normal|4|plan the retirement;announce the retirement
shift|班次|noun|Human Resources|easy|4|change the shift;confirm the shift
staffing|人力配置|noun|Human Resources|green|3|review the staffing;improve the staffing
vacancy|職缺|noun|Human Resources|easy|4|post the vacancy;fill the vacancy
hire|聘用|verb|Human Resources|easy|4|hire the candidate;hire the staff
recruit|招募|verb|Human Resources|easy|4|recruit new staff;recruit engineers
train|培訓|verb|Human Resources|easy|4|train the employee;train the intern
transfer|調動|verb|Human Resources|normal|4|transfer the employee;transfer the staff
`;

const projectRows = `
backlog|待辦清單|noun|Project Management|normal|4|review the backlog;reduce the backlog
checkpoint|檢查節點|noun|Project Management|normal|3|reach the checkpoint;review the checkpoint
dependency|相依關係|noun|Project Management|green|4|review the dependency;resolve the dependency
estimate|預估值|noun|Project Management|normal|4|review the estimate;update the estimate
feasibility|可行性|noun|Project Management|green|4|study the feasibility;review the feasibility
handover|交接|noun|Project Management|normal|4|prepare the handover;complete the handover
issue|議題；問題|noun|Project Management|easy|4|track the issue;resolve the issue
outcome|成果|noun|Project Management|normal|4|review the outcome;measure the outcome
outreach|接觸推廣|noun|Project Management|green|3|plan the outreach;review the outreach
phase|階段|noun|Project Management|easy|4|start the phase;finish the phase
progress|進度|noun|Project Management|easy|5|update the progress;track the progress
proposal|提案|noun|Project Management|easy|5|review the proposal;submit the proposal
risk|風險|noun|Project Management|easy|5|assess the risk;reduce the risk
timeline|時程|noun|Project Management|easy|4|review the timeline;adjust the timeline
`;

const entertainmentRows = `
concert|音樂會|noun|Entertainment|easy|3|attend the concert;book the concert
exhibit|展覽|noun|Entertainment|easy|3|visit the exhibit;review the exhibit
festival|節慶活動|noun|Entertainment|normal|3|join the festival;plan the festival
gallery|藝廊|noun|Entertainment|normal|2|visit the gallery;open the gallery
performance|演出|noun|Entertainment|easy|3|watch the performance;schedule the performance
screening|放映|noun|Entertainment|green|2|attend the screening;plan the screening
showcase|展示活動|noun|Entertainment|normal|3|prepare the showcase;attend the showcase
theater|劇院|noun|Entertainment|easy|3|visit the theater;book the theater
ticket|門票|noun|Entertainment|easy|4|buy the ticket;check the ticket
venue|活動場館|noun|Entertainment|normal|3|confirm the venue;visit the venue
`;

const officeExtraRows = `
briefcase|公事包|noun|Office|easy|2|carry the briefcase;check the briefcase
docket|清單摘要|noun|Office|green|2|review the docket;prepare the docket
handset|話筒|noun|Office|normal|2|pick up the handset;replace the handset
keycard|門禁卡|noun|Office|easy|3|use the keycard;replace the keycard
logbook|工作日誌|noun|Office|normal|3|update the logbook;review the logbook
mailbox|信箱|noun|Office|easy|3|check the mailbox;empty the mailbox
notepad|便條本|noun|Office|easy|2|use the notepad;replace the notepad
paperclip|迴紋針|noun|Office|easy|1|use the paperclip;buy the paperclip
photocopy|影本|noun|Office|normal|2|make the photocopy;file the photocopy
receptionist|接待人員|noun|Office|easy|4|ask the receptionist;inform the receptionist
roster|名單|noun|Office|normal|3|update the roster;review the roster
timestamp|時間戳記|noun|Office|green|2|check the timestamp;record the timestamp
timesheet|工時表|noun|Office|normal|4|submit the timesheet;review the timesheet
voicemail|語音留言|noun|Office|easy|3|check the voicemail;leave the voicemail
wardrobe|衣櫃|noun|Office|easy|1|open the wardrobe;clean the wardrobe
workbench|工作檯|noun|Office|normal|2|prepare the workbench;clean the workbench
bookmark|書籤|noun|Office|easy|1|use the bookmark;remove the bookmark
cabling|配線工程|noun|Office|green|2|review the cabling;install the cabling
counter|櫃台|noun|Office|easy|3|stand at the counter;approach the counter
facsimile|傳真文件|noun|Office|green|2|send the facsimile;check the facsimile
fixture|固定裝置|noun|Office|normal|2|inspect the fixture;replace the fixture
handoff|交接|noun|Office|normal|3|complete the handoff;review the handoff
headset|耳機麥克風|noun|Office|easy|2|wear the headset;replace the headset
inbox|收件匣|noun|Office|easy|4|open the inbox;check the inbox
outbox|寄件匣|noun|Office|easy|3|open the outbox;review the outbox
`;

const businessExtraRows = `
accomplishment|成果|noun|Business|normal|3|review the accomplishment;celebrate the accomplishment
accountability|責任承擔|noun|Business|green|4|improve accountability;promote accountability
advisory|顧問性質|noun|Business|green|2|review the advisory;issue the advisory
capability|能力|noun|Business|normal|4|assess the capability;improve the capability
collaboration|協作|noun|Business|normal|4|improve collaboration;encourage collaboration
consortium|聯盟團體|noun|Business|blue|2|join the consortium;form the consortium
dedication|投入程度|noun|Business|normal|3|show dedication;recognize the dedication
enterprise|企業|noun|Business|normal|4|grow the enterprise;support the enterprise
execution|執行成效|noun|Business|green|4|improve the execution;review the execution
goodwill|商譽|noun|Business|blue|2|protect the goodwill;review the goodwill
innovation|創新|noun|Business|normal|4|encourage innovation;review innovation
milieu|商業環境|noun|Business|advanced|1|study the milieu;adapt to the milieu
motivation|動機|noun|Business|normal|4|improve motivation;measure motivation
networking|人脈經營|noun|Business|green|3|encourage networking;improve networking
ownership|責任感|noun|Business|normal|3|show ownership;encourage ownership
shareholder|股東|noun|Business|green|4|inform the shareholder;meet the shareholder
sustainability|永續性|noun|Business|green|4|improve sustainability;report sustainability
synergy|綜效|noun|Business|green|3|create synergy;review the synergy
undertaking|事業；承諾|noun|Business|green|2|review the undertaking;complete the undertaking
viability|可行營運能力|noun|Business|green|3|assess the viability;improve the viability
acquire|取得；收購|verb|Business|green|4|acquire the company;acquire the asset
advise|建議|verb|Business|normal|4|advise the client;advise the team
collaborate|合作|verb|Business|normal|4|collaborate with partners;collaborate with the team
diversify|多角化|verb|Business|green|3|diversify the portfolio;diversify the business
innovate|創新|verb|Business|green|3|innovate the service;innovate the product
`;

const financeExtraRows = `
allowance|津貼|noun|Finance|easy|3|review the allowance;pay the allowance
arrears|欠款|noun|Finance|green|3|collect the arrears;report the arrears
bookkeeping|記帳作業|noun|Accounting|green|3|review the bookkeeping;improve the bookkeeping
cashflow|現金流|noun|Finance|green|4|review the cashflow;improve the cashflow
creditor|債權人|noun|Finance|green|3|inform the creditor;contact the creditor
default|違約|noun|Finance|green|4|avoid default;report the default
duty|稅費|noun|Finance|normal|3|pay the duty;calculate the duty
escrow|第三方保管款|noun|Banking|blue|2|review the escrow;release the escrow
insolvency|無力償債|noun|Finance|blue|2|avoid insolvency;review the insolvency
invoicee|受票人|noun|Accounting|advanced|1|confirm the invoicee;contact the invoicee
levy|徵收費|noun|Finance|green|3|impose the levy;review the levy
overhead|管理費用|noun|Finance|normal|4|reduce the overhead;review the overhead
payout|撥付款|noun|Finance|normal|3|confirm the payout;schedule the payout
receivable|應收款|noun|Accounting|green|4|review the receivable;collect the receivable
remuneration|報酬|noun|Finance|green|3|review the remuneration;adjust the remuneration
royalty|權利金|noun|Finance|green|3|pay the royalty;calculate the royalty
tariff|關稅|noun|Finance|green|4|review the tariff;pay the tariff
underpayment|少付金額|noun|Finance|blue|2|report the underpayment;correct the underpayment
underwrite|承保；承銷|verb|Finance|blue|2|underwrite the policy;underwrite the deal
capitalize|資本化|verb|Accounting|blue|2|capitalize the cost;capitalize the expense
defer|遞延|verb|Accounting|green|3|defer the payment;defer the expense
liquidate|清算|verb|Finance|green|3|liquidate the asset;liquidate the company
reconcile|對帳|verb|Accounting|green|4|reconcile the statement;reconcile the account
refinance|再融資|verb|Banking|green|3|refinance the loan;refinance the mortgage
settle|結清；和解|verb|Finance|normal|4|settle the bill;settle the claim
`;

const purchasingExtraRows = `
allocator|分配人員|noun|Purchasing|advanced|1|inform the allocator;review the allocator
comparison|比較結果|noun|Purchasing|normal|3|review the comparison;prepare the comparison
dealer|經銷商|noun|Purchasing|normal|3|contact the dealer;select the dealer
importation|進口作業|noun|Purchasing|green|3|review the importation;approve the importation
inspection|驗貨|noun|Purchasing|normal|4|conduct the inspection;review the inspection
listing|清單|noun|Purchasing|normal|3|update the listing;review the listing
overstock|庫存過多|noun|Purchasing|green|3|reduce the overstock;report the overstock
packaging|包裝|noun|Purchasing|easy|3|review the packaging;improve the packaging
preference|偏好|noun|Purchasing|normal|3|note the preference;confirm the preference
sampling|抽樣|noun|Purchasing|green|3|conduct the sampling;review the sampling
screening|篩選|noun|Purchasing|green|3|begin the screening;complete the screening
shortlist|入選名單|noun|Purchasing|green|3|prepare the shortlist;review the shortlist
subcontract|分包工作|noun|Purchasing|green|3|review the subcontract;sign the subcontract
tenderer|投標人|noun|Purchasing|blue|2|contact the tenderer;inform the tenderer
utilization|使用率|noun|Purchasing|green|3|increase the utilization;review the utilization
award|授標結果|noun|Purchasing|normal|3|announce the award;review the award
brokerage|仲介服務費|noun|Purchasing|green|2|review the brokerage;pay the brokerage
consumption|耗用量|noun|Purchasing|normal|4|track the consumption;reduce the consumption
depletion|耗盡|noun|Purchasing|green|3|avoid depletion;report the depletion
fulfill|履行；供應完成|verb|Purchasing|normal|4|fulfill the order;fulfill the request
inspect|查驗|verb|Purchasing|normal|4|inspect the shipment;inspect the sample
procure|採購|verb|Purchasing|green|4|procure the materials;procure the equipment
reorder|再次訂購|verb|Purchasing|easy|3|reorder the item;reorder the parts
source|尋找供應來源|verb|Purchasing|normal|4|source the material;source the supplier
stockpile|儲備存貨|verb|Purchasing|green|3|stockpile the supplies;stockpile the material
`;

const logisticsExtraRows = `
demurrage|延滯費|noun|Logistics|blue|2|calculate the demurrage;review the demurrage
locator|定位器|noun|Logistics|normal|2|check the locator;replace the locator
mileage|里程數|noun|Logistics|easy|3|record the mileage;check the mileage
relocation|搬遷|noun|Logistics|normal|3|plan the relocation;review the relocation
rerouting|改道安排|noun|Logistics|green|3|approve the rerouting;review the rerouting
tariff|運輸關稅|noun|Logistics|green|3|check the tariff;review the tariff
toll|通行費|noun|Logistics|easy|2|pay the toll;check the toll
towage|拖運作業|noun|Logistics|blue|2|arrange the towage;review the towage
turnaround|周轉時間|noun|Logistics|green|4|reduce the turnaround;measure the turnaround
van|廂型車|noun|Logistics|easy|2|load the van;drive the van
waybill|託運單|noun|Logistics|green|3|review the waybill;print the waybill
clearance|清關|noun|Logistics|green|4|complete the clearance;review the clearance
cartage|短程運輸費|noun|Logistics|blue|2|pay the cartage;review the cartage
staging|暫存作業|noun|Logistics|green|3|review the staging;prepare the staging
handoff|交運|noun|Logistics|normal|3|complete the handoff;review the handoff
dispatching|派送調度|noun|Logistics|green|3|improve the dispatching;review the dispatching
`;

const salesRows = `
clientele|客群|noun|Sales|green|3|expand the clientele;understand the clientele
concession|讓步；特許銷售點|noun|Sales|green|3|offer the concession;review the concession
dealership|經銷據點|noun|Sales|normal|3|visit the dealership;support the dealership
lead|潛在線索|noun|Sales|normal|4|track the lead;follow the lead
listing|商品清單|noun|Sales|normal|3|update the listing;review the listing
merchant|商家|noun|Sales|normal|3|contact the merchant;support the merchant
resale|轉售|noun|Sales|green|3|approve the resale;review the resale
retention|客戶留存|noun|Sales|green|4|improve retention;measure retention
sale|銷售|noun|Sales|easy|5|increase the sale;review the sale
seller|賣方|noun|Sales|easy|4|contact the seller;inform the seller
showroom|展示間|noun|Sales|normal|3|visit the showroom;prepare the showroom
subscriber|訂閱者|noun|Sales|normal|3|inform the subscriber;support the subscriber
telemarketing|電話行銷|noun|Sales|green|3|review the telemarketing;plan the telemarketing
upsell|加價銷售|verb|Sales|green|3|upsell the service;upsell the plan
wholesale|批發|noun|Sales|normal|3|review the wholesale;expand the wholesale
`;

const contractRows = `
appendix|附錄|noun|Contract|normal|3|review the appendix;attach the appendix
arbitration|仲裁|noun|Contract|green|4|request arbitration;review the arbitration
attorney|律師|noun|Contract|normal|3|contact the attorney;consult the attorney
confidentiality|保密性|noun|Contract|green|4|maintain confidentiality;review confidentiality
covenant|契約條款|noun|Contract|blue|2|review the covenant;sign the covenant
enforcement|執行效力|noun|Contract|green|4|review the enforcement;strengthen the enforcement
jurisdiction|司法管轄權|noun|Contract|blue|2|confirm the jurisdiction;review the jurisdiction
lease|租約|noun|Contract|easy|4|sign the lease;renew the lease
litigation|訴訟|noun|Contract|blue|2|avoid litigation;review the litigation
notary|公證人|noun|Contract|green|3|contact the notary;meet the notary
permit|許可證|noun|Contract|normal|3|check the permit;renew the permit
ratification|正式批准|noun|Contract|blue|2|await the ratification;review the ratification
regulation|法規|noun|Contract|normal|4|review the regulation;follow the regulation
signatory|簽署人|noun|Contract|green|3|confirm the signatory;contact the signatory
stipulation|約定條款|noun|Contract|blue|2|review the stipulation;accept the stipulation
trademark|商標|noun|Contract|green|3|register the trademark;protect the trademark
validity|效力；有效性|noun|Contract|green|3|check the validity;confirm the validity
waiver|放棄權利聲明|noun|Contract|green|3|sign the waiver;review the waiver
amendment|修正條文|noun|Contract|normal|4|review the amendment;approve the amendment
compliance|遵循規定|noun|Contract|green|4|review compliance;improve compliance
`;

const emailRows = `
alias|別名信箱|noun|Email|normal|2|create the alias;update the alias
footer|頁尾資訊|noun|Email|normal|2|edit the footer;review the footer
greeting|問候語|noun|Email|easy|3|write the greeting;revise the greeting
mailing|寄送作業|noun|Email|normal|3|prepare the mailing;review the mailing
outgoing|寄出的|adjective|Email|easy|2|check the outgoing mail;review the outgoing message
salutation|開頭稱呼|noun|Email|normal|3|edit the salutation;review the salutation
spam|垃圾郵件|noun|Email|easy|3|delete the spam;filter the spam
subscribe|訂閱|verb|Email|easy|3|subscribe to the newsletter;subscribe to the update
unsubscribe|取消訂閱|verb|Email|normal|3|unsubscribe from the mailing;unsubscribe from the notice
wording|措辭|noun|Email|normal|3|improve the wording;review the wording
archive|封存郵件|verb|Email|normal|3|archive the email;archive the message
compose|撰寫郵件|verb|Email|easy|4|compose the email;compose the reply
forwarding|轉寄|noun|Email|normal|3|check the forwarding;update the forwarding
mailbox|電子信箱|noun|Email|easy|3|check the mailbox;open the mailbox
signature|簽名檔|noun|Email|easy|3|update the signature;review the signature
`;

export const supplementalVocabularySeeds = [
  ...parseSeedRows(officeRows),
  ...parseSeedRows(businessRows),
  ...parseSeedRows(financeRows),
  ...parseSeedRows(purchasingRows),
  ...parseSeedRows(logisticsRows),
  ...parseSeedRows(manufacturingRows),
  ...parseSeedRows(technologyRows),
  ...parseSeedRows(travelRows),
  ...parseSeedRows(serviceRows),
  ...parseSeedRows(healthcareRows),
  ...parseSeedRows(meetingRows),
  ...parseSeedRows(humanResourcesRows),
  ...parseSeedRows(projectRows),
  ...parseSeedRows(entertainmentRows),
  ...parseSeedRows(officeExtraRows),
  ...parseSeedRows(businessExtraRows),
  ...parseSeedRows(financeExtraRows),
  ...parseSeedRows(purchasingExtraRows),
  ...parseSeedRows(logisticsExtraRows),
  ...parseSeedRows(salesRows),
  ...parseSeedRows(contractRows),
  ...parseSeedRows(emailRows),
];
