// 怨좎젙 諛곕떦�뚮뱷 紐⑸줉
const dividendMap = {
  "1%": [
    107000000, 215000000, 326000000, 443000000, 560000000,
    676000000, 793000000, 910000000, 1026000000, 1143000000
  ],
  "20%": [
    127000000, 255000000, 383000000, 511000000, 539000000,
    767000000, 895000000, 1023000000, 1154000000, 1286000000
  ],
  "50%": [
    200000000, 400000000, 600000000, 800000000, 1000000000,
    1200000000, 1400000000, 1600000000, 1800000000, 2000000000
  ]
};

// 怨쇱꽭�쒖� 怨꾩궛 鍮꾩쑉 (吏�遺꾩쑉蹂�)
function getTaxBaseByRate(dividend, rateLabel) {
  switch (rateLabel) {
    case "20%":
      return dividend * 0.5;
    case "1%":
      return dividend * 0.7;
    case "50%":
    default:
      return 0; // 50%�� 踰뺤씤�� 怨꾩궛 �덊븿
  }
}

// �몄쑉 援ш컙
function getTaxBracket(income) {
  if (income > 255500000) {
    return { rate: 0.19, deduction: 20000000 };
  } else {
    return { rate: 0.09, deduction: 0 };
  }
}

// 踰뺤씤�� 怨꾩궛
function calculateCorporateTax(b7, rateLabel) {
  if (rateLabel === "50%") return 0;
  const taxBase = getTaxBaseByRate(b7, rateLabel);
  const { rate, deduction } = getTaxBracket(taxBase);
  return Math.round((taxBase * rate - deduction) * 1.1);
}

// �뚯씠釉� �낅뜲�댄듃 硫붿씤
function updateDividendTable() {
  const tbody = document.querySelector("#tax-output-table tbody");
  const stockPriceInput = document.querySelector("#subsidiaryStockPrice");
  const totalSharesInput = document.querySelector("#subsidiaryTotalShares");

  // ��, 肄ㅻ쭏 �� 鍮꾩닽�� �쒓굅
  const stockPrice = parseFloat(stockPriceInput?.value.replace(/[^\d]/g, "") || "0");
  const totalShares = parseFloat(totalSharesInput?.value.replace(/[^\d]/g, "") || "0");

  const rows = Array.from(tbody.querySelectorAll("tr"));
  let currentRate = null;
  let rowGroup = [];

  rows.forEach((row) => {
    const firstCell = row.querySelector("td");
    if (firstCell?.getAttribute("rowspan") === "5") {
      if (rowGroup.length === 5 && currentRate) {
        processGroup(currentRate, rowGroup, stockPrice, totalShares);
      }
      currentRate = firstCell.textContent.trim();
      rowGroup = [row];
    } else {
      rowGroup.push(row);
    }
  });

  // 留덉�留� 洹몃９ 泥섎━
  if (rowGroup.length === 5 && currentRate) {
    processGroup(currentRate, rowGroup, stockPrice, totalShares);
  }
}

// 吏�遺꾩쑉 洹몃９蹂� 泥섎━
function processGroup(rate, rows, stockPrice, totalShares) {
  const dividendList = dividendMap[rate];
  if (!dividendList) return;

  const afterTaxArr = [];
  const stockCountArr = [];

  rows.forEach((row, idx) => {
    const cells = row.querySelectorAll("td");
    if (idx === 0) {
      // 諛곕떦�뚮뱷
      dividendList.forEach((value, i) => {
        if (cells[i + 2]) cells[i + 2].textContent = value.toLocaleString();
      });
    }

    if (idx === 1) {
      // 踰뺤씤��
      dividendList.forEach((income, i) => {
        const tax = calculateCorporateTax(income, rate);
        const formattedTax = tax > 0 ? tax.toLocaleString() : "-";
        if (cells[i + 1]) cells[i + 1].textContent = formattedTax;

        updateSecondTableValue(rate, "踰뺤씤��", i, tax);
      });
    }

    if (idx === 2) {
      // �명썑�섎졊��
      dividendList.forEach((income, i) => {
        const tax = calculateCorporateTax(income, rate);
        const afterTax = income - tax;
        afterTaxArr[i] = afterTax;
        if (cells[i + 1]) cells[i + 1].textContent = afterTax.toLocaleString();

        updateSecondTableValue(rate, "�명썑�섎졊��", i, afterTax);
      });
    }
	
	if (idx === 3) {
		
	  afterTaxArr.forEach((afterTax, i) => {
		if (stockPrice > 0) {
		  const stockCount = Math.floor(afterTax / stockPrice);
		  stockCountArr[i] = stockCount;

		  if (cells[i + 1]) {
			cells[i + 1].textContent = stockCount.toLocaleString();
			cells[i + 1].dataset.stockCount = stockCount;
		  }

		  updateSecondTableValue(rate, "�묒닔媛��μ닔��", i, stockCount);

		  const parentOwnedSharesInput = document.querySelector("#parentOwnedShares");
		  const parentOwnedShares = parseFloat(parentOwnedSharesInput?.value.replace(/,/g, "") || "0");

		  if (parentOwnedShares > 0 && stockCount > 0) {
			const period = parentOwnedShares / stockCount;
			updateSecondTableValue(rate, "湲곌컙", i, parseFloat(period.toFixed(1))); // �뚯닔�� 1�먮━
		  } else {
			updateSecondTableValue(rate, "湲곌컙", i, 0);
		  }
		}
	  });
	}

    if (idx === 4) {
      // 吏�遺꾩쑉 怨꾩궛
      stockCountArr.forEach((count, i) => {
        if (totalShares > 0) {
          const ratio = (count / totalShares) * 100;
          if (cells[i + 1]) cells[i + 1].textContent = ratio.toFixed(1) + "%";
        } else {
          if (cells[i + 1]) cells[i + 1].textContent = "-";
        }
      });
    }
  });
}


