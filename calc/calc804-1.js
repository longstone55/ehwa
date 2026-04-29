const holdingDeductionRates = [
  { year: 0, rate: 0 },
  { year: 3, rate: 6 },
  { year: 4, rate: 8 },
  { year: 5, rate: 10 },
  { year: 6, rate: 12 },
  { year: 7, rate: 14 },
  { year: 8, rate: 16 },
  { year: 9, rate: 18 },
  { year: 10, rate: 20 },
  { year: 11, rate: 22 },
  { year: 12, rate: 24 },
  { year: 13, rate: 26 },
  { year: 14, rate: 28 },
  { year: 15, rate: 30 }
];

const taxRateTable = [
  { base: 0,             deduction: 0,         business: 0.06, nonBusiness: 0.16 },
  { base: 12000000,      deduction: 1080000,   business: 0.15, nonBusiness: 0.25 },
  { base: 46000000,      deduction: 5220000,   business: 0.24, nonBusiness: 0.34 },
  { base: 88000000,      deduction: 14900000,  business: 0.35, nonBusiness: 0.45 },
  { base: 150000000,     deduction: 19400000,  business: 0.38, nonBusiness: 0.48 },
  { base: 300000000,     deduction: 25400000,  business: 0.40, nonBusiness: 0.50 },
  { base: 500000000,     deduction: 35400000,  business: 0.42, nonBusiness: 0.52 },
  { base: 1000000000,    deduction: 65400000,  business: 0.45, nonBusiness: 0.55 }
];

function parseToNumber(value) {
  return Number(String(value).replace(/[^\d.-]/g, '')) || 0;
}

function formatNumber(num) {
  return num.toLocaleString('ko-KR');
}


function updateBusinessFlags() {
  for (let i = 1; i <= 4; i++) {
    const select = document.getElementById(`useType${i}`);
    const target = document.getElementById(`bizFlag${i}`);
    if (!select || !target) continue;
    const value = select.value; // "1" for �ъ뾽��, "0" for 鍮꾩궗�낆슜
    const flag = (value === "1") ? 0 : 1; // �ъ뾽�⑹씠硫� 0, 鍮꾩궗�낆슜�대㈃ 1

    target.textContent = flag;
  }
}

function calculateAllHoldingPeriods() {
  for (let i = 1; i <= 4; i++) {
    const acqInput = document.getElementById(`acqDate${i}`);
    const transInput = document.getElementById(`transDate${i}`);
    const outputCell = document.getElementById(`holdingPeriod${i}`);

    if (!acqInput || !transInput || !outputCell) continue;

    const acqDate = new Date(acqInput.value);
    const transDate = new Date(transInput.value);

    if (isNaN(acqDate) || isNaN(transDate)) {
      outputCell.textContent = '';
      continue;
    }

    const diffDays = (transDate - acqDate) / (1000 * 60 * 60 * 24);
    const years = (diffDays / 365).toFixed(1);

    outputCell.textContent = `${years}�� 蹂댁쑀`;
  }
}

function updateNecessaryCosts() {
  for (let i = 1; i <= 4; i++) {
    const capital = parseToNumber(document.getElementById(`capitalExp${i}`)?.value);
    const broker = parseToNumber(document.getElementById(`transferBrokerFee${i}`)?.value);
    const bond = parseToNumber(document.getElementById(`bondLoss${i}`)?.value);
    const etc = parseToNumber(document.getElementById(`etc2_${i}`)?.value);

    const sum = capital + broker + bond + etc;

    const cell = document.getElementById(`necessaryCost${i}`);
    if (cell) {
      cell.textContent = sum ? formatNumber(sum) : '';
    }
  }
}

function updateEstimatedDeductions() {
  for (let i = 1; i <= 4; i++) {
    const acqInput = document.getElementById(`acqPrice${i}`);
    const outputCell = document.getElementById(`deductEstimate${i}`);

    if (!acqInput || !outputCell) continue;

    const rawValue = parseToNumber(acqInput.value);
    const estimatedDeduction = Math.floor(rawValue * 0.03);

    outputCell.textContent = estimatedDeduction ? formatNumber(estimatedDeduction) : '';
  }
}
function getDeductionRate(years) {
  let rate = 0;
  for (let i = 0; i < holdingDeductionRates.length; i++) {
    if (years >= holdingDeductionRates[i].year) {
      rate = holdingDeductionRates[i].rate;
    } else {
      break;
    }
  }
  return rate;
}

function updateHoldingPeriodsAndRates() {
  for (let i = 1; i <= 4; i++) {
    const acq = document.getElementById(`acqDate${i}`);
    const trans = document.getElementById(`transDate${i}`);
    const periodCell = document.getElementById(`holdingPeriod${i}`);
    const rateCell = document.getElementById(`deductRate${i}`);

    if (!acq || !trans || !periodCell || !rateCell) continue;

    const acqDate = new Date(acq.value);
    const transDate = new Date(trans.value);

    if (isNaN(acqDate) || isNaN(transDate)) {
      periodCell.textContent = '';
      rateCell.textContent = '';
      continue;
    }

    const diffDays = (transDate - acqDate) / (1000 * 60 * 60 * 24);
    const years = +(diffDays / 365).toFixed(1); // �뚯닔 泥レ㎏�먮━源뚯�
    periodCell.textContent = `${years}�� 蹂댁쑀`;

    const rate = getDeductionRate(Math.floor(years));
    rateCell.textContent = `${rate}%`;
  }
}




	function updateCapitalGains() {
	  let totalTransfer = 0;

	  for (let i = 1; i <= 6; i++) {
		const transfer = parseToNumber(document.getElementById(`transferPrice${i}`)?.value);
		const acq = parseToNumber(document.getElementById(`acqPrice${i}`)?.value);
		const cost = parseToNumber(document.getElementById(`necessaryCost${i}`)?.textContent);
		const deduct = parseToNumber(document.getElementById(`deductEstimate${i}`)?.textContent);
		const gain = transfer - acq - cost - deduct;

		if (i <= 4) {
		  totalTransfer += transfer;

		  // �� �ш린�� 痍⑤뱷媛��� <td> �낅뜲�댄듃 (class 湲곕컲)
		  const acqCell = document.querySelector(`.acq-price-cell[data-index="${i}"]`);
		  if (acqCell) acqCell.textContent = formatNumber(transfer);
		}

		const cell = document.getElementById(`capitalGain${i}`);
		if (cell) cell.textContent = gain ? formatNumber(gain) : '';
	  }

	  const totalCell = document.getElementById("transferPriceTotal");
	  if (totalCell) totalCell.textContent = totalTransfer ? formatNumber(totalTransfer) : '';

	  const currentNetAssetsCell = document.getElementById("currentNetAssets");
	  if (currentNetAssetsCell) currentNetAssetsCell.textContent = totalTransfer ? formatNumber(totalTransfer) : '';

	  const acqTotalCell = document.querySelector(".acq-price-total");
	  if (acqTotalCell) acqTotalCell.textContent = formatNumber(totalTransfer);
	}

	function updateSpecialDeductions() {
	  for (let i = 1; i <= 4; i++) {
		const gain = parseToNumber(document.getElementById(`capitalGain${i}`)?.textContent);
		const rateText = document.getElementById(`deductRate${i}`)?.textContent || "0%";
		const rate = parseToNumber(rateText.replace('%', '')) / 100;

		const result = Math.floor(gain * rate);
		const cell = document.getElementById(`specialDeduct${i}`);
		if (cell) cell.textContent = result ? result.toLocaleString('ko-KR') : '';
	  }
	}

