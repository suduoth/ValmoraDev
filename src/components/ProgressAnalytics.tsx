/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart, 
  Clock, 
  Trash2, 
  PlusCircle, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { Phase } from '../types';
import { DevHoursLog } from '../hooks/useOSState';

interface ProgressAnalyticsProps {
  phases: Phase[];
  completedPhases: number[];
  devHoursLogs: DevHoursLog[];
  addDevHoursLog: (phaseId: number, hours: number, description: string) => void;
  deleteDevHoursLog: (logId: string) => void;
}

export default function ProgressAnalytics({
  phases,
  completedPhases,
  devHoursLogs,
  addDevHoursLog,
  deleteDevHoursLog
}: ProgressAnalyticsProps) {
  const [logPhaseId, setLogPhaseId] = useState<number>(0);
  const [logHours, setLogHours] = useState<string>("1.5");
  const [logDesc, setLogDesc] = useState("");

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursNum = parseFloat(logHours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      alert("Please designate a valid decimal hours sum greater than 0.");
      return;
    }

    addDevHoursLog(logPhaseId, hoursNum, logDesc.trim());
    setLogDesc("");
    setLogHours("1.5");
  };

  // State calculations
  const totalHoursLogged = devHoursLogs.reduce((acc, curr) => acc + curr.hours, 0);
  const completedPhasesCount = completedPhases.length;
  const averageVelocity = devHoursLogs.length > 0 
    ? (totalHoursLogged / devHoursLogs.length).toFixed(1) 
    : "0";

  // Calculate percentage of phases completed
  const completionPercentage = Math.round((completedPhasesCount / phases.length) * 100) || 0;

  // Find phase title from logs
  const getPhaseTitle = (pId: number): string => {
    const ph = phases.find(p => p.id === pId);
    return ph ? `Phase ${ph.id}: ${ph.title}` : "General Base";
  };

  return (
    <div className="space-y-6 animate-fade-in" id="analytics_panel">
      {/* Top Banner stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wide">Total Hours Logged</span>
            <div className="text-2xl font-bold font-mono text-slate-100">{totalHoursLogged.toFixed(1)} hrs</div>
            <p className="text-[9px] text-indigo-400 font-mono mt-0.5">Physical developer workload</p>
          </div>
          <span className="p-3 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wide">Phases Completed</span>
            <div className="text-2xl font-bold font-mono text-slate-100">{completedPhasesCount} <span className="text-xs text-slate-655">/ {phases.length}</span></div>
            <p className="text-[9px] text-emerald-400 font-mono mt-0.5">{completionPercentage}% Total Completed</p>
          </div>
          <span className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wide">Average Log Entry</span>
            <div className="text-2xl font-bold font-mono text-slate-100">{averageVelocity} hrs</div>
            <p className="text-[9px] text-cyan-400 font-mono mt-0.5">Velocity index score</p>
          </div>
          <span className="p-3 bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wide">Momentum Status</span>
            <div className="text-lg font-bold font-sans text-slate-100 flex items-center gap-1">
              Active Build
            </div>
            <p className="text-[9px] text-violet-400 font-mono mt-0.5">Safe Sequential Progress</p>
          </div>
          <span className="p-3 bg-violet-500/10 border border-violet-500/25 text-violet-400 rounded-lg">
            <Award className="w-5 h-5 animate-pulse" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive hours logger form */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-sans">
              <PlusCircle className="w-4 h-4 text-indigo-400" /> Log Workload Hours
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Record game development sprint sessions</p>
          </div>

          <form onSubmit={handleAddLog} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Target Milestone Phase</label>
              <select
                value={logPhaseId}
                onChange={(e) => setLogPhaseId(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 py-2.5 px-3 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer outline-none"
              >
                {phases.map(p => (
                  <option key={p.id} value={p.id}>Phase {p.id}: {p.title.slice(0, 30)}...</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase block">Decimal Hours</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="24"
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 py-2 px-3 rounded-lg text-xs text-slate-300 text-center font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase block">Hotkeys (hrs)</label>
                <div className="flex gap-1">
                  {["1.0", "2.5", "4.0"].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLogHours(val)}
                      className={`flex-grow text-[10px] py-2 rounded text-center font-mono border transition-all cursor-pointer ${
                        logHours === val 
                          ? 'bg-indigo-600 text-white border-indigo-500' 
                          : 'bg-slate-900 border-slate-805 text-slate-400'
                      }`}
                    >
                      +{val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Completed Actions Description</label>
              <textarea
                value={logDesc}
                onChange={(e) => setLogDesc(e.target.value)}
                required
                rows={3}
                placeholder="What architectural systems or coordinate issues did you resolve?"
                className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 outline-none placeholder-slate-550"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 py-2.5 text-xs text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 cursor-pointer outline-none transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Log Sprint Record</span>
            </button>
          </form>
        </div>

        {/* Right: History audit trail list */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-sans">
              <Calendar className="w-4 h-4 text-indigo-400" /> Sprint Audit History logs
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Double-check completed tasks timeline and hours</p>
          </div>

          {devHoursLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-550 text-xs font-mono italic">
              No development hours records located. Populate your sprint logs on the left.
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {devHoursLogs.map((log) => (
                <div key={log.id} className="bg-slate-900 border border-slate-805 p-4 rounded-xl space-y-2 relative group hover:border-slate-705 transition-all">
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/15">
                    +{log.hours} hrs
                  </span>

                  <div className="space-y-1 pr-16">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">{log.date}</span>
                    <h4 className="text-xs font-semibold text-slate-205 leading-snug">
                      {getPhaseTitle(log.phaseId)}
                    </h4>
                    <p className="text-xs text-slate-401 leading-relaxed font-sans italic">&ldquo;{log.description}&rdquo;</p>
                  </div>

                  {/* Delete audit log button */}
                  <button
                    onClick={() => deleteDevHoursLog(log.id)}
                    className="absolute bottom-4 right-4 p-1 rounded hover:bg-slate-950 hover:text-rose-450 border border-transparent hover:border-slate-800 text-slate-600 transition-all cursor-pointer outline-none"
                    title="Delete sprint record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
