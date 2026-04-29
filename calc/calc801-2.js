
const SALARY_DEDUCTION_TABLE = [
  { limit: 0, rate: 0.7, deduction: 0 },
  { limit: 5_000_000, rate: 0.4, deduction: 3_500_000 },
  { limit: 15_000_000, rate: 0.15, deduction: 7_500_000 },
  { limit: 45_000_000, rate: 0.05, deduction: 12_000_000 },
  { limit: 100_000_000, rate: 0.02, deduction: 14_750_000 }
];

const TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_080_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_220_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 14_900_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_400_000 },
  { limit: 500_000_000, rate: 0.40, deduction: 25_400_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_400_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_400_000 }
];

const TAX_BRACKETS_ALT = [  // 醫낇빀怨쇱꽭�쒖� A��
  { limit: 0, rate: 0.06, deduction: 0 },
  { limit: 14_000_000, rate: 0.28, deduction: 3_080_000 },
  { limit: 50_000_000, rate: 0.24, deduction: 1_080_000 },
  { limit: 88_000_000, rate: 0.45, deduction: 19_560_000 },
  { limit: 150_000_000, rate: 0.22, deduction: -14_940_000 },
  { limit: 300_000_000, rate: 0.55, deduction: 84_060_000 },
  { limit: 500_000_000, rate: 0.42, deduction: 19_060_000 },
  { limit: 1_000_000_000, rate: 0.15, deduction: -250_940_000 }
];

const taxRateTable = [
  { min: 0,             deduction: 0,          rate: 0.06 },
  { min: 14000000,      deduction: 1260000,    rate: 0.15 },
  { min: 50000000,      deduction: 5760000,    rate: 0.24 },
  { min: 88000000,      deduction: 15440000,   rate: 0.35 },
  { min: 150000000,     deduction: 19940000,   rate: 0.38 },
  { min: 300000000,     deduction: 25940000,   rate: 0.40 },
  { min: 500000000,     deduction: 35940000,   rate: 0.42 },
  { min: 1000000000,    deduction: 65940000,   rate: 0.45 }
];
const salaryDeductionTable = [
  { base: 0, rate: 0.7, deduction: 0 },
  { base: 5_000_000, rate: 0.4, deduction: 3_500_000 },
  { base: 15_000_000, rate: 0.15, deduction: 7_500_000 },
  { base: 45_000_000, rate: 0.05, deduction: 12_000_000 },
  { base: 100_000_000, rate: 0.02, deduction: 14_750_000 }
];

const HEALTH_INSURANCE_CAP = 50888520; // O24 �곹븳��
const HEALTH_INSURANCE_RATE = 0.0709;  // Q24 嫄닿컯蹂댄뿕猷뚯쑉

// === �몄븸 怨듭젣 怨좎젙媛� ===
const STANDARD_TAX_CREDIT_IF_EMPLOYED = 630_000;
const STANDARD_TAX_CREDIT_ELSE = 70_000;

// === �쒕룄/�꾧퀎媛� �곸닔 ===
const SALARY_ETC_THRESHOLD = 20_000_000;
const INCOME_DEDUCTION_AMOUNT = 1_500_000;
const STANDARD_DEDUCTION = 70_000;

// === 遺꾨━怨쇱꽭�� 諛� 異붽� 鍮꾩쑉 ===
const DIVIDEND_SEPARATE_TAX_RATE = 0.14;
const LOCAL_TAX_RATE = 0.1;
const careRate = 0.1295; // �몄씤�붿뼇蹂댄뿕猷뚯쑉 (怨좎젙)

const NATIONAL_PENSION_CAP = 74040000;
const NATIONAL_PENSION_RATE = 0.09;
const financialThreshold = 20000000;

