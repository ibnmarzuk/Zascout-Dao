import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./lib/ThemeContext";
import Layout from "./components/Layout";
import Onboarding from "./components/Onboarding";

const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Explorer = lazy(() => import("./pages/Explorer"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Intelligence = lazy(() => import("./pages/Intelligence"));
const SavedItems = lazy(() => import("./pages/SavedItems"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-screen bg-app-bg text-brand-blue">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-t-brand-blue border-brand-blue/20 rounded-full animate-spin" />
      <div className="text-sm font-mono font-bold uppercase tracking-widest">Loading...</div>
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Onboarding />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/bounties" element={<Explorer type="bounty" />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/intelligence" element={<Intelligence />} />
              <Route path="/saved" element={<SavedItems />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