function updateTaxableGains() {
  for (let i = 1; i <= 4; i++) {
    const gain = parseToNumber(document.getElementById(`capitalGain${i}`)?.textContent);
    const special = parseToNumber(document.getElementById(`specialDeduct${i}`)?.textContent);
    const result = gain - special;

    const cell = document.getElementById(`taxableGain${i}`);
    if (cell) cell.textContent = result ? result.toLocaleString('ko-KR') : '';
  }
}

function updateTaxBases() {
  for (let i = 1; i <= 6; i++) {
    const gain = parseToNumber(document.getElementById(`taxableGain${i}`)?.textContent);
    const deduct = parseToNumber(document.getElementById(`basicDeduct${i}`)?.value);
    const result = Math.max(gain - deduct, 0);

    const cell = document.getElementById(`taxBase${i}`);
    if (cell) cell.textContent = result ? result.toLocaleString('ko-KR') : '';
  }
}

function updateAppliedRates() {
	
  for (let i = 1; i <= 4; i++) {
	  
    const taxBaseStr = document.getElementById(`taxBase${i}`)?.textContent;
    const bizFlagStr = document.getElementById(`bizFlag${i}`)?.textContent;

    const taxBase = parseToNumber(taxBaseStr);
    const bizFlag = parseToNumber(bizFlagStr);

    let rate = 0;
    let deduction = 0;

    for (let j = 0; j < taxRateTable.length; j++) {
      if (taxBase >= taxRateTable[j].base) {
        rate = (bizFlag === 0) ? taxRateTable[j].business : taxRateTable[j].nonBusiness;
        deduction = taxRateTable[j].deduction;
      } else {
        break;
      }
    }

    const elRate = document.getElementById(`appliedRate${i}`);
    if (elRate) {
      elRate.textContent = (rate * 100).toFixed(1) + '%';
    }
    const taxAmount = Math.max(0, taxBase * rate - deduction);
    const elTax = document.getElementById(`taxAmount${i}`);
    if (elTax) {
      elTax.textContent = taxAmount > 0 ? taxAmount.toLocaleString('ko-KR') : "";
    }
  }
  
}

function updateProgressiveDeductions() {
  for (let i = 1; i <= 4; i++) {
    const taxBase = parseToNumber(document.getElementById(`taxBase${i}`)?.textContent);
    let deduction = 0;

    for (let j = 0; j < taxRateTable.length; j++) {
      if (taxBase >= taxRateTable[j].base) {
        deduction = taxRateTable[j].deduction;  // �꾩쭊怨듭젣��
      } else {
        break;
      }
    }

    const el = document.getElementById(`progressiveDeduction${i}`);
    if (el) {
      el.textContent = deduction > 0 ? deduction.toLocaleString('ko-KR') : "";
    }
  }
}

function updateCalculatedTaxes() {
  for (let i = 1; i <= 4; i++) {
    const taxBase = parseToNumber(document.getElementById(`taxBase${i}`)?.textContent);
    const appliedRateText = document.getElementById(`appliedRate${i}`)?.textContent || "0%";
    const progressiveDeduction = parseToNumber(document.getElementById(`progressiveDeduction${i}`)?.textContent);
    const rate = parseFloat(appliedRateText.replace('%', '')) / 100 || 0;
    const calculatedTax = Math.max(0, taxBase * rate - progressiveDeduction);
    const el = document.getElementById(`calculatedTax${i}`);
    if (el) {
      el.textContent = calculatedTax > 0 ? calculatedTax.toLocaleString('ko-KR') : "";
    }
  }
}
function updateLocalTaxes() {
  for (let i = 1; i <= 4; i++) {
    const calculatedTax = parseToNumber(document.getElementById(`calculatedTax${i}`)?.textContent);
    const localTax = calculatedTax * 0.1;

    const el = document.getElementById(`localTax${i}`);
    if (el) {
      el.textContent = localTax > 0 ? localTax.toLocaleString('ko-KR') : "";
    }
  }
}

function updateTaxSubtotal() {
  let totalSubtotal = 0;

  for (let i = 1; i <= 4; i++) {
    const calculatedTax = parseToNumber(document.getElementById(`calculatedTax${i}`)?.textContent);
    const localTax = parseToNumber(document.getElementById(`localTax${i}`)?.textContent);

    const subtotal = calculatedTax + localTax;

    const el = document.getElementById(`taxSubtotal${i}`);
    if (el) {
      el.textContent = subtotal > 0 ? subtotal.toLocaleString('ko-KR') : "";
    }

    totalSubtotal += subtotal;
  }

  // 5踰덉뿉 �⑷퀎, 6踰덉� 鍮꾩썙�먭린
  const totalCell = document.getElementById(`taxSubtotal5`);
  if (totalCell) {
    totalCell.textContent = totalSubtotal > 0 ? totalSubtotal.toLocaleString('ko-KR') : "";
  }
	const carryForwardCell = document.getElementById("carryForwardTax");
	if (carryForwardCell) {
	  carryForwardCell.textContent = totalSubtotal > 0 ? totalSubtotal.toLocaleString('ko-KR') : "";
	}
  const lastCell = document.getElementById(`taxSubtotal6`);
  if (lastCell) {
    lastCell.textContent = "";
  }
}

