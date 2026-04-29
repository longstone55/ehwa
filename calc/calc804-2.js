 // 二쇱슂 怨꾩궛 濡쒖쭅 (�꾩슂 �� �⑥닔 遺꾨━�댁꽌 �묒꽦)

const incomeRateTable = [
  { base: 0, deduction: 0, business: 6, nonBusiness: 16 },
  { base: 12000000, deduction: 1080000, business: 15, nonBusiness: 25 },
  { base: 46000000, deduction: 5220000, business: 24, nonBusiness: 34 },
  { base: 88000000, deduction: 14900000, business: 35, nonBusiness: 45 },
  { base: 150000000, deduction: 19400000, business: 38, nonBusiness: 48 },
  { base: 300000000, deduction: 25400000, business: 40, nonBusiness: 50 },
  { base: 500000000, deduction: 35400000, business: 42, nonBusiness: 52 },
  { base: 1000000000, deduction: 65400000, business: 45, nonBusiness: 55 },
];

 function getVal(selector) {
  const el = document.querySelector(selector);
  return el ? el.value : "";
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function parseToNumber(value) {
  return Number(String(value).replace(/[^\d.-]/g, '')) || 0;
}

function formatNumber(num) {
  return num.toLocaleString('ko-KR');
}
function updateFormattedInputs() {
  document.querySelectorAll(".money-input").forEach(el => {
    const raw = parseToNumber(el.value);
    el.value = raw ? formatNumber(raw) : "";
  });
}

function updateSummaryTable() {
  const acquisitionDate = document.querySelector("#acquisitionDate")?.value || "";
  const transferDate = document.querySelector("#transferDate")?.value || "";
  const usageValue = document.querySelector("#businessUse")?.value;

  // 1 �먮뒗 0 �� �ъ뾽�� / 鍮꾩궗�낆슜�쇰줈 蹂���
  const usageType = usageValue === "1" ? "�ъ뾽��" :
                    usageValue === "0" ? "鍮꾩궗�낆슜" : "";

  const start = new Date(acquisitionDate);
  const end = new Date(transferDate);
  let periodText = "";

  if (!isNaN(start) && !isNaN(end) && end > start) {
    const diffYears = (end - start) / (1000 * 60 * 60 * 24 * 365);
    periodText = `${diffYears.toFixed(1)} �� 蹂댁쑀`;
  }

  // 媛� 異쒕젰
  document.querySelector("#acquisitionDateDisplay").textContent = acquisitionDate;
  document.querySelector("#transferDateDisplay").textContent = transferDate;
  document.querySelector("#usageTypeDisplay").textContent = usageType;
  document.querySelector("#holdingPeriodDisplay").textContent = periodText;
}

//�묐룄媛���
function updateValuationCells() {
  const valuation1 = document.querySelector("#valuation1")?.value || "";
  const valuation2 = document.querySelector("#valuation2")?.value || "";
  const marketCase = document.querySelector("#marketCase")?.value || "";

  document.querySelector("#valuationCell1").textContent = valuation1;
  document.querySelector("#valuationCell2").textContent = valuation2;
  document.querySelector("#marketCaseCell").textContent = marketCase;

  // �섎㉧吏� ���� 怨듬�
  document.querySelector("#extraCell1").textContent = "";
}
//痍⑤뱷媛���
function updateAcqPriceRightCells() {
  const acqInput = document.querySelector("#acqPrice1");
  const value = acqInput?.value || "";

  // �곗륫 �� ���� 媛� 蹂듭궗
  document.querySelector("#acqPriceRight1").textContent = value;
  document.querySelector("#acqPriceRight2").textContent = value;
}

function calculateAndUpdateHoldingPeriod(){
  const acquisitionDate = document.querySelector("#acquisitionDate")?.value;
  const transferDate = document.querySelector("#transferDate")?.value;

  const start = new Date(acquisitionDate);
  const end = new Date(transferDate);

  let result = "";
  if (!isNaN(start) && !isNaN(end) && end > start) {
    const diffYears = (end - start) / (1000 * 60 * 60 * 24 * 365);
    result = parseFloat(diffYears.toFixed(1));
  }

  document.querySelector("#holdingPeriod").textContent = result;
}

function updateAcquisitionPriceCell() {
  const acqPrice = document.querySelector("#acquisitionPrice")?.value || ""; 
  document.querySelector("#acquisitionPriceCell").textContent = acqPrice;
}

function updateDeductEstimate1() {
  const price = parseToNumber(getVal("#acquisitionPrice"));
  const estimated = Math.round(price * 0.03); // 3% 怨꾩궛
  setText("#deductEstimate1", formatNumber(estimated));
}

function updateNecessaryCost1() {
  const costFields = [
    "#capitalExp1",
    "#transferBrokerFee1",
    "#bondLoss1",
    "#etc2_1"
  ];

  let total = 0;
  for (const selector of costFields) {
    total += parseToNumber(getVal(selector));
  }

  setText("#necessaryCost1", formatNumber(total));
}


function calculateCapitalGains() {
  const acquisitionPrice = parseToNumber(getVal("#acqPrice1")); // 痍⑤뱷媛���
  console.log("acquisitionPrice:", acquisitionPrice);

  const capitalExp = parseToNumber(getVal("#capitalExp1")); // �꾩슂寃쎈퉬1
  const brokerFee = parseToNumber(getVal("#transferBrokerFee1")); // 以묎컻蹂댁닔
  const bondLoss = parseToNumber(getVal("#bondLoss1")); // 梨꾧텒�곸떎
  const etc = parseToNumber(getVal("#etc2_1")); // 湲고�
  const totalCost = capitalExp + brokerFee + bondLoss + etc;

  const val1 = parseToNumber(getVal("#valuation1")); // input
  setText("#capitalGain1", formatNumber(val1 - acquisitionPrice - totalCost));

  const val2 = parseToNumber(getVal("#valuation2")); // input
  setText("#capitalGain2", formatNumber(val2 - acquisitionPrice - totalCost));

  const marketCase = parseToNumber(getVal("#marketCase")); // input
  setText("#capitalGain3", formatNumber(marketCase - acquisitionPrice - totalCost));
}


function getSpecialDeductRate(holdingPeriod) {
  // 蹂댁쑀湲곌컙 怨듭젣�� �곗씠�� (�ㅻ쫫李⑥닚 �뺣젹 �꾩닔)
  const rates = [
    { period: 0, rate: 0 },
    { period: 3, rate: 6 },
    { period: 4, rate: 8 },
    { period: 5, rate: 10 },
    { period: 6, rate: 12 },
    { period: 7, rate: 14 },
    { period: 8, rate: 16 },
    { period: 9, rate: 18 },
    { period: 10, rate: 20 },
    { period: 11, rate: 22 },
    { period: 12, rate: 24 },
    { period: 13, rate: 26 },
    { period: 14, rate: 28 },
    { period: 15, rate: 30 }
  ];

  // holdingPeriod �댄븯 媛��� �� period瑜� 李얠쓬 (VLOOKUP�� TRUE �듭뀡怨� 媛숈쓬)
  let matchedRate = 0;
  for (const r of rates) {
    if (holdingPeriod >= r.period) matchedRate = r.rate;
    else break;
  }
  return matchedRate;
}

function updateSpecialDeduct() {
  const holdingPeriodStr = document.querySelector("#holdingPeriod")?.textContent || "";
  const holdingPeriod = parseFloat(holdingPeriodStr);

  if (isNaN(holdingPeriod)) {
    document.querySelector("#specialDeduct4").textContent = "";
    return;
  }

  const rate = getSpecialDeductRate(holdingPeriod);
  document.querySelector("#specialDeduct4").textContent = `${rate}%`;
}

function updateSpecialDeductRatesFromGain() {
	
  const rateText = document.querySelector("#specialDeduct4")?.textContent.replace('%', '').trim();
  const rate = parseFloat(rateText) / 100;

  if (isNaN(rate)) {
    // �쇱꽱�멸컪�� �좏슚�섏� �딆쑝硫� 鍮덉뭏 泥섎━
    for (let i = 1; i <= 3; i++) {
      document.querySelector(`#specialDeduct${i}`).textContent = "";
    }
    return;
  }
  // 2. �묐룄李⑥씡 媛� ���� �쒗쉶�섎ŉ 怨꾩궛
  for (let i = 1; i <= 3; i++) {
    const gainText = document.querySelector(`#capitalGain${i}`)?.textContent.replace(/,/g, '').trim();
    const gain = parseFloat(gainText);

    if (!isNaN(gain)) {
      const result = Math.round(gain * rate);
      document.querySelector(`#specialDeduct${i}`).textContent = result.toLocaleString();
    } else {
      document.querySelector(`#specialDeduct${i}`).textContent = "";
    }
  }
}

function syncBasicDeductToOthers() {
  const input = document.querySelector('#basicDeduct1');
  const value = input.value;

  // ���� <td>��
  const td2 = input.closest('tr').children[2]; // �� 踰덉㎏ td (index 1)
  const td3 = input.closest('tr').children[3]; // �� 踰덉㎏ td (index 2)

  // 媛� �ｊ린
  td2.textContent = value;
  td3.textContent = value;
}

function updateTaxableGains() {
  for (let i = 1; i <= 3; i++) {
    const capitalGainText = document.querySelector(`#capitalGain${i}`)?.textContent.replace(/,/g, '').trim();
    const deductText = document.querySelector(`#specialDeduct${i}`)?.textContent.replace(/,/g, '').trim();

    const capitalGain = parseFloat(capitalGainText);
    const specialDeduct = parseFloat(deductText);

    if (!isNaN(capitalGain) && !isNaN(specialDeduct)) {
      const taxableGain = Math.max(0, capitalGain - specialDeduct); // �뚯닔 諛⑹�
      document.querySelector(`#taxableGain${i}`).textContent = taxableGain.toLocaleString();
    } else {
      document.querySelector(`#taxableGain${i}`).textContent = "";
    }
  }
}

function calculateTaxBase() {
  const basicDeduct = Number(document.querySelector('#basicDeduct1').value.replace(/,/g, '') || 0);

  for (let i = 1; i <= 3; i++) {
    const taxableGainEl = document.querySelector(`#taxableGain${i}`);
    const taxBaseEl = document.querySelector(`#taxBase${i}`);

    const gain = Number(taxableGainEl.textContent.replace(/,/g, '') || 0);
    const taxBase = gain - basicDeduct;

    taxBaseEl.textContent = taxBase.toLocaleString(); // 肄ㅻ쭏 �ы븿 異쒕젰
  }
}


function getApplicableRate(taxBase, isBusinessUse) {
  const table = incomeRateTable;

  let rate = 0;
  for (let i = 0; i < table.length; i++) {
    if (taxBase < table[i].base) break;
    rate = isBusinessUse ? table[i].business : table[i].nonBusiness;
  }
  return rate;
}

function updateAppliedRates() {
  const isBusinessUse = document.querySelector('#businessUse').value === '1';

  for (let i = 1; i <= 3; i++) {
    const baseEl = document.querySelector(`#taxBase${i}`);
    const outputEl = document.querySelector(`#appliedRate${i}`);
    const raw = baseEl.textContent.replace(/,/g, '').trim();
    const baseValue = Number(raw) || 0;

    const rate = getApplicableRate(baseValue, isBusinessUse);
    outputEl.textContent = rate.toFixed(0) + ' %';
  }
}


function getProgressiveDeduction(taxBase) {
  let deduction = 0;
  for (let i = 0; i < incomeRateTable.length; i++) {
    if (taxBase < incomeRateTable[i].base) break;
    deduction = incomeRateTable[i].deduction;
  }
  return deduction;
}
function updateProgressiveDeductions() {
  for (let i = 1; i <= 3; i++) {
    const taxBaseEl = document.querySelector(`#taxBase${i}`);
    const deductionEl = document.querySelector(`#progressiveDeduction${i}`);
    if (!taxBaseEl || !deductionEl) continue;
    const raw = taxBaseEl.textContent.replace(/,/g, '').trim();
    const taxBaseValue = Number(raw) || 0;
    const deduction = getProgressiveDeduction(taxBaseValue);
    deductionEl.textContent = deduction.toLocaleString();
  }
}

function updateCalculatedTaxes() {
  for (let i = 1; i <= 3; i++) {
    const baseEl = document.querySelector(`#taxBase${i}`);
    const rateEl = document.querySelector(`#appliedRate${i}`);
    const deductionEl = document.querySelector(`#progressiveDeduction${i}`);
    const resultEl = document.querySelector(`#calculatedTax${i}`);
    const localTaxEl = document.querySelector(`#localTax${i}`);
    const subtotalEl = document.querySelector(`#taxSubtotal${i}`); // �멸툑 �뚭퀎

    if (!baseEl || !rateEl || !deductionEl || !resultEl) continue;

    const base = Number(baseEl.textContent.replace(/,/g, '').trim()) || 0;
    const rate = Number(rateEl.textContent.replace('%', '').trim()) || 0;
    const deduction = Number(deductionEl.textContent.replace(/,/g, '').trim()) || 0;

    // �곗텧�몄븸 怨꾩궛
    let calculated = base * (rate / 100) - deduction;
    calculated = Math.max(0, Math.round(calculated));
    resultEl.textContent = calculated.toLocaleString();

    // 吏�諛⑹냼�앹꽭 怨꾩궛 (1~3留�)
    let localTax = 0;
    if (i <= 3 && localTaxEl) {
      localTax = Math.round(calculated * 0.1);
      localTaxEl.textContent = localTax.toLocaleString();
    }

    // �멸툑 �뚭퀎 怨꾩궛 (1~3留�)
    if (i <= 3 && subtotalEl) {
      const subtotal = calculated + localTax;
      subtotalEl.textContent = subtotal.toLocaleString();
    }
  }
}

function calculateAllAcquisitionTaxes() {
  const getVal = id => {
    const el = document.querySelector(id);
    const raw = el?.value?.replace(/,/g, '') || '0';
    console.log(`getVal(${id}) = ${raw}`);
    return Number(raw);
  };

  const parseRate = id => {
    const text = document.querySelector(id)?.textContent || '';
    const num = Number(text.replace('%', ''));
    console.log(`parseRate(${id} => "${text}") = ${num / 100}`);
    return num / 100;
  };

  // �낅젰媛믩뱾
  const valuation1 = getVal('#valuation1');
  const valuation2 = getVal('#valuation2');
  const valuation3 = getVal('#marketCase');

  // �몄쑉 異붿텧
  const acquisitionRate = parseRate('#acquisitionRateText');
  const ruralRate = parseRate('#ruralRateText');
  const eduRate = parseRate('#eduRateText');

  // 痍⑤뱷��
  const acquisition1 = Math.round(valuation1 * acquisitionRate);
  const acquisition2 = Math.round(valuation2 * acquisitionRate);
  const acquisition3 = Math.round(valuation3 * acquisitionRate);

  // �랁듅��
  const rural1 = Math.round(valuation1 * ruralRate);
  const rural2 = Math.round(valuation2 * ruralRate);
  const rural3 = Math.round(valuation3 * ruralRate);

  // 吏�諛⑷탳�≪꽭
  const edu1 = Math.round(valuation1 * eduRate);
  const edu2 = Math.round(valuation2 * eduRate);
  const edu3 = Math.round(valuation3 * eduRate);

  // �⑷퀎
  const total1 = acquisition1 + rural1 + edu1;
  const total2 = acquisition2 + rural2 + edu2;
  const total3 = acquisition3 + rural3 + edu3;

  // 寃곌낵 異쒕젰
  console.log('--- 怨꾩궛 寃곌낵 ---');
  console.log({ acquisition1, acquisition2, acquisition3 });
  console.log({ rural1, rural2, rural3 });
  console.log({ edu1, edu2, edu3 });
  console.log({ total1, total2, total3 });

  // DOM 諛섏쁺
  document.querySelector('#acquisitionTax1').textContent = acquisition1.toLocaleString();
  document.querySelector('#acquisitionTax2').textContent = acquisition2.toLocaleString();
  document.querySelector('#acquisitionTax3').textContent = acquisition3.toLocaleString();

  document.querySelector('#ruralTax1').textContent = rural1.toLocaleString();
  document.querySelector('#ruralTax2').textContent = rural2.toLocaleString();
  document.querySelector('#ruralTax3').textContent = rural3.toLocaleString();

  document.querySelector('#eduTax1').textContent = edu1.toLocaleString();
  document.querySelector('#eduTax2').textContent = edu2.toLocaleString();
  document.querySelector('#eduTax3').textContent = edu3.toLocaleString();

  document.querySelector('#totalTax1').textContent = total1.toLocaleString();
  document.querySelector('#totalTax2').textContent = total2.toLocaleString();
  document.querySelector('#totalTax3').textContent = total3.toLocaleString();
}

function calculateSecondAcquisitionTaxes() {
  const getVal = id => {
    const el = document.querySelector(id);
    const raw = el?.value?.replace(/,/g, '') || '0';
    return Number(raw);
  };

  const parseRate = text => {
    const num = Number(text.replace('%', '').trim());
    return isNaN(num) ? 0 : num / 100;
  };

  // �먮낯 媛� (��: �댁쟾 �쒖쓽 valuation 媛� �먮뒗 �ㅻⅨ 湲곗�媛�)
  // �ш린�� 留욌뒗 媛믪쓣 �ｌ뼱�� �⑸땲��. �덉떆濡� valuation1~3 �ъ슜:
  const valuation1 = getVal('#valuation1');
  const valuation2 = getVal('#valuation2');
  const valuation3 = getVal('#marketCase');

  // �몄쑉 �띿뒪�� 媛��몄삤湲�
  const acqText = document.querySelector('#acquisitionRateText_2')?.textContent || '';
  const ruralText = document.querySelector('#ruralRateText_2')?.textContent || '';
  const eduText = document.querySelector('#eduRateText_2')?.textContent || '';

  const acquisitionRate = parseRate(acqText);
  const ruralRate = parseRate(ruralText);
  const eduRate = parseRate(eduText);

  // 怨꾩궛
  const acquisition1 = Math.round(valuation1 * acquisitionRate);
  const acquisition2 = Math.round(valuation2 * acquisitionRate);
  const acquisition3 = Math.round(valuation3 * acquisitionRate);

  const rural1 = Math.round(valuation1 * ruralRate);
  const rural2 = Math.round(valuation2 * ruralRate);
  const rural3 = Math.round(valuation3 * ruralRate);

  const edu1 = Math.round(valuation1 * eduRate);
  const edu2 = Math.round(valuation2 * eduRate);
  const edu3 = Math.round(valuation3 * eduRate);

  // �⑷퀎
  const total1 = acquisition1 + rural1 + edu1;
  const total2 = acquisition2 + rural2 + edu2;
  const total3 = acquisition3 + rural3 + edu3;

  // 寃곌낵 諛섏쁺
  document.querySelector('#acquisitionTax_2_1').textContent = acquisition1.toLocaleString();
  document.querySelector('#acquisitionTax_2_2').textContent = acquisition2.toLocaleString();
  document.querySelector('#acquisitionTax_2_3').textContent = acquisition3.toLocaleString();

  document.querySelector('#ruralTax_2_1').textContent = rural1.toLocaleString();
  document.querySelector('#ruralTax_2_2').textContent = rural2.toLocaleString();
  document.querySelector('#ruralTax_2_3').textContent = rural3.toLocaleString();

  document.querySelector('#eduTax_2_1').textContent = edu1.toLocaleString();
  document.querySelector('#eduTax_2_2').textContent = edu2.toLocaleString();
  document.querySelector('#eduTax_2_3').textContent = edu3.toLocaleString();

  document.querySelector('#totalTax_2_1').textContent = total1.toLocaleString();
  document.querySelector('#totalTax_2_2').textContent = total2.toLocaleString();
  document.querySelector('#totalTax_2_3').textContent = total3.toLocaleString();
}

function calculateNetAssets() {
  const parseNumber = str => Number(str.replace(/,/g, '')) || 0;

  // �낅젰媛� 媛��몄삤湲�
  const val1 = parseNumber(document.querySelector('#valuation1')?.value);
  const val2 = parseNumber(document.querySelector('#valuation2')?.value);
  const val3 = parseNumber(document.querySelector('#marketCase')?.value);
  const debt = parseNumber(document.querySelector('#collateralDebt')?.value);

  // 怨꾩궛
  const net1 = val1 - debt;
  const net2 = val2 - debt;
  const net3 = val3 - debt;

  // 寃곌낵 諛섏쁺
  document.querySelector('#netAsset1').textContent = net1.toLocaleString();
  document.querySelector('#netAsset2').textContent = net2.toLocaleString();
  document.querySelector('#netAsset3').textContent = net3.toLocaleString();
}

function calculateLicenseTax() {
  const parseNumber = str => Number(str.replace(/,/g, '')) || 0;

  const netAssets = [
    parseNumber(document.querySelector('#netAsset1')?.textContent),
    parseNumber(document.querySelector('#netAsset2')?.textContent),
    parseNumber(document.querySelector('#netAsset3')?.textContent),
  ];
  const licenseRate = 0.004; // 0.4%
  netAssets.forEach((netAsset, index) => {
    const tax = Math.max(netAsset * licenseRate, 0);
    const target = document.querySelector(`#licenseTax${index + 1}`);
    if (target) target.textContent = tax.toLocaleString(undefined, { maximumFractionDigits: 0 });
  });
}
function calculateEducationTaxFromLicense() {
  for (let i = 1; i <= 3; i++) {
    const licenseTaxEl = document.querySelector(`#licenseTax${i}`);
    const eduTaxEl = document.querySelector(`#eduTaxFromLicense${i}`);

    if (licenseTaxEl && eduTaxEl) {
      const licenseTax = Number(licenseTaxEl.textContent.replace(/,/g, '')) || 0;
      const eduTax = licenseTax * 0.2;
      eduTaxEl.textContent = Math.round(eduTax).toLocaleString();
    }
  }
}
function calculateTotalLicenseAndEduTax() {
  for (let i = 1; i <= 3; i++) {
    const licenseTaxEl = document.querySelector(`#licenseTax${i}`);
    const eduTaxEl = document.querySelector(`#eduTaxFromLicense${i}`);
    const totalTaxEl = document.querySelector(`#taxTotal${i}`);

    const licenseTax = Number(licenseTaxEl?.textContent.replace(/,/g, '')) || 0;
    const eduTax = Number(eduTaxEl?.textContent.replace(/,/g, '')) || 0;

    const total = licenseTax + eduTax;
    if (totalTaxEl) {
      totalTaxEl.textContent = Math.round(total).toLocaleString();
    }
  }
}

function calculateDenseAreaLicenseTax() {
  const taxRate = 0.012; // 1.2%
  for (let i = 1; i <= 3; i++) {
    const assetEl = document.querySelector(`#netAsset${i}`);
    const denseTaxEl = document.querySelector(`#denseTax${i}`);

    const assetValue = Number(assetEl?.textContent.replace(/,/g, '')) || 0;
    const tax = Math.max(assetValue * taxRate, 0);

    if (denseTaxEl) {
      denseTaxEl.textContent = Math.round(tax).toLocaleString();
    }
  }
}

function calculateDenseEduTax() {
  for (let i = 1; i <= 3; i++) {
    const licenseTaxEl = document.querySelector(`#denseTax${i}`);
    const eduTaxEl = document.querySelector(`#denseEduTax${i}`);

    const licenseTax = Number(licenseTaxEl?.textContent.replace(/,/g, '')) || 0;
    const eduTax = Math.round(licenseTax * 0.2); // 20%

    if (eduTaxEl) {
      eduTaxEl.textContent = eduTax.toLocaleString();
    }
  }
}

function calculateDenseAreaTotal() {
  for (let i = 1; i <= 3; i++) {
    const licenseTax = Number(document.querySelector(`#denseTax${i}`)?.textContent.replace(/,/g, '') || 0);
    const eduTax = Number(document.querySelector(`#denseEduTax${i}`)?.textContent.replace(/,/g, '') || 0);

    const total = licenseTax + eduTax;

    const totalEl = document.querySelector(`#denseTotal${i}`);
    if (totalEl) {
      totalEl.textContent = total.toLocaleString();
    }
  }
}
function calculateAll() {
  calculateAndUpdateHoldingPeriod();
  updateFormattedInputs();
  updateSummaryTable();
  updateValuationCells();
  updateAcqPriceRightCells();
  updateAcquisitionPriceCell(); // 留ㅼ엯媛��� �� 諛섏쁺
  updateDeductEstimate1();
  updateNecessaryCost1();
  calculateCapitalGains();
  updateSpecialDeduct();
  updateSpecialDeductRatesFromGain();
  updateTaxableGains();
  calculateTaxBase();
  updateAppliedRates();
  updateProgressiveDeductions();
  updateCalculatedTaxes();
  calculateAllAcquisitionTaxes();
  calculateSecondAcquisitionTaxes();
  calculateNetAssets();
  calculateLicenseTax();
  calculateEducationTaxFromLicense();
  calculateTotalLicenseAndEduTax();
  calculateDenseAreaLicenseTax();
  calculateDenseEduTax();
  calculateDenseAreaTotal();
}


document.addEventListener("DOMContentLoaded", () => {
	
initToggleEvents();	
  calculateAll();
  syncBasicDeductToOthers();
  document.querySelectorAll(".calc-trigger").forEach(el => {
    el.addEventListener("input", calculateAll);
    el.addEventListener("change", calculateAll);
  });

  const acqPriceEl = document.querySelector("#acqPrice1");
  if (acqPriceEl) {
    acqPriceEl.addEventListener("input", updateAcqPriceRightCells);
    acqPriceEl.addEventListener("change", updateAcqPriceRightCells);
  }
  
	document.querySelector('#basicDeduct1')?.addEventListener('input', syncBasicDeductToOthers);
	document.querySelector('#collateralDebt').addEventListener('input', calculateNetAssets);
	document.querySelectorAll('.toggle-group-btn').forEach(btn => {
		btn.addEventListener('click', () => {
		  const groupNumber = btn.getAttribute('data-group');
		  const icon = btn.querySelector('i');

		  let rows;

		  if (groupNumber === '0') {
			rows = Array.from(document.querySelectorAll('tr'))
			  .filter(row => Array.from(row.classList).some(cls => /^group-\d+$/.test(cls)));
		  } else {
			rows = document.querySelectorAll(`.group-${groupNumber}`);
		  }
		  const isHidden = [...rows].every(row => row.style.display === 'none');

		  rows.forEach(row => {
			row.style.display = isHidden ? '' : 'none';
		  });
		  if (icon) {
			icon.classList.toggle('bi-chevron-down', isHidden);
			icon.classList.toggle('bi-chevron-up', !isHidden);
		  }
		});
	});
	
});

function initToggleEvents() {
  const toggleLinks = document.querySelectorAll('.toggle-category');
  toggleLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // 留곹겕 �대룞 諛⑹�

      const subList = this.nextElementSibling;
      const icon = this.querySelector('i.bi-chevron-down, i.bi-chevron-up');

      if (!subList) return;

      const isHidden = subList.style.display === 'none' || subList.style.display === '';

      subList.style.display = isHidden ? 'block' : 'none';

      if (icon) {
        icon.classList.toggle('bi-chevron-down', !isHidden);
        icon.classList.toggle('bi-chevron-up', isHidden);
      }
    });
  });
}