document.addEventListener("DOMContentLoaded", () => {
  const inputTbody = document.querySelector(".input-form-table tbody");
  const outputTbody = document.querySelector(".excel-table tbody");
  if (!inputTbody || !outputTbody) return;

  const rowNameMap = {
    "諛곕떦�뚮뱷": "�먯쿇吏뺤닔諛곕떦",
    "諛곕떦�뚮뱷�� 湲덉쑖�뚮뱷": "湲덉쑖�뚮뱷怨�"
  };

  const getVisualCell = (row, visualIndex) => {
    let count = 0;
    for (let i = 0; i < row.cells.length; i++) {
      const cell = row.cells[i];
      const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
      if (visualIndex < count + colspan) return cell;
      count += colspan;
    }
    return null;
  };

  const recalculate = () => {
    try {
      performTaxCalculation(); // �몃� �⑥닔
    } catch (e) {
      console.error("怨꾩궛 �⑥닔 �ㅻ쪟:", e);
    }
  };

  Array.from(inputTbody.rows).forEach((inputRow) => {
    const incomeType = inputRow.cells[0].textContent.trim();
    const mappedName = rowNameMap[incomeType] || incomeType;

    const outputRow = Array.from(outputTbody.rows).find(row => {
      const cell = row.querySelector("td[colspan]");
      return cell && cell.textContent.trim() === mappedName;
    });

    if (!outputRow) return;

    for (let caseIndex = 0; caseIndex < 4; caseIndex++) {
      const inputCurrentCell = inputRow.cells[1 + caseIndex * 2];
      const inputRentCell = inputRow.cells[2 + caseIndex * 2];

      const currentInput = inputCurrentCell?.querySelector("input");
      const rentInput = inputRentCell?.querySelector("input");

      const outputCurrentCell = getVisualCell(outputRow, 2 + caseIndex * 2);
      const outputRentCell = getVisualCell(outputRow, 3 + caseIndex * 2);
		  
	if (currentInput && outputCurrentCell) {
	  currentInput.addEventListener("input", () => {
		triggerFormat(currentInput); // �� �꾩닔
		const raw = currentInput.dataset.raw;
		outputCurrentCell.textContent = raw === "" ? "0" : raw;
		recalculate();
	  });
	}

	if (rentInput && outputRentCell) {
	  rentInput.addEventListener("input", () => {
		triggerFormat(rentInput); // �� �꾩닔
		const raw = rentInput.dataset.raw;
		outputRentCell.textContent = raw === "" ? "0" : raw;
		recalculate();
	  });
	}
	  
	  
    }
	
  });

  recalculate(); // 珥덇린 怨꾩궛
});
window.getInputNumber = function(input) {
  if (!input) return 0;

  if (!input.dataset.raw) {
    // value媛� �レ옄 �щ㎎�� 寃쎌슦 泥섎━
    const raw = input.value?.replace(/[^\d]/g, '') || '0';
    input.dataset.raw = raw; // �좑툘 dataset.raw �숆린��
  }

  return Number(input.dataset.raw || 0);
};
function performTaxCalculation(){
	
  const inputRows = document.querySelectorAll(".input-form-table tbody tr");
  const outputRows = document.querySelectorAll(".excel-table tbody tr");

  const caseCount = 4;
  const healthRate = 0.0709;

  const pensionLimit = 70800000;
  const pensionRate = 0.045;

  for (let caseIndex = 0; caseIndex < caseCount; caseIndex++){
	  
	const totalWithSemiTaxByColType = {};
	const finalTaxByColType = {};
	
    for (let colType of ["�꾩옱�곹솴", "�꾨��뚮뱷"]) {

      const incomeData = {
        businessIncome: 0,
        dividendIncome: 0,
        financialIncome: 0,
        rentalIncome: 0,
        employmentIncome: 0,
		ipTransferIncome: 0 			
      };

	const BASE_COL_IDX = 2;
	const labelsWithOffsetZero = ["遺꾨━怨쇱꽭��", "�몃��대쪧2","洹쇰줈��","援���곌툑2","湲됱뿬2","踰뺤씤怨�","踰뺤씤�멸컧�뚯븸","���몄쑀異쒕퉬��"];	
	const colIdx = BASE_COL_IDX + caseIndex * 2 + (colType === "�꾨��뚮뱷" ? 1 : 0);
	const hasEmployment = incomeData.employmentIncome > 0;
		
	inputRows.forEach(row => {
		
        const type = row.cells[0].textContent.trim();
        const inputCell = row.cells[colIdx - 1]; 
        const input = inputCell?.querySelector("input");

		const value = window.getInputNumber(input); 

        if (type === "�ъ뾽�뚮뱷") incomeData.businessIncome = value;
        if (type === "諛곕떦�뚮뱷") incomeData.dividendIncome = value;
        if (type === "諛곕떦�뚮뱷�� 湲덉쑖�뚮뱷") incomeData.financialIncome = value;
        if (type === "�꾨��뚮뱷") incomeData.rentalIncome = value;
        if (type === "洹쇰줈�뚮뱷(�곌툒��)") incomeData.employmentIncome = value;
		if (type === "�곗뾽�ъ궛沅� �묐룄�뚮뱷") incomeData.ipTransferIncome = value;
		
      });

	const employmentIncome = incomeData.employmentIncome;
	const otherBusinessIncome = incomeData.otherBusinessIncome || 0; // D21 怨꾩궛�� �ㅻ쪟�덈굹寃� �쒖꽌��濡� �섏젙
	const otherTaxableIncome = incomeData.rentalIncome;             // D27 �덉떆
	const healthInsurance = calculateHealthInsuranceForSalary(employmentIncome);

	const result = calculateTaxScenario(incomeData);
	var expenses1 = incomeData.rentalIncome * 0;
	var expenses2 = incomeData.ipTransferIncome * 0.6;	
	const nationalPension = calculateNationalPension(employmentIncome);
	const pensionBase = Math.min(incomeData.employmentIncome, pensionLimit);
	const ipTransferExpense = incomeData.ipTransferIncome * 0.7;
	

	const ddct_expn_neds = 
	  (incomeData.rentalIncome - expenses1) + 
	  (incomeData.ipTransferIncome - ipTransferExpense);



	const baseSum = (result.totalFinancialIncome || 0) + (ddct_expn_neds || 0) + (result.grossUpDividend || 0);

	

	const healthInsuranceAssessmentIncome = baseSum <= financialThreshold
	  ? (incomeData.businessIncome || 0) + (expenses1 || 0)
	  : baseSum + (incomeData.businessIncome || 0) + (expenses1 || 0);

	const healthInsurance2 = calculateHealthInsuranceForNonSalary( employmentIncome, healthInsuranceAssessmentIncome );

	const elderlyCare = Math.round((healthInsurance + healthInsurance2) * careRate);
	const semiTaxTotal = healthInsurance + healthInsurance2 + elderlyCare + nationalPension;
	const taxBase = calculateSalaryTaxBase(incomeData.employmentIncome);
	const salaryEtcThreshold = 20000000;
	const salaryEtcTotal = result.totalFinancialIncome + incomeData.businessIncome + result.grossUpDividend;
	const salaryEtc = salaryEtcTotal <= salaryEtcThreshold ? 0 : salaryEtcTotal;
	const salaryTaxBase = calculateSalaryTaxBase(incomeData.employmentIncome);
	let comprehensiveTaxBaseA = 0;

if (incomeData.employmentIncome > 0) {
  const totalIncome =
    salaryTaxBase +                             // D12
    incomeData.dividendIncome +                 // D14
    incomeData.financialIncome +                // D16
    incomeData.ipTransferIncome +               // D19
    result.taxableFinancialIncome +             // D23
    incomeData.rentalIncome;                    // D26

  const totalDeductions =
    result.incomeDeduction +                    // D29
    healthInsurance +                           // D41
    healthInsurance2 +                          // D42
    elderlyCare +                               // D43
    nationalPension;                            // �� D44 異붽�
    comprehensiveTaxBaseA = Math.max(totalIncome - totalDeductions, 0);
  
} else {
  const totalIncome =
    incomeData.dividendIncome +                 // D14
    incomeData.financialIncome +                // D16
    incomeData.ipTransferIncome +               // D19
    result.taxableFinancialIncome +             // D23
    incomeData.rentalIncome;                    // D26

  comprehensiveTaxBaseA = Math.max(totalIncome - result.incomeDeduction, 0);
}

let comprehensiveTaxBaseB;

if (incomeData.employmentIncome > 0) {
  const totalIncome =
    (salaryTaxBase || 0) +
    (incomeData.dividendIncome || 0) +
    (incomeData.financialIncome || 0) +
    (incomeData.otherBusinessIncome || 0) +
    (incomeData.rentalIncome || 0);

  const totalDeductions =
    (result.incomeDeduction || 0) +
    (nationalPension || 0) +
    (healthInsurance || 0) +
    (healthInsurance2 || 0) +
    (elderlyCare || 0);

  comprehensiveTaxBaseB = Math.max(totalIncome - totalDeductions, 0);
} else {
  const totalIncome =
    (salaryTaxBase || 0) +
    (incomeData.dividendIncome || 0) +
    (incomeData.financialIncome || 0) +
    (incomeData.otherBusinessIncome || 0) +
    (incomeData.rentalIncome || 0);
   comprehensiveTaxBaseB = Math.max(totalIncome - (result.incomeDeduction || 0), 0);
}

const separatedFinalTax = calculateSeparatedTax(comprehensiveTaxBaseB, otherBusinessIncome);
const separatedTax = Math.floor(separatedFinalTax);
const separatedFinancialIncome = incomeData.separatedFinancialIncome || 0;
const comprehensiveFinalTax = calculateComprehensiveTax(comprehensiveTaxBaseA, separatedFinancialIncome);
const roundedTax = Math.floor(comprehensiveFinalTax);

const finalTaxBase = Math.max(roundedTax, separatedTax); //�곗텧�몄븸 
const dividendCredit = Math.min(result.grossUpDividend, finalTaxBase - separatedTax); 
const standardTaxCredit = calculateStandardTaxCredit({
  totalIncome: result.totalIncome,
  employmentIncome: incomeData.employmentIncome,
  rentalIncome: incomeData.rentalIncome,
  totalFinancialIncome: result.totalFinancialIncome,
  calculatedTax: result.calculatedTax,
  separatedTax: separatedTax
});

		function adjustedColIdx(rowLabel) {
		  if (labelsWithOffsetZero.includes(rowLabel)) {
			return colIdx - 1;
		  }
		  return colIdx;
		}

		const finalTax = Math.max(comprehensiveTaxBaseA, comprehensiveTaxBaseB);

		finalTaxByColType[colType] = finalTax;

		const totalWithSemiTax = finalTax + semiTaxTotal;
	

		const rentalExpense = incomeData.rentalIncome * 0.6;

		


		var totalIncomeForTax = (incomeData.businessIncome + incomeData.rentalIncome + incomeData.ipTransferIncome <= financialThreshold)
		  ? (incomeData.dividendIncome + incomeData.financialIncome)
		  : (incomeData.businessIncome + incomeData.rentalIncome + incomeData.ipTransferIncome + incomeData.dividendIncome + incomeData.financialIncome);




		const D34 = finalTaxBase;   
		const D35 = dividendCredit;      
		const D36 = standardTaxCredit;           
		


		const localIncomeTax = Math.round(Math.max(D34 - D35 - D36, 0) * 1.1);
		
		const salaryTaxBaseAfterDeduction = Math.round(Math.max(salaryTaxBase - result.incomeDeduction - (healthInsurance * (1 + careRate) + nationalPension),0));
		const burdenRate = calculateBurdenRate(localIncomeTax, result.totalIncome);
		const adjustedHealthInsurance = Math.round(healthInsurance * (1 + careRate));
		const income2 = adjustedHealthInsurance + nationalPension + incomeData.employmentIncome;
		var C2 = 0;
		const taxRate = (C2 === 1) ? 0.11 : 0.22;
		const corporateTax = Math.round(-income2 * taxRate);
		var E333 = localIncomeTax + semiTaxTotal;
		const D55 = E333 + corporateTax + adjustedHealthInsurance + nationalPension;
		const D56 = (result.totalIncome !== 0) ? D55 / result.totalIncome : 0;
		const D56Percent = (D56 * 100).toFixed(1) + "%";
		const E60 = Math.max(result.totalIncome - E333, 0);
		
		
			
		const burdenRateWithSemi = calculateBurdenRate(E333, result.totalIncome);

		console.log("�뮥 totalWithSemiTax (�멸툑�⑷퀎):", totalWithSemiTax);
		console.log("�뱤 result.totalIncome (珥앹냼��):", result.totalIncome);
		console.log("�뱢 burdenRateWithSemi (�몃��대쪧):", burdenRateWithSemi);
		
		updateCellByLabel("踰뺤씤�섎퉬��", adjustedHealthInsurance, colIdx);
		updateCellByLabel("援���곌툑2", nationalPension, adjustedColIdx("援���곌툑2"));
		updateCellByLabel("湲됱뿬2", incomeData.employmentIncome, adjustedColIdx("湲됱뿬2"));
		updateCellByLabel("踰뺤씤怨�", income2, adjustedColIdx("踰뺤씤怨�"));
		updateCellByLabel("踰뺤씤�멸컧�뚯븸", corporateTax, colIdx);
		updateCellByLabel("�ъ뾽�뚮뱷", incomeData.businessIncome, colIdx);
		updateCellByLabel("�곗뾽�ъ궛沅� �묐룄�뚮뱷", incomeData.ipTransferIncome, colIdx);		
		updateCellByLabel("�꾩슂寃쎈퉬", expenses1, colIdx);
		updateCellByLabel("�꾩슂寃쎈퉬2", expenses2, colIdx);
		updateCellByLabel("�뚮뱷怨듭젣�� 湲됱뿬怨쇱꽭�쒖�", salaryTaxBaseAfterDeduction, colIdx);
		updateCellByLabel("洹쇰줈�뚮뱷怨쇱꽭�쒖�", salaryTaxBase, colIdx);
		updateCellByLabel("洹쇰줈��", healthInsurance2, adjustedColIdx("洹쇰줈��"));
		updateCellByLabel("洹쇰줈�� 嫄대낫猷뚮�怨쇱냼��", healthInsuranceAssessmentIncome, colIdx);		
		updateCellByLabel("�꾩슂寃쎈퉬怨듭젣�� 湲고��뚮뱷", ddct_expn_neds, colIdx);			
		updateCellByLabel("�꾨��뚮뱷", incomeData.rentalIncome, colIdx);
		updateCellByLabel("洹쇰줈�뚮뱷", incomeData.employmentIncome, colIdx);
		updateCellByLabel("諛곕떦�뚮뱷", incomeData.dividendIncome, colIdx);
		updateCellByLabel("諛곕떦�뚮뱷�� 湲덉쑖�뚮뱷", incomeData.financialIncome, colIdx);
		updateCellByLabel("�먯쿇吏뺤닔諛곕떦", result.withholdingDividend, colIdx);
		updateCellByLabel("洹몃줈�ㅼ뾽諛곕떦(10%媛���)", result.grossUpDividend, colIdx);
		updateCellByLabel("湲덉쑖�뚮뱷怨�", result.totalFinancialIncome, colIdx);
		updateCellByLabel("�먯쿇吏뺤닔湲덉쑖�뚮뱷", result.withholdingFinancialIncome, colIdx);
		updateCellByLabel("珥� �� ��", result.totalIncome, colIdx);
		updateCellByLabel("醫낇빀怨쇱꽭湲덉쑖�뚮뱷", result.taxableFinancialIncome, colIdx);
		updateCellByLabel("醫낇빀�뚮뱷怨듭젣", result.incomeDeduction, colIdx);
		updateCellByLabel("醫낇빀�뚮뱷醫낇빀怨쇱꽭�쒖�A", comprehensiveTaxBaseA, colIdx);
		updateCellByLabel("醫낇빀�뚮뱷遺꾨━怨쇱꽭�쒖�B", comprehensiveTaxBaseB, colIdx);
		updateCellByLabel("湲됱뿬�뚮뱷怨쇱꽭�쒖�", taxBase, colIdx);
		updateCellByLabel("湲됱뿬�뚮뱷�멸퀎", salaryEtc, colIdx);
		updateCellByLabel("醫낇빀怨쇱꽭��", roundedTax, colIdx);
		updateCellByLabel("遺꾨━怨쇱꽭��", separatedTax, adjustedColIdx("遺꾨━怨쇱꽭��"));
		updateCellByLabel("珥앹궛異쒖꽭��", finalTaxBase, colIdx);
		
		updateCellByLabel("諛곕떦�몄븸怨듭젣", dividendCredit, colIdx);
		updateCellByLabel("�쒖��몄븸怨듭젣", standardTaxCredit, colIdx);
		
		updateCellByLabel("寃곗젙�몄븸(吏�諛⑹냼�앹꽭)", localIncomeTax, colIdx);
		updateCellByLabel("�몃��대쪧", burdenRate, colIdx);
		updateCellByLabel("嫄닿컯蹂댄뿕猷�", healthInsurance, colIdx);
		updateCellByLabel("�몄씤�붿뼇", elderlyCare, colIdx);
		updateCellByLabel("援���곌툑", nationalPension, colIdx);
		updateCellByLabel("以�議곗꽭(怨�)", semiTaxTotal, colIdx);
		totalWithSemiTaxByColType[colType] = totalWithSemiTax;

		
		updateCellByLabel("�몃��대쪧2", burdenRateWithSemi, adjustedColIdx("�몃��대쪧2"));
		
		updateCellByLabel("���몄쑀異쒓툑��", D55, colIdx);		
		updateCellByLabel("���몄쑀異쒕퉬��", D56Percent, adjustedColIdx("���몄쑀異쒕퉬��"));
		updateCellByLabel("�명썑 �섎졊��", E60, adjustedColIdx("���몄쑀異쒕퉬��"));		
		const outputRowsArray = Array.from(outputRows);

		updateCellByLabel("�멸툑 怨�", E333, colIdx);		
		
		if (colType === "�꾨��뚮뱷") {
			
		  const tableRows = Array.from(document.querySelectorAll(".excel-table tbody tr"));

		  const totalIncomeRow = tableRows.find(r => r.cells[0]?.textContent.trim() === "珥� �� ��");
		  const semiIncreaseRow = tableRows.find(r => r.dataset.label === "�꾩옱��鍮� 以�議곗꽭�ы븿 利앷�遺�");
		  const semiTaxRow = tableRows.find(r => r.dataset.label === "�멸툑 怨�");
		  const ratioRow = tableRows.find(r => r.dataset.label === "以�議곗꽭�ы븿");
		  const finalTaxRow = tableRows.find(r => r.dataset.label === "寃곗젙�몄븸(吏�諛⑹냼�앹꽭)");
		  const semiRow = tableRows.find(r => r.dataset.label === "以�議곗꽭(怨�)");
		  const taxIncreaseRow = tableRows.find(r => r.dataset.label === "�꾩옱��鍮� �멸툑 利앷�遺�");
		  const deltaRatioRow = tableRows.find(r => r.dataset.label === "�녹꽭湲� / �녹냼��");
		  const netIncomeRow = tableRows.find(r => r.dataset.label === "�명썑�섎졊��");

		  const baseColIdx = 2 + caseIndex * 2;
		  const currentIdx = baseColIdx;
		  const rentalIdx = baseColIdx + 1;

		  function findCellIndex(row, visualIdx) {
			let vIdx = 0;
			for (let i = 0; i < row.cells.length; i++) {
			  const colspan = parseInt(row.cells[i].getAttribute("colspan") || "1", 10);
			  if (vIdx === visualIdx) return i;
			  vIdx += colspan;
			}
			return -1;
		  }

		  const getNumber = (row, idx) => {
			const cellIdx = findCellIndex(row, idx);
			if (cellIdx === -1 || !row.cells[cellIdx]) return 0;
			const raw = row.cells[cellIdx].textContent.replace(/[^\d.-]/g, '').trim();
			const parsed = parseFloat(raw);
			return Number.isFinite(parsed) ? parsed : 0;
		  };

		  let taxDiff = 0;

		  if (finalTaxRow && taxIncreaseRow) {
			const finalTaxRental = getNumber(finalTaxRow, rentalIdx);
			const finalTaxCurrent = getNumber(finalTaxRow, currentIdx);
			taxDiff = finalTaxRental - finalTaxCurrent;

			const taxIdx = findCellIndex(taxIncreaseRow, rentalIdx);
			if (taxIdx !== -1 && taxIncreaseRow.cells[taxIdx]) {
			  taxIncreaseRow.cells[taxIdx].textContent = Number.isFinite(taxDiff)
				? Math.round(taxDiff).toLocaleString()
				: "";
			}
		  }

		  if (totalIncomeRow && semiIncreaseRow && ratioRow && finalTaxRow && semiRow){
			  
			const incomeRental = getNumber(totalIncomeRow, currentIdx);
			const incomeCurrent = getNumber(totalIncomeRow, rentalIdx);
			const deltaIncome = Math.max(incomeCurrent - incomeRental, 0);

			console.log("�룧 incomeRental (鍮꾧탳 ���� ��):", incomeRental);
			console.log("�뱦 incomeCurrent (湲곗� ��):", incomeCurrent);
			console.log("�봺 deltaIncome (李⑥씠):", deltaIncome);

			// �� �멸툑 怨� = 寃곗젙�몄븸(吏�諛⑹냼�앹꽭) + 以�議곗꽭(怨�)
			const finalTaxRental = getNumber(finalTaxRow, rentalIdx);
			const finalTaxCurrent = getNumber(finalTaxRow, currentIdx);
			const semiRental = getNumber(semiRow, rentalIdx);
			const semiCurrent = getNumber(semiRow, currentIdx);
			const semiTaxRental = finalTaxRental + semiRental;
			const semiTaxCurrent = finalTaxCurrent + semiCurrent;

			// �� �꾩옱��鍮� 以�議곗꽭�ы븿 利앷�遺� = �꾩옱�곹솴 - �꾨��뚮뱷
			const semiIncreaseValue = semiTaxRental - semiTaxCurrent;
			const semiRatio = deltaIncome === 0 ? 0 : semiIncreaseValue / deltaIncome;

			// �� G48 媛� 異쒕젰
			const semiIdx = findCellIndex(semiIncreaseRow, rentalIdx);
			if (semiIdx !== -1 && semiIncreaseRow.cells[semiIdx]) {
			  semiIncreaseRow.cells[semiIdx].textContent = Number.isFinite(semiIncreaseValue)
				? Math.round(semiIncreaseValue).toLocaleString()
				: "";
			}

			// �� 以�議곗꽭 �ы븿 鍮꾩쑉
			const ratioIdx = findCellIndex(ratioRow, rentalIdx);
			if (ratioIdx !== -1 && ratioRow.cells[ratioIdx]) {
			  ratioRow.cells[ratioIdx].textContent = Number.isFinite(semiRatio)
				? (semiRatio * 100).toFixed(1) + "%"
				: "";
			}

			// �� �녹꽭湲� / �녹냼��
				if (deltaRatioRow) {
					
				  const deltaIdx = findCellIndex(deltaRatioRow, rentalIdx);
				  
				  const taxIncomeRatio = deltaIncome === 0 ? 0 : taxDiff / deltaIncome;

				  if (deltaIdx !== -1 && deltaRatioRow.cells[deltaIdx]) {
					const ratioText = Number.isFinite(taxIncomeRatio)
					  ? (taxIncomeRatio * 100).toFixed(1) + "%"
					  : "";

					deltaRatioRow.cells[deltaIdx].textContent = ratioText;
				  } else {
					console.log("deltaRatioRow.cells:", deltaRatioRow.cells);
				  }
				} else {
				  console.log("�� deltaRatioRow is null or undefined.");
				}
			
			if (netIncomeRow) {
			  const netIdx = rentalIdx;
			  const netCellIdx = findCellIndex(netIncomeRow, netIdx);
			  const netIncome = deltaIncome - semiIncreaseValue;
			  if (netCellIdx !== -1 && netIncomeRow.cells[netCellIdx]) {
				netIncomeRow.cells[netCellIdx].textContent = Number.isFinite(netIncome)
				  ? Math.round(netIncome).toLocaleString()
				  : "";
			  }
			}
		  }
		  
		}
			
			
    }
  }
}


