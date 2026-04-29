document.addEventListener('DOMContentLoaded', () => {
  // ======== 怨듯넻 �좏떥 ========
  function parseNumber(str) {
    return parseFloat((str || '').toString().replace(/,/g, '').replace(/[^\d.]/g, '').trim()) || 0;
  }

  function formatNumber(num) {
    return num.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }

  function calculateFreeUse() {
    const freeUseTable = document.getElementById('freeUseTable');
    if (!freeUseTable) return;

    const rate = 0.029;
    const rows = freeUseTable.querySelectorAll('tbody tr');

    const landAmountFromRealEstate = document
      .querySelector('#realEstateTable tbody tr:nth-child(1) td:nth-child(4)')
      ?.textContent || '0';

    rows.forEach((row, index) => {
      const landPriceEl = row.querySelector('.land-price') || row.children[1];
      const halfLandPriceEl = row.querySelector('.half-land-price') || row.children[2];
      const depositInput = row.querySelector('.deposit-input') || row.children[3].querySelector('input');
      const baseAmountEl = row.querySelector('.base-amount') || row.children[4];
      const fairRentEl = row.querySelector('.fair-rent') || row.children[6];

      let landPrice = 0;
      if (index === 0) {
        landPrice = parseNumber(landAmountFromRealEstate);
        landPriceEl.textContent = formatNumber(landPrice);
      } else {
        landPrice = parseNumber(landPriceEl?.textContent);
      }

      const deposit = parseNumber(depositInput?.value || '0');
      const halfPrice = landPrice * 0.5;
      const baseAmount = Math.max(0, halfPrice - deposit);
      const fairRent = baseAmount * rate;

      halfLandPriceEl.textContent = formatNumber(halfPrice);
      baseAmountEl.textContent = formatNumber(baseAmount);
      fairRentEl.textContent = formatNumber(fairRent);
    });
  }

  // ======== [2] 臾댁긽�ъ슜�댁씡 諛� 利앹뿬�섏젣 �щ� 怨꾩궛 �⑥닔 ========
  function calculateDeemedGiftTable() {
    const table = document.getElementById('freeUseTable2');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    const presentValueFactor = 3.79079;
    const rate = 0.02;

    const marketRow = rows[0];
    const marketPriceCell = marketRow.querySelector('.land-price');
    const marketAmountCell = marketRow.querySelector('.base-amount');
    const marketGiftResultCell = marketRow.querySelector('.deemed-gift-result');

    const landAmountText = document.querySelector('#realEstateTable tbody tr:first-child td:nth-child(4)')?.textContent || '0';
    const landAmount = parseNumber(landAmountText);
    marketPriceCell.textContent = formatNumber(landAmount);

    const benefit1 = landAmount * rate * presentValueFactor;
    marketAmountCell.textContent = formatNumber(benefit1);
    marketGiftResultCell.textContent = benefit1 < 100000000 ? '利앹뿬�꾨떂' : '利앹뿬�대떦';

    const appraisalRow = rows[1];
    const appraisalPrice = parseNumber(appraisalRow.querySelector('.land-price')?.textContent);
    const appraisalAmountCell = appraisalRow.querySelector('.base-amount');
    const appraisalGiftResultCell = appraisalRow.querySelector('.deemed-gift-result');

    const benefit2 = appraisalPrice * rate * presentValueFactor;
    appraisalAmountCell.textContent = formatNumber(benefit2);
    appraisalGiftResultCell.textContent = benefit2 < 100000000 ? '利앹뿬�꾨떂' : '利앹뿬�대떦';
  }

  // ======== [3] 遺��숈궛�꾪솴 怨꾩궛 ========
const realEstateTable = document.getElementById('realEstateTable');
if (realEstateTable) {
  const rows = realEstateTable.querySelectorAll('tbody tr');
  const totalRow = document.getElementById('realEstateTotalRow');
  const leaseAmount = 20000000;

  // �덉쟾�섍쾶 ���� �レ옄 媛� 異붿텧 (input�� �덉쑝硫� value, �놁쑝硫� textContent)
  function getCellValue(cell) {
    const input = cell.querySelector('input');
    return parseNumber(input ? input.value : cell.textContent);
  }

  // �덉쟾�섍쾶 ���� �レ옄媛� �ｊ린 (input�� �덉쑝硫� value��, �놁쑝硫� textContent��)
  function setCellValue(cell, value) {
    const input = cell.querySelector('input');
    const formatted = formatNumber(value);
    if (input) {
      input.value = formatted;
    } else {
      cell.textContent = formatted;
    }
  }

  function calculateRealEstate() {
    let totalAppraisal = 0;

	 for (let i = 0; i <= 1; i++) {
		const row = rows[i];
		const area = getCellValue(row.children[1]);
		const unitPrice = getCellValue(row.children[2]);
		const amountCell = row.children[3];
		const appraisal = getCellValue(row.children[4]);

		let amount = 0;

		if (i === 0) {
		  // �좎�: 怨꾩궛��
		  amount = area * unitPrice;
		  if (!amountCell.querySelector('input')) {
			amountCell.textContent = formatNumber(amount);
		  }
		} else {
		  // 嫄대Ъ: �ъ슜�먭� �낅젰�� 湲덉븸留� �ъ슜
		  amount = getCellValue(amountCell);
		}

		row.dataset.appraisal = appraisal;
		totalAppraisal += appraisal;
	  }


    let totalLease = 0;

    for (let i = 0; i <= 1; i++) {
      const row = rows[i];
      const appraisal = parseNumber(row.dataset.appraisal);
      const ratioCell = row.children[5];
      const leaseShareCell = row.children[6];

      const ratio = totalAppraisal > 0 ? appraisal / totalAppraisal : 0;
      const lease = ratio * leaseAmount;
      totalLease += lease;

      ratioCell.textContent = (ratio * 100).toFixed(1) + '%';

      setCellValue(leaseShareCell, lease);
    }

    // 珥� 湲덉븸 怨꾩궛 (湲덉븸 ���� textContent �먮뒗 input)
    const totalAmount = [...rows].slice(0, 2).reduce((sum, row) => {
      const amountCell = row.children[3];
      return sum + getCellValue(amountCell);
    }, 0);

    // �⑷퀎 諛섏쁺
    totalRow.children[3].textContent = formatNumber(totalAmount);
    totalRow.children[4].textContent = formatNumber(totalAppraisal);
    totalRow.children[5].textContent = '100%';

    setCellValue(totalRow.children[6], totalLease);

    const appraisalInput = document.querySelector('.land-appraisal');
    const appraisalValue = parseNumber(appraisalInput?.value);

    document.querySelectorAll('.land-appraisal-target').forEach(cell => {
      cell.textContent = formatNumber(appraisalValue);
    });

    calculateFreeUse();
    calculateDeemedGiftTable();
  }

	  // �대깽�� 諛붿씤��
	  realEstateTable.querySelectorAll('.form-control').forEach(input => {
		input.addEventListener('input', calculateRealEstate);
	  });

	  calculateRealEstate(); // 珥덇린 �ㅽ뻾
	}

  // ======== [4] 蹂댁쬆湲� �낅젰 �대깽�� 諛붿씤�� ========
  const freeUseTable = document.getElementById('freeUseTable');
  if (freeUseTable) {
    freeUseTable.querySelectorAll('.deposit-input').forEach(input => {
      input.addEventListener('input', calculateFreeUse);
    });
    calculateFreeUse();
  }
});





