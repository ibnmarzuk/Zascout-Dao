import React, { useState, useEffect } from "react";
import { X, Sparkles, Filter, Bookmark, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

const onboardingSteps = [
  {
    title: "Welcome to ZA Scout",
    description: "Your AI-powered companion for navigating the Zero Authority DAO ecosystem. Let's show you around.",
    icon: Sparkles,
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
  },
  {
    title: "AI-Powered Discovery",
    description: "Search using natural language. Scout will automatically refine your filters and suggest the best opportunities.",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Advanced Filtering",
    description: "Filter by reward range, status, or specific DAO ecosystems to find exactly where you can contribute.",
    icon: Filter,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Track Your Journey",
    description: "Save interesting opportunities and monitor your activity score as you grow in the ecosystem.",
    icon: Bookmark,
    color: "text-brand-purple",
    bgColor: "bg-brand-purple/10",
  }
];

export default function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleTrigger = () => {
      setCurrentStep(0);
      setIsOpen(true);
    };

    window.addEventListener("trigger-onboarding", handleTrigger);

    const hasOnboarded = localStorage.getItem("zascout_onboarded");
    if (!hasOnboarded) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => {
        window.removeEventListener("trigger-onboarding", handleTrigger);
        clearTimeout(timer);
      };
    }

    return () => window.removeEventListener("trigger-onboarding", handleTrigger);
  }, []);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    setIsOpen(false);
    localStorage.setItem("zascout_onboarded", "true");
  };

  const step = onboardingSteps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-charcoal/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-md bg-card-bg border border-border-main rounded-[2.5rem] shadow-2xl p-6 md:p-8 text-center overflow-hidden mx-2"
          >
            {/* Background Accent */}
            <div className={cn("absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] -z-10 transition-colors duration-500", step.bgColor)} />
            
            <button 
              onClick={completeOnboarding}
              className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-text-main transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 md:mb-8 flex justify-center">
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className={cn("w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-lg transition-colors duration-500", step.bgColor)}
              >
                <step.icon className={cn("w-8 h-8 md:w-10 md:h-10 transition-colors duration-500", step.color)} />
              </motion.div>
            </div>

            <div className="space-y-4 mb-10">
              <motion.h3 
                key={`title-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-text-main font-display"
              >
                {step.title}
              </motion.h3>
              <motion.p 
                key={`desc-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-neutral-500 leading-relaxed text-sm"
              >
                {step.description}
              </motion.p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={nextStep}
                className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-blue/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {currentStep === onboardingSteps.length - 1 ? "Start Exploring" : "Next Step"}
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <div className="flex justify-center gap-2">
                {onboardingSteps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === currentStep ? "w-8 bg-brand-blue" : "w-1.5 bg-neutral-800"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