function calculateComprehensiveTax(baseTaxableIncome, separatedFinancialIncome) {
  let selected = taxRateTable[0];
  for (let i = 1; i < taxRateTable.length; i++) {
    if (baseTaxableIncome >= taxRateTable[i].min) {
      selected = taxRateTable[i];
    } else {
      break;
    }
  }

  const progressiveTax = baseTaxableIncome * selected.rate - selected.deduction;
  const separatedTax = separatedFinancialIncome * 0.14;
  return progressiveTax + separatedTax;
}

function calculateFullNationalPension(employmentIncome) {
  if (employmentIncome === 0) return 0;

  const base = Math.min(NATIONAL_PENSION_CAP, employmentIncome);
  return base * NATIONAL_PENSION_RATE; // �꾩껜 遺���
}

function calculateNationalPension(employmentIncome) {
  if (employmentIncome === 0) return 0;
  const base = Math.min(NATIONAL_PENSION_CAP, employmentIncome);
  return base * (NATIONAL_PENSION_RATE / 2); // 洹쇰줈�� �덈컲 遺���
}


function calculateHealthInsuranceForNonSalary(employmentIncome, otherTaxableIncome) {
  let insurance = 0;

  if (Number(employmentIncome) === 0) {
    insurance = otherTaxableIncome * HEALTH_INSURANCE_RATE;
  } else {
    if (otherTaxableIncome >= financialThreshold) {
      insurance = (otherTaxableIncome - financialThreshold) * HEALTH_INSURANCE_RATE;
    } else {
      insurance = 0;
    }
  }

  const capped = Math.min(insurance, HEALTH_INSURANCE_CAP);

  return capped;
}

