document.addEventListener('DOMContentLoaded', () => {
  // 理쒖큹 1�� 怨꾩궛
  calculateInheritance();

  // 紐⑤뱺 input �꾨뱶�� input �대깽�� 諛붿씤��
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateInheritance);
  });

  // select �꾨뱶�먮룄 change �대깽�� 諛붿씤��
  document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', calculateInheritance);
  });
  
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

function vlookupApprox(value, table) {
  // value �댄븯 以� 媛��� �� income�� 李얠쓬
  let result = 0;
  for (const row of table) {
    if (value >= row.income) {
      result = row.tax;
    } else {
      break;
    }
  }
  return result;
}
function calculateInheritance() {
	
  function parseNumber(str) {
    return Number(str.replace(/,/g, '')) || 0;
  }

  // �� 遺�踰뺤씤 李⑤벑諛곕떦 �� �듦툑
  const subCorpDividendInput = document.getElementById('subCorpDividend_1');
  const subCorpIncomeEl = document.getElementById('subCorpIncome_1');
  const subCorpDividend = parseNumber(subCorpDividendInput.value);
  const subCorpIncome = subCorpDividend * 0.2;
	const shareRatioSelect = document.getElementById('shareRatio');
	const shareRatioKey = shareRatioSelect.value;


  const shareRatioMap = {
    under20: 0.3,
    over20: 0.8,
    over50: 1.0
  };

	const dividendTaxTable = [
  { income: 100_000_000,  tax: 33_000_000 },
  { income: 200_000_000,  tax: 72_000_000 },
  { income: 300_000_000,  tax: 114_000_000 },
  { income: 400_000_000,  tax: 155_000_000 },
  { income: 500_000_000,  tax: 199_000_000 },
  { income: 600_000_000,  tax: 243_000_000 },
  { income: 700_000_000,  tax: 283_000_000 },
  { income: 800_000_000,  tax: 322_000_000 },
  { income: 900_000_000,  tax: 362_000_000 },
  { income: 1000_000_000, tax: 405_000_000 },
];

	
  subCorpIncomeEl.textContent = subCorpIncome.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  // �� 踰뺤씤�� 怨꾩궛
	const subCorpIncomeRaw = parseNumber(subCorpIncomeEl.textContent);

	// �� 踰뺤씤�� 怨꾩궛
	const subCorpTaxEl = document.getElementById('subCorpTax_1');

	let subCorpTax = 0;
	const threshold = 200_000_000; // 200諛깅쭔�� �� 2��

	if (subCorpIncome > threshold) {
	  subCorpTax = ((subCorpIncome - threshold) * 0.19 + threshold * 0.09) * 1.1;
	} else {
	  subCorpTax = subCorpIncome * 0.09 * 1.1;
	}

	subCorpTaxEl.textContent = subCorpTax.toLocaleString(undefined, {
	  minimumFractionDigits: 0,
	  maximumFractionDigits: 2
	});

  // �� �명썑 �좎엯
  const subCorpNetIncomeEl = document.getElementById('subCorpNetIncome_1');
  const subCorpNetIncome = subCorpDividend - subCorpTax;
  subCorpNetIncomeEl.textContent = subCorpNetIncome.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
	
	
  const shareRatioPercent = shareRatioMap[shareRatioKey] ?? 0;
  const shareRatioOutput = document.getElementById('shareRatioPercent');
  if (shareRatioOutput) {
    shareRatioOutput.textContent = (shareRatioPercent * 100).toFixed(0) + '%';
  }
  

	const sonCorpIncome = subCorpDividend * (1 - shareRatioPercent);

	// 寃곌낵 諛섏쁺
	const sonCorpIncomeEl = document.getElementById('sonCorpIncome_1');
	if (sonCorpIncomeEl) {
	  sonCorpIncomeEl.textContent = sonCorpIncome.toLocaleString();
	}

	let sonCorpTax = 0;

	if (sonCorpIncome > threshold) {
	  sonCorpTax = ((sonCorpIncome - threshold) * 0.19 + threshold * 0.09) * 1.1;
	} else {
	  sonCorpTax = sonCorpIncome * 0.09 * 1.1;
	}


	// 諛섏쁺
	const sonCorpTaxEl = document.getElementById('sonCorpTax_1');
	if (sonCorpTaxEl) {
	  sonCorpTaxEl.textContent = sonCorpTax.toLocaleString(undefined, { maximumFractionDigits: 1 });
	}

	const sonCorpNetIncome = subCorpDividend - sonCorpTax;
	const sonCorpNetIncomeEl = document.getElementById('sonCorpNetIncome_1');
	if (sonCorpNetIncomeEl) {
	  sonCorpNetIncomeEl.textContent = sonCorpNetIncome.toLocaleString(undefined, { maximumFractionDigits: 1 });
	}

	const subCorpDividendValue = parseNumber(document.getElementById('subCorpDividend_1').value || '0');
	const formattedDividend = subCorpDividendValue.toLocaleString();  // 泥� �⑥쐞 肄ㅻ쭏 �곸슜
	document.getElementById('dividendLabel_1').textContent = `${formattedDividend} 諛곕떦�� 媛쒖씤諛곕떦 怨� 踰뺤씤諛곕떦 �멸툑 鍮꾧탳 / 嫄대낫猷뚰룷��`;
	//document.getElementById('dividendLabel_11').textContent = `${formattedDividend} 諛곕떦��`;

	const personalTax = vlookupApprox(subCorpDividend, dividendTaxTable);

	const taxPersonalEl = document.getElementById('tax_personal_1');
	if (taxPersonalEl) {
	  taxPersonalEl.textContent = personalTax.toLocaleString() + '';
	}

	const sonCorpTaxValue = parseNumber(document.getElementById('sonCorpTax_1').textContent || '0');
	const taxCorp1El = document.getElementById('tax_corp1_1');
	if (taxCorp1El) {
	  taxCorp1El.textContent = sonCorpTaxValue.toLocaleString(undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	  });
	}
	
		
	  const sonCorpNetIncomeValue = parseNumber(document.getElementById('sonCorpNetIncome_1').textContent || '0');
	  const taxCorp2El = document.getElementById('tax_corp2_1');
	  if (taxCorp2El) {
		taxCorp2El.textContent = sonCorpNetIncomeValue.toLocaleString(undefined, { maximumFractionDigits: 0 }) + '';
	  }
	  
  	  const taxCorp3El = document.getElementById('tax_corp3_1');
	  if (taxCorp3El) {
		taxCorp3El.textContent = (subCorpDividendValue - personalTax).toLocaleString();

	  }


	updateCurrentRow();
	calculate20Years();
  
}
  function parseNumber(str) {
    return Number(str.replace(/,/g, '')) || 0;
  }