function formatCurrency(value) {
  return value.toLocaleString("ko-KR");
}

function updateNetAssetsAfterTax() {
	
  const netAssetsEl = document.getElementById("currentNetAssets");       // B35
  const carryForwardEl = document.getElementById("carryForwardTax");
  const resultEl = document.getElementById("netAssetsAfterTax");         // B37
  const ratioEl = document.getElementById("netAssetsAfterTaxRatio");     // 鍮꾩쑉 �쒖떆��

  if (!netAssetsEl || !carryForwardEl || !resultEl) return;

  const netAssets = parseToNumber(netAssetsEl.textContent);
  const carryForward = parseToNumber(carryForwardEl.textContent);
  const afterTax = netAssets - carryForward;

  resultEl.textContent = afterTax > 0 ? formatNumber(afterTax) : "0";

  if (ratioEl) {
    const ratio = netAssets > 0 ? (afterTax / netAssets) * 100 : 0;
    ratioEl.textContent = `${ratio.toFixed(1)}%`;
  }
}

function updateStockPrices() {
  const netAssetsEl = document.getElementById("currentNetAssets");       // B35
  const afterTaxEl = document.getElementById("netAssetsAfterTax");       // B37

  if (!netAssetsEl || !afterTaxEl) return;

  const netAssets = parseToNumber(netAssetsEl.textContent);
  const afterTax = parseToNumber(afterTaxEl.textContent);

  const ratio = netAssets > 0 ? (afterTax / netAssets) : 0;
  const stockPrice = Math.round(ratio * 10000); // 寃곌낵: 7458

  for (let i = 1; i <= 5; i++){
    const cell = document.getElementById(`stockPrice${i}`);
    if (cell) {
      cell.textContent = stockPrice.toLocaleString('ko-KR');
    }
  }
}

function updateNetAssetsMirror(){
  const mirrorPairs = [
    { sourceId: "currentNetAssets", targetId: "currentNetAssetsMirror" },
    { sourceId: "carryForwardTax", targetId: "carryForwardTaxMirror" }
  ];

  mirrorPairs.forEach(({ sourceId, targetId }) => {
    const sourceEl = document.getElementById(sourceId);
    const targetEl = document.getElementById(targetId);
    if (sourceEl && targetEl) {
      const value = sourceEl.tagName === "INPUT" ? sourceEl.value : sourceEl.textContent;
      targetEl.textContent = value;
    }
  });

  const netAssetsText = document.getElementById("currentNetAssetsMirror")?.textContent;
  const carryForwardText = document.getElementById("carryForwardTaxMirror")?.textContent;
  const afterTaxEl = document.getElementById("netAssetsAfterTaxMirror");
  const ratioEl = document.getElementById("netAssetsAfterTaxRatioMirror");

  const netAssets = parseToNumber(netAssetsText);
  const carryForward = parseToNumber(carryForwardText);
  const afterTax = netAssets - carryForward;

  afterTaxEl.textContent = formatNumber(afterTax > 0 ? afterTax : 0);

  if (ratioEl) {
    const ratio = netAssets > 0 ? (afterTax / netAssets) * 100 : 0;
    ratioEl.textContent = `${ratio.toFixed(1)}%`;
  }
}

function updateRequiredAssetIncrease() {
  const netAssetElement = document.getElementById("currentNetAssetsMirror");
  const outputElement = document.getElementById("requiredAssetIncrease");

  if (!netAssetElement || !outputElement) return;

  // �꾩옱 �쒖옄�곌��� 異붿텧 (�먰솕 肄ㅻ쭏 �쒓굅 �� �レ옄��)
  const rawValue = parseFloat(netAssetElement.textContent.replace(/,/g, ""));
  if (isNaN(rawValue) || rawValue === 0) {
    outputElement.textContent = "";
    return;
  }

  // 怨꾩궛: (�쒖옄�곌��� / 0.8) - �쒖옄�곌��� -> �⑥쐞: 諛깅쭔��
  const requiredAmount = Math.round(((rawValue / 0.8) - rawValue) / 1_000_000);

  outputElement.textContent = `${requiredAmount}諛깅쭔�먯쓽 �먯궛�� �섎젮��`;
}

function updateStockRowByClass(){
	
  const b44Text = document.getElementById("currentNetAssetsMirror")?.textContent;
  const b46Text = document.getElementById("netAssetsAfterTaxMirror")?.textContent;
  const stockCells = document.querySelectorAll(".stock-cell");

  if (!b44Text || !b46Text || stockCells.length === 0) return;

  const b44 = parseToNumber(b44Text);
  const b46 = parseToNumber(b46Text);

  if (b44 <= 0) return;

  const stockValue = Math.floor((b46 / b44) * 10000 * 0.8);

  stockCells.forEach(cell => {
    cell.textContent = formatNumber(stockValue);
  });
  
}





function bindItemInputToLabels() {
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`itemInput${i}`);

    if (input) {
      input.addEventListener("input", () => {
        const newValue = input.value || `臾쇨굔吏�${i}`;
        document.querySelectorAll(`.item-label[data-index="${i}"]`).forEach(label => {
          label.textContent = newValue;
        });
      });
    }
  }
}


function updateAcquisitionTax() {
  const leaseRate = 0.04;     // �꾨� �몄쑉
  const nonLeaseRate = 0.01;  // 鍮꾩엫�� �몄쑉

  let totalTax = 0;

  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    const priceInput = document.getElementById(`transferPrice${i}`);
    const taxCell = document.querySelector(`.acq-tax-cell[data-index="${i}"]`);

    const leaseType = leaseSelect?.value;
    const price = parseToNumber(priceInput?.value);
    const rate = leaseType === "�꾨�" ? leaseRate : nonLeaseRate;
    const tax = Math.floor(price * rate);

    if (taxCell) taxCell.textContent = price > 0 ? formatNumber(tax) : '';

    totalTax += tax;
  }

  const totalCell = document.querySelector('.acq-tax-total');
  if (totalCell) totalCell.textContent = totalTax > 0 ? formatNumber(totalTax) : '';
}