function calculateHealthInsuranceForSalary(employmentIncome) {
  if (employmentIncome === 0) return 0;

  const insuranceHalf = (employmentIncome * HEALTH_INSURANCE_RATE) / 2;
  return Math.min(HEALTH_INSURANCE_CAP, insuranceHalf);
}


function calculateSalaryTaxBase(employmentIncome) {
  const MAX_DEDUCTION = 20_000_000;

  let bracket = salaryDeductionTable[0];
  for (let i = 1; i < salaryDeductionTable.length; i++) {
    if (employmentIncome < salaryDeductionTable[i].base) break;
    bracket = salaryDeductionTable[i];
  }

  const { base, rate, deduction } = bracket;
  const earnedDeduction = (employmentIncome - base) * rate + deduction;
  const appliedDeduction = Math.min(earnedDeduction, MAX_DEDUCTION);

  return Math.max(employmentIncome - appliedDeduction, 0);
}

function updateCellByLabel(label, value, colIdx) {
  const row = document.querySelector(`.excel-table tbody tr[data-label="${label}"]`);
  if (!row) return;

  let visualIndex = 0, actualIndex = -1;
  const isFirstCellRowspan = row.cells[0]?.hasAttribute("rowspan");
  const offset = ["遺꾨━怨쇱꽭��", "�몃��대쪧2"].includes(label) ? 0 : (isFirstCellRowspan ? 1 : 0);
  visualIndex = offset;

  for (let i = offset; i < row.cells.length; i++) {
    const colspan = parseInt(row.cells[i].getAttribute("colspan") || "1", 10);
    if (visualIndex === colIdx) {
      actualIndex = i;
      break;
    }
    visualIndex += colspan;
  }

  if (actualIndex !== -1 && row.cells[actualIndex]) {
    row.cells[actualIndex].textContent = typeof value === 'string'
      ? value
      : isFinite(value) ? Number(value).toLocaleString() : "";
  }
}

