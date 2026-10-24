// apps/web/src/components/RoadmapScreen.tsx
import Header from "./Header";

export default function RoadmapScreen() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <a href="/" className="hover:text-gray-800">Home</a> /
          <a href="#" className="hover:text-gray-800">[Instrument]</a> /
          <span className="text-gray-800 font-medium">[Roadmap name]</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-200 via-purple-200 to-blue-200 flex-shrink-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          </div>

          {/* Content */}
          <div className="flex-1 w-full">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">[Level]</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">[n] steps</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">About [n] weeks</span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              [Instrument]:<br />[Roadmap name]
            </h1>
            <p className="text-gray-500 mb-6 text-sm max-w-xl">
              [One or two sentences on what this roadmap covers and who it's for.]
            </p>

            {/* Progress Bar */}
            <div className="flex items-center gap-4 max-w-lg">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-pink-500 w-[35%] rounded-full"></div>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">[x] of [n] done</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <button className="bg-[#C2185B] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#ad1457] transition shadow-md w-full">
              Continue roadmap
            </button>
            <button className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-full border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center gap-2 w-full">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              Save to Favorites
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: The Steps */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 mb-6">
              The Steps
            </h2>
            <div className="space-y-4">

              {/* Step 1 - Completed */}
              <div className="bg-white p-5 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-500 font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm"><span className="text-gray-400 mr-2">1·</span>[Step title]</h3>
                  <p className="text-gray-400 text-xs mt-1">[Short description of the step]</p>
                </div>
                <span className="text-xs text-gray-400">[n] resources</span>
              </div>

              {/* Step 2 - Completed */}
              <div className="bg-white p-5 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-500 font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm"><span className="text-gray-400 mr-2">2·</span>[Step title]</h3>
                  <p className="text-gray-400 text-xs mt-1">[Short description of the step]</p>
                </div>
                <span className="text-xs text-gray-400">[n] resources</span>
              </div>

              {/* Step 3 - Current */}
              <div className="bg-white p-5 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#C2185B] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">[Step title]</h3>
                  <p className="text-gray-400 text-xs mt-1">[Short description of the step]</p>
                </div>
                <span className="px-3 py-1 bg-[#C2185B] text-white text-xs font-bold rounded-full">You're here</span>
              </div>

              {/* Steps 4-6 - Future */}
              {[4, 5, 6].map((num) => (
                <div key={num} className="bg-gray-50/50 p-5 rounded-2xl flex items-center gap-5 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-400 font-bold text-sm">
                    {num}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">[Step title]</h3>
                    <p className="text-gray-400 text-xs mt-1">[Short description of the step]</p>
                  </div>
                  <span className="text-xs text-gray-400">[n] resources</span>
                </div>
              ))}

            </div>
          </div>

          {/* Right Column: About */}
          <div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-6">
              About
            </h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What you'll learn</h3>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• [Skill or outcome]</li>
                <li>• [Skill or outcome]</li>
                <li>• [Skill or outcome]</li>
              </ul>

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What you'll need</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• [Equipment or prior skill]</li>
                <li>• [Equipment or prior skill]</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">When you finish</h3>
              <a href="#" className="font-bold text-gray-800 hover:text-[#C2185B] flex items-center gap-2">
                [Next roadmap name] <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}