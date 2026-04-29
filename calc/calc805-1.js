document.addEventListener('DOMContentLoaded', () => {
  // 湲곕낯媛� �명똿

  calculateInheritance();
	initToggleEvents();
  // �낅젰媛� 蹂��붿떆 怨꾩궛 �먮룞 �ㅽ뻾
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', calculateInheritance);
  });
  
  
  document.querySelectorAll(".money-input").forEach(input => {
    input.addEventListener("input", function (e) {
        const val = e.target.value.replace(/[^0-9]/g, "");
        e.target.dataset.raw = val; // �ㅼ젣 �レ옄�� �ш린 ����
        e.target.value = numberWithCommas(val);
    });

    // 珥덇린 �뚮뜑留� �� 肄ㅻ쭏 �곸슜
    const val = input.value.replace(/[^0-9]/g, "");
    input.dataset.raw = val;
    input.value = numberWithCommas(val);
});


});



function parse(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const val = el.value || el.textContent || '0';
  return parseFloat(val.toString().replace(/[^\d.-]/g, '')) || 0;
}

function formatNumber(num) {
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  // �レ옄留� �щ㎎: %, �� �� �ы븿�� 臾몄옄�댁� 洹몃�濡� �ъ슜
  if (typeof value === 'number') {
    el.textContent = formatNumber(value);
  } else if (!isNaN(value) && !/[^\d.-]/.test(value)) {
    el.textContent = formatNumber(parseFloat(value));
  } else {
    el.textContent = value; // %, 臾몄옄�� �깆� 洹몃�濡� 異쒕젰
  }
}

function calculateTaxAmount(taxStandard, taxRate) {
  const deduction = getProgressiveDeduction(taxRate);
  return Math.round((taxStandard * (taxRate / 100)) - deduction);
}

function calculateFinancialDeduction(financialAmount) {
  if (!financialAmount || financialAmount === 0) return 0;

  return Math.min(200000000, Math.max(Math.round(financialAmount * 0.2), 20));
}
function getApplicableTaxRate(taxableAmount) {
  if (taxableAmount > 3_000_000_000) return 50;
  if (taxableAmount > 1_000_000_000) return 40;
  if (taxableAmount > 500_000_000) return 30;
  if (taxableAmount > 100_000_000) return 20;
  return 10;
}

function getProgressiveDeduction(taxRate) {
  switch (taxRate) {
    case 50: return 460;
    case 40: return 160;
    case 30: return 60;
    case 20: return 10;
    default: return 0;
  }
}

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

function toFraction(numerator, denominator) {
  const factor = gcd(numerator, denominator);
  return `${numerator / factor}/${denominator / factor}`;
}
function calculateSpouseShareRatio(spouseCount, childCount) {
  if (spouseCount + childCount === 0) return 0;
  return (spouseCount * 1.5) / (spouseCount * 1.5 + childCount);
}

function calculateSpouseDeduction({
  spouseCount,
  childCount,
  personName,
  currentDate,
  baseDate,
  taxTotal,
  spouseShareRatio,
}) {
  if (spouseCount === 0) return 0;
  if (!personName || personName.trim() === '') return '#####'; // A1=0
  if (!currentDate || !baseDate) return '#####';               // A3=0 or A4=0
  if (currentDate > baseDate) return '#####';                  // A3>A4

  const rawDeduction = taxTotal * spouseShareRatio;
  return Math.min(3000000000, Math.max(500000000, rawDeduction));
}

function numberWithCommas(x) {
    x = x.replace(/[^0-9]/g, ""); // �レ옄留�
    if (!x) return "";
    return parseInt(x, 10).toLocaleString('ko-KR');
}

