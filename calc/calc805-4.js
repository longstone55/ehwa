document.addEventListener('DOMContentLoaded', () => {
  calculateInheritance();
  
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateInheritance);
  });
  
  initToggleEvents();
});

function calculateGiftTax(amount) {
  if (amount > 3000000000) {
    return amount * 0.5 - 460000000;
  } else if (amount > 1000000000) {
    return amount * 0.4 - 160000000;
  } else if (amount > 500000000) {
    return amount * 0.3 - 60000000;
  } else if (amount > 100000000) {
    return amount * 0.2 - 10000000;
  } else {
    return amount * 0.1;
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

function calculateInheritance() {
	
  function parseNumber(str) {
    return Number(String(str).replace(/,/g, '')) || 0;
  }

  const parValue = parseNumber(document.getElementById('parValue').value);
  const acquisitionPrice = parseNumber(document.getElementById('acquisitionPrice').value);
  const currentPrice = parseNumber(document.getElementById('currentPrice').value);
  const stockCount = parseNumber(document.getElementById('stockCount').value);
  const customPrice = parseNumber(document.getElementById('customPrice').value);
  const mirrorEl = document.getElementById('customPrice_mirror');
  
  mirrorEl.textContent = document.getElementById('customPrice').value;

  const calcPrice = acquisitionPrice !== 0 ? acquisitionPrice : parValue;
  const today = new Date();
  const cutoffDate = new Date(2020, 2, 31);

  for (let i = 1; i <= 10; i++) {
	  
    const stockTd = document.getElementById(`stockCount_${i}`);
    const acquisitionTd = document.getElementById(`acquisitionPrice_${i}`);
    const tradePriceTd = document.getElementById(`tradePrice_${i}`);
    const tradeAmountTd = document.getElementById(`tradeAmount_${i}`);
    const giftProfitTd = document.getElementById(`giftProfit_${i}`);
    const giftTaxTd = document.getElementById(`giftTax_${i}`);
    const giftTaxReportTd = document.getElementById(`giftTaxReport_${i}`);
    const giftTaxFinalTd = document.getElementById(`giftTaxFinal_${i}`);
    const capitalGainTd = document.getElementById(`capitalGain_${i}`);
    const securitiesTaxTd = document.getElementById(`securitiesTax_${i}`);
    const transferTaxBaseTd = document.getElementById(`transferTaxBase_${i}`);

    let tradePriceValue = 0;
    if (i === 1) {
      tradePriceValue = currentPrice;
    } else if (i >= 2 && i <= 4) {
      tradePriceValue = currentPrice * 0.7;
    } else if (i >= 5 && i <= 7) {
      tradePriceValue = parValue;
    } else if (i >= 8 && i <= 10) {
      tradePriceValue = customPrice;
    }

    const tradeAmount = stockCount * tradePriceValue;
    const F3 = currentPrice * stockCount;

    if (stockTd) stockTd.textContent = stockCount.toLocaleString();
    if (acquisitionTd) acquisitionTd.textContent = calcPrice.toLocaleString();
    if (tradePriceTd) tradePriceTd.textContent = Math.round(tradePriceValue).toLocaleString();
    if (tradeAmountTd) tradeAmountTd.textContent = Math.round(tradeAmount).toLocaleString();

    // 利앹뿬�댁씡 怨꾩궛
    let giftProfit = 0;
    if (i === 1) {
      if (giftProfitTd) giftProfitTd.textContent = '';
    } else {
      const groupOffset = ((i - 2) % 3);
      const threshold = Math.min(F3 * 0.3, 300000000);
      const diff = F3 - tradeAmount;

      if (groupOffset === 0 || groupOffset === 1) {
        giftProfit = (diff < threshold) ? 0 : diff - threshold;
      } else if (groupOffset === 2) {
        giftProfit = (diff < F3 * 0.3) ? 0 : diff - 300000000;
        giftProfit = Math.max(giftProfit, 0);
      }

      if (giftProfitTd) giftProfitTd.textContent = Math.round(giftProfit).toLocaleString();
    }

    // 利앹뿬�� 怨꾩궛
    if (i >= 2) {
      const tax = calculateGiftTax(giftProfit);
      const reportCredit = -tax * 0.03;
      const finalTax = tax + reportCredit;

      if (giftTaxTd) giftTaxTd.textContent = tax > 0 ? Math.round(tax).toLocaleString() : '0';
      if (giftTaxReportTd) giftTaxReportTd.textContent = tax > 0 ? Math.round(reportCredit).toLocaleString() : '0';
      if (giftTaxFinalTd) giftTaxFinalTd.textContent = tax > 0 ? Math.round(finalTax).toLocaleString() : '0';
    } else {
      if (giftTaxTd) giftTaxTd.textContent = '';
      if (giftTaxReportTd) giftTaxReportTd.textContent = '';
      if (giftTaxFinalTd) giftTaxFinalTd.textContent = '';
    }

    // �묐룄李⑥씡 怨꾩궛
    let capitalGain = 0;
    if ([1, 3, 4, 6, 7, 9, 10].includes(i)) {
      capitalGain = (tradePriceValue - calcPrice) * stockCount;
    } else if (i === 2 || i === 5) {
      capitalGain = (currentPrice - calcPrice) * stockCount;
    } else if (i === 8) {
      if (currentPrice < parValue) {
        capitalGain = currentPrice * stockCount;
      } else {
        capitalGain = (customPrice - calcPrice) * stockCount;
      }
    }

    if (capitalGainTd) {
      capitalGainTd.textContent = Math.round(capitalGain).toLocaleString();
    }

    // 利앷텒嫄곕옒�� 怨꾩궛
    let securitiesTax = 0;
    if (i === 2) {
      const tax1 = parseNumber(document.getElementById('securitiesTax_1')?.textContent);
      securitiesTax = tax1;
      if (securitiesTaxTd) securitiesTaxTd.textContent = tax1.toLocaleString();
    } else {
      const taxRate = today > cutoffDate ? 0.0045 : 0.005;
      securitiesTax = tradeAmount * taxRate;
      if (securitiesTaxTd) securitiesTaxTd.textContent = Math.round(securitiesTax).toLocaleString();
    }

    // �� �묐룄�뚮뱷�� 怨쇱꽭�쒖� 怨꾩궛
    let capGain = capitalGain;
    if (i === 2) {
      capGain = parseNumber(document.getElementById('capitalGain_1')?.textContent);
      securitiesTax = parseNumber(document.getElementById('securitiesTax_1')?.textContent);
    }

    const transferBase = Math.max(capGain - securitiesTax - 2500000, 0);
    if (transferTaxBaseTd) transferTaxBaseTd.textContent = Math.round(transferBase).toLocaleString();
	    const transferTaxLocalTd = document.getElementById(`transferTaxLocal_${i}`);
		if (transferTaxLocalTd) {
		  let baseValue = 0;

		  if (i === 2) {
			// 2踰덉� 1踰덉쓽 怨꾩궛 寃곌낵瑜� �ъ슜
			baseValue = parseNumber(document.getElementById('transferTaxBase_1')?.textContent);
		  } else {
			baseValue = parseNumber(document.getElementById(`transferTaxBase_${i}`)?.textContent);
		  }

		  let transferTax = 0;
		  if (baseValue > 300000000) {
			transferTax = (baseValue - 300000000) * 0.25 + 60000000;
		  } else {
			transferTax = baseValue * 0.2;
		  }

		  transferTax *= 1.1; // 吏�諛⑹냼�앹꽭 �ы븿
		  transferTaxLocalTd.textContent = Math.round(transferTax).toLocaleString();
		}
		
		
		   const transferTaxSumTd = document.getElementById(`transferTaxSum_${i}`);
			if (transferTaxSumTd) {
			  const securitiesTaxVal = parseNumber(document.getElementById(`securitiesTax_${i}`)?.textContent);
			  const transferTaxLocalVal = parseNumber(document.getElementById(`transferTaxLocal_${i}`)?.textContent);
			  const total = securitiesTaxVal + transferTaxLocalVal;
			  transferTaxSumTd.textContent = Math.round(total).toLocaleString();
			}
			
		const totalTaxSumTd = document.getElementById(`totalTaxSum_${i}`);
		if (totalTaxSumTd) {
		  const giftFinal = parseNumber(document.getElementById(`giftTaxFinal_${i}`)?.textContent);
		  const transferTotal = parseNumber(document.getElementById(`transferTaxSum_${i}`)?.textContent);
		  const sumTotal = giftFinal + transferTotal;
		  totalTaxSumTd.textContent = Math.round(sumTotal).toLocaleString();
		}
	
	  const paymentAmountTd = document.getElementById(`paymentAmount_${i}`);
    const tradeAmountVal = parseNumber(document.getElementById(`tradeAmount_${i}`)?.textContent);
    if (paymentAmountTd) {
      paymentAmountTd.textContent = Math.round(tradeAmountVal).toLocaleString();
    }
  }
  
   
}