function updateRuralSpecialTax() {
  const leaseRate = 0.002;      // �꾨� �랁듅�몄쑉 (0.20%)
  const nonLeaseRate = 0.0005;  // 鍮꾩엫�� �랁듅�몄쑉 (0.05%)

  let totalRuralTax = 0;

  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    const priceInput = document.getElementById(`transferPrice${i}`);
    const taxCell = document.querySelector(`.rural-tax-cell[data-index="${i}"]`);

    const leaseType = leaseSelect?.value;
    const price = parseToNumber(priceInput?.value);
    const rate = leaseType === "�꾨�" ? leaseRate : nonLeaseRate;
    const tax = Math.floor(price * rate);

    if (taxCell) taxCell.textContent = price > 0 ? formatNumber(tax) : '';

    totalRuralTax += tax;
  }

  const totalCell = document.querySelector('.rural-tax-total');
  if (totalCell) totalCell.textContent = totalRuralTax > 0 ? formatNumber(totalRuralTax) : '';
}


function updateEduTax() {
  const leaseRate = 0.004;    // �꾨�: 0.40%
  const nonLeaseRate = 0.001; // 鍮꾩엫��: 0.10%

  let totalEduTax = 0;

  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    const priceInput = document.getElementById(`transferPrice${i}`);
    const taxCell = document.querySelector(`.edu-tax-cell[data-index="${i}"]`);

    const leaseType = leaseSelect?.value;
    const price = parseToNumber(priceInput?.value);
    const rate = leaseType === "�꾨�" ? leaseRate : nonLeaseRate;

    const tax = Math.floor(price * rate);

    if (taxCell) taxCell.textContent = price > 0 ? formatNumber(tax) : '';
    totalEduTax += tax;
  }

  const totalCell = document.querySelector('.edu-tax-total');
  if (totalCell) totalCell.textContent = totalEduTax > 0 ? formatNumber(totalEduTax) : '';
}

function updateReducedRuralSpecialTax() {
  const baseTaxRate = 0.04;         // $H59
  const reducedRate = 0.00;         // $H61 (�꾨�)
  const nonReducedRate = 0.20;      // $I61 (鍮꾩엫��)
  const reductionFactor = 0.75;

  let totalReducedTax = 0;

  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    const priceInput = document.getElementById(`transferPrice${i}`);
    const taxCell = document.querySelector(`.reduced-rural-tax-cell[data-index="${i}"]`);

    const leaseType = leaseSelect?.value;
    const price = parseToNumber(priceInput?.value);
    const appliedRate = leaseType === "�꾨�" ? reducedRate : nonReducedRate;

    const tax = Math.floor(price * appliedRate * reductionFactor * baseTaxRate);

    if (taxCell) taxCell.textContent = price > 0 ? formatNumber(tax) : '';
    totalReducedTax += tax;
  }

  const totalCell = document.querySelector('.reduced-rural-tax-total');
  if (totalCell) totalCell.textContent = totalReducedTax > 0 ? formatNumber(totalReducedTax) : '';
}

function updateTotalRow() {
  const totalByColumn = [0, 0, 0, 0]; // 臾쇨굔吏� 1~4蹂� �멸툑 �⑷퀎
  let grandTotal = 0;

  for (let i = 1; i <= 4; i++) {
    const tax1 = parseToNumber(document.querySelector(`.acq-tax-cell[data-index="${i}"]`)?.textContent);
    const tax2 = parseToNumber(document.querySelector(`.rural-tax-cell[data-index="${i}"]`)?.textContent);
    const tax3 = parseToNumber(document.querySelector(`.reduced-rural-tax-cell[data-index="${i}"]`)?.textContent);
    const tax4 = parseToNumber(document.querySelector(`.edu-tax-cell[data-index="${i}"]`)?.textContent);

    const subtotal = tax1 + tax2 + tax3 + tax4;

    totalByColumn[i - 1] = subtotal;
    grandTotal += subtotal;

    const cell = document.querySelector(`.total-cell[data-index="${i}"]`);
	
    if (cell) cell.textContent = subtotal > 0 ? formatNumber(subtotal) : '';
  }

  const totalSumCell = document.querySelector('.total-sum');
  if (totalSumCell) totalSumCell.textContent = grandTotal > 0 ? formatNumber(grandTotal) : '';
}

function updateAcquisitionTax2() {
  const leaseRate = 0.08;    // �꾨�: 8%
  const nonLeaseRate = 0.02; // 鍮꾩엫��: 2%
  let totalTax = 0;

  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    const priceInput = document.getElementById(`transferPrice${i}`);
    const taxCell = document.querySelector(`.acq-tax2-cell[data-index="${i}"]`);
    const leaseType = leaseSelect?.value;
    const priceRaw = priceInput?.value || '';
    const price = parseToNumber(priceRaw);
    const rate = leaseType === "�꾨�" ? leaseRate : nonLeaseRate;
    const tax = Math.floor(price * rate);

    if (taxCell) taxCell.textContent = price > 0 ? formatNumber(tax) : '';
    totalTax += tax;
  }

  const totalCell = document.querySelector('.acq-tax2-total');
  if (totalCell) {
    totalCell.textContent = totalTax > 0 ? formatNumber(totalTax) : '';
    console.log(`Total Tax (All Rows): ${totalTax}`);
  } else {
    console.warn("Total cell (.acq-tax2-total) not found!");
  }
}

