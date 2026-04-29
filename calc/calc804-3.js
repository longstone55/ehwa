function updatePurchasePriceCells() {
	
  const priceEl = document.getElementById('purchasePriceInput');
  const areaEl = document.getElementById('purchaseAreaInput');

  if (!priceEl || !areaEl) return;

  const purchasePrice = parseFloat(priceEl.dataset.raw || priceEl.value.replace(/[^\d]/g, '') || '0');
  const purchaseArea = parseFloat(areaEl.value || '0');

  // 湲곗�媛�
  const H9 = 600000000;
  const H10 = 600000000;
  const H11 = 600000000;
  const H12 = 900000000;
  const H13 = 900000000;
  const H14 = 900000000;
  const I9 = 85;
  const I10 = 85;
  const I11 = 85;
  const I12 = 85;
  const I13 = 85;
  const I14 = 85;

  // 留ㅼ엯媛�寃� 議곌굔蹂� �ㅼ젙
  document.getElementById('purchasePriceCell1').textContent = (purchasePrice <= H9 && purchaseArea <= I9) ? purchasePrice.toLocaleString() : '0';
  document.getElementById('purchasePriceCell2').textContent = (purchasePrice <= H10 && purchaseArea > I10) ? purchasePrice.toLocaleString() : '0';
  document.getElementById('purchasePriceCell3').textContent = (purchasePrice > H11 && purchasePrice <= H12 && purchaseArea <= I11) ? purchasePrice.toLocaleString() : '0';
  document.getElementById('purchasePriceCell4').textContent =(purchasePrice > H11 && purchasePrice <= H12 && purchaseArea > I12)  ? purchasePrice.toLocaleString() : '0';

  document.getElementById('purchasePriceCell5').textContent = (purchasePrice > H13 && purchaseArea <= I13) ? purchasePrice.toLocaleString() : '0'; document.getElementById('purchasePriceCell6').textContent =
    (purchasePrice > H14 && purchaseArea > I14)
      ? purchasePrice.toLocaleString() : '0';

 updateDynamicTaxRates(); // 癒쇱� �ㅽ뻾�댁꽌 taxRate 梨꾩�
  updateAcquisitionTaxes(); // 洹몃떎�� 痍⑤뱷�� 怨꾩궛
  updateTaxationRate(purchasePrice);
  updateTotalAcquisitionTax(purchasePrice);
}

function parsePercent(str) {
  return parseFloat(str.replace('%', '')) / 100;
}

function updateAcquisitionTaxes() {
  for (let i = 1; i <= 6; i++) {
    const priceCell = document.getElementById(`purchasePriceCell${i}`);
    const taxRateCell = document.getElementById(`taxRate${i}`);
    const outputCell = document.getElementById(`acquisitionTax${i}`);

    if (!priceCell || !outputCell || !taxRateCell) continue;

    const rawPrice = parseFloat(priceCell.textContent.replace(/[^\d]/g, '')) || 0;
    const taxRate = parsePercent(taxRateCell.textContent || '0%');

    const tax = rawPrice === 0 ? 0 : Math.floor((rawPrice * taxRate) / 10) * 10;
    outputCell.textContent = tax.toLocaleString();
  }
}