// 珥덇린 �ㅽ뻾 諛� �낅젰媛� 蹂�寃� �� �ㅼ떆 怨꾩궛
document.addEventListener("DOMContentLoaded", () => {
  updateDividendTable();
  fillSecondTableDividendOnly();
});

document.querySelector("#subsidiaryStockPrice")?.addEventListener("input", updateDividendTable);
document.querySelector("#subsidiaryTotalShares")?.addEventListener("input", updateDividendTable);

function fillSecondTableDividendOnly() {
  const tables = document.querySelectorAll("table.table.excel-table.text-center");
  if (tables.length < 2) return;

  const secondTable = tables[1];
  const rows = secondTable.querySelectorAll("tbody tr");

  let currentRate = null;

  rows.forEach((row) => {
    const labelCell = row.querySelector("td.text-center.item-cell");
    if (labelCell?.textContent.trim() === "諛곕떦�뚮뱷") {
      const rateCell = row.querySelector("td[rowspan]");
      if (rateCell) {
        currentRate = rateCell.textContent.trim();
      }

      const dividendList = dividendMap[currentRate];
      if (!dividendList) return;

      const tds = row.querySelectorAll("td");
      dividendList.forEach((amount, i) => {
        if (tds[i + 2]) {
          tds[i + 2].textContent = amount.toLocaleString();
        }
      });
    }
  });
}

function extractMainTableData() {
  const table = document.querySelector("#tax-output-table");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const result = {};
  let currentRate = null;
  let group = [];

  rows.forEach((row) => {
    const firstCell = row.querySelector("td[rowspan]");
    if (firstCell) {
      if (currentRate && group.length === 5) {
        result[currentRate] = parseGroup(group);
      }
      currentRate = firstCell.textContent.trim();
      group = [row];
    } else {
      group.push(row);
    }
  });

  if (currentRate && group.length === 5) {
    result[currentRate] = parseGroup(group);
  }

  return result;
}

function parseGroup(rows) {
  const keys = ["諛곕떦�뚮뱷", "踰뺤씤��", "�명썑�섎졊��", "二쇱떇�� �섏궛", "吏�遺꾩쑉"];
  const result = {};

  rows.forEach((row, i) => {
    const cells = Array.from(row.querySelectorAll("td")).slice(2); // 泥� 2移� �쒖쇅
    result[keys[i]] = cells.map((td) => {
      const val = parseFloat(td.dataset.stockCount || td.textContent.replace(/,/g, ""));
      return isNaN(val) ? 0 : val;
    });
  });

  return result;
}

function updateSecondTableValue(rateLabel, labelName, index, value) {
  const table = document.querySelector("#second-dividend-table");
  if (!table) return;

  const rows = table.querySelectorAll("tbody tr");
  let currentRate = null;

  for (const row of rows) {
    const firstCell = row.querySelector("td[rowspan]");
    if (firstCell) currentRate = firstCell.textContent.trim();

    if (currentRate === rateLabel) {
      const labelCell = row.querySelector("td.text-center");
      if (labelCell?.textContent.trim() === labelName) {
        const tds = row.querySelectorAll("td");
        const targetCell = tds[index + 1];
        if (!targetCell) return;

        // dataset ���� (�묒닔媛��μ닔�됱슜)
        if (labelName === "�묒닔媛��μ닔��") {
          targetCell.dataset.stockCount = value;
        }

        // 異쒕젰 �뺤떇 泥섎━
        if (labelName === "湲곌컙") {
          targetCell.textContent = value > 0 ? value.toFixed(1) + " ��" : "-";
        } else {
          targetCell.textContent = value > 0 ? value.toLocaleString() : "-";
        }

        break;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const toggleLinks = document.querySelectorAll('.toggle-category');
  toggleLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // 留곹겕 �대룞 諛⑹�
      const subList = this.nextElementSibling;
      const icon = this.querySelector('i.bi-chevron-down, i.bi-chevron-up');
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


  document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector("#tax-output-table tbody");

    const evenShareholderCols = [4, 6, 8, 10, 12,14]; // 吏앹닔 二쇱＜�� ��

    Array.from(tbody.rows).forEach((row) => {
      const cells = Array.from(row.cells);

      // 諛곕떦�뚮뱷 �됱씤吏� �먮떒
      const isDividendRow = cells[1]?.textContent?.trim() === "諛곕떦�뚮뱷";
      let visualCol = isDividendRow ? 3 : 2;

      cells.forEach((cell) => {
        const colspan = parseInt(cell.getAttribute("colspan") || 1, 10);

        for (let i = 0; i < colspan; i++) {
          const currentCol = visualCol + i;

          if (evenShareholderCols.includes(currentCol)) {
            cell.classList.add("bg-even");
            // �� break �쒓굅 �� 紐⑤뱺 吏앹닔 col�� �곸슜 媛���
          }
        }

        visualCol += colspan;
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