function updateCurrentRow() {


  const subCorpAsset = parseNumber(document.getElementById('subCorpAsset').value || '0');        // D13
  const subCorpDividend = parseNumber(document.getElementById('subCorpDividend_1').value || '0'); // B14
  const subCorpNetIncome = parseNumber(document.getElementById('subCorpNetIncome').value || '0'); // C14

  const baseCapital = subCorpAsset;  // td_3_current
  const baseNetValue = baseCapital;  // td_6_current
  const baseFinalValue = 500000000;         // td_9_current

  document.getElementById('td_3_current').textContent = baseCapital.toLocaleString();
  document.getElementById('td_6_current').textContent = baseNetValue.toLocaleString();
  document.getElementById('td_9_current').textContent = baseFinalValue.toLocaleString();
}

function calculate20Years() {
	
  const subCorpNetIncome = parseNumber(document.getElementById('subCorpNetIncome').value || '0'); // 遺�踰뺤씤 �명썑�쒖씡
  const subCorpDividend = parseNumber(document.getElementById('subCorpDividend_1').value || '0'); // 李⑤벑諛곕떦
  const sonCorpBeforeTaxIncome = parseNumber(document.getElementById('sonCorpBeforeTaxIncome_1').value || '0'); // �꾨뱾踰뺤씤�몄쟾�댁씡
  const sonCorpNetIncome = Math.round(parseNumber(document.getElementById('sonCorpNetIncome_1').textContent || '0'));
  let td3_prev = parseNumber(document.getElementById('td_3_current').textContent || '0');
  let td6_prev = parseNumber(document.getElementById('td_6_current').textContent || '0');
  let td9_prev = parseNumber(document.getElementById('td_9_current').textContent || '50'); // 珥덇린媛믪� "50" 怨좎젙

  const empty_2 = 0; // td_2 媛믪� 怨듬� (�섏젙 媛��ν븯�꾨줉 蹂��섎줈)

  for (let year = 1; year <= 20; year++) {
    const id = (y) => `td_${y}_${year}year`;

    const td1 = subCorpNetIncome;
    const td2 = empty_2;
    const td3 = td3_prev + td1 + td2;
    const td4 = td1;
    const td5 = -subCorpDividend;
    const td6 = td6_prev + td4 + td5;
    const td7 = sonCorpBeforeTaxIncome;
	const td8_raw = sonCorpNetIncome;
	const td8 = Math.round(td8_raw / 1000000) * 1000000;
    const td9 = td9_prev + td7 + td8;

    // DOM 諛섏쁺
    document.getElementById(id(1)).textContent = td1.toLocaleString();
    document.getElementById(id(2)).textContent = td2.toLocaleString();
    document.getElementById(id(3)).textContent = td3.toLocaleString();
    document.getElementById(id(4)).textContent = td4.toLocaleString();
    document.getElementById(id(5)).textContent = td5.toLocaleString();
    document.getElementById(id(6)).textContent = td6.toLocaleString();
    document.getElementById(id(7)).textContent = td7.toLocaleString();
    document.getElementById(id(8)).textContent = td8.toLocaleString();
    document.getElementById(id(9)).textContent = td9.toLocaleString();

    // �ㅼ쓬 �뚯감 �꾩쟻媛� �낅뜲�댄듃
    td3_prev = td3;
    td6_prev = td6;
    td9_prev = td9;
  }
}