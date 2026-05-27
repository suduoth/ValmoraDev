/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Flame, 
  Sparkles, 
  Layers, 
  Target,
  CircleCheck,
  Award,
  Maximize2,
  Minimize2,
  X,
  Compass,
  Zap,
  CheckCircle2,
  BookOpen,
  Sliders,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Phase } from '../types';

interface DailyFocusModeProps {
  dailyFocusList: string[];
  toggleDailyFocus: (taskId: string) => void;
  phases: Phase[];
  completedTasks: string[];
  toggleTaskCompletion: (taskId: string) => void;
  toggleSubtaskCompletion: (subtaskId: string, parentTaskId: String) => void;
  completedSubtasks: string[];
}

export default function DailyFocusMode({
  dailyFocusList,
  toggleDailyFocus,
  phases,
  completedTasks,
  toggleTaskCompletion,
  toggleSubtaskCompletion,
  completedSubtasks
}: DailyFocusModeProps) {
  // Timer settings: Default 25 minutes Pomodoro
  const [secondsLeft, setSecondsLeft] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'rest'>('focus');
  const [sessionCount, setSessionCount] = useState(() => {
    const saved = localStorage.getItem('gdos_focus_sessions');
    return saved ? parseInt(saved) : 0;
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Overdrive Extreme Focus States
  const [isOverdriveActive, setIsOverdriveActive] = useState<boolean>(false);
  const [selectedOverdriveTaskId, setSelectedOverdriveTaskId] = useState<string>('');
  const [breathState, setBreathState] = useState<'breathe-in' | 'hold' | 'breathe-out'>('breathe-in');

  // Synchronize statistics
  useEffect(() => {
    localStorage.setItem('gdos_focus_sessions', sessionCount.toString());
  }, [sessionCount]);

  // Handle breathing pacing multiplier timers
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathState((prev) => {
        if (prev === 'breathe-in') return 'hold';
        if (prev === 'hold') return 'breathe-out';
        return 'breathe-in';
      });
    }, 4000);
    return () => clearInterval(breathInterval);
  }, []);

  // Handle timer countdown ticking
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleTimerExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerMode]);

  const handleTimerExpiry = () => {
    setTimerRunning(false);
    
    // Play system-generated synthesis synthesis chime beep
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(698.46, audioCtx.currentTime + 0.2); // F5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.4); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio Context beep omitted due to interaction limits.", e);
    }

    if (timerMode === 'focus') {
      setSessionCount(prev => prev + 1);
      alert("Congratulations! Focus Session Completed. Step back, breathe, and record any architectural progress before the next spin.");
      setTimerMode('rest');
      setSecondsLeft(300); // 5 mins
    } else {
      alert("Rest period complete. Ready to zero back in on standard objectives?");
      setTimerMode('focus');
      setSecondsLeft(1500); // 25 mins
    }
  };

  const toggleTimer = () => setTimerRunning(!timerRunning);
  
  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(timerMode === 'focus' ? 1500 : 300);
  };

  const formatTime = (totalSeconds: number): string => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find actual tasks assigned for today
  const allTasks = phases.flatMap(p => p.tasks);
  const activeFocusTasks = allTasks.filter(t => dailyFocusList.includes(t.id));

  // Auto-select first focus task for Overdrive if not selected yet
  useEffect(() => {
    if (!selectedOverdriveTaskId && activeFocusTasks.length > 0) {
      setSelectedOverdriveTaskId(activeFocusTasks[0].id);
    } else if (!selectedOverdriveTaskId && allTasks.length > 0) {
      setSelectedOverdriveTaskId(allTasks.find(t => !completedTasks.includes(t.id))?.id || allTasks[0].id);
    }
  }, [activeFocusTasks, selectedOverdriveTaskId]);

  const activeFocusedItem = allTasks.find(t => t.id === selectedOverdriveTaskId) || activeFocusTasks[0] || allTasks[0];

  // Find the current active phase name for subtitle mappings
  const getPhaseNameByTaskId = (taskId: string): string => {
    const phase = phases.find(p => p.tasks.some(t => t.id === taskId));
    return phase ? `Phase ${phase.id}: ${phase.title}` : "General Core";
  };

  // Immediate first incomplete sub-task step inside active focal task
  const firstIncompleteSubtask = activeFocusedItem?.subtasks.find(s => !completedSubtasks.includes(s.id));

  // Paured technical Loose coupling advice strings based on the focused category
  const getFocalArchitectAdvice = (taskTitle: string) => {
    const lower = taskTitle.toLowerCase();
    if (lower.includes('movement') || lower.includes('character') || lower.includes('mover')) {
      return "Ensure all translation states (Sprint, Swim, Dash) are calculated as pure vector velocity displacement modifications inside the Mover simulation component. Avoid forcing direct actor coordinates transforms as this introduces severe desynchronizations in multiplayer client hosts.";
    }
    if (lower.includes('camera') || lower.includes('spring')) {
      return "Separate inputs from characters yaw/pitch calculations. PlayerCameraManager must bind camera rotation targets from player character inputs without adding dependencies inside the physical Character base ticking components.";
    }
    if (lower.includes('actor') || lower.includes('class') || lower.includes('hierarch')) {
      return "Leverage Base BP classes (BP_WorldActor_Base) mapping static structures before defining children actors. Let static meshes load through Data Assets profiles asynchronously to prevent loading massive assets into RAM on level transitions.";
    }
    if (lower.includes('interact') || lower.includes('trace') || lower.includes('interface')) {
      return "Do NOT cast directly to custom interactables from player controllers. Build BPI_Interactable as a loose interface binding so player lines can safely query 'Interact' or 'CanInteract' dynamically. Zero hard references keeps RAM bounds extremely clean.";
    }
    if (lower.includes('health') || lower.includes('damage') || lower.includes('destruct')) {
      return "HealthComponent should remain completely modular and agnostic of actor types. Register health attributes as decoupled component classes that can be attached to players, NPCs, or breakable trees alike, communicating death events through standard event dispatchers.";
    }
    if (lower.includes('save') || lower.includes('persis') || lower.includes('load')) {
      return "Write level object state variables directly to temporary persistent dictionaries base on Unique Instance IDs. Level reloads then simply query dictionaries to restore meshes dynamically rather than writing hardcoded world state records.";
    }
    return "Conserve class decoupling boundaries carefully. Keep Blueprints modular and pass parameters through localized structures rather than calling global variables directly.";
  };

  const handleStepCompletionOverdrive = (subId: string, parentId: string) => {
    toggleSubtaskCompletion(subId, parentId);
    
    // Play satisfying tick synth sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Ignored
    }
  };

  return (
    <div className="space-y-6 relative" id="focus_panel_root">
      
      {/* Overdrive Extreme Focus Overlay Modal */}
      <AnimatePresence>
        {isOverdriveActive && activeFocusedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
            id="overdrive_active_workspace"
          >
            {/* Ambient Breathe glowing visual mask */}
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-indigo-950/20 to-transparent pointer-events-none select-none"></div>
            
            <div className="w-full max-w-5xl bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.08)] flex flex-col md:flex-row gap-8 items-stretch">
              
              {/* Breathe Aura Visual background element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-505/2 rounded-full blur-3xl pointer-events-none transition-all duration-3500 flex items-center justify-center">
                <div className={`transition-all duration-3000 bg-indigo-500/2 rounded-full blur-2xl ${
                  breathState === 'breathe-in' ? 'w-[400px] h-[400px] opacity-100 scale-110' :
                  breathState === 'hold' ? 'w-[410px] h-[410px] opacity-100 scale-103' :
                  'w-[250px] h-[250px] opacity-40 scale-90'
                }`}></div>
              </div>

              {/* Close Button / Demote */}
              <button 
                onClick={() => setIsOverdriveActive(false)}
                className="absolute top-4 right-4 text-slate-450 hover:text-white bg-slate-950 border border-slate-850 p-2 rounded-lg cursor-pointer transition-all outline-none"
                title="Exit Overdrive Workspace"
              >
                <X className="w-4 h-4" />
              </button>

              {/* LEFT COLUMN: Time, Controls and the Resonator Breathing Oracle */}
              <div className="md:w-5/12 flex flex-col items-center justify-center space-y-6 text-center select-none border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0 md:pr-8 relative shrink-0">
                <span className="text-[10px] font-mono font-bold text-rose-450 flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase">
                  <Zap className="w-3 h-3 text-red-400 animate-pulse" /> Overdrive Zero-In Node Active
                </span>

                {/* Main Visual Clock face */}
                <div className="relative flex items-center justify-center h-48 w-48 bg-slate-950/60 border border-slate-800 rounded-full shadow-inner ring-4 ring-slate-950 transition-all duration-500 hover:scale-102">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                    <circle 
                      cx="96" 
                      cy="96" 
                      r="82" 
                      className="stroke-indigo-500/5 fill-transparent" 
                      strokeWidth="5" 
                    />
                    <circle 
                      cx="96" 
                      cy="96" 
                      r="82" 
                      className={`fill-transparent transition-all duration-1000 ${
                        timerMode === 'focus' ? 'stroke-rose-500' : 'stroke-emerald-400'
                      }`}
                      strokeWidth="5" 
                      strokeDasharray={`${2 * Math.PI * 82}`}
                      strokeDashoffset={`${2 * Math.PI * 82 * (1 - secondsLeft / (timerMode === 'focus' ? 1500 : 300))}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-3xl font-mono font-black text-slate-100 tracking-tight">
                    {formatTime(secondsLeft)}
                  </div>
                </div>

                {/* Countdown togglers */}
                <div className="flex gap-2.5 justify-center w-full">
                  <button
                    onClick={toggleTimer}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold font-bold flex items-center gap-1.5 border cursor-pointer outline-none transition-all ${
                      timerRunning
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    }`}
                  >
                    {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{timerRunning ? 'Halt Clock' : 'Begin Focus'}</span>
                  </button>
                  
                  <button
                    onClick={resetTimer}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-200 border border-slate-800 bg-slate-950 cursor-pointer outline-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Breathing Oracle Helper bubble */}
                <div className="space-y-1 bg-slate-950/70 border border-slate-850 p-3 rounded-xl w-full max-w-[240px] shadow-sm select-none">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Diaphragmatic Breath Anchor</span>
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <span className={`w-2 h-2 rounded-full transition-all duration-1000 ${
                      breathState === 'breathe-in' ? 'bg-indigo-400 scale-125' :
                      breathState === 'hold' ? 'bg-amber-400 scale-110' :
                      'bg-slate-700 scale-75'
                    }`}></span>
                    <strong className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest leading-none">
                      {breathState === 'breathe-in' && 'Breathe In'}
                      {breathState === 'hold' && 'Hold'}
                      {breathState === 'breathe-out' && 'Exhale'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Selected Zero-in Task & Immediate Checklist Step */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-6 relative z-10" id="overdrive_checklist_pane">
                
                {/* Task selection & header summaries */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-805/40 pb-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-black block">
                        {getPhaseNameByTaskId(activeFocusedItem.id)}
                      </span>
                      
                      {/* Interactive Task selector dropdown */}
                      <div className="relative group/sel">
                        <select
                          value={selectedOverdriveTaskId}
                          onChange={(e) => setSelectedOverdriveTaskId(e.target.value)}
                          className="bg-slate-950 text-slate-205 border border-slate-805 px-2 py-1 rounded text-xs font-sans font-bold cursor-pointer outline-none focus:border-indigo-500 pr-6 appearance-none"
                        >
                          {allTasks.map(t => (
                            <option key={t.id} value={t.id}>
                              {completedTasks.includes(t.id) ? '🟢 ' : '👀 '} {t.title.substring(0, 40)}...
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-2 top-2 w-0 h-0 border-t-[4px] border-t-slate-400 border-x-[3px] border-x-transparent pointer-events-none"></span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTaskCompletion(activeFocusedItem.id)}
                      className={`text-[10px] font-mono py-1 px-2 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                        completedTasks.includes(activeFocusedItem.id)
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{completedTasks.includes(activeFocusedItem.id) ? 'Task Stable' : 'Checkoff Entire Task'}</span>
                    </button>
                  </div>

                  {/* Gigantic Target Core Step view */}
                  <div className="py-4 space-y-4">
                    {firstIncompleteSubtask ? (
                      <div className="space-y-4 animate-fade-in" key={firstIncompleteSubtask.id}>
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-black text-rose-450 uppercase tracking-widest bg-rose-500/5 py-0.5 px-2 border border-rose-500/15 rounded flex items-center gap-1.5 w-fit">
                            <Zap className="w-3.5 h-3.5" /> Core Focus Step
                          </span>
                          <h2 className="text-xl md:text-2xl font-sans font-semibold text-slate-102 leading-snug tracking-tight">
                            {firstIncompleteSubtask.title}
                          </h2>
                          {firstIncompleteSubtask.estimated_effort && (
                            <span className="text-[10px] font-mono text-zinc-550 block">Targeting Effort Limit: {firstIncompleteSubtask.estimated_effort}</span>
                          )}
                        </div>

                        {/* Huge Checkout Active Goal interaction checkbox */}
                        <button
                          onClick={() => handleStepCompletionOverdrive(firstIncompleteSubtask.id, activeFocusedItem.id)}
                          className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300 py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-mono font-bold font-black tracking-wide cursor-pointer transition-all uppercase shadow-lg shadow-indigo-500/2 animate-pulse"
                        >
                          <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Mark Step Complete
                        </button>
                      </div>
                    ) : (
                      <div className="py-8 text-center space-y-2 bg-slate-955/50 border border-dashed border-slate-850 rounded-xl">
                        <Award className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                        <div>
                          <h4 className="text-xs font-semibold text-slate-201 block">Task Milestones Cleared!</h4>
                          <p className="text-[11px] text-slate-505 leading-relaxed font-mono max-w-sm mx-auto">
                            All localized micro-steps for this system stand completely configured. Update overall task registry status, or select a new target node.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Architecture Sentinel Advice panel */}
                <div className="bg-indigo-950/10 border border-indigo-505/15 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] lowercase font-mono font-black text-slate-205 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-400" /> UE Loose Coupling Mover Advice
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans leading-relaxed">
                    {getFocalArchitectAdvice(activeFocusedItem.title)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standard DailyFocusMode layout - visually isolated completely on activating overdrive */}
      <div className="space-y-6 animate-fade-in" id="focus_panel">
        
        {/* Visual Header Intro */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono font-semibold text-rose-450 uppercase tracking-widest bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20 flex w-fit items-center gap-1.5 font-bold animate-pulse">
                <Flame className="w-3.5 h-3.5" /> Extreme Focus Workstation
              </span>
              <h1 className="text-2xl font-bold text-slate-105 tracking-tight">Zero-In Workspace</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintain momentum by separating daily focus targets. Keep clutter low and avoid multitasking. Focus, achieve, log, then celebrate!
              </p>
            </div>

            {/* Quick Streak Stats card */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3.5 flex items-center gap-3.5 text-xs text-slate-300">
              <span className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Sessions Today</div>
                <div className="text-lg font-bold text-slate-100 font-mono">{sessionCount} Completed</div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Growth Rate: Stable
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Overdrive Extreme Isolation Mode! */}
        <button
          onClick={() => setIsOverdriveActive(true)}
          className="w-full bg-slate-950 hover:bg-slate-900 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider cursor-pointer transition-all uppercase shadow-md shadow-indigo-500/2"
        >
          <Maximize2 className="w-4 h-4 text-indigo-400 animate-pulse" /> Activate Extreme Zero-In Mode
        </button>

        {/* Grid: Timer vs Objectives list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Pomodoro Clock component */}
          <div className="lg:col-span-12 xl:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-6 text-center select-none xl:sticky xl:top-6">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 animate-pulse" />
              {timerMode === 'focus' ? 'SYSTEM FOCUS SEGMENT' : 'RECOMMENDED CALMING RESPITE'}
            </div>

            {/* Main Visual Clock face */}
            <div className="relative flex items-center justify-center h-52 w-52 bg-slate-900 border border-slate-810 rounded-full shadow-inner ring-4 ring-slate-950">
              {/* Dynamic circle loading bar */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle 
                  cx="104" 
                  cy="104" 
                  r="90" 
                  className="stroke-indigo-500/10 fill-transparent pointer-events-none" 
                  strokeWidth="6" 
                />
                <circle 
                  cx="104" 
                  cy="104" 
                  r="90" 
                  className={`fill-transparent pointer-events-none transition-all duration-1000 ${
                    timerMode === 'focus' ? 'stroke-rose-500' : 'stroke-emerald-400'
                  }`}
                  strokeWidth="6" 
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - secondsLeft / (timerMode === 'focus' ? 1500 : 300))}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-4xl font-mono font-bold font-black text-slate-100 tracking-tight">
                {formatTime(secondsLeft)}
              </div>
            </div>

            {/* Action configurations */}
            <div className="flex gap-3 justify-center w-full">
              <button
                onClick={toggleTimer}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold font-bold flex items-center gap-2 border cursor-pointer outline-none transition-all ${
                  timerRunning
                    ? 'bg-amber-600 border-amber-500 text-white hover:bg-amber-500'
                    : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/10'
                }`}
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{timerRunning ? 'Pause Engine' : 'Begin Session'}</span>
              </button>
              
              <button
                onClick={resetTimer}
                className="p-2.5 rounded-lg text-slate-400 hover:text-slate-200 border border-slate-800 bg-slate-900 hover:bg-slate-850 cursor-pointer outline-none transition-all"
                title="Reset timer state"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-slate-506 leading-relaxed max-w-xs font-mono">
              * 25 minutes of high-intensity focus matched with 5 minute breaks. Conforms to premium productivity standards.
            </p>
          </div>

          {/* Right: Daily Objectives list */}
          <div className="lg:col-span-12 xl:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-150 flex items-center gap-2 font-sans">
                  <Layers className="w-4 h-4 text-indigo-400" /> Today&apos;s Focus Buffer
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Select up to 5 tasks from Interactive Roadmap</p>
              </div>
              <span className="bg-slate-900 border border-slate-850 text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded">
                {activeFocusTasks.length} / 5 Selected
              </span>
            </div>

            {activeFocusTasks.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-slate-900/10 border border-dashed border-slate-805/40 rounded-lg">
                <span className="p-3 bg-slate-900 border border-slate-800 text-slate-500 rounded-full inline-block">
                  <Target className="w-5 h-5" />
                </span>
                <div className="space-y-1 max-w-xs mx-auto">
                  <h4 className="text-xs font-semibold text-slate-300">Focus Desk Empty</h4>
                  <p className="text-[11px] text-slate-505 leading-relaxed font-mono">
                    Browse the **Interactive Roadmap** and check the target icon (★) to queue objectives for extreme focal development.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeFocusTasks.map((task) => {
                  const isTaskDone = completedTasks.includes(task.id);
                  return (
                    <div 
                      key={task.id}
                      className={`p-4 border rounded-xl space-y-3 transition-all ${
                        isTaskDone 
                          ? 'bg-emerald-500/5 border-emerald-500/20' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-705'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 text-left">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                            {getPhaseNameByTaskId(task.id)}
                          </span>
                          <h4 className={`text-xs font-sans font-semibold leading-snug ${
                            isTaskDone ? 'text-slate-450 line-through' : 'text-slate-205'
                          }`}>
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-slate-405 leading-relaxed">{task.description}</p>
                        </div>

                        {/* Complete Task checkbox */}
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`p-1 rounded shrink-0 transition-all outline-none border cursor-pointer ${
                            isTaskDone 
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                              : 'bg-slate-950 border-slate-800 text-slate-550 hover:text-slate-300'
                          }`}
                        >
                          <CircleCheck className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subtasks checklist expand */}
                      {task.subtasks.length > 0 && (
                        <div className="pt-2 border-t border-slate-805/40 space-y-1.5 pl-2 text-left">
                          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Sub-Steps Checklist</div>
                          {task.subtasks.map((sub) => {
                            const isSubDone = completedSubtasks.includes(sub.id);
                            return (
                              <label 
                                key={sub.id} 
                                className={`flex items-center gap-2 text-[11px] cursor-pointer selection:bg-transparent ${
                                  isSubDone ? 'text-slate-500' : 'text-slate-300 hover:text-slate-100'
                                }`}
                              >
                                <input 
                                  type="checkbox"
                                  checked={isSubDone}
                                  onChange={() => toggleSubtaskCompletion(sub.id, task.id)}
                                  className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-950 bg-slate-950 w-3.5 h-3.5"
                                />
                                <span className={isSubDone ? 'line-through text-slate-505' : ''}>
                                  {sub.title} {sub.estimated_effort && <span className="text-[9px] text-slate-500 font-mono">({sub.estimated_effort})</span>}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Quick win details */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-505 pt-1">
                        <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded text-indigo-400 font-bold">
                          Estimate: {task.estimated_time}
                        </span>
                        <button
                          onClick={() => toggleDailyFocus(task.id)}
                          className="text-[9px] text-rose-450 hover:underline hover:text-rose-400 cursor-pointer outline-none font-bold"
                        >
                          Remove from Focus List
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
