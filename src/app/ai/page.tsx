export default function AiServicePage() {
  return (
    <div className="pt-[80px] min-h-screen bg-[#F9FAFB]">
      <div className="w-full h-[calc(100vh-80px)]">
        <iframe
          src="https://ai.ehwatax.com/"
          className="w-full h-full border-0"
          title="Ehwa Tax AI Service"
          allow="microphone; camera; clipboard-read; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
