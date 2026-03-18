'use client';

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { 
  ClipboardList, Map, Bot, Calculator, ArrowRight, 
  UserCheck, Search, AlertCircle, 
  FileText, Cpu, CheckCircle2, BarChart3, ChevronRight,
  TrendingDown, Users, Award, Star, Quote
} from "lucide-react";

export default function Home() {
  const stats = [
    { label: "누적 절세액", value: "1,240억+", icon: <TrendingDown className="w-6 h-6 text-primary" /> },
    { label: "전문가 그룹", value: "45명", icon: <Users className="w-6 h-6 text-primary" /> },
    { label: "고객 만족도", value: "99.2%", icon: <Award className="w-6 h-6 text-primary" /> },
    { label: "상담 케이스", value: "12,000건+", icon: <ClipboardList className="w-6 h-6 text-primary" /> },
  ];

  const reviews = [
    { name: "김*호 대표 (IT 제조사)", text: "복잡한 법인 전환 과정에서 리스크를 미리 파악해주신 덕분에 세무조사 걱정 없이 성장하고 있습니다. 역시 국세청 출신 전문가의 디테일은 다릅니다.", rating: 5 },
    { name: "최*영 님 (상속 증여 설계)", text: "세대 간 부의 이전을 고민하던 중 이창기 박사님의 세미나를 듣고 명쾌한 해답을 찾았습니다. 자산 가치를 지키는 가장 현명한 방법인 것 같아요.", rating: 5 },
    { name: "이*진 님 (자산 관리 서비스)", text: "간편 계산기로 대략적인 금액을 확인하고 바로 상담받았는데, 실제 절세 효과는 그 이상이었습니다. 택스사콤 서비스는 정말 혁신적이네요.", rating: 5 },
  ];

  const accountants = [
    { name: "이창기 박사", title: "회장 / 세무학 박사", career: "전) 국세청 33년 근무", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" },
    { name: "김철수 세무사", title: "대표 세무사", career: "전) 강남세무서 조사관", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop" },
    { name: "이영희 세무사", title: "파트너 세무사", career: "상속/증여 전문 상담", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" },
    { name: "박지민 세무사", title: "파트너 세무사", career: "법인세 / 국제조세 전문", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop" },
    { name: "최동현 세무사", title: "세무사", career: "조세불복 / 세무조사 대응", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" },
  ];

  const riskSteps = [
    { step: "1단계", title: "모의 세무조사 서비스", desc: "실제 세무조사 수준의 진단", icon: <Search className="w-6 h-6 text-blue-600" /> },
    { step: "2단계", title: "잠재적 리스크 식별", desc: "숨겨진 위험 요소 완벽 분석", icon: <AlertCircle className="w-6 h-6 text-red-500" /> },
    { step: "3단계", title: "문서/기록 철저 검토", desc: "세무 관련 증빙 서류 정밀 체크", icon: <FileText className="w-6 h-6 text-emerald-600" /> },
    { step: "4단계", title: "프로세스 종합 평가", desc: "세무 처리 시스템의 효율성 진단", icon: <Cpu className="w-6 h-6 text-purple-600" /> },
    { step: "5단계", title: "리스크 최소화 제안", desc: "맞춤형 절세 전략 및 대응 방안", icon: <CheckCircle2 className="w-6 h-6 text-primary" /> },
    { step: "6단계", title: "지속적 모니터링", desc: "변화하는 세법에 따른 사후 관리", icon: <BarChart3 className="w-6 h-6 text-orange-600" /> },
  ];

  const fadeInVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut"
      } 
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1f27]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-20 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <Image 
            src="https://images.unsplash.com/photo-1709880945165-d2208c6ad2ec?q=80&w=1740&auto=format&fit=crop" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-20"
            priority
           />
           <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white"></div>
        </div>

        <motion.div 
          className="relative z-10 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={fadeInVariant}
        >
          <div className="inline-block px-4 py-1.5 mb-8 text-sm font-bold tracking-wider text-primary bg-primary/5 rounded-full uppercase">
            The Standard of Tax Innovation
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1a1f27] md:text-8xl mb-8 leading-[1.1]">
            오늘의 자산을 <br className="hidden md:block" /> 내일의 가치로
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-[#4e5968] md:text-2xl leading-relaxed mb-12 font-medium">
            부(富)는 단순한 소유가 아니라 미래를 설계하는 종합적 가치입니다. <br className="hidden md:block" />
            체계적인 자산 관리와 세대 간 이전 전략으로 부의 흐름을 지키고, <br className="hidden md:block" />
            합리적인 절세로 지속 가능한 번영을 약속합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-2xl text-xl font-bold hover:scale-[1.05] transition-all shadow-2xl shadow-primary/30">
              상담 예약하기
            </button>
            <a href="#seminar" className="w-full sm:w-auto px-12 py-6 bg-white/80 backdrop-blur-sm text-[#4e5968] border border-gray-200 rounded-2xl text-xl font-bold hover:bg-gray-50 transition-all">
              세미나 안내
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-24 bg-white md:px-20 border-b border-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeInVariant}
              className="flex flex-col items-center text-center p-8 bg-[#f9fafb] rounded-[40px] hover:bg-white hover:shadow-xl transition-all duration-500 group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-3xl font-black text-[#1a1f27] mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-[#4e5968] uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seminar Section */}
      <section id="seminar" className="px-6 py-32 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeInVariant}
            className="bg-[#f9fafb] rounded-[50px] p-8 md:p-20 overflow-hidden relative"
          >
            <div className="max-w-3xl relative z-10 text-left">
              <span className="text-primary font-black text-sm mb-6 block tracking-widest uppercase">Seminar Info</span>
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                이창기 박사의 <br />
                <span className="text-primary">[부의 이전과 절세전략]</span> 세미나
              </h2>
              <p className="text-[#4e5968] text-lg md:text-xl mb-12 leading-loose font-medium">
                실제 사례를 통해 부의 이전과 절세 구조를 완벽하게 이해할 수 있는 <br className="hidden md:block" />
                맞춤형 해법을 제시합니다.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <UserCheck className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[#1a1f27]">33년 국세청 경력의 전문성</h4>
                    <p className="text-[#4e5968] text-sm leading-relaxed">이창기 박사/회장의 풍부한 실무 경험을 바탕으로 최적화된 방안 소개</p>
                  </div>
                </div>
                <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Bot className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[#1a1f27]">실제 사례 중심 맞춤 해법</h4>
                    <p className="text-[#4e5968] text-sm leading-relaxed">복잡한 절세 구조를 실제 케이스별로 분석하여 알기 쉽게 설명</p>
                  </div>
                </div>
              </div>
              
              <button className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl text-xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
                세미나 참여 신청하기 <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TAXSACOM 4대 핵심 서비스 */}
      <section id="services" className="px-6 py-32 md:px-20 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeInVariant}
            className="text-center mb-24"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight text-[#1a1f27]">
              세무법인 이화가 제안하는 <br className="hidden md:block" /> 택스사콤의 4대 핵심 서비스
            </h2>
            <div className="w-20 h-2 bg-primary mx-auto rounded-full"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 01. 택스사콤 서비스 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeInVariant}
              className="group relative p-12 bg-white rounded-[50px] border border-gray-50 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-2xl text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 text-[10rem] font-black text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">01</div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-5 text-[#1a1f27]">01. 택스사콤(Taxsacom) 서비스</h3>
                <p className="text-[#4e5968] leading-relaxed mb-10 text-lg md:text-xl font-medium">
                  세무법인 이화가 만든 택스사콤 서비스.<br />
                  더 스마트한 세무, 더 앞선 혁신, 오직 하나의 세무 서비스.
                </p>
                <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all group-hover:text-blue-700 text-lg">
                  자세히보기 <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>

            {/* 02. 택스사콤-MAP */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeInVariant}
              className="group relative p-12 bg-white rounded-[50px] border border-gray-50 hover:border-purple-500/20 transition-all duration-500 shadow-sm hover:shadow-2xl text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 text-[10rem] font-black text-purple-500/5 group-hover:text-purple-500/10 transition-colors pointer-events-none">02</div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <Map className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-5 text-[#1a1f27]">02. 택스사콤-MAP</h3>
                <p className="text-[#4e5968] leading-relaxed mb-10 text-lg md:text-xl font-medium">
                  세무법인 이화의 <br />
                  전국 부동산 시세조회 서비스.
                </p>
                <button className="flex items-center gap-2 text-purple-600 font-bold hover:gap-4 transition-all group-hover:text-purple-800 text-lg">
                  자세히보기 <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>

            {/* 03. 택스사콤-Ai */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeInVariant}
              className="group relative p-12 bg-white rounded-[50px] border border-gray-50 hover:border-emerald-500/20 transition-all duration-500 shadow-sm hover:shadow-2xl text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 text-[10rem] font-black text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors pointer-events-none">03</div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-5 text-[#1a1f27]">03. 택스사콤-Ai</h3>
                <p className="text-[#4e5968] leading-relaxed mb-10 text-lg md:text-xl font-medium">
                  세무법인 이화가 만든 Ai 검색서비스.<br />
                  AI 기반 세무 자동화, 예측 분석, 리스크 관리 시스템.
                </p>
                <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-4 transition-all group-hover:text-emerald-800 text-lg">
                  자세히보기 <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>

            {/* 04. 택스사콤-간편세금계산 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeInVariant}
              className="group relative p-12 bg-white rounded-[50px] border border-gray-50 hover:border-orange-500/20 transition-all duration-500 shadow-sm hover:shadow-2xl text-left overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 text-[10rem] font-black text-orange-500/5 group-hover:text-orange-500/10 transition-colors pointer-events-none">04</div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Calculator className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-5 text-[#1a1f27]">04. 택스사콤-간편세금계산</h3>
                <p className="text-[#4e5968] leading-relaxed mb-10 text-lg md:text-xl font-medium">
                  세무법인 이화가 만든 다양한 세금계산 프로그램.<br />
                  복잡한 세금 및 투자관련 지표를 간편하게 비교분석.
                </p>
                <Link href="/simple-calculator" className="flex items-center gap-2 text-orange-600 font-bold hover:gap-4 transition-all group-hover:text-orange-800 text-lg">
                  자세히보기 <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 리스크 전담 솔루션 Section */}
      <section className="px-6 py-32 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeInVariant}
            className="text-left mb-20 max-w-4xl"
          >
            <span className="text-primary font-black text-sm mb-6 block tracking-widest uppercase">Risk Dedicated Solution</span>
            <h2 className="text-3xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-[#1a1f27]">
              리스크 관리, <br /> 맞춤 세무 솔루션의 시작
            </h2>
            <p className="text-lg md:text-xl text-[#4e5968] leading-relaxed font-medium">
              고객 자산을 안전하게 지키고 리스크를 최소화하는 것을 핵심가치로 삼으며, <br className="hidden md:block" />
              맞춤 세무전략과 절세 설계, 위기 상황 대응까지 아우르는 종합 서비스를 제공합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskSteps.map((item, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                variants={fadeInVariant}
                className="group p-10 bg-[#f9fafb] rounded-[40px] border border-transparent hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-gray-50/50"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-sm font-black text-gray-300 group-hover:text-primary transition-colors">
                    {item.step}
                  </span>
                </div>
                <h4 className="text-xl font-black text-[#1a1f27] mb-3">{item.title}</h4>
                <p className="text-[#4e5968] text-sm leading-relaxed font-medium mb-8">
                  {item.desc}
                </p>
                <div className="w-10 h-1 bg-gray-200 group-hover:w-20 group-hover:bg-primary transition-all rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-32 bg-[#f9fafb] md:px-20 overflow-hidden relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeInVariant}
            className="text-center mb-24"
          >
            <span className="text-primary font-black text-sm mb-4 block tracking-widest uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#1a1f27]">이미 많은 분들이 <br className="md:hidden" /> 증명해주셨습니다</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {reviews.map((review, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                variants={fadeInVariant}
                className="bg-white p-12 rounded-[50px] shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col justify-between"
              >
                <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/5" />
                <div className="mb-10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-[#4e5968] text-lg font-medium leading-relaxed italic">&quot;{review.text}&quot;</p>
                </div>
                <div className="flex items-center gap-4 border-t border-gray-50 pt-8">
                  <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center font-bold text-primary">
                    {review.name.charAt(0)}
                  </div>
                  <span className="font-bold text-[#1a1f27] text-sm">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accountants Section (Added above YouTube) */}
      <section className="px-6 py-32 bg-[#f9fafb] md:px-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeInVariant}
            className="text-center mb-20"
          >
            <span className="text-primary font-black text-sm mb-4 block tracking-widest uppercase">Expert Group</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#1a1f27]">세무법인 이화의 전문가 그룹</h2>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-20 accountant-swiper"
          >
            {accountants.map((person, idx) => (
              <SwiperSlide key={idx}>
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.1 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      transition: { duration: 0.5, ease: "easeOut", delay: idx * 0.1 } 
                    }
                  }}

                  className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image 
                      src={person.image} 
                      alt={person.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <p className="text-white/80 text-sm font-bold mb-2">{person.career}</p>
                      <button className="w-full py-3 bg-white text-primary rounded-xl font-bold text-sm">상세 프로필 보기</button>
                    </div>
                  </div>
                  <div className="p-8 text-center">
                    <h4 className="text-2xl font-black text-[#1a1f27] mb-2">{person.name}</h4>
                    <p className="text-primary font-bold text-sm mb-4">{person.title}</p>
                    <div className="w-8 h-1 bg-gray-100 mx-auto rounded-full group-hover:w-16 group-hover:bg-primary transition-all"></div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="px-6 py-32 bg-white md:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={fadeInVariant}
            className="text-center mb-20"
          >
            <span className="text-primary font-black text-sm mb-4 block tracking-widest uppercase">YouTube Channel</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#1a1f27]">세무 전문가의 <br className="md:hidden" /> 명쾌한 세무 인사이트</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { id: "1", title: "2024년 개정세법 핵심 요약", desc: "반드시 알아야 할 절세 포인트 5가지", thumb: "https://images.unsplash.com/photo-1554224155-1110a7bc384d?q=80&w=1000&auto=format&fit=crop" },
              { id: "2", title: "상속 vs 증여, 당신의 선택은?", desc: "국세청 출신 전문가가 알려주는 최적의 자산 이전 전략", thumb: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop" },
              { id: "3", title: "법인 전환 전 꼭 확인하세요", desc: "성공적인 법인 운영을 위한 세무 리스크 관리 비법", thumb: "https://images.unsplash.com/photo-1664575196412-ed801e8333a1?q=80&w=1000&auto=format&fit=crop" },
            ].map((video, idx) => (
              <motion.div 
                key={video.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.5, ease: "easeOut", delay: idx * 0.1 } 
                  }
                }}

                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-[30px] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <Image 
                    src={video.thumb} 
                    alt={video.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ArrowRight className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
                    12:45
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#1a1f27] mb-3 group-hover:text-primary transition-colors line-clamp-1">{video.title}</h3>
                <p className="text-[#4e5968] text-sm font-medium leading-relaxed line-clamp-2">{video.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button className="px-10 py-5 bg-[#f9fafb] text-[#4e5968] rounded-2xl font-extrabold hover:bg-gray-100 transition-all inline-flex items-center gap-2">
              더 많은 영상 보러가기 <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="px-6 py-32 md:px-20 bg-primary text-white text-center">
        <h2 className="text-3xl md:text-6xl font-black mb-8 tracking-tight text-white leading-tight">Expertise in Every Detail.</h2>
        <p className="text-white/70 mb-12 text-xl max-w-3xl mx-auto leading-relaxed font-medium">최고의 전문가들이 제안하는 가장 명쾌한 세무 솔루션, 지금 상담 신청으로 직접 확인하세요.</p>
        <button className="px-12 py-6 bg-white text-primary rounded-2xl text-2xl font-bold hover:scale-[1.05] transition-all shadow-2xl">
          무료 상담 신청하기
        </button>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 md:px-20 border-t border-gray-100 text-[#4e5968] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-black text-[#1a1f27] mb-8">세무법인이화</div>
            <p className="mb-6 text-[15px] leading-loose font-medium text-[#4e5968]">
              세무법인이화 | 사업자등록번호: 000-00-00000<br />
              본사: 서울특별시 강남구 테헤란로 (전문가 빌딩 15층)<br />
              대표전화: 02-123-4567 | 팩스: 02-123-4568
            </p>
            <p className="text-xs text-gray-400">
              © 2024 TAXSACOM by EHWATAX Tax Corporation. All rights reserved.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-[#1a1f27] mb-8 text-[16px]">전문 서비스</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-primary cursor-pointer transition-colors">정기 세무 기장</li>
              <li className="hover:text-primary cursor-pointer transition-colors">상속 및 증여 플래닝</li>
              <li className="hover:text-primary cursor-pointer transition-colors">조세 불복 및 심판 청구</li>
              <li className="hover:text-primary cursor-pointer transition-colors">법인 설립 및 전환</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-[#1a1f27] mb-8 text-[16px]">퀵 링크</h5>
            <ul className="space-y-4 text-sm font-extrabold text-primary">
              <li className="hover:underline cursor-pointer"><Link href="/simple-calculator">간편 세금 계산기</Link></li>
              <li className="hover:underline cursor-pointer"><Link href="/calculator">전문 세금 계산기</Link></li>
              <li className="hover:underline cursor-pointer">세미나 신청</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
