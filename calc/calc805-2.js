document.addEventListener('DOMContentLoaded', () => {

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function unformatNumber(str) {
    return str.replace(/,/g, "");
  }

  function toggleGiftValueRows() {
	  
    const giftValueRow = document.getElementById('gift_value_row');
    const giftValue2Row = document.getElementById('gift_value2_row');
    const amountWonInput = document.getElementById('amountWon');
    const amountWonStr = amountWonInput.value.replace(/[^0-9]/g, '');
    const amountWon = parseInt(amountWonStr, 10) || 0;

    if (amountWon === 0) {
      giftValueRow.style.display = '';
      giftValue2Row.style.display = 'none';
    } else {
      giftValueRow.style.display = 'none';
      giftValue2Row.style.display = '';
    }
  }

  calculateInheritance();
  initToggleEvents();
  syncHeaderWithInput();

  // 紐⑤뱺 input �붿냼�� �대깽�� �곌껐
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      calculateInheritance();
      toggleGiftValueRows();
    });
  });

  // amountWon input 媛� 蹂�寃� �� �좉� �⑥닔 �ㅽ뻾
  const amountWonInput = document.getElementById('amountWon');
  if (amountWonInput) {
    amountWonInput.addEventListener('input', () => {
      toggleGiftValueRows();
      calculateInheritance();
    });
  }
const input = document.getElementById('amountStock');

input.addEventListener('input', function () {
  // �レ옄留� 異붿텧
  const raw = this.value.replace(/[^0-9]/g, '');

  // �レ옄 �щ㎎ �곸슜
  const formatted = formatNumber(raw);

  // �щ㎎�� 媛믪쑝濡� �ㅼ떆 �낅젰李쎌뿉 �쒖떆
  this.value = formatted;
});

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  // 珥덇린 �좉� �ㅽ뻾
  toggleGiftValueRows();

  // 媛�議� �대쫫, 愿�怨� �곕룞
  for (let i = 0; i < 10; i++) {
    const selectEl = document.getElementById(`relationSelect${i}`);
    if (selectEl) {
      selectEl.addEventListener('change', calculateInheritance);
    }

    const inputEl = document.getElementById(`relation_family${i}`);
    if (inputEl) {
      inputEl.addEventListener('input', () => {
        const headerEl = document.getElementById(`header_family${i + 1}`);
        if (headerEl) {
          headerEl.textContent = inputEl.value || headerEl.textContent;
        }
      });
    }
  }

  // �� 1二쇰떦 �됯��� 肄ㅻ쭏 �щ㎎ �곸슜 (unitPrice_family*)
  for (let i = 0; i < 10; i++) {
    const input = document.getElementById(`unitPrice_family${i}`);
    if (input) {
      // 珥덇린 �щ㎎
      input.value = formatNumber(unformatNumber(input.value));

      // �낅젰 以� �レ옄留� �좎�
      input.addEventListener('input', () => {
        const raw = unformatNumber(input.value);
        input.value = raw.replace(/\D/g, "");
      });

      // �ъ빱�� �꾩썐 �� 肄ㅻ쭏 �곸슜
      input.addEventListener('blur', () => {
        input.value = formatNumber(unformatNumber(input.value));
      });
    }
  }

});