function calculateDeemedGiftTable() {
  const table = document.getElementById('freeUseTable2');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  const presentValueFactor = 3.79079;
  const rate = 0.02;

  // 湲곗��쒓� ��
  const marketRow = rows[0];
  const marketPriceCell = marketRow.querySelector('.land-price');
  const marketAmountCell = marketRow.querySelector('.base-amount');
  const marketGiftResultCell = marketRow.querySelector('.deemed-gift-result');

  // 湲곗� �좎�媛��� �� realEstateTable �좎� 湲덉븸 �� 李몄“
  const landAmountText = document.querySelector('#realEstateTable tbody tr:first-child td:nth-child(4)')?.textContent || '0';
  const landAmount = parseNumber(landAmountText);
  marketPriceCell.textContent = formatNumber(landAmount);

  const benefit1 = landAmount * rate * presentValueFactor;
  marketAmountCell.textContent = formatNumber(benefit1);
  marketGiftResultCell.textContent = benefit1 < 100000000 ? '利앹뿬�꾨떂' : '利앹뿬�대떦';

  // 媛먯젙�됯��� ��
  const appraisalRow = rows[1];
  const appraisalPrice = parseNumber(appraisalRow.querySelector('.land-price')?.textContent);
  const appraisalAmountCell = appraisalRow.querySelector('.base-amount');
  const appraisalGiftResultCell = appraisalRow.querySelector('.deemed-gift-result');

  const benefit2 = appraisalPrice * rate * presentValueFactor;
  appraisalAmountCell.textContent = formatNumber(benefit2);
  appraisalGiftResultCell.textContent = benefit2 < 100000000 ? '利앹뿬�꾨떂' : '利앹뿬�대떦';
}



   document.addEventListener('DOMContentLoaded', () => {
	   initToggleEvents();
    const inputs = document.querySelectorAll('.input-text');

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