function updateDynamicTaxRates() {
  const cell3Price = parseFloat(document.getElementById('purchasePriceCell3').textContent.replace(/[^\d]/g, '')) || 0;
  const tax2_1El = document.getElementById('tax2-1');
  const tax2_2El = document.getElementById('tax2-2');
  const taxRate3El = document.getElementById('taxRate3');

  if (cell3Price === 0) {
    tax2_1El.textContent = '-';
    tax2_2El.textContent = '-';
    taxRate3El.textContent = '-';
  } else {
    const t21 = Math.round((((2 / 3) * (cell3Price / 100000000) - 3) / 100) * 10000) / 10000;
    const t22 = Math.round((((cell3Price / 100000000) - 6) / 100) * 10000) / 10000;

    tax2_1El.textContent = (t21 * 100).toFixed(2) + '%';
    tax2_2El.textContent = (t22 * 100).toFixed(2) + '%';

    // taxRate3 = t21 + t22
    const totalRate3 = t21 + t22;
    taxRate3El.textContent = (totalRate3 * 100).toFixed(2) + '%';
  }

  const cell4Price = parseFloat(document.getElementById('purchasePriceCell4').textContent.replace(/[^\d]/g, '')) || 0;
  const tax3_1El = document.getElementById('tax3-1');
  const tax3_2El = document.getElementById('tax3-2');
  const tax3_3El = document.getElementById('tax3-3');
  const taxRate4El = document.getElementById('taxRate4');

  if (cell4Price === 0) {
    tax3_1El.textContent = '-';
    tax3_2El.textContent = '-';
    if (tax3_3El) tax3_3El.textContent = '-';
    taxRate4El.textContent = '-';
  } else {
    const t31 = Math.round((((2 / 3) * (cell4Price / 100000000) - 3) / 100) * 10000) / 10000; // �뚯닔��
    const t32 = t31 * 0.5 * 0.2;

    tax3_1El.textContent = (t31 * 100).toFixed(2) + '%';
    tax3_2El.textContent = (t32 * 100).toFixed(2) + '%';

    let t33 = 0;
    if (tax3_3El && tax3_3El.dataset.rate) {
      t33 = parseFloat(tax3_3El.dataset.rate); // HTML�� data-rate 媛� 洹몃�濡� �ъ슜
      tax3_3El.textContent = (t33 * 100).toFixed(2) + '%';
    }

    // taxRate4 = t31 + t32 + t33
    const totalRate4 = t31 + t32 + t33;
    taxRate4El.textContent = (totalRate4 * 100).toFixed(2) + '%';
  }
}

function updateTaxationRate(purchasePrice) {
	
  const matchTargets = [
    parseFloat(document.getElementById('purchasePriceCell1').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell2').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell3').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell4').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell5').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell6').textContent.replace(/[^\d]/g, '') || '0'),
  ];

  const taxRates = [
    document.getElementById('taxRate1')?.textContent || '',
    document.getElementById('taxRate2')?.textContent || '',
    document.getElementById('taxRate3')?.textContent || '',
    document.getElementById('taxRate4')?.textContent || '',
    document.getElementById('taxRate5')?.textContent || '',
    document.getElementById('taxRate6')?.textContent || '',
  ];

  const matchedIndex = matchTargets.findIndex(v => v === purchasePrice);
  const taxationRateEl = document.getElementById('taxationRate');
  if (taxationRateEl) {
    taxationRateEl.textContent = matchedIndex >= 0 ? taxRates[matchedIndex] : '';
  }
  
}

function updateTotalAcquisitionTax(purchasePrice) {
  const matchTargets = [
    parseFloat(document.getElementById('purchasePriceCell1').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell2').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell3').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell4').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell5').textContent.replace(/[^\d]/g, '') || '0'),
    parseFloat(document.getElementById('purchasePriceCell6').textContent.replace(/[^\d]/g, '') || '0'),
  ];

  const acquisitionTaxes = [
    document.getElementById('acquisitionTax1')?.textContent || '0',
    document.getElementById('acquisitionTax2')?.textContent || '0',
    document.getElementById('acquisitionTax3')?.textContent || '0',
    document.getElementById('acquisitionTax4')?.textContent || '0',
    document.getElementById('acquisitionTax5')?.textContent || '0',
    document.getElementById('acquisitionTax6')?.textContent || '0',
  ];

  const matchedIndex = matchTargets.findIndex(v => v === purchasePrice);
  const totalTaxEl = document.getElementById('totalAcquisitionTax');

  if (totalTaxEl) {
    totalTaxEl.textContent =
      matchedIndex >= 0 ? acquisitionTaxes[matchedIndex] : '';
  }
}

// DOM 濡쒕뱶 �� 珥덇린 �ㅽ뻾 諛� �대깽�� �깅줉
document.addEventListener('DOMContentLoaded', () => {
  const priceInput = document.getElementById('purchasePriceInput');
  const areaInput = document.getElementById('purchaseAreaInput');

  if (priceInput && areaInput) {
    priceInput.addEventListener('input', updatePurchasePriceCells);
    areaInput.addEventListener('input', updatePurchasePriceCells);
  }

  updatePurchasePriceCells(); // 理쒖큹 �ㅽ뻾
  initToggleEvents();
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