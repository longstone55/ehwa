import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ClientRenderer from './ClientRenderer';

export default async function ProCalculatorPage(props: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const type = searchParams.type;

  // 1. Special Handling for 801-1 (Professional Calculator)
  if (id === '801-1') {
    return (
      <div className="min-h-screen bg-[#f9fafb]">
        <ClientRenderer 
          title="개인사업자 소득구성과 조세효과"
          description="사업소득과 임대소득의 조합에 따른 세금 및 준조세 부담률을 케이스별로 비교해 보세요."
          html="" 
          scriptUrls={[]} 
          inlineScripts={[]}
          inlineStyles={[]}
          id={id}
          isContentOnly={type === 'content'}
          useReactCalculator={true}
        />
      </div>
    );
  }

  if (id === '804-2') {
    return (
      <div className="min-h-screen bg-[#f9fafb]">
        <ClientRenderer
          title="상가·빌딩 매각 세부담 비교 분석"
          description="감정평가액과 매매사례가액 시나리오별 양도소득세, 취득세, 등록면허세 부담을 비교합니다."
          html=""
          scriptUrls={[]}
          inlineScripts={[]}
          inlineStyles={[]}
          id={id}
          isContentOnly={type === 'content'}
          useReactCalculator={true}
          reactCalculatorId="804-2"
        />
      </div>
    );
  }

  const rootDir = process.cwd();
  const filePath = path.join(rootDir, 'sub', `sub-${id}.html`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const htmlContent = fs.readFileSync(filePath, 'utf-8');

  // 1. Metadata Extraction (Title, Subtitle)
  const titleMatch = htmlContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const descMatch = htmlContent.match(/<p[^>]*class="[^"]*text-base[^"]*"[^>]*>([\s\S]*?)<\/p>/);
  
  const title = titleMatch ? titleMatch[1].replace(/<br\s*\/?>/gi, ' ').trim() : '심화 세무 시뮬레이션';
  const description = descMatch ? descMatch[1].replace(/<br\s*\/?>/gi, ' ').trim() : '세무법인 이화의 정밀 로직을 통해 최적의 절세 방안을 확인해 보세요.';

  // 2. Clean HTML (Remove Hero, Nav, Footer, and CMS tags)
  const cleanHtml = htmlContent
    .replace(/<!--@layout[\s\S]*?-->/g, '')
    .replace(/<!--@import[\s\S]*?-->/g, '')
    // Remove Hero Sections (Multiple variations)
    .replace(/<section[^>]*class="[^"]*Hero Section[^"]*"[\s\S]*?<\/section>/gi, '')
    .replace(/<section[^>]*class="[^"]*pt-20 pb-16[^"]*"[\s\S]*?<\/section>/gi, '')
    .replace(/<section[^>]*class="[^"]*pt-16 pb-12[^"]*"[\s\S]*?<\/section>/gi, '');

  // 3. Extract Script & Style
  const styleMatches = Array.from(cleanHtml.matchAll(/<style>([\s\S]*?)<\/style>/g));
  const inlineStyles = styleMatches.map(m => m[1]);
  const scriptMatches = Array.from(cleanHtml.matchAll(/<script src="([\s\S]*?)"><\/script>/g));
  const scriptUrls = scriptMatches.map(m => m[1]);
  const inlineScriptMatches = Array.from(cleanHtml.matchAll(/<script>([\s\S]*?)<\/script>/g));
  const inlineScripts = inlineScriptMatches.map(m => m[1]);

  // 4. Content Area Extraction (Extract everything inside calculator-wrap or the whole body)
  const wrapMatch = cleanHtml.match(/<div id="calculator-wrap"[^>]*>([\s\S]*)<\/div>\s*(?:<script|$)/i);
  const displayHtml = wrapMatch ? wrapMatch[1] : cleanHtml;

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <ClientRenderer 
        title={title}
        description={description}
        html={displayHtml} 
        scriptUrls={scriptUrls} 
        inlineScripts={inlineScripts}
        inlineStyles={inlineStyles}
        id={id}
        isContentOnly={type === 'content'}
      />
    </div>
  );
}
