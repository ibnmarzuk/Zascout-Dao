import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, Wallet } from "lucide-react";
import { cn } from "@/src/lib/utils";

const volumeData = [
  { name: "Jan", grants: 4000, bounties: 2400 },
  { name: "Feb", grants: 3000, bounties: 1398 },
  { name: "Mar", grants: 2000, bounties: 9800 },
  { name: "Apr", grants: 2780, bounties: 3908 },
  { name: "May", grants: 1890, bounties: 4800 },
  { name: "Jun", grants: 2390, bounties: 3800 },
];

const pieData = [
  { name: "DeFi", value: 400 },
  { name: "Infra", value: 300 },
  { name: "NFT", value: 300 },
  { name: "Social", value: 200 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#a855f7", "#6366f1"];

export default function Analytics() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-text-main leading-tight">Ecosystem Portfolio Analytics</h1>
          <p className="text-sm text-neutral-500">Aggregated live signals from 14 ecosystem APIs</p>
        </div>
        <div className="flex gap-2 rounded-lg bg-card-bg p-1 ring-1 ring-border-main w-full md:w-auto">
          <button className="flex-1 md:flex-none rounded px-3 py-1 text-xs font-medium text-brand-blue shadow-sm bg-nav-hover text-center">Live</button>
          <button className="flex-1 md:flex-none rounded px-3 py-1 text-xs font-medium text-neutral-500 hover:text-text-main transition-colors text-center">Historical</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Volume" value="$12.4M" change="+12.5%" icon={DollarSign} />
        <MetricCard label="Active Participants" value="2,840" change="+4.2%" icon={Users} />
        <MetricCard label="DAOs Tracked" value="64" change="+2" icon={TrendingUp} />
        <MetricCard label="Avg. Grant Size" value="$18.5k" change="-1.2%" icon={Wallet} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Funding Volume Chart */}
        <div className="bloomberg-card h-[350px] md:h-[400px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="font-bold text-text-main">Funding Volume</h3>
              <p className="text-xs text-neutral-500">Grants vs Bounties (Monthly)</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-brand-blue rounded-full" /> Grants</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-brand-purple rounded-full" /> Bounties</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="70%">
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="colorGrants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="currentColor" className="text-neutral-500 opacity-20" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-neutral-500 opacity-20" fontSize={10} tickLine={false} axisLine={false} width={30} />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px" }}
                itemStyle={{ fontSize: "12px", padding: "2px 0", color: "var(--text)" }}
              />
              <Area type="monotone" dataKey="grants" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGrants)" />
              <Area type="monotone" dataKey="bounties" stroke="#8b5cf6" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Pie */}
        <div className="bloomberg-card h-auto min-h-[400px]">
          <h3 className="font-bold mb-8 text-text-main">DAO Sector Distribution</h3>
          <div className="flex flex-col sm:flex-row h-full items-center gap-8">
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-col gap-4 w-full sm:w-auto sm:pr-12">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-tight text-text-main leading-tight whitespace-nowrap">{d.name}</div>
                    <div className="text-[10px] text-neutral-500">{((d.value/1200)*100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, icon: Icon }: { label: string, value: string, change: string, icon: React.ElementType }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="stats-card">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{label}</span>
        <Icon className="w-4 h-4 text-neutral-600" />
      </div>
      <div className="text-2xl font-semibold text-text-main tracking-tight">{value}</div>
      <div className={cn("text-[10px] font-bold mt-1", isPositive ? "text-emerald-400" : "text-red-400")}>
        {change} {isPositive ? "vs last week" : "drop"}
      </div>
    </div>
  );
}
