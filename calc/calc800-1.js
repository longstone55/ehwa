
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
const HEALTH_INSURANCE_RATE = 0.45;
const LONG_TERM_CARE_RATE = 0.1281; //�몄씤�붿뼇

const NATIONAL_PENSION_CAP = 70800000;     // $T$23
const NATIONAL_PENSION_RATE = 0.45;       // $T$24 

document.addEventListener("DOMContentLoaded", () => {

    const inputTbody = document.querySelector(".input-form-table tbody");
    const outputTbody = document.querySelector(".excel-table tbody");

    if (!inputTbody || !outputTbody) return;

    const rowNameMap = {
        "諛곕떦�뚮뱷": "�먯쿇吏뺤닔諛곕떦",
        "諛곕떦�뚮뱷�� 湲덉쑖�뚮뱷": "湲덉쑖�뚮뱷怨�"
    };

    const recalculate = () => {
        performTaxCalculation();
    };

    recalculate();

    Array.from(inputTbody.rows).forEach((inputRow) => {

        const incomeType = inputRow.cells[0].textContent.trim();
        const mappedName = rowNameMap[incomeType] || incomeType;

        const outputRow = Array.from(outputTbody.rows).find(
            row => row.cells[0].textContent.trim() === mappedName
        );

        if (!outputRow) return;

        const getCellByVisualIndex = (row, visualIndex) => {
            let count = 0;
            for (let i = 0; i < row.cells.length; i++) {
                const cell = row.cells[i];
                const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
                if (count === visualIndex) return cell;
                count += colspan;
            }
            return null;
        };

        const visualOffset = 1;

        for (let caseIndex = 0; caseIndex < 4; caseIndex++) {

            const currentIdx = 1 + caseIndex * 2;
            const rentIdx = currentIdx + 1;
            const currentInput = inputRow.cells[currentIdx]?.querySelector("input");
            const rentInput = inputRow.cells[rentIdx]?.querySelector("input");
            const outputCurrentCell = getCellByVisualIndex(outputRow, currentIdx + visualOffset);
            const outputRentCell = getCellByVisualIndex(outputRow, rentIdx + visualOffset);

            if (currentInput && outputCurrentCell) {
                currentInput.addEventListener("input", () => {
                    outputCurrentCell.textContent = currentInput.value || "";
                    recalculate();
                });
            }

            if (rentInput && outputRentCell) {
                rentInput.addEventListener("input", () => {
                    outputRentCell.textContent = rentInput.value || "";
                    recalculate();
                });
            }
        }
    });

});