function updateTotalTax2() {
	
  const indices = [1, 2, 3, 4];
  let grandTotal = 0;

  function getCellText(className, index) {
    const cell = document.querySelector(`.${className}[data-index="${index}"]`);
    return cell ? parseToNumber(cell.textContent) : 0;
  }

  indices.forEach(i => {
	  
    const acqTax = getCellText('acq-tax2-cell', i);
    const ruralTax = getCellText('rural-tax2-cell', i);
    const reducedTax = getCellText('reduced-rural-tax2-cell', i);
    const eduTax = getCellText('edu-tax2-cell', i);
	
	console.log(eduTax);
	
    const sum = acqTax + ruralTax + reducedTax + eduTax;

    const colTotalCell = document.querySelector(`.total2-cell[data-index="${i}"]`);
    if (colTotalCell) {
      colTotalCell.textContent = formatNumber(sum);
    }
    grandTotal += sum;
  });

  const totalSumCell = document.querySelector('.total2-sum');
  if (totalSumCell) {
    totalSumCell.textContent = grandTotal > 0 ? formatNumber(grandTotal) : '';
  }
  
}

function updateRuralSpecialTax2() {
  const leaseRate = 0.002;    // �꾨�: 0.2%
  const nonLeaseRate = 0.0005; // 鍮꾩엫��: 0.05%
  let totalTax = 0;

  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    const priceInput = document.getElementById(`transferPrice${i}`);
    const taxCell = document.querySelector(`.rural-tax2-cell[data-index="${i}"]`);

    const leaseType = leaseSelect?.value;
    const priceRaw = priceInput?.value || '';
    const price = parseToNumber(priceRaw);
    const rate = leaseType === "�꾨�" ? leaseRate : nonLeaseRate;
    const tax = Math.floor(price * rate);

    if (taxCell) taxCell.textContent = price > 0 ? formatNumber(tax) : '';
    totalTax += tax;
  }

  const totalCell = document.querySelector('.rural-tax2-total');
  if (totalCell) totalCell.textContent = totalTax > 0 ? formatNumber(totalTax) : '';
}


function bindLeaseTypeChangeEvents() {
  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    if (leaseSelect) {
      leaseSelect.addEventListener("change", () => {
        updateAcquisitionTax();
        updateRuralSpecialTax();
		updateReducedRuralSpecialTax();	
		updateEduTax();	
		updateTotalRow();
      });
    }
  }
}

function bindAllLeaseTransferEvents() {
  for (let i = 1; i <= 4; i++) {
    const lease = document.getElementById(`leaseType${i}`);
    const price = document.getElementById(`transferPrice${i}`);

    lease?.addEventListener("change", () => {
      updateRuralSpecialTax2();
      updateReducedRuralTax2();
      updateAcquisitionTax2();
	  updateEducationTax();
	  updateTotalTax2();
    });

    price?.addEventListener("input", () => {
      updateRuralSpecialTax2();
      updateReducedRuralTax2();
      updateAcquisitionTax2();
	  updateEducationTax();
	  updateTotalTax2();	  
    });
  }
}

function updateReducedRuralTax2() {
  const leaseRate = 0;
  const nonLeaseRate = 0.2;
  const reductionFactor = 0.75;
  const baseAcqTaxRate = 0.08;

  let totalTax = 0;

  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    const priceInput = document.getElementById(`transferPrice${i}`);
    const taxCell = document.querySelector(`.reduced-rural-tax2-cell[data-index="${i}"]`);

    const leaseType = leaseSelect?.value;
    const price = parseToNumber(priceInput?.value || "");
    const rate = leaseType === "�꾨�" ? leaseRate : nonLeaseRate;

    const rawTax = price * rate;
    const finalTax = Math.floor(rawTax * reductionFactor * baseAcqTaxRate);

    if (taxCell) {
      taxCell.textContent = price > 0 ? finalTax.toLocaleString('ko-KR') : '';
      console.log(`Updated cell[${i}]:`, taxCell.textContent);
    } else {
      console.warn(`taxCell not found for index ${i}`);
    }

    totalTax += finalTax;
  }

  const totalCell = document.querySelector('.reduced-rural-tax2-total');
  if (totalCell) {
    totalCell.textContent = totalTax > 0 ? totalTax.toLocaleString('ko-KR') : '';
  } else {
    console.warn('Total cell (.reduced-rural-tax2-total) not found!');
  }
}

function updateEducationTax() {
  const leaseRate = 0.012;   // �꾨�(媛먮㈃X) 1.20%
  const nonLeaseRate = 0.003; // 鍮꾩엫��(媛먮㈃O) 0.30%

  let totalTax = 0;

  for (let i = 1; i <= 4; i++) {
    const leaseSelect = document.getElementById(`leaseType${i}`);
    const priceInput = document.getElementById(`transferPrice${i}`);
    const taxCell = document.querySelector(`.edu-tax2-cell[data-index="${i}"]`);

    const leaseType = leaseSelect?.value;
    const price = parseToNumber(priceInput?.value || "");
    const rate = leaseType === "�꾨�" ? leaseRate : nonLeaseRate;

    const tax = Math.floor(price * rate);

    if (taxCell) taxCell.textContent = price > 0 ? formatNumber(tax) : '';
    totalTax += tax;
  }

  const totalCell = document.querySelector('.edu-tax2-total');
  if (totalCell) totalCell.textContent = totalTax > 0 ? formatNumber(totalTax) : '';
}

function calculateLicenseTax() {
  let sumLicenseTax = 0;

  for (let i = 1; i <= 4; i++) {
    const netAssetCell = document.getElementById(`netAsset${i}`);
    const licenseTaxCell = document.getElementById(`licenseTax${i}`);

    if (!netAssetCell || !licenseTaxCell) {
      console.log(`netAsset${i} �먮뒗 licenseTax${i} ���� 李얠쓣 �� �놁뒿�덈떎.`);
      continue;
    }

    const netAssetValue = parseToNumber(netAssetCell.textContent);
    const licenseTaxValue = netAssetValue * 0.004; // 0.4%

    licenseTaxCell.textContent = formatNumber(Math.floor(licenseTaxValue));
    sumLicenseTax += licenseTaxValue;
  }

  const licenseTaxTotalCell = document.getElementById('licenseTaxTotal');
  if (licenseTaxTotalCell) {
    licenseTaxTotalCell.textContent = formatNumber(Math.floor(sumLicenseTax));
  } else {
    console.log('licenseTaxTotal ���� 李얠쓣 �� �놁뒿�덈떎.');
  }
}

