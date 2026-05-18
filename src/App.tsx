import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./lib/ThemeContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Explorer from "./pages/Explorer";
import Analytics from "./pages/Analytics";
import Intelligence from "./pages/Intelligence";
import SavedItems from "./pages/SavedItems";
import Onboarding from "./components/Onboarding";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Onboarding />
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
      </BrowserRouter>
    </ThemeProvider>
  );
}
