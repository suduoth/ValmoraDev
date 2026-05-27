/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Terminal, 
  Map, 
  PlusCircle, 
  Layers, 
  ShieldCheck, 
  Activity,
  FolderLock,
  Bot,
  Zap,
  BookOpen,
  Settings,
  Search,
  Sliders,
  BarChart,
  CalendarDays,
  Radar
} from 'lucide-react';
import { useOSState } from './hooks/useOSState';

import Dashboard from './components/Dashboard';
import RoadmapView from './components/RoadmapView';
import ObjectArchitect from './components/ObjectArchitect';
import SystemsData from './components/SystemsData';
import AIMentorTerminal from './components/AIMentorTerminal';
import DailyFocusMode from './components/DailyFocusMode';
import NotesHub from './components/NotesHub';
import ProgressAnalytics from './components/ProgressAnalytics';
import AnalyzeTab from './components/AnalyzeTab';
import SearchFilters from './components/SearchFilters';
import OSSettings from './components/OSSettings';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'roadmap' | 'focus' | 'ai-mentor' | 'notes' | 'architect' | 'systems' | 'analytics' | 'analyze' | 'search' | 'settings'
  >('dashboard');

  // Load centralized custom states
  const osState = useOSState();

  const handleSelectPhase = (phaseId: number) => {
    osState.setSelectedPhaseId(phaseId);
  };

  const handleSelectTaskFromSearch = (phaseId: number, taskId: string) => {
    osState.setSelectedPhaseId(phaseId);
    osState.setSelectedTaskId(taskId);
    setActiveTab('roadmap');
  };

  const activePhaseObj = osState.phases.find(p => p.id === osState.selectedPhaseId);
  const activeTaskObj = activePhaseObj?.tasks.find(t => t.id === osState.selectedTaskId);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white selection:font-bold theme-${osState.settings.theme}`}>
      {/* Dynamic Grid Background Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-20"></div>

      {/* Main Container */}
      <div className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Top-Level Navigation Brand Rail */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-805 pb-5 select-none">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-600 rounded-lg text-white font-black shadow-lg shadow-indigo-500/10 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-sans tracking-tight text-white">VALMORA GDOS</h1>
                <span className="text-[10px] font-mono tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-bold animate-pulse">
                  STABLE OPERATING SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">Senior Unreal Engine Sequential Development Environment</p>
            </div>
          </div>

          {/* Core System Status bar indicators */}
          <div className="flex items-center gap-4 text-xs font-mono bg-slate-900/40 border border-slate-800 rounded-lg py-1.5 px-3 self-stretch sm:self-auto justify-around sm:justify-start">
            <span className="flex items-center gap-1.5 text-slate-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div> CACHE: SECURE
            </span>
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full hidden sm:inline"></span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Decoupled Matrices
            </span>
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full hidden sm:inline"></span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <FolderLock className="w-3.5 h-3.5 text-cyan-500" /> V1.3 Active
            </span>
          </div>
        </header>

        {/* Dynamic Navigation Menu Items */}
        <nav className="flex items-center border-b border-slate-900 gap-1 overflow-x-auto pb-1 select-none">
          {[
            { id: 'analyze' as const, label: "Analyze", icon: Radar },
            { id: 'dashboard' as const, label: "Core Deck", icon: Layers },
            { id: 'roadmap' as const, label: "Interactive Roadmap", icon: Map },
            { id: 'focus' as const, label: "Zero-In Mode", icon: Zap },
            { id: 'ai-mentor' as const, label: "Senior UE5 Mentor", icon: Bot },
            { id: 'notes' as const, label: "Documentation Notes", icon: BookOpen },
            { id: 'architect' as const, label: "Object Architect", icon: PlusCircle },
            { id: 'systems' as const, label: "Systems Coupling", icon: Activity },
            { id: 'analytics' as const, label: "Sprint Analytics", icon: BarChart },
            { id: 'search' as const, label: "Global Search", icon: Search },
            { id: 'settings' as const, label: "OS Settings", icon: Settings }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-sans font-semibold transition-all border-b-2 shrink-0 cursor-pointer outline-none relative hover:text-slate-100 ${
                  isSelected
                    ? 'border-indigo-500 text-indigo-400 font-bold bg-slate-900/40'
                    : 'border-transparent text-slate-400'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{tab.label}</span>
                {tab.id === 'focus' && osState.dailyFocusList.length > 0 && (
                  <span className="absolute top-1.5 right-1 h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Views dispatcher */}
        <main className="flex-grow">
          {activeTab === 'dashboard' && (
            <Dashboard 
              phases={osState.phases}
              completedPhases={osState.completedPhases}
              completedTasks={osState.completedTasks}
              dailyFocusList={osState.dailyFocusList}
              devHoursLogs={osState.devHoursLogs}
              onNavigate={setActiveTab}
              onSelectPhase={handleSelectPhase}
              toggleDailyFocus={osState.toggleDailyFocus}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView 
              phases={osState.phases}
              completedPhases={osState.completedPhases}
              completedTasks={osState.completedTasks}
              completedSubtasks={osState.completedSubtasks}
              taskNotes={osState.taskNotes}
              phaseNotes={osState.phaseNotes}
              bookmarkedTasks={osState.bookmarkedTasks}
              dailyFocusList={osState.dailyFocusList}
              selectedPhaseId={osState.selectedPhaseId}
              setSelectedPhaseId={osState.setSelectedPhaseId}
              selectedTaskId={osState.selectedTaskId}
              setSelectedTaskId={osState.setSelectedTaskId}
              toggleTaskCompletion={osState.toggleTaskCompletion}
              toggleSubtaskCompletion={osState.toggleSubtaskCompletion}
              updateTaskNotes={osState.updateTaskNotes}
              updatePhaseNotes={osState.updatePhaseNotes}
              toggleBookmark={osState.toggleBookmark}
              toggleDailyFocus={osState.toggleDailyFocus}
              addDevHoursLog={osState.addDevHoursLog}
              onNavigate={setActiveTab}
              setChatHistory={osState.setChatHistory}
            />
          )}

          {activeTab === 'focus' && (
            <DailyFocusMode 
              dailyFocusList={osState.dailyFocusList}
              toggleDailyFocus={osState.toggleDailyFocus}
              phases={osState.phases}
              completedTasks={osState.completedTasks}
              toggleTaskCompletion={osState.toggleTaskCompletion}
              toggleSubtaskCompletion={osState.toggleSubtaskCompletion}
              completedSubtasks={osState.completedSubtasks}
            />
          )}

          {activeTab === 'ai-mentor' && (
            <AIMentorTerminal 
              chatHistory={osState.chatHistory}
              setChatHistory={osState.setChatHistory}
              clearChatHistory={osState.clearChatHistory}
              activePhase={activePhaseObj}
              activeTask={activeTaskObj}
              personalityChoice={osState.settings.mentorPersonality}
            />
          )}

          {activeTab === 'notes' && (
            <NotesHub 
              phases={osState.phases}
              taskNotes={osState.taskNotes}
              phaseNotes={osState.phaseNotes}
              updateTaskNotes={osState.updateTaskNotes}
              updatePhaseNotes={osState.updatePhaseNotes}
            />
          )}

          {activeTab === 'architect' && (
            <ObjectArchitect 
              createdObjects={osState.createdObjects} 
              setCreatedObjects={osState.setCreatedObjects} 
              completedTasks={osState.completedTasks}
              phases={osState.phases}
            />
          )}

          {activeTab === 'systems' && (
            <SystemsData 
              createdObjects={osState.createdObjects} 
              phases={osState.phases} 
              completedTasks={osState.completedTasks} 
              onNavigate={setActiveTab}
              onSelectPhase={handleSelectPhase}
            />
          )}

          {activeTab === 'analyze' && (
            <AnalyzeTab 
              createdObjects={osState.createdObjects}
              phases={osState.phases}
            />
          )}

          {activeTab === 'analytics' && (
            <ProgressAnalytics 
              phases={osState.phases}
              completedPhases={osState.completedPhases}
              devHoursLogs={osState.devHoursLogs}
              addDevHoursLog={osState.addDevHoursLog}
              deleteDevHoursLog={osState.deleteDevHoursLog}
            />
          )}

          {activeTab === 'search' && (
            <SearchFilters 
              phases={osState.phases}
              completedTasks={osState.completedTasks}
              bookmarkedTasks={osState.bookmarkedTasks}
              toggleBookmark={osState.toggleBookmark}
              onSelectTask={handleSelectTaskFromSearch}
            />
          )}

          {activeTab === 'settings' && (
            <OSSettings 
              settings={osState.settings}
              setSettings={osState.setSettings}
              resetAllProgress={osState.resetAllProgress}
              exportProgressStateJSON={osState.exportProgressStateJSON}
              importProgressStateJSON={osState.importProgressStateJSON}
            />
          )}
        </main>

        {/* Footer info brand rail */}
        <footer className="border-t border-slate-900 pt-5 text-center flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-slate-500">
          <span>Valmora Operating System (GDOS) Spec Hub. Standard Unreal Engine 5 loose coupling compliance verified.</span>
          <span>Environment ID: 3cba0ba7-07ad-4c6c-9198-3725fad31c1b</span>
        </footer>
      </div>
    </div>
  );
}
