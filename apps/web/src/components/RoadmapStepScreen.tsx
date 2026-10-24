// apps/web/src/components/RoadmapStepScreen.tsx
import Header from "./Header";

export default function RoadmapStepScreen() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumbs & Back Link */}
        <div className="flex justify-between items-center mb-6">
          <nav className="text-sm text-gray-500 flex gap-2">
            <a href="/" className="hover:text-gray-800">Home</a> /
            <a href="#" className="hover:text-gray-800">[Instrument]</a> /
            <a href="/roadmap" className="hover:text-gray-800">[Roadmap name]</a> /
            <span className="text-gray-800 font-medium">Step [n]</span>
          </nav>
          <a href="/roadmap" className="text-sm font-bold text-[#C2185B] hover:underline">
            ← Back to roadmap
          </a>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-800 via-amber-900 to-amber-700 rounded-3xl p-8 text-white shadow-lg mb-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-4">
                [Roadmap name] · Step [n] of [n]
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                [Step title]
              </h1>
              <p className="text-gray-200 text-sm md:text-base mb-6">
                Goal: [What you'll be able to do after this step]
              </p>

              {/* Segmented Progress Bar */}
              <div className="flex gap-2 w-full max-w-md">
                <div className="h-2 flex-1 bg-pink-400 rounded-full"></div>
                <div className="h-2 flex-1 bg-amber-400 rounded-full"></div>
                <div className="h-2 flex-1 bg-amber-400 rounded-full"></div>
                <div className="h-2 flex-1 bg-white/20 rounded-full"></div>
                <div className="h-2 flex-1 bg-white/20 rounded-full"></div>
                <div className="h-2 flex-1 bg-white/20 rounded-full"></div>
                <div className="h-2 flex-1 bg-white/20 rounded-full"></div>
              </div>
            </div>

            <button className="bg-white text-gray-800 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition shadow-md flex items-center gap-2 whitespace-nowrap">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              Mark step complete
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column: Resources */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 mb-2">
              Resources for This Step
            </h2>
            <p className="text-gray-500 text-sm mb-6">Work through them in order, or pick the format you like best.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Resource 1: Video */}
              <div className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
                <div className="w-16 h-16 rounded-xl bg-pink-500 flex items-center justify-center flex-shrink-0 text-white">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold bg-pink-100 text-pink-600 px-2 py-1 rounded-full uppercase tracking-wider">Video</span>
                  <h3 className="font-bold text-gray-800 text-sm mt-1">[Resource title]</h3>
                  <p className="text-xs text-gray-400 mt-1">[Source] · [Length]</p>
                </div>
              </div>

              {/* Resource 2: Article */}
              <div className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
                <div className="w-16 h-16 rounded-xl bg-blue-400 flex items-center justify-center flex-shrink-0 text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase tracking-wider">Article</span>
                  <h3 className="font-bold text-gray-800 text-sm mt-1">[Resource title]</h3>
                  <p className="text-xs text-gray-400 mt-1">[Source] · [Read time]</p>
                </div>
              </div>

              {/* Resource 3: Tabs */}
              <div className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
                <div className="w-16 h-16 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0 text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-1 rounded-full uppercase tracking-wider">Tabs / Sheet music</span>
                  <h3 className="font-bold text-gray-800 text-sm mt-1">[Resource title]</h3>
                  <p className="text-xs text-gray-400 mt-1">[Source] · [Details]</p>
                </div>
              </div>

              {/* Resource 4: Practice */}
              <div className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
                <div className="w-16 h-16 rounded-xl bg-teal-400 flex items-center justify-center flex-shrink-0 text-white">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-600 px-2 py-1 rounded-full uppercase tracking-wider">Practice</span>
                  <h3 className="font-bold text-gray-800 text-sm mt-1">[Resource title]</h3>
                  <p className="text-xs text-gray-400 mt-1">[Source] · [Length]</p>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-6">
              <a href="#" className="bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition flex flex-col">
                <span className="text-xs text-gray-500 mb-1">← Previous step</span>
                <span className="font-bold text-gray-800 text-sm">[Step title]</span>
              </a>
              <a href="#" className="bg-[#C2185B] text-white px-6 py-3 rounded-xl shadow-md hover:bg-[#ad1457] transition flex flex-col items-end">
                <span className="text-xs text-pink-200 mb-1">Next step →</span>
                <span className="font-bold text-sm">[Step title]</span>
              </a>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-4">

            {/* Practice Tip */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Practice Tip</h3>
              <p className="text-sm text-gray-700">
                [A short tip for practicing this step, such as how long and how often.]
              </p>
            </div>

            {/* Metronome */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Practice with the metronome</h3>
                <p className="text-xs text-gray-500 mt-1">Suggested tempo: [n] BPM</p>
              </div>
            </div>

            {/* Checkpoints */}
            <div className="px-2 pt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">You're ready to move on when</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">• [Checkpoint]</li>
                <li className="flex items-start gap-2">• [Checkpoint]</li>
              </ul>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}