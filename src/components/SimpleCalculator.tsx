'use client';

import { useState } from 'react';
import { Calculator, RefreshCcw, ArrowRight } from 'lucide-react';

export default function SimpleCalculator() {
  const [salePrice, setSalePrice] = useState<string>('');
  const [acquisitionPrice, setAcquisitionPrice] = useState<string>('');
  const [period, setPeriod] = useState<number>(2);
  const [result, setResult] = useState<number | null>(null);

  const calculateTax = () => {
    const sale = parseInt(salePrice) || 0;
    const acq = parseInt(acquisitionPrice) || 0;
    const gain = sale - acq;
    
    if (gain <= 0) {
      setResult(0);
      return;
    }

    // 매우 간소화된 양도세 로직 (기본공제 및 대략적 세율 적용)
    let tax = gain * 0.2; // 단순 가상 세율 20%
    if (period < 2) tax = gain * 0.5; // 2년 미만 50%
    
    setResult(Math.floor(tax));
  };

  const formatNumber = (num: number) => num.toLocaleString() + '원';

  return (
    <div className="w-full max-w-xl mx-auto p-8 bg-white rounded-[40px] shadow-2xl border border-gray-50">
      <div className="flex items-center gap-3 mb-10 text-primary font-black text-2xl">
        <Calculator className="w-8 h-8" />
        간편 양도세 계산기
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-[#4e5968] mb-3">양도가액 (판 금액)</label>
          <input 
            type="number" 
            placeholder="예: 1000000000 (10억)"
            className="w-full px-6 py-4 bg-[#f2f4f6] rounded-2xl border-none focus:ring-2 focus:ring-primary text-lg font-bold outline-none transition-all"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#4e5968] mb-3">취득가액 (산 금액)</label>
          <input 
            type="number" 
            placeholder="예: 600000000 (6억)"
            className="w-full px-6 py-4 bg-[#f2f4f6] rounded-2xl border-none focus:ring-2 focus:ring-primary text-lg font-bold outline-none transition-all"
            value={acquisitionPrice}
            onChange={(e) => setAcquisitionPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#4e5968] mb-3">보유 기간</label>
          <select 
            className="w-full px-6 py-4 bg-[#f2f4f6] rounded-2xl border-none focus:ring-2 focus:ring-primary text-lg font-bold outline-none appearance-none"
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
          >
            <option value={1}>1년 미만</option>
            <option value={2}>2년 이상</option>
          </select>
        </div>

        <button 
          onClick={calculateTax}
          className="w-full py-5 bg-primary text-white rounded-2xl text-xl font-black hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
        >
          계산하기 <ArrowRight className="w-6 h-6" />
        </button>

        {result !== null && (
          <div className="mt-10 p-8 bg-blue-50 rounded-[30px] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-sm font-bold text-primary/70 mb-2 uppercase tracking-widest">Expected Tax Amount</div>
            <div className="text-4xl font-black text-primary mb-4">
              {formatNumber(result)}
            </div>
            <p className="text-xs text-[#4e5968] leading-relaxed">
              * 위 결과는 대략적인 참고용이며, 정확한 세금은 전문가와 상담하시기 바랍니다.
            </p>
            <button 
              onClick={() => { setResult(null); setSalePrice(''); setAcquisitionPrice(''); }}
              className="mt-6 flex items-center gap-2 text-primary font-bold text-sm hover:underline"
            >
              <RefreshCcw className="w-4 h-4" /> 다시 계산하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
