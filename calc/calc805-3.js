function updateAmounts() {
  for (let i = 1; i <= 10; i++) {
    const stockCount = parseInt(document.getElementById(`stockCount_${i}`)?.value.replace(/,/g, '')) || 0;
    const buyPrice = parseFloat(document.getElementById(`buyPrice_${i}`)?.value.replace(/,/g, '')) || 0;
    const sellPrice = parseFloat(document.getElementById(`sellPrice_${i}`)?.value.replace(/,/g, '')) || 0;

    const acquisitionAmount = stockCount * buyPrice;
    const transferAmount = stockCount * sellPrice;
    const capitalGain = Math.max((sellPrice - buyPrice) * stockCount, 0);
    const stockTax = transferAmount * 0.0045;
    const taxBase = Math.max(capitalGain - stockTax - 2500000, 0);

    let capitalTax = 0;
    if (taxBase > 300000000) {
      capitalTax = (taxBase - 300000000) * 0.25 + 60000000;
    } else {
      capitalTax = taxBase * 0.2;
    }

    const localTax = capitalTax * 0.1;

	const totalTax = capitalTax + localTax + stockTax;

	document.getElementById(`totalTax_${i}`).textContent =
	  totalTax > 0 ? Math.round(totalTax).toLocaleString() : '';

	document.getElementById(`totalTaxSender_${i}`).textContent =
	  totalTax > 0 ? Math.round(totalTax).toLocaleString() : '';

    document.getElementById(`requiredAmountBuyer_${i}`).textContent =
      transferAmount > 0 ? transferAmount.toLocaleString() : '';
	
    // DOM 諛섏쁺
    document.getElementById(`acquisitionAmount_${i}`).textContent =
      acquisitionAmount > 0 ? acquisitionAmount.toLocaleString() : '';
    document.getElementById(`transferAmount_${i}`).textContent =
      transferAmount > 0 ? transferAmount.toLocaleString() : '';
    document.getElementById(`capitalGain_${i}`).textContent =
      capitalGain > 0 ? capitalGain.toLocaleString() : '';
    document.getElementById(`stockTax_${i}`).textContent =
      transferAmount > 0 ? Math.round(stockTax).toLocaleString() : '';
    document.getElementById(`taxBase_${i}`).textContent =
      taxBase > 0 ? Math.round(taxBase).toLocaleString() : '';
    document.getElementById(`capitalTax_${i}`).textContent =
      capitalTax > 0 ? Math.round(capitalTax).toLocaleString() : '';
    document.getElementById(`localTax_${i}`).textContent =
      localTax > 0 ? Math.round(localTax).toLocaleString() : '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
	
	updateAmounts();
	initToggleEvents();
	
	document.querySelectorAll('input[type="text"]').forEach(input => {
	  input.addEventListener('input', e => {
		// 肄ㅻ쭏 �쒓굅 �� �レ옄留� 異붿텧
		let val = e.target.value.replace(/,/g, '').replace(/[^\d]/g, '');
		// �レ옄硫� 肄ㅻ쭏 遺숈엫
		if(val) {
		  e.target.value = val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		} else {
		  e.target.value = '';
		}
	  });
	});
});

document.addEventListener('input', function (e) {
  if (e.target.matches('[id^="stockCount_"], [id^="buyPrice_"], [id^="sellPrice_"]')) {
    updateAmounts();
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