function calculateThirdTable() {
  const targetTable = document.getElementById('thirdTable');
  if (!targetTable) {
    console.log('thirdTable�� 李얠쓣 �� �놁뒿�덈떎.');
    return;
  }

  function fillNetAssetValue() {
    let sum = 0;

    for (let i = 1; i <= 4; i++) {
      const inputEl = document.getElementById(`transferPrice${i}`);
      const targetCell = document.getElementById(`netAsset${i}`);

      if (inputEl && targetCell) {
        const rawValue = inputEl.value.trim();
        targetCell.textContent = rawValue;

        sum += parseToNumber(rawValue);
      } else {
        console.log(`transferPrice${i} input �먮뒗 netAsset${i} ���� 李얠쓣 �� �놁뒿�덈떎.`);
      }
    }
    const totalCell = document.getElementById('transferPriceTotal');
    if (totalCell) {
      totalCell.textContent = formatNumber(sum);
    } else {
      console.log('transferPriceTotal ���� 李얠쓣 �� �놁뒿�덈떎.');
    }
    const totalTarget = document.getElementById('netAssetTotal');
    if (totalTarget) {
      totalTarget.textContent = formatNumber(sum);
    } else {
      console.log('netAssetTotal ���� 李얠쓣 �� �놁뒿�덈떎.');
    }
    const noteCell = document.getElementById('netAssetNote');
    if (noteCell) noteCell.textContent = '';
  }

	function calculateEduTax() {
	  let sumEduTax = 0;

	  for (let i = 1; i <= 4; i++) {
		const licenseTaxCell = document.getElementById(`licenseTax${i}`);
		const eduTaxCell = document.getElementById(`eduTax${i}`);

		if (!licenseTaxCell || !eduTaxCell) {
		  console.log(`licenseTax${i} �먮뒗 eduTax${i} ���� 李얠쓣 �� �놁뒿�덈떎.`);
		  continue;
		}

		const licenseTaxValue = parseToNumber(licenseTaxCell.textContent);
		const eduTaxValue = licenseTaxValue * 0.2; // �깅줉硫댄뿀�몄쓽 20%

		eduTaxCell.textContent = formatNumber(Math.floor(eduTaxValue));
		sumEduTax += eduTaxValue;
	  }

	  const eduTaxTotalCell = document.getElementById('eduTaxTotal');
	  if (eduTaxTotalCell) {
		eduTaxTotalCell.textContent = formatNumber(Math.floor(sumEduTax));
	  } else {
		console.log('eduTaxTotal ���� 李얠쓣 �� �놁뒿�덈떎.');
	  }
	}

	function calculateTaxSubtotal() {
	  let totalSum = 0;

	  for (let i = 1; i <= 4; i++) {
		const license = document.getElementById(`licenseTax${i}`);
		const edu = document.getElementById(`eduTax${i}`);
		const totalCell = document.getElementById(`taxTotal${i}`);

		if (!license || !edu || !totalCell) {
		  console.log(`�꾩슂�� ���� �놁뒿�덈떎: licenseTax${i}, eduTax${i}, taxTotal${i}`);
		  continue;
		}

		const licenseVal = parseToNumber(license.textContent);
		const eduVal = parseToNumber(edu.textContent);
		const sum = licenseVal + eduVal;

		totalCell.textContent = formatNumber(Math.floor(sum));
		totalSum += sum;
	  }

	  // 珥앺빀 (�곗륫 �� ��)
	  const sumCell = document.getElementById('taxTotalSum');
	  if (sumCell) {
		sumCell.textContent = formatNumber(Math.floor(totalSum));
	  } else {
		console.log('taxTotalSum ���� �놁뒿�덈떎.');
	  }
	}

	function calculateDenseAreaTax() {
  const rate = 0.012; // 1.2%
  let total = 0;

  for (let i = 1; i <= 4; i++) {
    const netAssetCell = document.getElementById(`netAsset${i}`);
    const denseTaxCell = document.getElementById(`denseTax${i}`);

    if (!netAssetCell || !denseTaxCell) {
      console.log(`netAsset${i} �먮뒗 denseTax${i} ���� �놁뒿�덈떎.`);
      continue;
    }

    const baseValue = parseToNumber(netAssetCell.textContent);
    const tax = Math.max(baseValue * rate, 0);

    denseTaxCell.textContent = formatNumber(Math.floor(tax));
    total += tax;
  }

  const denseTaxTotalCell = document.getElementById('denseTaxTotal');
  if (denseTaxTotalCell) {
    denseTaxTotalCell.textContent = formatNumber(Math.floor(total));
  } else {
    console.log('denseTaxTotal ���� 李얠쓣 �� �놁뒿�덈떎.');
  }
}

function calculateDenseEduTax() {
  let total = 0;

  for (let i = 1; i <= 4; i++) {
    const denseTaxCell = document.getElementById(`denseTax${i}`);
    const eduTaxCell = document.getElementById(`denseEduTax${i}`);

    if (!denseTaxCell || !eduTaxCell) {
      console.log(`denseTax${i} �먮뒗 denseEduTax${i} ���� �놁뒿�덈떎.`);
      continue;
    }

    const baseValue = parseToNumber(denseTaxCell.textContent);
    const eduTaxValue = baseValue * 0.2;

    eduTaxCell.textContent = formatNumber(Math.floor(eduTaxValue));
    total += eduTaxValue;
  }

  const totalCell = document.getElementById('denseEduTaxTotal');
  if (totalCell) {
    totalCell.textContent = formatNumber(Math.floor(total));
  } else {
    console.log('denseEduTaxTotal ���� 李얠쓣 �� �놁뒿�덈떎.');
  }
}

function calculateDenseTaxSubtotal() {
  let totalSum = 0;

  for (let i = 1; i <= 4; i++) {
    const denseTaxCell = document.getElementById(`denseTax${i}`);
    const denseEduCell = document.getElementById(`denseEduTax${i}`);
    const totalCell = document.getElementById(`denseTotal${i}`);

    if (!denseTaxCell || !denseEduCell || !totalCell) {
      console.log(`�꾩슂�� ���� 李얠쓣 �� �놁뒿�덈떎: denseTax${i}, denseEduTax${i}, denseTotal${i}`);
      continue;
    }

    const dense = parseToNumber(denseTaxCell.textContent);
    const edu = parseToNumber(denseEduCell.textContent);
    const sum = dense + edu;

    totalCell.textContent = formatNumber(Math.floor(sum));
    totalSum += sum;
  }

  const sumCell = document.getElementById('denseTotalSum');
  if (sumCell) {
    sumCell.textContent = formatNumber(Math.floor(totalSum));
  } else {
    console.log('denseTotalSum ���� 李얠쓣 �� �놁뒿�덈떎.');
  }
}
  fillNetAssetValue();
  calculateLicenseTax();  
  calculateEduTax();
  calculateTaxSubtotal();
  calculateDenseAreaTax();
  calculateDenseEduTax();
  calculateDenseTaxSubtotal();
}