function calculateInheritance() {
  const totalStockStr = document.getElementById('amountStock').value.replace(/[^0-9]/g, '');
  const totalStock = parseInt(totalStockStr, 10);

  const amountWonStr = document.getElementById('amountWon').value.replace(/[^0-9]/g, '');
  const amountWon = parseInt(amountWonStr, 10) || 0;

  if (!totalStock || isNaN(totalStock)) return;

  for (let i = 0; i < 10; i++) {
    const stockInput = document.getElementById(`stock_family${i}`);
    const unitPriceInput = document.getElementById(`unitPrice_family${i}`);
    const ratioTd = document.getElementById(`ratio_family${i}`);
    const giftTd = document.getElementById(`gift_value_family${i}`);
    const gift2Input = document.getElementById(`gift_value2_family${i}`);
    const deductionTd = document.getElementById(`deduction_family${i}`);
    const relationSelect = document.getElementById(`relationSelect${i}`);
    const taxableBaseTd = document.getElementById(`taxable_base_family${i}`);
    const dueTd = document.getElementById(`tax_due_family${i}`);
    const reportedDeductionTd = document.getElementById(`reported_deduction_family${i}`);
    const declaredTaxTd = document.getElementById(`declared_tax_family${i}`);

    // 二쇱떇 ��, 1二쇰떦 �됯��� �レ옄留� 異붿텧
    const stockStr = stockInput.value.replace(/[^0-9]/g, '');
    const unitPriceStr = unitPriceInput.value.replace(/[^0-9]/g, '');

    const stockCount = parseInt(stockStr, 10) || 0;
    const unitPrice = parseInt(unitPriceStr, 10) || 0;

    // 吏�遺꾩쑉 怨꾩궛
    const ratio = totalStock > 0 ? (stockCount / totalStock) * 100 : 0;
    ratioTd.textContent = ratio.toFixed(1) + '%';

    // 利앹뿬�ъ궛媛��� 怨꾩궛
    let giftValue = 0;
    if (amountWon === 0) {
      giftValue = stockCount * unitPrice;
      giftTd.textContent = giftValue.toLocaleString() + '��';
    } else {
      // amountWon > 0 �대㈃ gift_value2_row input 媛� �ъ슜
      if (gift2Input) {
        const gift2Str = gift2Input.value.replace(/[^0-9]/g, '');
        giftValue = parseInt(gift2Str, 10) || 0;
        giftTd.textContent = giftValue.toLocaleString() + '��'; // 湲곗〈 td�먮룄 異쒕젰�댁쨾�� �붾㈃ �숆린��
      }
    }

    // 利앹뿬�ъ궛怨듭젣 怨꾩궛
    const exemption = parseInt(relationSelect.value.replace(/[^0-9]/g, ''), 10) || 0;
    deductionTd.textContent = exemption.toLocaleString() + '��';

    // 怨쇱꽭�쒖� 怨꾩궛 (MAX(giftValue - deductionValue, 0))
    const deductionValue = parseInt(deductionTd.textContent.replace(/[^0-9]/g, ''), 10) || 0;
    const taxableBase = Math.max(giftValue - deductionValue, 0);
    taxableBaseTd.textContent = taxableBase.toLocaleString() + '��';

    // 利앹뿬�� �곗텧�몄븸 怨꾩궛 (�뚯닽�� �ы븿)
    let taxExact = 0;
    if (taxableBase > 3000000000) {
      taxExact = taxableBase * 0.5 - 460000000;
    } else if (taxableBase > 1000000000) {
      taxExact = taxableBase * 0.4 - 160000000;
    } else if (taxableBase > 500000000) {
      taxExact = taxableBase * 0.3 - 60000000;
    } else if (taxableBase > 100000000) {
      taxExact = taxableBase * 0.2 - 10000000;
    } else {
      taxExact = taxableBase * 0.1;
    }

    // UI �쒖떆�⑹� 諛섏삱由�
    dueTd.textContent = Math.round(taxExact).toLocaleString() + '��';

    // �좉퀬�몄븸怨듭젣 怨꾩궛 (�뚯닽�� �덈뒗 taxExact 媛믪쑝濡� 怨꾩궛)
    const reportedDeductionExact = taxExact * 0.03;

    // �좉퀬�몄븸怨듭젣 �쒖떆 (諛섏삱由�)
    const reportedDeductionRounded = Math.round(reportedDeductionExact);
    reportedDeductionTd.textContent = reportedDeductionRounded === 0 ? '0' : '-' + reportedDeductionRounded.toLocaleString() + '��';

    // 利앹뿬�� �좉퀬�몄븸 怨꾩궛 (諛섏삱由� �� �뺥솗�� 媛믪쑝濡� 怨꾩궛 �� 理쒖쥌 諛섏삱由�)
    const declaredTaxExact = taxExact - reportedDeductionExact;
    const declaredTaxRounded = Math.round(declaredTaxExact);
    declaredTaxTd.textContent = declaredTaxRounded.toLocaleString() + '��';
  }
}

function syncHeaderWithInput() {
  for(let i = 0; i < 10; i++) {
    const inputEl = document.getElementById(`relation_family${i}`);
    const headerEl = document.getElementById(`header_family${i + 1}`);

    if(inputEl && headerEl) {
      headerEl.textContent = inputEl.value || headerEl.textContent;
    }
  }
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