function performTaxCalculation() {

    const inputRows = document.querySelectorAll(".input-form-table tbody tr");
    const outputRows = document.querySelectorAll(".excel-table tbody tr");

    const caseCount = 4;
    const healthRate = 0.0709;
    const careRate = 0.1281;
    const pensionLimit = 70800000;
    const pensionRate = 0.045;

    for (let caseIndex = 0; caseIndex < caseCount; caseIndex++) {

        const totalWithSemiTaxByColType = {};
        const finalTaxByColType = {};

        for (let colType of ["�꾩옱�곹솴", "�꾨��뚮뱷"]) {

            const incomeData = {
                businessIncome: 0,
                dividendIncome: 0,
                financialIncome: 0,
                rentalIncome: 0,
                employmentIncome: 0
            };

            const BASE_COL_IDX = 2;
            const labelsWithOffsetZero = ["遺꾨━怨쇱꽭��", "�몃��대쪧2"];
            const colIdx = BASE_COL_IDX + caseIndex * 2 + (colType === "�꾨��뚮뱷" ? 1 : 0);


            inputRows.forEach(row => {
                const type = row.cells[0].textContent.trim();
                const inputCell = row.cells[colIdx - 1];
                const input = inputCell?.querySelector("input");

                // �뷀룓�⑥쐞 �쒓굅�섍퀬 �レ옄 蹂���
                const rawValue = input?.value ? input.value.replace(/[��,]/g, '') : '0';
                const value = Number(rawValue);

                if (type === "�ъ뾽�뚮뱷") incomeData.businessIncome = value;
                if (type === "諛곕떦�뚮뱷") incomeData.dividendIncome = value;
                if (type === "諛곕떦�뚮뱷�� 湲덉쑖�뚮뱷") incomeData.financialIncome = value;
                if (type === "�꾨��뚮뱷") incomeData.rentalIncome = value;
                if (type === "洹쇰줈�뚮뱷") incomeData.employmentIncome = value;
            });

            const result = calculateTaxScenario(incomeData);
            const taxBase = calculateSalaryTaxBase(incomeData.employmentIncome);

            const salaryEtcThreshold = 20000000;
            const salaryEtcTotal = result.totalFinancialIncome + incomeData.businessIncome + result.grossUpDividend;
            const salaryEtc = salaryEtcTotal <= salaryEtcThreshold ? 0 : salaryEtcTotal;
            const separatedTax = calculateSeparatedTax(result.comprehensiveTaxBaseB, result.totalFinancialIncome);
            const finalTaxBase = Math.max(result.calculatedTax, separatedTax);
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

            const finalTax = calculateFinalTaxWithCredits({
                calculatedTax: finalTaxBase,
                dividendTaxCredit: dividendCredit,
                standardTaxCredit: standardTaxCredit
            });
            finalTaxByColType[colType] = finalTax;


            const healthInsurance = Math.round(result.totalIncome * healthRate);

            const elderlyCare = Math.round(healthInsurance * careRate);
            const pensionBase = Math.min(incomeData.employmentIncome, pensionLimit);
            const nationalPension = Math.round(pensionBase * pensionRate);
            const semiTaxTotal = healthInsurance + elderlyCare + nationalPension;
            const totalWithSemiTax = finalTax + semiTaxTotal;
            const burdenRateWithSemi = calculateBurdenRate(totalWithSemiTax, result.totalIncome);
            const burdenRate = calculateBurdenRate(finalTax, result.totalIncome);


            const taxableIncome = Math.max(
                taxBase -
                result.incomeDeduction -
                (healthInsurance * (1 + LONG_TERM_CARE_RATE) + nationalPension),
                0
            );

            updateCellByLabel("�뚮뱷怨듭젣�� 湲됱뿬怨쇱꽭�쒖�", taxableIncome, colIdx);
            updateCellByLabel("�꾩슂寃쎈퉬", 0, colIdx);
            updateCellByLabel("�ъ뾽�뚮뱷", incomeData.businessIncome, colIdx);
            updateCellByLabel("�꾨��뚮뱷", incomeData.rentalIncome, colIdx);
            updateCellByLabel("洹쇰줈�뚮뱷", incomeData.employmentIncome, colIdx);
            updateCellByLabel("諛곕떦�뚮뱷", incomeData.dividendIncome, colIdx);
            updateCellByLabel("諛곕떦�뚮뱷�� 湲덉쑖�뚮뱷", incomeData.financialIncome, colIdx);
            updateCellByLabel("�먯쿇吏뺤닔諛곕떦", result.withholdingDividend, colIdx);
            updateCellByLabel("洹몃줈�ㅼ뾽諛곕떦(11%媛���)", result.grossUpDividend, colIdx);
            updateCellByLabel("湲덉쑖�뚮뱷怨�", result.totalFinancialIncome, colIdx);
            updateCellByLabel("�먯쿇吏뺤닔湲덉쑖�뚮뱷", result.withholdingFinancialIncome, colIdx);
            updateCellByLabel("珥� �� ��", result.totalIncome, colIdx);
            updateCellByLabel("醫낇빀怨쇱꽭湲덉쑖�뚮뱷", result.taxableFinancialIncome, colIdx);
            updateCellByLabel("醫낇빀�뚮뱷怨듭젣", result.incomeDeduction, colIdx);
            updateCellByLabel("醫낇빀�뚮뱷醫낇빀怨쇱꽭�쒖�A", result.comprehensiveTaxBaseA, colIdx);
            updateCellByLabel("醫낇빀�뚮뱷遺꾨━怨쇱꽭�쒖�B", result.comprehensiveTaxBaseB, colIdx);
            updateCellByLabel("湲됱뿬�뚮뱷怨쇱꽭�쒖�", taxBase, colIdx);
            updateCellByLabel("湲됱뿬�뚮뱷�멸퀎", salaryEtc, colIdx);
            updateCellByLabel("醫낇빀怨쇱꽭��", result.calculatedTax, colIdx);
            updateCellByLabel("遺꾨━怨쇱꽭��", separatedTax, adjustedColIdx("遺꾨━怨쇱꽭��"));
            updateCellByLabel("珥앹궛異쒖꽭��", finalTaxBase, colIdx);
            updateCellByLabel("諛곕떦�몄븸怨듭젣", dividendCredit, colIdx);
            updateCellByLabel("�쒖��몄븸怨듭젣", standardTaxCredit, colIdx);
            updateCellByLabel("寃곗젙�몄븸(吏�諛⑹냼�앹꽭)", finalTax, colIdx);
            updateCellByLabel("�몃��대쪧", burdenRate, colIdx);
            updateCellByLabel("嫄닿컯蹂댄뿕猷�", healthInsurance, colIdx);
            updateCellByLabel("�몄씤�붿뼇", elderlyCare, colIdx);
            updateCellByLabel("援���곌툑", nationalPension, colIdx);
            updateCellByLabel("以�議곗꽭(怨�)", semiTaxTotal, colIdx);
            totalWithSemiTaxByColType[colType] = totalWithSemiTax; // �� �� 以� 異붽�
            updateCellByLabel("�멸툑 怨�", totalWithSemiTax, colIdx);
            updateCellByLabel("�몃��대쪧2", burdenRateWithSemi, adjustedColIdx("�몃��대쪧2"));
            const outputRowsArray = Array.from(outputRows);

            if (colType === "�꾨��뚮뱷") {
                const tableRows = Array.from(document.querySelectorAll(".excel-table tbody tr"));
                const totalIncomeRow = tableRows.find(r => r.cells[0]?.textContent.trim() === "珥� �� ��");
                const semiIncreaseRow = tableRows.find(r => r.dataset.label === "�꾩옱��鍮� 以�議곗꽭�ы븿 利앷�遺�");
                const semiTaxRow = tableRows.find(r => r.dataset.label === "�멸툑 怨�");
                const ratioRow = tableRows.find(r => r.dataset.label === "以�議곗꽭�ы븿");

                const taxRatioRow = tableRows.find(r => r.dataset.label === "�멸툑�뚮뱷");  // 湲곗〈 "�녹꽭湲�/�녹냼��" �� "�멸툑�뚮뱷"


                // 異붽��� ��
                const finalTaxRow = tableRows.find(r => r.dataset.label === "寃곗젙�몄븸(吏�諛⑹냼�앹꽭)");
                const taxIncreaseRow = tableRows.find(r => r.dataset.label === "�꾩옱��鍮� �멸툑 利앷�遺�");

                if (totalIncomeRow && semiIncreaseRow && semiTaxRow && ratioRow) {
                    const baseColIdx = 2 + caseIndex * 2;
                    const currentIdx = baseColIdx;
                    const rentalIdx = baseColIdx + 1;

                    // �쒓컖�� index �� �ㅼ젣 cell index 怨꾩궛 �⑥닔
                    function findCellIndex(row, visualIdx) {
                        let vIdx = 0;
                        for (let i = 0; i < row.cells.length; i++) {
                            const colspan = parseInt(row.cells[i].getAttribute("colspan") || "1", 10);
                            if (vIdx === visualIdx) return i;
                            vIdx += colspan;
                        }
                        return -1;
                    }

                    // �レ옄 �뚯떛 �⑥닔
                    const getNumber = (row, idx) => {
                        const cellIdx = findCellIndex(row, idx);
                        if (cellIdx === -1) return 0;
                        return parseFloat(row.cells[cellIdx]?.textContent.replace(/,/g, '')) || 0;
                    };

                    // 1. 以�議곗꽭 �ы븿 利앷컧 怨꾩궛
                    const incomeRental = getNumber(totalIncomeRow, rentalIdx);
                    const incomeCurrent = getNumber(totalIncomeRow, currentIdx);
                    const taxRental = totalWithSemiTaxByColType["�꾨��뚮뱷"] ?? 0;
                    const taxCurrent = totalWithSemiTaxByColType["�꾩옱�곹솴"] ?? 0;
                    const semiDiff = incomeRental === 0 ? 0 : taxRental - taxCurrent;
                    const deltaIncome = incomeRental - incomeCurrent;
                    const deltaRatio = deltaIncome === 0 ? 0 : semiDiff / deltaIncome;

                    // �꾩옱��鍮� 以�議곗꽭�ы븿 利앷�遺�
                    const semiIdx = findCellIndex(semiIncreaseRow, rentalIdx);
                    if (semiIdx !== -1 && semiIncreaseRow.cells[semiIdx]) {
                        semiIncreaseRow.cells[semiIdx].textContent = Number.isFinite(semiDiff)
                            ? semiDiff.toLocaleString()
                            : "";
                    }

                    // �녹�議곗꽭�ы븿 / �녹냼��
                    const ratioIdx = findCellIndex(ratioRow, rentalIdx);
                    if (ratioIdx !== -1 && ratioRow.cells[ratioIdx]) {
                        ratioRow.cells[ratioIdx].textContent = Number.isFinite(deltaRatio)
                            ? (deltaRatio * 100).toFixed(2) + "%"
                            : "";
                    }

                    // 2. �꾩옱��鍮� �멸툑 利앷�遺� 怨꾩궛
                    if (finalTaxRow && taxIncreaseRow) {
                        const finalTaxRental = getNumber(finalTaxRow, rentalIdx);
                        const finalTaxCurrent = getNumber(finalTaxRow, currentIdx);
                        const taxDiff = finalTaxRental - finalTaxCurrent;

                        const taxIdx = findCellIndex(taxIncreaseRow, rentalIdx);
                        if (taxIdx !== -1 && taxIncreaseRow.cells[taxIdx]) {
                            taxIncreaseRow.cells[taxIdx].textContent = Number.isFinite(taxDiff)
                                ? taxDiff.toLocaleString()
                                : "";
                        }
                    }

                    let taxDiff = 0;
                    if (finalTaxRow && taxIncreaseRow) {
                        const finalTaxRental = getNumber(finalTaxRow, rentalIdx);
                        const finalTaxCurrent = getNumber(finalTaxRow, currentIdx);
                        taxDiff = finalTaxRental - finalTaxCurrent;

                        const taxIdx = findCellIndex(taxIncreaseRow, rentalIdx);
                        if (taxIdx !== -1 && taxIncreaseRow.cells[taxIdx]) {
                            taxIncreaseRow.cells[taxIdx].textContent = Number.isFinite(taxDiff)
                                ? taxDiff.toLocaleString()
                                : "";
                        }
                    }

                    // �� �멸툑�뚮뱷 (�녹꽭湲� / �녹냼��)
                    const taxRatioRow = tableRows.find(r => r.dataset.label === "�멸툑�뚮뱷"); // �� 遺�遺꾨쭔 諛붾��
                    if (taxRatioRow) {
                        const ratioIdx = findCellIndex(taxRatioRow, rentalIdx);
                        if (ratioIdx !== -1 && taxRatioRow.cells[ratioIdx]) {
                            const deltaTaxRatio = deltaIncome === 0 ? 0 : taxDiff / deltaIncome;
                            taxRatioRow.cells[ratioIdx].textContent = Number.isFinite(deltaTaxRatio)
                                ? (deltaTaxRatio * 100).toFixed(1) + "%"
                                : "";
                        }
                    }

                } else {
                    console.warn("�� �쇰� �꾩닔 �됱씠 議댁옱�섏� �딆뒿�덈떎", {
                        totalIncomeRow,
                        semiIncreaseRow,
                        semiTaxRow,
                        ratioRow
                    });
                }
            }

        }
    }



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


//援���곌툑
function calculateNationalPension(employmentIncome) {
    if (employmentIncome === 0) return 0;
    return Math.floor(Math.min(employmentIncome, NATIONAL_PENSION_CAP) * NATIONAL_PENSION_RATE);
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
    employmentIncome = 0
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

function calculateFinalTaxWithBracketA(comprehensiveTaxBaseA, withholdingFinancialIncome) {
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
    if (!totalIncome || isNaN(totalIncome) || totalIncome === 0) {
        return '0%';
    }
    const rate = (finalTax / totalIncome) * 100;
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
    const inputs = document.querySelectorAll('.money-input');

    inputs.forEach(input => {
        if (input.value) {
            const raw = input.value.replace(/[^\d]/g, '');
            input.dataset.raw = raw;
            input.value = formatCurrency(raw);
        }

        input.addEventListener('input', () => {
            const raw = input.value.replace(/[^\d]/g, '');
            input.dataset.raw = raw;
            input.value = formatCurrency(raw);
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

    function formatCurrency(value) {
        if (!value) return '';
        return new Intl.NumberFormat('ko-KR').format(value);
    }

});