function parseNumber(str) {
  return Number((str || '').replaceAll(',', '')) || 0;
}


function getSalaryDeduction(income) {
	
  const brackets = [
    { limit: 0, rate: 0.7, deduction: 0 },
    { limit: 5000000, rate: 0.4, deduction: 3500000 },
    { limit: 15000000, rate: 0.15, deduction: 7500000 },
    { limit: 45000000, rate: 0.05, deduction: 12000000 },
    { limit: 100000000, rate: 0.02, deduction: 14750000 }
  ];

  let matched = brackets[0];

  for (const bracket of brackets) {
    if (income >= bracket.limit) {
      matched = bracket;
    } else {
      break;
    }
  }

  const deduction =
    Math.min(
      ((income - matched.limit) * matched.rate + matched.deduction),
      20000000 // 理쒕� 怨듭젣�쒕룄
    );

  return Math.floor(deduction);
}

function calculateTaxScenario({
	  businessIncome = 0,
	  dividendIncome = 0,
	  financialIncome = 0,
	  rentalIncome = 0,
	  employmentIncome = 0,
      ipTransferIncome = 0
	  
	}) {
	  
	// 1. �먯쿇吏뺤닔諛곕떦 怨꾩궛
	const withholdingDividend = dividendIncome === 0 ? 0 : Math.max(20000000 - financialIncome, 0);

	// 2. 洹몃줈�ㅼ뾽諛곕떦 = MAX((諛곕떦�뚮뱷 - �먯쿇吏뺤닔諛곕떦) * 0.11, 0)
	const grossUpDividend = Math.max((dividendIncome - withholdingDividend) * 0.11, 0);

	// 3. 諛곕떦 �ы븿 湲덉쑖�뚮뱷
	const totalDividend = withholdingDividend + grossUpDividend;
	const totalFinancialIncome = dividendIncome + financialIncome;
	const taxableFinancialIncome = Math.max(totalFinancialIncome - 20000000, 0);
	const withholdingFinancialIncome = totalFinancialIncome > 20000000
	? 20000000
	: totalFinancialIncome;

	// 4. �꾨��뚮뱷 �꾩슂寃쎈퉬 (50%)
	const rentalExpense = Math.floor(rentalIncome * 0.5);
	const netRental = rentalIncome - rentalExpense;

	const totalIncome = employmentIncome + totalFinancialIncome + rentalIncome + businessIncome;

	const incomeDeduction = totalIncome === 0 ? 0 : 1500000;
	const comprehensiveTaxBaseA = businessIncome + rentalIncome + employmentIncome + taxableFinancialIncome;
	const comprehensiveTaxBaseB = businessIncome + taxableFinancialIncome + totalFinancialIncome + employmentIncome;
	  
	const calculatedTax = calculateFinalTaxWithBracketA(comprehensiveTaxBaseA, withholdingFinancialIncome);


  return {
    totalIncome,
    withholdingDividend,
    grossUpDividend,
    totalDividend,
    totalFinancialIncome,
    rentalExpense,
    netRental,
	withholdingFinancialIncome,
    
	incomeDeduction,
	taxableFinancialIncome,
	comprehensiveTaxBaseA,
	comprehensiveTaxBaseB,
	calculatedTax,
  };
}



