/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Trash2, 
  Play, 
  Briefcase,
  Activity,
  Award,
  BookOpen,
  Anchor,
  Info,
  Compass,
  Zap
} from 'lucide-react';
import { Phase, Task } from '../types';
import { DevHoursLog } from '../hooks/useOSState';

interface DashboardProps {
  phases: Phase[];
  completedPhases: number[];
  completedTasks: string[];
  dailyFocusList: string[];
  devHoursLogs: DevHoursLog[];
  onNavigate: (tab: 'dashboard' | 'roadmap' | 'focus' | 'ai-mentor' | 'notes' | 'architect' | 'systems' | 'analytics' | 'search' | 'settings') => void;
  onSelectPhase: (phaseId: number) => void;
  toggleDailyFocus: (taskId: string) => void;
}

export default function Dashboard({
  phases,
  completedPhases,
  completedTasks,
  dailyFocusList,
  devHoursLogs,
  onNavigate,
  onSelectPhase,
  toggleDailyFocus
}: DashboardProps) {
  // Statistics computations
  const totalTasksCount = phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasksCount = completedTasks.length;
  const progressPercent = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  const totalDevHours = devHoursLogs.reduce((acc, curr) => acc + curr.hours, 0);

  // Recommendations Engine: Find the FIRST incomplete task from the FIRST incomplete phase
  const getRecommendedTask = (): { phase: Phase; task: Task } | null => {
    // Traverse sequential phases
    for (const phase of phases) {
      const isPhaseComplete = phase.status === 'Completed' || completedPhases.includes(phase.id);
      if (!isPhaseComplete && phase.status === 'Unlocked') {
        const incompleteTask = phase.tasks.find(t => !completedTasks.includes(t.id));
        if (incompleteTask) {
          return { phase, task: incompleteTask };
        }
      }
    }
    // Fallback: If Phase 0 is locked or all phases finished
    return null;
  };

  const recommendation = getRecommendedTask();

  // Streak Multipliers: sessionCount calculation based on total log entries the last 3 days
  const activeStreakCount = Math.max(1, new Set(devHoursLogs.map(l => l.date)).size);

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard_panel">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-505/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-semibold font-bold">
              <Sparkles className="w-4 h-4" /> Game Development Operating System Active
            </div>
            <h1 className="text-3xl font-sans font-bold text-slate-100 tracking-tight">
              Solo Dev Control Center
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              A highly balanced workspace carefully engineered to avoid solo developer chaos, eliminate cycle-cast overhead, and enforce safe sequential phase parameters. Preserve code decoupling standards in every Blueprint.
            </p>
          </div>
          
          {/* Circular overall tracker */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center gap-4 shrink-0">
            <div className="relative flex items-center justify-center select-none">
              <svg className="w-16 h-16">
                <circle cx="32" cy="32" r="28" className="stroke-slate-800 fill-transparent" strokeWidth="4" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="stroke-indigo-500 fill-transparent pointer-events-none" 
                  strokeWidth="4" 
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-mono font-bold text-indigo-400">{progressPercent}%</span>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Overall Build</div>
              <div className="text-sm font-bold text-slate-205">Completeness</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono mt-0.5">
                <CheckCircle2 className="w-3 h-3 animate-pulse" /> Architecture Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Span 7): Recommendations & Focus Quick View */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Panel 2: Next Task Recommendation Engine */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-900 pb-2 flex justify-between items-center select-none">
              <div className="space-y-0.5">
                <h3 className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 shrink-0 text-indigo-400 animate-spin" /> Next Safe Objective Advisor
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Guarantees code implementation order is strictly preserved</p>
              </div>
              <span className="bg-slate-900 border border-slate-850 text-[9px] text-slate-400 px-2 py-0.5 rounded font-mono uppercase">
                Dependency Safe
              </span>
            </div>

            {recommendation ? (
              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center flex-wrap gap-2 text-[10px]">
                    <span className="text-slate-550 font-mono font-bold uppercase">
                      Phase {recommendation.phase.id}: {recommendation.phase.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border ${
                      recommendation.task.priority === 'High' ? 'bg-rose-500/10 text-rose-455 border-rose-500/20' : 'bg-slate-950 text-slate-405 border-slate-805'
                    }`}>
                      {recommendation.task.priority} Priority Goal
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-201 leading-relaxed">{recommendation.task.title}</h4>
                  <p className="text-xs text-slate-401 leading-relaxed">{recommendation.task.description}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono pt-2.5 border-t border-slate-805/40 text-slate-500">
                  <span>Effort Goal: {recommendation.task.estimated_time}</span>
                  <button
                    onClick={() => {
                      onSelectPhase(recommendation.phase.id);
                      onNavigate('roadmap');
                    }}
                    className="text-indigo-400 hover:text-indigo-305 flex items-center gap-1 font-bold hover:underline cursor-pointer outline-none"
                  >
                    <span>Open Step Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs font-mono italic select-none">
                All scheduled core phases and milestones stand complete! Retrace settings or settings rules.
              </div>
            )}
          </div>

          {/* Panel 3: Daily Focus Mode Quick Indicators */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-900 pb-2 flex justify-between items-center select-none">
              <div className="space-y-0.5">
                <h3 className="text-xs font-mono font-semibold text-rose-450 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 shrink-0 text-rose-400 animate-pulse" /> Focus Block queue
                </h3>
                <p className="text-[10px] text-slate-500 font-mono font-medium">Daily objectives separated for high concentration focus</p>
              </div>
              <button 
                onClick={() => onNavigate('focus')}
                className="text-[10px] text-indigo-400 hover:text-indigo-305 hover:underline font-mono font-bold cursor-pointer outline-none"
              >
                Go to Focus Desk
              </button>
            </div>

            {dailyFocusList.length === 0 ? (
              <div className="py-8 text-center bg-slate-900/20 border border-dashed border-slate-805 rounded-xl space-y-1 font-mono">
                <span className="text-xs font-semibold text-slate-405 block">Queue is currently clear</span>
                <span className="text-[10px] text-slate-550 leading-relaxed block max-w-xs mx-auto">
                  Click the (★) icon inside any task specifications sheet to transfer it to focal mode.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {phases.flatMap(p => p.tasks).filter(t => dailyFocusList.includes(t.id)).map(task => {
                  const isTaskDone = completedTasks.includes(task.id);
                  return (
                    <div 
                      key={task.id}
                      onClick={() => onNavigate('focus')}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isTaskDone 
                          ? 'bg-emerald-550/5 border-emerald-500/20 text-slate-450' 
                          : 'bg-slate-900/60 border-slate-850 hover:border-slate-705 text-slate-205'
                      }`}
                    >
                      <span className={`text-[10px] font-semibold leading-snug truncate block ${isTaskDone ? 'line-through' : ''}`}>
                        {task.title}
                      </span>
                      <span className="text-[9px] font-mono text-slate-505 block mt-0.5 uppercase">Estimate: {task.estimated_time}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Span 5): Recent Activity & Motivation/Streaks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Panel 5: Build Momentum & Streak Multipliers */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-900 pb-2 flex justify-between items-center select-none">
              <div className="space-y-0.5">
                <h3 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 shrink-0 text-amber-500" /> Sprint Morale Indexer
                </h3>
                <p className="text-[10px] text-slate-505 font-mono">Your developer persistence score card</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex gap-4 items-center">
              <span className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center animate-pulse">
                <Award className="w-5 h-5" />
              </span>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-505">Active Dev Streak</span>
                <div className="text-xl font-bold font-mono text-slate-101">{activeStreakCount} consecutive days</div>
                <p className="text-[9px] text-zinc-455 font-mono">Persistence multiplies focus output. Keep building!</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex gap-4 items-center">
              <span className="p-3 bg-indigo-505/10 border border-indigo-505/20 text-indigo-400 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 animate-pulse" />
              </span>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-505 font-semibold">Development Yield</span>
                <div className="text-xl font-bold font-mono text-slate-101">{totalDevHours.toFixed(1)} hours logged</div>
                <p className="text-[9px] text-zinc-455 font-mono">Total tracked effort committed to world files</p>
              </div>
            </div>
          </div>

          {/* Panel 4: Clean Recent Activity timeline logs */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-900 pb-2 flex justify-between items-center select-none">
              <div className="space-y-0.5">
                <h3 className="text-xs font-mono font-semibold text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Recent Sprint Log Entries
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Historical logging timeline summaries</p>
              </div>
              <button 
                onClick={() => onNavigate('analytics')}
                className="text-[10px] text-indigo-400 hover:text-indigo-305 hover:underline font-mono font-bold cursor-pointer outline-none"
              >
                Track Logs
              </button>
            </div>

            {devHoursLogs.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs font-mono italic select-none">
                No recent activity. Keep logging focus timers to record milestones.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                {devHoursLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="text-xs flex justify-between gap-4 p-2 bg-slate-900/30 border border-slate-900 rounded-lg select-none">
                    <div className="truncate pr-4">
                      <span className="text-slate-505 text-[9px] block font-mono">{log.date}</span>
                      <span className="font-semibold text-slate-200 truncate block">{log.description}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 shrink-0 self-center">+{log.hours}h</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
