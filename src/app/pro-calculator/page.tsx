'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Building2, 
  Landmark, 
  Home, 
  Users, 
  Briefcase,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  {
    id: '801',
    title: '소득 및 조세 시뮬레이션',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    items: [
      { id: '801-1', title: '사업/임대소득 상세 비교' },
      { id: '801-2', title: '법인 대표 소득 구성 비교' },
      { id: '801-3', title: '최적 소득 포트폴리오 분석' },
    ]
  },
  {
    id: '802',
    title: '법인 거래 및 배당 전략',
    icon: <Building2 className="w-6 h-6" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    items: [
      { id: '802-1', title: '법인 간 거래 리스크 진단' },
      { id: '802-2', title: '차등배당 세후 실익 분석' },
      { id: '802-3', title: '특정법인 증여 세무 진단' },
    ]
  },
  {
    id: '803',
    title: '토지 사용 및 과세 구조',
    icon: <Landmark className="w-6 h-6" />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    items: [
      { id: '803-1', title: '토지 무상사용 리스크 분석' },
      { id: '803-2', title: '증여 후 법인세 과세 분석' },
      { id: '803-3', title: '배당소득 이중과세 최적화' },
    ]
  },
  {
    id: '804',
    title: '부동산 매각 및 취득',
    icon: <Home className="w-6 h-6" />,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    items: [
      { id: '804-1', title: '법인 부동산 증여 분석' },
      { id: '804-2', title: '상가·빌딩 매각 세부담 비교' },
      { id: '804-3', title: '주택 취득세 스마트 계산기' },
    ]
  },
  {
    id: '805',
    title: '상속·증여 및 주식 이동',
    icon: <Users className="w-6 h-6" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    items: [
      { id: '805-1', title: '상속세 미래 예측 시뮬레이션' },
      { id: '805-2', title: '증여세 다중 수증자 통합 분석' },
      { id: '805-3', title: '비상장주식 양도세 시뮬레이션' },
      { id: '805-4', title: '주식 이동 전 리스크 체크' },
    ]
  },
  {
    id: '806',
    title: '가업 승계 및 자산 평가',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    items: [
      { id: '806-1', title: '자녀법인 가업 승계 로드맵' },
      { id: '806-2', title: '승계 후 법인세 구조 분석' },
      { id: '806-3', title: '배당소득 이중과세 정밀 분석' },
      { id: '806-4', title: '상증법 보충적 평가 시뮬레이션' },
    ]
  }
];

export default function ProCalculatorHub() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1f27]">
      <main className="pt-32 pb-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-16 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold text-primary bg-primary/5 rounded-full uppercase tracking-wider">
                <Calculator className="w-4 h-4" /> Professional Calculators
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight">
                택스사콤 <br className="md:hidden" /> 전문 세금 계산기
              </h1>
              <p className="text-lg md:text-xl text-[#4e5968] font-medium leading-relaxed">
                세무법인 이화의 노하우가 집약된 20여 종의 정밀 시뮬레이션 도구입니다.<br className="hidden md:block" />
                복잡한 세무 리스크를 수치로 확인하고 최적의 전략을 도출해 보세요.
              </p>
            </motion.div>
          </header>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
              >
                <div className={`w-14 h-14 ${category.bg} ${category.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-black mb-6 text-[#1a1f27]">{category.title}</h3>
                
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <Link 
                      key={item.id} 
                      href={`/pro-calculator/${item.id}`}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#f9fafb] hover:bg-white hover:ring-2 hover:ring-primary/20 transition-all group/item"
                    >
                      <span className="text-[15px] font-bold text-[#4e5968] group-hover/item:text-primary transition-colors">
                        {item.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-primary transition-all group-hover/item:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-24 p-12 bg-primary rounded-[50px] text-white text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-6">원하는 계산 결과가 나오지 않나요?</h2>
              <p className="text-white/80 text-lg mb-10 font-medium">국세청 출신 전문가 그룹이 직접 복잡한 세무 케이스를 분석해 드립니다.</p>
              <Link href="/#contact" className="inline-flex items-center gap-2 bg-white text-primary px-10 py-5 rounded-2xl text-xl font-black hover:scale-[1.05] transition-all shadow-2xl">
                전문가 1:1 상담 신청하기 <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-dark/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