function calculateInheritance() {
	
  const stockCount = parse('stockCount');
  const currentStockPrice = parse('currentStockPrice');
  const futureStockPrice = parse('futureStockPrice');
  const realEstateValue = parse('realEstateValue');
  const realEstateGrowth = parse('realEstateGrowth');
  const elapsedYears = parse('elapsedYears');

  const years = elapsedYears || 0;
  const labels = document.querySelectorAll('.elapsedYearsLabel');

  labels.forEach(label => {
    label.textContent = label.textContent.replace(/\d+��/, `${years}��`);
  });

  const financialAssetsValue = parse('financialAssetsValue');
  
  
  const financialAssetsGrowth = parse('financialAssetsGrowth');
  const otherAssetsValue = parse('otherAssetsValue');
  const debtValue = parse('debtValue'); 
  const priorGiftValue = parse('priorGiftValue');
  const priorGiftTaxPaid = parse('priorGiftTaxPaid');
  const childCount = parse('childCount');
  const spouseCount = parse('spouseCount');

  let spouseShare = 0;
	if (spouseCount + childCount > 0) {
	  spouseShare = (spouseCount * 1.5) / (spouseCount * 1.5 + childCount);
	}
	const rawNumerator = spouseCount * 1.5;
	const rawDenominator = spouseCount * 1.5 + childCount;

	let spouseShareText = '-';
	if (rawDenominator > 0) {
	  const numerator = rawNumerator * 10;
	  const denominator = rawDenominator * 10;
	  spouseShareText = toFraction(numerator, denominator);
	}

  document.getElementById('stockOwner').textContent = stockCount;
  document.getElementById('stockCurrentValue2').textContent = formatNumber(currentStockPrice);
  document.getElementById('stockFutureValue2').textContent = formatNumber(futureStockPrice);
  document.getElementById('stockGrowthRate3').textContent = realEstateGrowth;  
  document.getElementById('stockGrowthRate5').textContent = realEstateGrowth;    
  
  document.getElementById('stockGrowthRate2').textContent = financialAssetsGrowth;
  document.getElementById('stockGrowthRate4').textContent = financialAssetsGrowth;  
  
  const nameA1 = '�ㅼ쥌��';

  const currentDate = new Date();
  const baseDate = new Date('2025-12-30');

  // 二쇱떇 �꾩옱/誘몃옒 (諛깅쭔�� �⑥쐞)
  const stockNow = (stockCount * currentStockPrice);
  const stockFuture = (stockCount * futureStockPrice);

  // 遺��숈궛 誘몃옒媛�移� 怨꾩궛

	const realEstateFuture = Math.round(realEstateValue * Math.pow(1 + realEstateGrowth / 100, elapsedYears));

  // 湲덉쑖�ъ궛 誘몃옒媛�移� 怨꾩궛
  const financialAssetsFuture =  Math.round(financialAssetsValue * Math.pow(1 + financialAssetsGrowth / 100, elapsedYears));

  // �꾩옱/誘몃옒 珥앹옄�� (諛깅쭔�� 湲곗�)
  const totalCurrentAssets = realEstateValue + financialAssetsValue + otherAssetsValue + stockNow;
  const totalFutureAssets = realEstateFuture + financialAssetsFuture + otherAssetsValue + stockFuture;

  // �쒖옄��
  const currentNetAssets = totalCurrentAssets - debtValue;
  const futureNetAssets = totalFutureAssets - debtValue;
  const netIncrease = futureNetAssets - currentNetAssets;

  // �곸냽�� 怨쇱꽭媛��� (諛깅쭔��)
  const taxBase1 = stockNow + realEstateValue + financialAssetsValue + otherAssetsValue - debtValue;
  const taxBase2 = Math.round(stockFuture + realEstateFuture + financialAssetsFuture + otherAssetsValue - debtValue);

  const inheritanceTaxable1 = taxBase1 + priorGiftValue;
  const inheritanceTaxable2 = taxBase2 + priorGiftValue;

  // 怨듭젣 怨꾩궛
  const financialDeduction1 = calculateFinancialDeduction(financialAssetsValue);
  const financialDeduction2 = calculateFinancialDeduction(financialAssetsFuture);

  const blanketDeduction = (childCount === 0) ? 2000000000 : 5000000000;
  const spouseShareRatio = calculateSpouseShareRatio(spouseCount, childCount);
  const taxTotalCurrent = parse('taxTotal1');
  const taxTotalFuture = parse('taxTotal2');
	 const spouseDeductionCurrent = calculateSpouseDeduction({
		spouseCount,
		childCount,
		personName: nameA1,
		currentDate,
		baseDate,
		taxTotal: taxTotalCurrent,
		spouseShareRatio,
	  });

	  const spouseDeductionFuture = calculateSpouseDeduction({
		spouseCount,
		childCount,
		personName: nameA1,
		currentDate,
		baseDate,
		taxTotal: taxTotalFuture,
		spouseShareRatio,
	  });

	const totalDeduction1 = financialDeduction1 + blanketDeduction + spouseDeductionCurrent;
	const totalDeduction2 = financialDeduction2 + blanketDeduction + spouseDeductionFuture;


	const deductionTotal1 = parse('deductionTotal1');  // F20 �꾩옱 湲곗� 怨듭젣怨�
	const deductionTotal2 = parse('deductionTotal2');  // F20 誘몃옒 湲곗� 怨듭젣怨�

	const taxableStandard1 = Math.max(inheritanceTaxable1 - totalDeduction1, 0);
	const taxableStandard2 = Math.max(inheritanceTaxable2 - totalDeduction2, 0);

	const taxStandard1 = parse('taxStandard1'); // �꾩옱 湲곗�
	const taxStandard2 = parse('taxStandard2'); // 誘몃옒 湲곗�


	
	const taxRate1 = getApplicableTaxRate(taxableStandard1);
	const taxRate2 = getApplicableTaxRate(taxableStandard2);

	console.log("taxableStandard1",taxRate1);
	console.log("taxableStandard1",taxRate2);
		
	const taxAmount1 = calculateTaxAmount(taxStandard1, taxRate1);
	const taxAmount2 = calculateTaxAmount(taxStandard2, taxRate2);
	
	const prepaidTax1 = parse('prepaidTax1');
	const prepaidTax2 = parse('prepaidTax2');
	const calculatedTax1 = parse('calculatedTax1'); // F23-1
	const calculatedTax2 = parse('calculatedTax2'); // F23-2	
	
	const finalTax1 = Math.round((taxAmount1 - priorGiftTaxPaid) * 0.97);
	const finalTax2 = Math.round((taxAmount2 - priorGiftTaxPaid) * 0.97);
	
	const afterTax1 = Math.max(0, taxBase1 - finalTax1);
	const afterTax2 = Math.max(0, taxBase2 - finalTax2);
    const spouseSharePercent = (spouseShare * 100).toFixed(2) + '%';
	
	setText('stockCurrentValue', stockNow);
	setText('stockFutureValue', stockFuture);
	setText('realEstateNow', realEstateValue);
	setText('realEstateFuture', realEstateFuture);
	setText('financialNow', financialAssetsValue);
	setText('financialFuture', financialAssetsFuture);
	setText('otherAssetsNow1', otherAssetsValue);
	setText('otherAssetsNow2', otherAssetsValue);
	setText('debtNow1', debtValue);
	setText('debtNow2', debtValue);
	setText('totalCurrentAssets', totalCurrentAssets);
	setText('totalFutureAssets', totalFutureAssets);
	setText('currentNetAssets', currentNetAssets);
	setText('futureNetAssets', futureNetAssets);
	setText('netAssetIncrease', netIncrease);
	setText('priorGiftValueResult', priorGiftValue);
	setText('priorGiftTaxPaidResult', priorGiftTaxPaid);
	setText('taxBase1', taxBase1);
	setText('taxBase2', taxBase2);
	setText('priorGiftValueResult2', priorGiftValue);
	setText('taxTotal1', inheritanceTaxable1);
	setText('taxTotal2', inheritanceTaxable2);
	setText('financialDeduction1', financialDeduction1);
	setText('financialDeduction2', financialDeduction2);
	setText('blanketDeduction1', blanketDeduction);
	setText('blanketDeduction2', blanketDeduction);
	
	setText('spouseDeduction1', spouseDeductionCurrent);
	setText('spouseDeduction2', spouseDeductionFuture);
	
	setText('totalDeduction1', totalDeduction1);
	setText('totalDeduction2', totalDeduction2); 
	setText('taxRate1', taxRate1+"%");
	setText('taxRate2', taxRate2+"%");
	setText('taxStandard1', taxableStandard1);
	setText('taxStandard2', taxableStandard2);
	setText('taxAmount1', taxAmount1);
	setText('taxAmount2', taxAmount2);
	setText('prepaidTaxDeduction1', priorGiftTaxPaid);
	setText('prepaidTaxDeduction2', priorGiftTaxPaid);
	setText('finalTaxPayment1', finalTax1);
	setText('finalTaxPayment2', finalTax2);
	setText('spouseShareRatio1', "諛곗슦�먯�遺� "+spouseShareText);
	setText('spouseShareRatio2', "諛곗슦�먯�遺� "+spouseShareText);
	setText('afterTaxInheritance1', afterTax1.toLocaleString());
	setText('afterTaxInheritance2', afterTax2.toLocaleString());

}

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