import { ArrowRight, Users, ClipboardCopy, Award, Brain, Compass, Target, LineChart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-[90vh] bg-[#050814] text-white overflow-hidden">
      {/* Dynamic Grid Background with Glowing Accents */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/4 right-1/4 size-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 size-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-16 lg:grid-cols-12 items-center">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <span className="mb-6 w-fit rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold text-cyan-400 tracking-wider uppercase backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              ✨ AI-Powered Career Development
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Build a Smarter
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                Career
              </span>{" "}
              with AI
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-400">
              Get personalized career analysis, skill gap insights,
              and a tailored learning roadmap to achieve your dream career. Let artificial intelligence map your professional growth.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur px-8 py-4 font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-white transition-all duration-300 transform hover:scale-[1.02]"
              >
                Learn More
              </Link>
            </div>

            {/* Bottom Row Counters */}
            <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-wrap gap-8 sm:gap-12 text-left">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">10K+</h3>
                  <p className="text-xs text-slate-400 font-medium">Active Users</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-11 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ClipboardCopy size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">50K+</h3>
                  <p className="text-xs text-slate-400 font-medium">Analyses Run</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">95%</h3>
                  <p className="text-xs text-slate-400 font-medium">Success Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Mockup Widget Grid) */}
          <div className="lg:col-span-5 flex items-center justify-center gap-4 w-full">
            <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-[#0d1321]/90 p-6 shadow-2xl backdrop-blur-xl relative">
              <div className="absolute -top-3 -right-3 size-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 blur-md" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <h3 className="text-md font-bold text-white tracking-wide">
                  Career Readiness Analysis
                </h3>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Circular SVG Gauge */}
              <div className="flex flex-col items-center py-4">
                <div className="relative size-32 flex items-center justify-center">
                  <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-cyan-500 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset="70.3" // 72%
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold text-white">72%</span>
                    <p className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider mt-0.5">Readiness</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-emerald-400">
                  Good Progress
                </p>
              </div>

              {/* Skill Gaps List */}
              <div className="mt-6 space-y-4 pt-5 border-t border-slate-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-left mb-3">
                  Identified Skill Gaps
                </h4>

                <div>
                  <div className="mb-1.5 flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Machine Learning</span>
                    <span className="text-purple-400">Advanced</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 shadow-[0_0_8px_rgba(147,51,234,0.5)]" />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">System Design</span>
                    <span className="text-indigo-400">Intermediate</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Cloud Computing</span>
                    <span className="text-cyan-400">Beginner</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                    <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Interactive Buttons column */}
            <div className="flex flex-col gap-4">
              <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/30 hover:bg-slate-800/50 transition cursor-pointer shadow-lg group">
                <Brain size={20} className="group-hover:scale-110 transition" />
              </div>
              <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 hover:text-purple-300 hover:border-purple-500/30 hover:bg-slate-800/50 transition cursor-pointer shadow-lg group">
                <LineChart size={20} className="group-hover:scale-110 transition" />
              </div>
              <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-slate-800/50 transition cursor-pointer shadow-lg group">
                <Target size={20} className="group-hover:scale-110 transition" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row - Key Core Features */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-slate-800/60 bg-slate-950/40 backdrop-blur relative z-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 text-left">
          
          <div className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/20 hover:border-cyan-500/30 hover:bg-slate-900/40 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500 group-hover:text-slate-950 transition duration-300">
              <Brain size={20} />
            </div>
            <h4 className="font-bold text-sm text-white">AI-Powered Analysis</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Get intelligent insights about your target career path.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/20 hover:border-indigo-500/30 hover:bg-slate-900/40 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500 group-hover:text-slate-950 transition duration-300">
              <Compass size={20} />
            </div>
            <h4 className="font-bold text-sm text-white">Personalized Roadmap</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Tailored learning path specifically built just for you.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/20 hover:border-purple-500/30 hover:bg-slate-900/40 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-slate-950 transition duration-300">
              <Target size={20} />
            </div>
            <h4 className="font-bold text-sm text-white">Skill Gap Detection</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Identify and systematically close critical technical skill gaps.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/20 hover:border-teal-500/30 hover:bg-slate-900/40 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 group-hover:bg-teal-500 group-hover:text-slate-950 transition duration-300">
              <LineChart size={20} />
            </div>
            <h4 className="font-bold text-sm text-white">Track Progress</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Monitor your milestones, score changes, and learning milestones.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800/60 bg-slate-900/20 hover:border-emerald-500/30 hover:bg-slate-900/40 transition-all duration-300 group">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition duration-300">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-sm text-white">Career Readiness</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Real-time score assessment to track your market-readiness.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}