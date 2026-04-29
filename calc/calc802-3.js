document.addEventListener('DOMContentLoaded', function () {
	
  const monthlyInput = document.getElementById('subsidiaryTotalShares');
  const yearlyInput = document.getElementById('parentOwnedShares');

  monthlyInput.addEventListener('input', function () {
    const monthly = parseFloat(this.value.replace(/,/g, '')) || 0;
    const yearly = monthly * 12;
    yearlyInput.value = yearly.toLocaleString();
    yearlyInput.dispatchEvent(new Event('input'));
  });

  const taxBrackets = [
    { threshold: 0, rate: 0.09, deduction: 0 },
    { threshold: 200000000, rate: 0.19, deduction: 20000000 },
    { threshold: 20000000000, rate: 0.21, deduction: 420000000 },
    { threshold: 300000000000, rate: 0.24, deduction: 9420000000 }
  ];

  function getCorporateTax(income) {
    if (income <= 0 || isNaN(income)) return 0;

    let applicable = taxBrackets[0];
    for (let i = 0; i < taxBrackets.length; i++) {
      if (income >= taxBrackets[i].threshold) {
        applicable = taxBrackets[i];
      } else {
        break;
      }
    }

    const result = income * applicable.rate - applicable.deduction;
    return result > 0 ? result : 0;
  }
  
	function updateTaxOutputTable() {
	  const subsidiaryTotalShares = parseFloat(document.getElementById('subsidiaryTotalShares').value.replace(/[^\d]/g, '')) || 0;
	  const parentOwnedSharesElem = document.getElementById('parentOwnedShares');
	  const realEstateInput = parseFloat(document.getElementById('subsidiaryStockPrice').value.replace(/[^\d]/g, '')) || 0;

	  // 怨좎젙 怨꾩궛: parentOwnedShares = subsidiaryTotalShares * 12
	  const fixedParentShares = subsidiaryTotalShares * 12;
	  parentOwnedSharesElem.value = fixedParentShares.toLocaleString(); // 肄ㅻ쭏�щ㎎
	  const yearlyRentInput = fixedParentShares;

	  const table = document.getElementById('tax-output-table');
	  if (!table) return;

	  const rows = table.querySelectorAll('tbody tr');
	  const assetRow = rows[0].children;      // �ъ궛媛��� (rowspan �덉쓬, �곗씠�� td[2]~)
	  const ratioRow = rows[1].children;      // 遺��숈궛吏�遺꾩쑉 (rowspan �놁쓬, �곗씠�� td[1]~)
	  const durationRow = rows[2].children;   // �뚯슂湲곌컙 (rowspan �놁쓬, �곗씠�� td[1]~)

	  const ratioList = [];
	  const assetAmountList = [];

    // 遺��숈궛 吏�遺꾩쑉, �뚯슂湲곌컙 怨꾩궛
    for (let i = 0; i < 10; i++) {
      const shareholderCount = i + 1;

      // �ъ궛媛���: td[2+i]
      const estateAmountText = assetRow[i + 2]?.textContent || '0';
      const estateAmount = parseFloat(estateAmountText.replace(/,/g, '')) || 0;
	  
	  console.log("estateAmount", estateAmount);
	  console.log("realEstateInput",realEstateInput);
	  
      assetAmountList.push(estateAmount);

      // 遺��숈궛吏�遺꾩쑉: td[1+i]
      const shareRate = realEstateInput > 0 ? (estateAmount / realEstateInput) * 100 : 0;
      const shareRateDisplay = shareRate ? shareRate.toFixed(2) + '%' : '';
      if (ratioRow[i + 1]) ratioRow[i + 1].textContent = shareRateDisplay;
      ratioList.push(shareRate);

      // �뚯슂湲곌컙: td[1+i]
      const rentPerPerson = yearlyRentInput / shareholderCount;
	const requiredYears = parseFloat((realEstateInput / estateAmount).toFixed(1)); // �レ옄 諛섑솚


	  if (durationRow[i + 1]) durationRow[i + 1].textContent = requiredYears+"��";
		
		
	 }

    const rentalBase = 22850000;

    for (let year = 1; year <= 10; year++) {
      const rowIndex = 3 + (year - 1) * 3;
      const rentRow = rows[rowIndex]?.children;     // �꾨��뚮뱷: rowspan=3, �곗씠�� td[2]~
      const incomeRow = rows[rowIndex + 1]?.children; // �먮�踰뺤씤�뚮뱷湲덉븸: rowspan �놁쓬, �곗씠�� td[1]~
      const taxRow = rows[rowIndex + 2]?.children;  // 踰뺤씤��: rowspan �놁쓬, �곗씠�� td[1]~

      if (!rentRow || !incomeRow || !taxRow) {
        console.warn(`${year}�꾩감 �� �꾨씫��`);
        continue;
      }

      for (let i = 0; i < 10; i++) {
		  
        const tdIndexRent = i + 2;
        const tdIndexIncomeTax = i + 1;

        const ratio = ratioList[i] || 0;
        const estateAmount = assetAmountList[i] || 0;

        const rentalIncome = Math.floor((ratio / 100) * rentalBase * year);
        const totalIncome = estateAmount + rentalIncome;
        const tax = Math.floor(getCorporateTax(totalIncome));

        if (rentRow[tdIndexRent]) rentRow[tdIndexRent].textContent = rentalIncome.toLocaleString();
        if (incomeRow[tdIndexIncomeTax]) incomeRow[tdIndexIncomeTax].textContent = totalIncome.toLocaleString();
        if (taxRow[tdIndexIncomeTax]) {
          taxRow[tdIndexIncomeTax].textContent = isNaN(tax) || tax <= 0 ? '' : tax.toLocaleString();
        }
      }
    }
  }

  document.querySelectorAll('.money-input').forEach(input => {
    input.addEventListener('input', updateTaxOutputTable);
  });

  updateTaxOutputTable();
});


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
      return '��' + new Intl.NumberFormat('ko-KR').format(value);
    }
  });	
  