function calculateFourthTable() {
	

function calculateSpecialRuralTax() {
  let totalSpecialTax = 0;

  for (let i = 1; i <= 4; i++) {
    const acqPriceCell = document.getElementById(`fourthAcqPrice${i}`);
    const specialTaxCell = document.getElementById(`specialTax${i}`);

    if (!acqPriceCell || !specialTaxCell) {
      console.warn(`�꾩슂�� �� �꾨씫: fourthAcqPrice${i} �먮뒗 specialTax${i}`);
      continue;
    }

    const price = parseToNumber(acqPriceCell.textContent);
    const tax = price * 0.002; // 0.2%
    const taxFloor = Math.floor(tax);

    specialTaxCell.textContent = formatNumber(taxFloor);
    totalSpecialTax += taxFloor;
  }

  const totalCell = document.getElementById('specialTaxTotal');
  if (totalCell) {
    totalCell.textContent = formatNumber(totalSpecialTax);
  } else {
    console.warn('specialTaxTotal �� �놁쓬');
  }
}

	function fillAcquisitionPriceFromNetAsset() {
	  for (let i = 1; i <= 4; i++) {
		const netAssetCell = document.getElementById(`netAsset${i}`);
		const acqCell = document.getElementById(`fourthAcqPrice${i}`);

		if (!netAssetCell) {
		  console.warn(`netAsset${i} �놁쓬`);
		  continue;
		}
		if (!acqCell) {
		  console.warn(`fourthAcqPrice${i} �놁쓬`);
		  continue;
		}

		const value = netAssetCell.textContent.trim();
		acqCell.textContent = value;
	  }

	  // �⑷퀎 泥섎━
	  const netAssetTotalCell = document.getElementById('netAssetTotal');
	  const acqTotalCell = document.getElementById('fourthAcqPriceTotal');

	  if (netAssetTotalCell && acqTotalCell) {
		acqTotalCell.textContent = netAssetTotalCell.textContent.trim();
	  } else {
		console.warn('�⑷퀎 �� �놁쓬');
	  }
	}

	function calculateAcquisitionTax() {
	  let totalTax = 0;

	  for (let i = 1; i <= 4; i++) {
		const acqPriceCell = document.getElementById(`fourthAcqPrice${i}`);
		const acqTaxCell = document.getElementById(`acqTax${i}`);

		if (!acqPriceCell || !acqTaxCell) {
		  console.warn(`�꾩슂�� �� �꾨씫: fourthAcqPrice${i} �먮뒗 acqTax${i}`);
		  continue;
		}

		const price = parseToNumber(acqPriceCell.textContent);
		const tax = price * 0.04; // 4%
		const taxFloor = Math.floor(tax);

		acqTaxCell.textContent = formatNumber(taxFloor);
		totalTax += taxFloor;
	  }

	  const totalTaxCell = document.getElementById('acqTaxTotal');
	  if (totalTaxCell) {
		totalTaxCell.textContent = formatNumber(totalTax);
	  } else {
		console.warn('acqTaxTotal �� �놁쓬');
	  }
	}
	function calculateEducationTax() {
	  let totalEduTax = 0;

	  for (let i = 1; i <= 4; i++) {
		const acqPriceCell = document.getElementById(`fourthAcqPrice${i}`);
		const eduTaxCell = document.getElementById(`fourthEduTax${i}`);

		if (!acqPriceCell || !eduTaxCell) {
		  console.warn(`�� �꾨씫: fourthAcqPrice${i} �먮뒗 fourthEduTax${i}`);
		  continue;
		}

		const price = parseToNumber(acqPriceCell.textContent);
		const tax = price * 0.004; // 0.4%
		const taxFloor = Math.floor(tax);

		eduTaxCell.textContent = formatNumber(taxFloor);
		totalEduTax += taxFloor;
	  }

	  const totalCell = document.getElementById('fourthEduTaxTotal');
	  if (totalCell) {
		totalCell.textContent = formatNumber(totalEduTax);
	  } else {
		console.warn('fourthEduTaxTotal �� �놁쓬');
	  }
	}
	function calculateFourthTableTotal() {
  let grandTotal = 0;

  for (let i = 1; i <= 4; i++) {
    const taxIds = [
      `acqTax${i}`,
      `specialTax${i}`,
      `fourthEduTax${i}`
    ];

    let cellSum = 0;
    for (const id of taxIds) {
      const cell = document.getElementById(id);
      if (!cell) {
        console.warn(`${id} �� �놁쓬`);
        continue;
      }
      const value = parseToNumber(cell.textContent);
      cellSum += value;
    }

    // 寃곌낵 諛섏쁺
    const totalCell = document.getElementById(`fourthTotal${i}`);
    if (totalCell) {
      totalCell.textContent = formatNumber(cellSum);
    }

    grandTotal += cellSum;
  }

  const totalSumCell = document.getElementById('fourthTotalSum');
  if (totalSumCell) {
    totalSumCell.textContent = formatNumber(grandTotal);
  }
}

function calculateHighRateAcquisitionTax() {
  let total = 0;

  for (let i = 1; i <= 4; i++) {
    const sourceCell = document.getElementById(`fourthAcqPrice${i}`);
    const targetCell = document.getElementById(`highAcqTax${i}`);
    if (!sourceCell || !targetCell) continue;

    const price = parseToNumber(sourceCell.textContent);
    const tax = Math.floor(price * 0.08); // 8%
    targetCell.textContent = formatNumber(tax);
    total += tax;
  }

  const totalCell = document.getElementById('highAcqTaxTotal');
  if (totalCell) totalCell.textContent = formatNumber(total);
}

function calculateHighRateRuralTax() {
  let total = 0;

  for (let i = 1; i <= 4; i++) {
    const sourceCell = document.getElementById(`fourthAcqPrice${i}`);
    const targetCell = document.getElementById(`highRuralTax${i}`);
    if (!sourceCell || !targetCell) continue;

    const price = parseToNumber(sourceCell.textContent);
    const tax = Math.floor(price * 0.002); // 0.2%
    targetCell.textContent = formatNumber(tax);
    total += tax;
  }

  const totalCell = document.getElementById('highRuralTaxTotal');
  if (totalCell) totalCell.textContent = formatNumber(total);
}
function calculateHighRateEduTax() {
  let total = 0;

  for (let i = 1; i <= 4; i++) {
    const sourceCell = document.getElementById(`fourthAcqPrice${i}`);
    const targetCell = document.getElementById(`highEduTax${i}`);
    if (!sourceCell || !targetCell) continue;

    const price = parseToNumber(sourceCell.textContent);
    const tax = Math.floor(price * 0.012); // 1.2%
    targetCell.textContent = formatNumber(tax);
    total += tax;
  }

  const totalCell = document.getElementById('highEduTaxTotal');
  if (totalCell) totalCell.textContent = formatNumber(total);
}
function calculateHighRateTotal() {
  let totalSum = 0;

  for (let i = 1; i <= 4; i++) {
    const ids = [
      `highAcqTax${i}`,
      `highRuralTax${i}`,
      `highEduTax${i}`
    ];

    let subtotal = 0;
    for (const id of ids) {
      const cell = document.getElementById(id);
      if (cell) {
        subtotal += parseToNumber(cell.textContent);
      }
    }

    const totalCell = document.getElementById(`highTotal${i}`);
    if (totalCell) totalCell.textContent = formatNumber(subtotal);

    totalSum += subtotal;
  }

  const totalSumCell = document.getElementById('highTotalSum');
  if (totalSumCell) totalSumCell.textContent = formatNumber(totalSum);
}
  fillAcquisitionPriceFromNetAsset();
  calculateAcquisitionTax();
  calculateSpecialRuralTax();
  calculateEducationTax();
  calculateFourthTableTotal();
  calculateHighRateAcquisitionTax();
  calculateHighRateRuralTax();
  calculateHighRateEduTax();
  calculateHighRateTotal();
}