function calculateSalaryTaxBase(grossSalary) {
	
  const brackets = [
    { limit: 0, rate: 0.7, deduction: 0 },
    { limit: 5000000, rate: 0.4, deduction: 3500000 },
    { limit: 15000000, rate: 0.15, deduction: 7500000 },
    { limit: 45000000, rate: 0.05, deduction: 12000000 },
    { limit: 100000000, rate: 0.02, deduction: 14750000 }
  ];

  let base = brackets[0];
  for (let i = 0; i < brackets.length; i++) {
    if (grossSalary >= brackets[i].limit) {
      base = brackets[i];
    } else {
      break;
    }
  }

  const deduction = ((grossSalary - base.limit) * base.rate) + base.deduction;
  const finalTaxBase = grossSalary - Math.min(deduction, 20000000);
  return Math.floor(finalTaxBase);
  
}

function calculateFinalTaxWithBracketA(comprehensiveTaxBaseA, withholdingFinancialIncome){
  const brackets = [
    { limit: 14_000_000, rate: 0.06, deduction: 0 },
    { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
    { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
    { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
    { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
    { limit: 500_000_000, rate: 0.40, deduction: 25_940_000 },
    { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
    { limit: Infinity, rate: 0.45, deduction: 65_940_000 }
  ];

  let matched = brackets[0];
  for (const bracket of brackets) {
    if (comprehensiveTaxBaseA <= bracket.limit) {
      matched = bracket;
      break;
    }
  }

  const baseTax = comprehensiveTaxBaseA * matched.rate - matched.deduction;
  const separateTax = withholdingFinancialIncome * 0.14;

  return Math.round(baseTax + separateTax);
}

function calculateSeparatedTax(comprehensiveTaxBaseB, financialIncomeTotal) {
  const brackets = [
    { limit: 14_000_000, rate: 0.06, deduction: 0 },
    { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
    { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
    { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
    { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
    { limit: 500_000_000, rate: 0.40, deduction: 25_940_000 },
    { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
    { limit: Infinity, rate: 0.45, deduction: 65_940_000 }
  ];

  let matched = brackets[0];
  for (const bracket of brackets) {
    if (comprehensiveTaxBaseB <= bracket.limit) {
      matched = bracket;
      break;
    }
  }

  const baseTax = comprehensiveTaxBaseB * matched.rate - matched.deduction;
  const separatedTax = financialIncomeTotal * 0.14;

  // 寃곌낵�� 諛섏삱由쇳븯�� 諛섑솚
  return Math.round(baseTax + separatedTax);
}

function calculateStandardTaxCredit({
  totalIncome,
  employmentIncome,
  rentalIncome,
  totalFinancialIncome,
  calculatedTax,     // �곗텧�몄븸(醫낇빀怨쇱꽭��)
  separatedTax       // �곗텧�몄븸(遺꾨━怨쇱꽭��)
}) {
  const STANDARD_CREDIT_WORKER = 630000; // $P$26 洹쇰줈�뚮뱷�먯슜
  const STANDARD_CREDIT_OTHERS = 70000;  // $Q$26 湲고���

  if (totalIncome === 0) return 0;

  if (employmentIncome > 0) {
    return STANDARD_CREDIT_WORKER;
  }

  if (
    employmentIncome === 0 &&
    rentalIncome === 0 &&
    totalFinancialIncome > 0 &&
    calculatedTax <= separatedTax
  ) {
    return 0;
  }

  return STANDARD_CREDIT_OTHERS;
}

//寃곗젙�몄븸(吏�諛⑹냼�앹꽭)
function calculateFinalTaxWithCredits({
  calculatedTax = 0,
  dividendTaxCredit = 0,
  standardTaxCredit = 0
}) {
  const baseTax = Math.max(calculatedTax - dividendTaxCredit - standardTaxCredit, 0);
  const finalTax = baseTax * 1.1; // �뚯닔�� 洹몃�濡� �좎�
  return finalTax;
}

//�몃��댁쑉
function calculateBurdenRate(finalTax, totalIncome) {

  const tax = parseFloat(String(finalTax).replace(/,/g, ''));
  const income = parseFloat(String(totalIncome).replace(/,/g, ''));

  if (isNaN(income) || income === 0) {
    return '0%';
  }
  const rate = (tax / income) * 100;
  return rate.toFixed(1) + '%';
}




document.addEventListener('DOMContentLoaded', () => {
	
  document.querySelectorAll('.toggle-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const groupNumber = btn.getAttribute('data-group');
      const icon = btn.querySelector('i');

      let rows;

      if (groupNumber === '0') {
        rows = Array.from(document.querySelectorAll('tr'))
          .filter(row => Array.from(row.classList).some(cls => /^group-\d+$/.test(cls)));
      } else {
        // �뱀젙 洹몃９留� �좏깮
        rows = document.querySelectorAll(`.group-${groupNumber}`);
      }

      // �꾩옱 紐⑤뱺 row媛� �④꺼�� �덈뒗吏� �뺤씤
      const isHidden = [...rows].every(row => row.style.display === 'none');

      // �좉�
      rows.forEach(row => {
        row.style.display = isHidden ? '' : 'none';
      });

      // �꾩씠肄� �좉� (媛쒕퀎 踰꾪듉�� �뚮쭔)
      if (icon) {
        icon.classList.toggle('bi-chevron-down', isHidden);
        icon.classList.toggle('bi-chevron-up', !isHidden);
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const toggleLinks = document.querySelectorAll('.toggle-category');

  toggleLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // 留곹겕 �대룞 諛⑹�
      const subList = this.nextElementSibling;
      // chevron �꾩씠肄섎쭔 �좏깮
      const icon = this.querySelector('i.bi-chevron-down, i.bi-chevron-up');

      // �좉�
      if (subList.style.display === 'none' || subList.style.display === '') {
        subList.style.display = 'block';
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-up');
      } else {
        subList.style.display = 'none';
        icon.classList.remove('bi-chevron-up');
        icon.classList.add('bi-chevron-down');
      }
    });
  });
});



document.addEventListener('DOMContentLoaded', () => {
  // �뮕 �щ㎎ �⑥닔 癒쇱� �좎뼵
  function formatCurrency(value) {
    if (!value) return '';
    return new Intl.NumberFormat('ko-KR').format(value);
  }

  // �뮕 �꾩뿭�먯꽌 �� �� �덇쾶 �깅줉
  window.triggerFormat = function(input) {
    const raw = input.value.replace(/[^\d]/g, '');
    input.dataset.raw = raw;
    input.value = raw.length > 0 ? formatCurrency(raw) : '';
    console.log('[triggerFormat] raw:', raw);
  };

  // �뮕 怨꾩궛�� �レ옄 異붿텧 �⑥닔 (�꾩뿭 �깅줉)
  window.getInputNumber = function(input) {
    return Number(input?.dataset?.raw || 0);
  };

  // �� �낅젰 �꾨뱶 泥섎━
  const inputs = document.querySelectorAll('.money-input');

  inputs.forEach(input => {
    if (input.value) {
      const raw = input.value.replace(/[^\d]/g, '');
      input.dataset.raw = raw;
      input.value = formatCurrency(raw);
    }

    let isComposing = false;

    input.addEventListener('compositionstart', () => {
      isComposing = true;
    });

    input.addEventListener('compositionend', () => {
      isComposing = false;
      window.triggerFormat(input); // �� �ш린�쒕룄 window �ъ슜 媛���
    });

    input.addEventListener('input', () => {
      if (isComposing) return;
      window.triggerFormat(input);
      console.log('[input] value:', input.value);
      console.log('[input] dataset.raw:', input.dataset.raw);
    });

    input.addEventListener('focus', () => {
      input.value = input.dataset.raw || '';
    });

    input.addEventListener('blur', () => {
      if (input.dataset.raw) {
        input.value = formatCurrency(input.dataset.raw);
      }
    });
  });

  // �봺 �덉떆: �꾩껜 �⑷퀎 怨꾩궛 �⑥닔 (�먰븷 �� �몄텧)
  window.calculateTotalWithSemiTax = function () {
    const inputs = document.querySelectorAll('.money-input');
    let total = 0;

    inputs.forEach(input => {
      total += getInputNumber(input);
    });

    console.log('totalWithSemiTax (以�議곗꽭 �ы븿 �멸툑 怨�):', total.toLocaleString());
    return total;
  };
});