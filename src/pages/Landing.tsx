import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Shield, BarChart3, Users, Zap, ArrowRight, Github, Twitter, Search, Compass } from "lucide-react";
import { motion } from "motion/react";

import { LogoIcon } from "../components/Header";
import banner from "../assets/images/zascout_banner_1779052799939.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-bg text-neutral-300 overflow-hidden font-sans">
      {/* Navigation */}
      <nav className="h-20 border-b border-neutral-800 flex items-center justify-between px-6 md:px-12 relative z-50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded overflow-hidden">
            <LogoIcon className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white uppercase italic">ZA Scout</span>
        </div>
        <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-neutral-500">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/dashboard" className="text-xs md:text-sm font-medium text-neutral-400 hover:text-white px-2 md:px-4 py-2">Sign In</Link>
          <Link 
            to="/dashboard" 
            className="bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-semibold hover:opacity-90 transition-all transform hover:scale-105"
          >
            Start Exploring
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-24 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] md:text-xs font-semibold mb-8"
        >
          <Sparkles className="w-3 h-3" />
          AI-POWERED DAO INTELLIGENCE
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1] md:leading-[0.9]"
        >
          NAVIGATE DAO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">OPPORTUNITIES</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-sm md:text-lg text-neutral-500 mb-12 px-4"
        >
          ZA Scout helps contributors discover grants, bounties, and governance opportunities using AI-powered DAO intelligence. Aggregated signals from across the ecosystem.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <Link 
            to="/dashboard" 
            className="h-14 px-8 bg-brand-blue rounded-md flex items-center justify-center gap-2 font-bold text-white hover:bg-brand-blue/90 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]"
          >
            Start Exploring <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            to="/explorer" 
            className="h-14 px-8 bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center font-bold text-white hover:bg-neutral-800 transition-all"
          >
            View Live Ops
          </Link>
        </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
            <img src={banner} alt="" className="w-full h-full object-cover blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/80 via-brand-bg/40 to-brand-bg" />
          </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 md:px-12 py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Powerful Discovery</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Scout leverages advanced indexers and AI to surface the highest quality signals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Search} 
              title="Semantic Discovery" 
              description="Find opportunities using natural language. Ask Scout to 'Find DeFi grants'."
            />
            <FeatureCard 
              icon={Shield} 
              title="Reputation Scores" 
              description="Understand contributor signals and DAO trustworthiness at a glance."
            />
            <FeatureCard 
              icon={Zap} 
              title="Real-time Feed" 
              description="Live aggregation of grants, bounties, and governance proposals across DAOs."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 md:px-12 py-24 bg-white/5 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase tracking-widest">
              Our Philosophy
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              A New Generation of <br /> Contributor Intelligence.
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              ZA Scout was born from the need to organize the chaotic landscape of DAO contributions. We believe that contributor reputation shouldn't be siloed, and finding opportunities shouldn't require monitoring 50 Discord servers.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <div className="text-brand-blue font-bold text-2xl mb-1">99%</div>
                <div className="text-neutral-500 text-xs uppercase font-bold tracking-widest text-nowrap">Filter Accuracy</div>
              </div>
              <div>
                <div className="text-brand-purple font-bold text-2xl mb-1">2k+</div>
                <div className="text-neutral-500 text-xs uppercase font-bold tracking-widest text-nowrap">DAOs Indexed</div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-brand-blue/20 blur-[100px] -z-10" />
            <div className="aspect-square bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex items-center justify-center overflow-hidden">
               <div className="grid grid-cols-2 gap-4 w-full">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="px-6 md:px-12 py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Connected Ecosystem</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto mb-16 text-lg">
            We pull data from the most trusted sources in the ecosystem to ensure you have a complete picture of the landscape.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "ZeroAuth", status: "Active" },
              { name: "Snapshot", status: "Active" },
              { name: "Gitcoin", status: "Active" },
              { name: "Tally", status: "Active" },
              { name: "Safe", status: "Active" },
              { name: "Arbitrum", status: "Active" },
              { name: "Optimism", status: "Active" },
              { name: "ENS", status: "Active" }
            ].map((partner) => (
              <div key={partner.name} className="relative h-24 md:h-32 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group hover:border-white/20 transition-all cursor-default overflow-hidden">
                <span className={`text-xl font-bold transition-opacity font-display italic ${partner.status === "Active" ? "opacity-80 text-white" : "opacity-30 text-white"}`}>{partner.name}</span>
                {partner.status === "Active" && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                    Live
                  </div>
                )}
                {partner.status === "Coming Soon" && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-[10px] font-bold">
                    Soon
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-8 md:p-12 rounded-[2rem] bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 blur-[80px] -z-10 group-hover:bg-white/20 transition-all duration-700" />
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-6">Ready to find your next mission?</h3>
            <Link 
              to="/dashboard" 
              className="inline-flex h-14 px-10 bg-white text-black rounded-full items-center font-bold hover:scale-105 transition-all shadow-xl shadow-white/10"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-12 py-12 border-t border-white/5 text-white/40 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-60">
            <Compass className="w-4 h-4" />
            <span className="font-display font-medium tracking-tight">ZA SCOUT © 2024</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://x.com/ZAScoutAI" className="hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-blue/30 transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-all">
        <Icon className="w-6 h-6 text-white group-hover:text-brand-blue transition-colors" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 leading-relaxed">{description}</p>
    </div>
  );
}