function bindColumnNameMirroring() {
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`colName${i}`);
    const target = document.getElementById(`copyColName${i}`);

    if (!input || !target) continue;

    input.addEventListener('input', () => {
      target.textContent = input.value.trim();
    });

    target.textContent = input.value.trim();
  }
}

function updateInheritanceAcquisitionTax() {
  const sourceEl = document.getElementById("transferPriceTotal");
  const targetEl = document.getElementById("inheritanceAcquisitionTax");

  if (!sourceEl || !targetEl) return;

  const rawValue = parseToNumber(sourceEl.textContent || sourceEl.value);
  const taxRate = 0.0316; // 3.16%
  const result = Math.floor(rawValue * taxRate);

  targetEl.textContent = formatNumber(result);
}


document.addEventListener("DOMContentLoaded", () => {

  const parseToNumber = val => Number(String(val).replace(/[^\d.-]/g, '')) || 0;
  const formatNumber = num => num.toLocaleString('ko-KR');
  
  function triggerAllCalculations(){
		bindAllLeaseTransferEvents();
		updateEstimatedDeductions();  
		updateNecessaryCosts();        
		updateCapitalGains();          
		updateSpecialDeductions();     
		updateTaxableGains();          
		updateTaxBases();              
		updateAppliedRates();          
		updateProgressiveDeductions();
		updateCalculatedTaxes();
		updateLocalTaxes(); 	
		updateTaxSubtotal(); 
		updateNetAssetsAfterTax();
		updateStockPrices();
		bindItemInputToLabels();	
		updateAcquisitionTax();
		updateRuralSpecialTax();
		bindLeaseTypeChangeEvents();
		updateReducedRuralSpecialTax();
		updateEduTax();		
		updateTotalRow();
		updateNetAssetsMirror();	
		updateRequiredAssetIncrease();
		updateStockRowByClass();		
		updateAcquisitionTax2();
		updateRuralSpecialTax2();
		updateReducedRuralTax2();
		updateEducationTax();
		updateTotalTax2();		
		calculateThirdTable();
		calculateFourthTable();
		bindColumnNameMirroring();
		initToggleEvents();
		updateInheritanceAcquisitionTax();
  }

  for (let i = 1; i <= 4; i++) {
    document.getElementById(`acqDate${i}`)?.addEventListener("change", calculateAllHoldingPeriods);
    document.getElementById(`transDate${i}`)?.addEventListener("change", calculateAllHoldingPeriods);
  }

  for (let i = 1; i <= 4; i++) {
    document.getElementById(`useType${i}`)?.addEventListener("change", updateBusinessFlags);
  }

  for (let i = 1; i <= 6; i++) {
    document.getElementById(`acqPrice${i}`)?.addEventListener("input", updateEstimatedDeductions);
  }

  const costFields = ["capitalExp", "transferBrokerFee", "bondLoss", "etc2_"];
  costFields.forEach(prefix => {
    for (let i = 1; i <= 6; i++) {
      document.getElementById(`${prefix}${i}`)?.addEventListener("input", updateNecessaryCosts);
    }
  });

  const inputs = [
    "transferPrice", "acqPrice", "legalFee", "brokerFee", "etcCost",
    "capitalExp", "transferBrokerFee", "bondLoss", "etc2_"
  ];
  inputs.forEach(prefix => {
    for (let i = 1; i <= 6; i++) {
      const el = document.getElementById(`${prefix}${i}`);
      if (el) {
        el.addEventListener("input", triggerAllCalculations);
      }
    }
  });

  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`basicDeduct${i}`);
    el?.addEventListener("input", updateTaxBases);
  }

  calculateAllHoldingPeriods();
  updateHoldingPeriodsAndRates();
  updateBusinessFlags();
  triggerAllCalculations();

  
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