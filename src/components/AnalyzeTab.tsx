import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  PlayCircle,
  PauseCircle,
  StopCircle,
  PlusSquare,
  Network,
  Cpu
} from 'lucide-react';
import { SimulatedObject, Phase } from '../types';

interface DevEvent {
  id: string;
  systemName: string;
  type: 'Created Actor' | 'Modified System' | 'Added Feature' | 'Tested System' | 'Fixed Bug' | 'Experimented Feature';
  timestamp: string; // ISO string
  notes: string;
  complexity: number; // 1-10
}

interface FocusSession {
  id: string;
  systemName: string;
  startTime: string;
  endTime: string | null;
  durationMs: number;
  isPaused?: boolean;
}

interface AnalyzeTabProps {
  createdObjects: SimulatedObject[];
  phases: Phase[];
}

export default function AnalyzeTab({ createdObjects, phases }: AnalyzeTabProps) {
  // We manage the DevEvents and Focus sessions locally but persist in LS
  const [devEvents, setDevEvents] = useState<DevEvent[]>(() => {
    try {
      const saved = localStorage.getItem('gdos_dev_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {}
    return [];
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    try {
      const saved = localStorage.getItem('gdos_focus_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {}
    return [];
  });

  const [activeSession, setActiveSession] = useState<FocusSession | null>(() => {
    try {
      const saved = localStorage.getItem('gdos_active_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        // ensure it is an object and not an array, as a basic safety check
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
      }
    } catch (e) {}
    return null;
  });

  // Watch for createdObjects changes to automatically log "Created Actor" events
  const [lastObjectCount, setLastObjectCount] = useState(createdObjects.length);
  useEffect(() => {
    if (createdObjects.length > lastObjectCount) {
      // New object(s) added
      const newObjects = createdObjects.slice(lastObjectCount);
      const autoEvents: DevEvent[] = newObjects.map(obj => ({
        id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        systemName: obj.category,
        type: 'Created Actor',
        timestamp: new Date().toISOString(),
        notes: `Auto-detected: Created ${obj.name} (${obj.category})`,
        complexity: Math.floor(Math.random() * 3) + 2
      }));
      setDevEvents(prev => [...autoEvents, ...prev]);
      setLastObjectCount(createdObjects.length);
    } else if (createdObjects.length < lastObjectCount) {
      setLastObjectCount(createdObjects.length);
    }
  }, [createdObjects, lastObjectCount]);

  useEffect(() => {
    localStorage.setItem('gdos_dev_events', JSON.stringify(devEvents));
  }, [devEvents]);

  useEffect(() => {
    localStorage.setItem('gdos_focus_sessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem('gdos_active_session', JSON.stringify(activeSession));
  }, [activeSession]);

  // Tick active session timer
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startSession = (systemName: string) => {
    const newSession: FocusSession = {
      id: `session_${Date.now()}`,
      systemName,
      startTime: new Date().toISOString(),
      endTime: null,
      durationMs: 0,
      isPaused: false
    };
    setActiveSession(newSession);
  };

  const pauseSession = () => {
    if (!activeSession) return;
    if (activeSession.isPaused) return;

    const currentDurationMs = (now - new Date(activeSession.startTime).getTime());
    setActiveSession({
      ...activeSession,
      isPaused: true,
      durationMs: activeSession.durationMs + currentDurationMs
    });
  };

  const resumeSession = () => {
    if (!activeSession) return;
    if (!activeSession.isPaused) return;

    setActiveSession({
      ...activeSession,
      isPaused: false,
      startTime: new Date(now).toISOString()
    });
  };

  const endSession = () => {
    if (!activeSession) return;
    
    let finalDuration = activeSession.durationMs;
    if (!activeSession.isPaused) {
      finalDuration += (now - new Date(activeSession.startTime).getTime());
    }
    
    const finished: FocusSession = {
      ...activeSession,
      endTime: new Date(now).toISOString(),
      durationMs: finalDuration
    };
    setFocusSessions(prev => [finished, ...prev]);
    setActiveSession(null);
  };

  // Systems derived from phases and events
  const allSystems = useMemo(() => {
    const baseSystems = [
      'Movement', 'Camera', 'WorldActors', 'Interaction', 
      'WaterVolume', 'Destruction', 'AI', 'SaveSystem', 'Inventory', 'Combat',
      'Player', 'NPC', 'StaticInteractable', 'DynamicInteractable'
    ];
    // Gather any newly typed systems via objects/events
    const dynamicSystems = new Set(devEvents.map(e => e.systemName));
    baseSystems.forEach(s => dynamicSystems.add(s));
    return Array.from(dynamicSystems);
  }, [devEvents]);

  // Calculations for System Time Analysis Engine
  const systemStats = useMemo(() => {
    const stats: Record<string, {
      actualMs: number;
      expectedMs: number;
      complexity: number;
      status: 'Healthy' | 'At Risk' | 'Blocked' | 'Overextended';
      efficiencyScore: number;
      eventsCount: number;
      ratio: number;
    }> = {};

    allSystems.forEach(sys => {
      // Mock expected time - in reality maybe derived from roadmap tasks containing this system
      const expectedHours = 2 + (Math.abs(sys.charCodeAt(0) - 65) % 10);
      const expectedMs = expectedHours * 3600 * 1000;

      // Sum actual time from focus sessions
      let actualMs = focusSessions.filter(s => s.systemName === sys).reduce((acc, s) => acc + s.durationMs, 0);
      if (activeSession && activeSession.systemName === sys) {
        if (activeSession.isPaused) {
          actualMs += activeSession.durationMs;
        } else {
          actualMs += activeSession.durationMs + (now - new Date(activeSession.startTime).getTime());
        }
      }

      // Base events for complexity
      const sysEvents = devEvents.filter(e => e.systemName === sys);
      const totalComplexity = sysEvents.reduce((acc, e) => acc + e.complexity, 0);

      // Determine Status & Efficiency
      let status: 'Healthy' | 'At Risk' | 'Blocked' | 'Overextended' = 'Healthy';
      const ratio = actualMs / expectedMs;
      
      let efficiencyScore = 100 - (ratio * 100);
      if (efficiencyScore > 100) efficiencyScore = 100;
      if (efficiencyScore < 0) efficiencyScore = Math.max(10, 100 - (ratio * 50)); // don't go below 10 arbitrarily

      if (ratio > 1.8) {
        status = 'Overextended'; // Warning Level 3
      } else if (ratio > 1.3) {
        status = 'At Risk'; // Warning Level 2
      } else if (ratio > 1.0) {
        status = 'At Risk'; // Warning Level 1
      }

      // Check if blocked by looking at extreme complexity with low time, etc...
      if (sysEvents.length > 0 && actualMs === 0) {
        status = 'Blocked';
        efficiencyScore = 0;
      }

      stats[sys] = {
        actualMs,
        expectedMs,
        complexity: totalComplexity,
        status,
        efficiencyScore: Math.round(efficiencyScore),
        eventsCount: sysEvents.length,
        ratio
      };
    });

    return stats;
  }, [allSystems, focusSessions, devEvents, activeSession, now]);

  // Form states
  const [newEventSystem, setNewEventSystem] = useState(allSystems[0] || 'Interaction');
  const [newEventType, setNewEventType] = useState<DevEvent['type']>('Modified System');
  const [newEventNotes, setNewEventNotes] = useState('');
  const [newEventComplexity, setNewEventComplexity] = useState(5);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const ev: DevEvent = {
      id: `ev_${Date.now()}`,
      systemName: newEventSystem,
      type: newEventType,
      timestamp: new Date().toISOString(),
      notes: newEventNotes,
      complexity: newEventComplexity
    };
    setDevEvents(prev => [ev, ...prev]);
    setNewEventNotes('');
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return '0s';
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in pb-12">
      
      {/* 1. Header & Overwork Detectors */}
      <div className="lg:col-span-12">
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            <Radar className="w-5 h-5 text-indigo-400" />
            Project Observer Brain
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-mono">
            A silent production director watching your architecture evolve.
          </p>
          
          {/* Simulation Warnings */}
          <div className="mt-4 space-y-2">
            {Object.entries(systemStats).map(([sys, stat]) => {
              if (stat.status === 'Overextended') {
                return (
                  <div key={sys} className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-rose-300 text-xs font-mono shadow-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <div>
                      <strong className="text-[10px] uppercase font-black tracking-wider text-rose-400 block mb-0.5">WARNING LEVEL 3 [{sys}]</strong>
                      Recommend stopping and reviewing architecture before continuing. Deviation +{Math.round((stat.ratio - 1) * 100)}%.
                    </div>
                  </div>
                );
              } else if (stat.status === 'At Risk') {
                if (stat.ratio > 1.3) {
                  return (
                    <div key={sys} className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-amber-300 text-xs font-mono shadow-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <div>
                        <strong className="text-[10px] uppercase font-black tracking-wider text-amber-400 block mb-0.5">WARNING LEVEL 2 [{sys}]</strong>
                        This may indicate overengineering or missing dependencies. System time deviation +{Math.round((stat.ratio - 1) * 100)}%.
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={sys} className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-yellow-300 text-xs font-mono shadow-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <div>
                        <strong className="text-[10px] uppercase font-black tracking-wider text-yellow-500 block mb-0.5">WARNING LEVEL 1 [{sys}]</strong>
                        This system is taking longer than expected.
                      </div>
                    </div>
                  );
                }
              }
              return null;
            })}
            
            <div className="mt-4 border-t border-slate-800 pt-4 space-y-2">
              <h4 className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400 mb-2">Project Behavior Simulation</h4>
              {Object.values(systemStats).some(s => s.status !== 'Healthy') ? (
                Object.entries(systemStats)
                  .filter(([sys, stat]) => stat.status !== 'Healthy')
                  .slice(0, 3)
                  .map(([sys, stat], i) => (
                    <div key={i} className="text-slate-400 font-mono text-xs flex gap-2">
                      <span className="text-indigo-500 shrink-0">→</span>
                      <span>If development continues like this, <strong>{sys}</strong> will delay dependent systems by approximately {Math.round(stat.ratio * 2)} days.</span>
                    </div>
                  ))
              ) : (
                <div className="text-emerald-400/80 font-mono text-xs flex gap-2">
                  <span className="text-emerald-500 shrink-0">→</span>
                  <span>All architecture trends are stable. No downstream delays detected.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Left Column: Focus Timer & Event Input */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Focus Timer System */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Clock className="w-24 h-24" />
          </div>
          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-indigo-400" /> Session Tracking
          </h3>

          {activeSession ? (
            <div className="space-y-4">
              <div className="text-center p-6 bg-slate-900 rounded-lg border border-indigo-500/30 relative">
                {!activeSession.isPaused && <div className="absolute inset-0 bg-indigo-500/5 animate-pulse rounded-lg"></div>}
                {activeSession.isPaused && <div className="absolute inset-0 bg-amber-500/5 rounded-lg border border-amber-500/20"></div>}
                <div className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-2 ${activeSession.isPaused ? 'text-amber-500' : 'text-indigo-300'}`}>
                  {activeSession.isPaused ? 'Paused Session:' : 'Active Session:'} {activeSession.systemName}
                </div>
                <div className="text-3xl font-bold font-mono tracking-wider text-white relative z-10">
                  {formatDuration(activeSession.isPaused ? activeSession.durationMs : (now - new Date(activeSession.startTime).getTime()) + activeSession.durationMs)}
                </div>
              </div>
              <div className="flex gap-2">
                {activeSession.isPaused ? (
                  <button 
                    onClick={resumeSession}
                    className="flex-1 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-lg font-bold font-sans text-xs tracking-wide transition-all flex justify-center items-center gap-2 uppercase"
                  >
                    <PlayCircle className="w-4 h-4" /> Resume
                  </button>
                ) : (
                  <button 
                    onClick={pauseSession}
                    className="flex-1 py-3 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-lg font-bold font-sans text-xs tracking-wide transition-all flex justify-center items-center gap-2 uppercase"
                  >
                    <PauseCircle className="w-4 h-4" /> Pause
                  </button>
                )}
                <button 
                  onClick={endSession}
                  className="flex-1 py-3 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg font-bold font-sans text-xs tracking-wide transition-all flex justify-center items-center gap-2 uppercase"
                >
                  <StopCircle className="w-4 h-4" /> End
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5">Target System</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={newEventSystem}
                  onChange={e => setNewEventSystem(e.target.value)}
                >
                  {allSystems.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button 
                onClick={() => startSession(newEventSystem)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold font-sans text-sm tracking-wide transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <PlayCircle className="w-4 h-4" /> Start Focus Session
              </button>
            </div>
          )}
        </div>

        {/* Data Input System */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
            <PlusSquare className="w-4 h-4 text-emerald-400" /> Log Event
          </h3>
          <form onSubmit={handleAddEvent} className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">System</label>
              <select 
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-white outline-none"
                value={newEventSystem}
                onChange={e => setNewEventSystem(e.target.value)}
              >
                {allSystems.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Event Type</label>
              <select 
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-white outline-none"
                value={newEventType}
                onChange={e => setNewEventType(e.target.value as any)}
              >
                <option value="Created Actor">Created Actor</option>
                <option value="Modified System">Modified System</option>
                <option value="Added Feature">Added Feature</option>
                <option value="Tested System">Tested System</option>
                <option value="Fixed Bug">Fixed Bug</option>
                <option value="Experimented Feature">Experimented Feature</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Complexity (1-10)</label>
              <input 
                type="range" min="1" max="10" 
                value={newEventComplexity}
                onChange={e => setNewEventComplexity(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[8px] text-slate-500 mt-1 font-mono">
                <span>Simple</span>
                <span>{newEventComplexity}</span>
                <span>Complex</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Notes</label>
              <input 
                type="text" 
                value={newEventNotes}
                onChange={e => setNewEventNotes(e.target.value)}
                placeholder="Optional commit context..."
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2 text-xs text-white placeholder-slate-600 outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 py-2 rounded-md transition-all font-bold text-xs uppercase tracking-wider mt-2">
              Add Record
            </button>
          </form>
        </div>

      </div>

      {/* 3. Right Column: Analytics & Dashboards */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* System Health Dashboard */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
             <Cpu className="w-4 h-4 text-cyan-400" /> System Health Dashboard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-2 px-3 font-semibold">System Name</th>
                  <th className="py-2 px-3 font-semibold">Status</th>
                  <th className="py-2 px-3 font-semibold text-right">Efficiency</th>
                  <th className="py-2 px-3 font-semibold text-right">Time Invested</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(systemStats).sort((a,b) => b[1].actualMs - a[1].actualMs).map(([sysName, stat]) => {
                  let statusColor = 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
                  if (stat.status === 'At Risk') statusColor = 'text-amber-400 bg-amber-400/10 border-amber-500/20';
                  else if (stat.status === 'Overextended') statusColor = 'text-rose-400 bg-rose-400/10 border-rose-500/20';
                  else if (stat.status === 'Blocked') statusColor = 'text-slate-400 bg-slate-400/10 border-slate-500/20';

                  return (
                    <tr key={sysName} className="border-b border-slate-900/50 hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-300">{sysName}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${statusColor}`}>
                          {stat.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className={stat.efficiencyScore < 50 ? 'text-rose-400' : 'text-slate-300'}>
                          {stat.efficiencyScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        {formatDuration(stat.actualMs)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Analysis Mode & Event Logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-widest gap-2 mb-4 flex items-center">
              <Network className="w-4 h-4 text-indigo-400" /> Recent Deviations
            </h3>
            <div className="space-y-3">
              {devEvents.slice(0, 5).map(ev => (
                <div key={ev.id} className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-lg text-xs">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-indigo-300">[{ev.systemName}]</span>
                    <span className="text-[9px] text-slate-500 font-mono">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-bold uppercase tracking-widest">{ev.type}</span>
                    <span className="text-[9px] text-slate-500">Cplx: {ev.complexity}/10</span>
                  </div>
                  {ev.notes && <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">{ev.notes}</p>}
                </div>
              ))}
              {devEvents.length === 0 && (
                <div className="text-center text-slate-500 text-xs py-6 font-mono border border-dashed border-slate-800 rounded">
                  No development events recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-widest gap-2 mb-4 flex items-center">
              Activity Heatmap
            </h3>
            <div className="space-y-4">
              {Object.entries(systemStats)
                .filter(([_, stat]) => stat.actualMs > 0 || stat.eventsCount > 0)
                .sort((a, b) => b[1].actualMs - a[1].actualMs)
                .slice(0, 5)
                .map(([sys, stat]) => {
                  const maxMs = Object.values(systemStats).reduce((max, s) => Math.max(max, s.actualMs), 1);
                  const width = Math.max(5, (stat.actualMs / maxMs) * 100);
                  return (
                    <div key={sys}>
                      <div className="flex justify-between text-[10px] uppercase font-mono text-slate-400 mb-1">
                        <span>{sys}</span>
                        <span>{formatDuration(stat.actualMs)}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-indigo-600 to-indigo-400"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
