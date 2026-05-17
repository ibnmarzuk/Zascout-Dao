import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-bg text-neutral-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col min-h-screen relative lg:ml-64">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        <div className="p-4 md:p-8 flex-1 w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
