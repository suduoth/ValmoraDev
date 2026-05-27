/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Task, Phase, ChatMessage, SimulatedObject } from '../types';
import { initialPhases } from '../data/roadmapData';

export interface DevHoursLog {
  id: string;
  date: string;
  phaseId: number;
  hours: number;
  description: string;
}

export interface OSSettings {
  theme: 'indigo' | 'slate' | 'contrast' | 'gold';
  mentorPersonality: 'unreal-pm' | 'technical-guru' | 'encouraging-partner';
  soundEnabled: boolean;
  devHoursBudget: number;
}

export function useOSState() {
  // Core structures
  const [phases, setPhases] = useState<Phase[]>(initialPhases);

  // Client States backed by LocalStorage
  const [completedPhases, setCompletedPhases] = useState<number[]>(() => {
    const saved = localStorage.getItem('gdos_completed_phases');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem('gdos_completed_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedSubtasks, setCompletedSubtasks] = useState<string[]>(() => {
    const saved = localStorage.getItem('gdos_completed_subtasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [taskNotes, setTaskNotes] = useState<{ [taskId: string]: string }>(() => {
    const saved = localStorage.getItem('gdos_task_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [phaseNotes, setPhaseNotes] = useState<{ [phaseId: number]: string }>(() => {
    const saved = localStorage.getItem('gdos_phase_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [bookmarkedTasks, setBookmarkedTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem('gdos_bookmarked_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyFocusList, setDailyFocusList] = useState<string[]>(() => {
    const saved = localStorage.getItem('gdos_daily_focus');
    return saved ? JSON.parse(saved) : [];
  });

  const [devHoursLogs, setDevHoursLogs] = useState<DevHoursLog[]>(() => {
    const saved = localStorage.getItem('gdos_hours_logs');
    return saved ? JSON.parse(saved) : [
      { id: "log_1", date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0], phaseId: 0, hours: 2.5, description: "Designed actor classification system blueprint architecture rules." },
      { id: "log_2", date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0], phaseId: 0, hours: 3.5, description: "Broke down data assets configurations and constructed directory trees bounds." }
    ];
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('gdos_chat_history');
    return saved ? JSON.parse(saved) : [
      {
        id: "chat_init",
        role: "assistant",
        content: "Greetings game architect. I am your Senior Unreal Engine 5 technical mentor. I will guide you through building Valmora step-by-step in a dependency-safe manner.\n\nAsk me any structural question about Phase 0, setting up Mover movement intentions, or decoupling Data Assets!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [createdObjects, setCreatedObjects] = useState<SimulatedObject[]>(() => {
    const saved = localStorage.getItem('gdos_created_objects');
    return saved ? JSON.parse(saved) : [
      {
        id: "obj_1",
        name: "Player Core Avatar",
        category: "Player",
        isCustom: false,
        notes: "Main mover-based player actor representing input-directed client actions.",
        customProperties: {}
      },
      {
        id: "obj_2",
        name: "Wild Boar AI",
        category: "NPC",
        isCustom: false,
        notes: "Neutral animal NPC that wanders and flees when player trace approaches.",
        customProperties: { Faction: "WildAnimal", StateTree: "ST_Boar_Behavior" }
      },
      {
        id: "obj_3",
        name: "Dungeon Metal Lever",
        category: "DynamicInteractable",
        isCustom: false,
        notes: "A dynamic switch that unlocks iron security grates on interaction triggers.",
        customProperties: { Cooldown: "1.5s", State: "Closed" }
      }
    ];
  });

  const [settings, setSettings] = useState<OSSettings>(() => {
    const saved = localStorage.getItem('gdos_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'indigo',
      mentorPersonality: 'unreal-pm',
      soundEnabled: true,
      devHoursBudget: 60
    };
  });

  // Active user selections
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Synchronize collections
  useEffect(() => {
    localStorage.setItem('gdos_completed_phases', JSON.stringify(completedPhases));
  }, [completedPhases]);

  useEffect(() => {
    localStorage.setItem('gdos_completed_tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('gdos_completed_subtasks', JSON.stringify(completedSubtasks));
  }, [completedSubtasks]);

  useEffect(() => {
    localStorage.setItem('gdos_task_notes', JSON.stringify(taskNotes));
  }, [taskNotes]);

  useEffect(() => {
    localStorage.setItem('gdos_phase_notes', JSON.stringify(phaseNotes));
  }, [phaseNotes]);

  useEffect(() => {
    localStorage.setItem('gdos_bookmarked_tasks', JSON.stringify(bookmarkedTasks));
  }, [bookmarkedTasks]);

  useEffect(() => {
    localStorage.setItem('gdos_daily_focus', JSON.stringify(dailyFocusList));
  }, [dailyFocusList]);

  useEffect(() => {
    localStorage.setItem('gdos_hours_logs', JSON.stringify(devHoursLogs));
  }, [devHoursLogs]);

  useEffect(() => {
    localStorage.setItem('gdos_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('gdos_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('gdos_created_objects', JSON.stringify(createdObjects));
  }, [createdObjects]);

  // Recalculate phases local models with locked, unlocked and percentage calculation
  useEffect(() => {
    const updatedPhases = initialPhases.map((phase) => {
      // 1. Establish locking statuses based on unlockedBy dependencies
      let status: Phase['status'] = 'Locked';
      const dependenciesMet = phase.dependencies.length === 0 || phase.dependencies.every(depName => {
        // Find dependency phase ID
        const depId = getPhaseIdByTitle(depName);
        return depId !== null && completedPhases.includes(depId);
      });

      if (phase.id === 0 || dependenciesMet) {
        status = 'Unlocked';
      }

      // Check if this phase itself is complete (all tasks are completed)
      const phaseTasks = phase.tasks;
      const allTasksDone = phaseTasks.length > 0 && phaseTasks.every(t => completedTasks.includes(t.id));

      if (allTasksDone && status === 'Unlocked') {
        status = 'Completed';
      }

      // 2. Calculate average progress percentage
      let progress = 0;
      if (phaseTasks.length > 0) {
        let taskWeights = 0;
        let completedWeight = 0;

        phaseTasks.forEach((t) => {
          taskWeights += 1;
          if (completedTasks.includes(t.id)) {
            completedWeight += 1;
          } else {
            // Give proportional scale based on completed subtasks
            const subt = t.subtasks;
            if (subt.length > 0) {
              const doneSubCount = subt.filter(s => completedSubtasks.includes(s.id)).length;
              completedWeight += doneSubCount / subt.length;
            }
          }
        });

        progress = Math.round((completedWeight / taskWeights) * 100);
      }

      return {
        ...phase,
        status,
        progress
      };
    });

    setPhases(updatedPhases);

    // Auto-complete or unlock parent milestones based on calculation
    updatedPhases.forEach((p) => {
      const isCompleteInRegistry = completedPhases.includes(p.id);
      if (p.status === 'Completed' && !isCompleteInRegistry) {
        setCompletedPhases(prev => [...prev, p.id]);
      } else if (p.status !== 'Completed' && isCompleteInRegistry) {
        setCompletedPhases(prev => prev.filter(id => id !== p.id));
      }
    });

  }, [completedTasks, completedSubtasks, completedPhases]);

  const getPhaseIdByTitle = (title: string): number | null => {
    const match = title.match(/Phase\s+(\d+)/i) || title.match(/(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return null;
  };

  // Helper State Modifiers
  const toggleTaskCompletion = (taskId: string) => {
    // Find target task
    const allTasks = phases.flatMap(p => p.tasks);
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    const isDone = completedTasks.includes(taskId);
    if (isDone) {
      setCompletedTasks(prev => prev.filter(id => id !== taskId));
      // Reset all subtasks as well
      const subtIds = task.subtasks.map(s => s.id);
      setCompletedSubtasks(prev => prev.filter(id => !subtIds.includes(id)));
    } else {
      setCompletedTasks(prev => [...prev, taskId]);
      // Complete all subtasks as well
      const subtIds = task.subtasks.map(s => s.id);
      setCompletedSubtasks(prev => {
        const unique = new Set([...prev, ...subtIds]);
        return Array.from(unique);
      });

      // Play minor notification sound if setting enabled
      if (settings.soundEnabled) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    }
  };

  const toggleSubtaskCompletion = (subtaskId: string, parentTaskId: string) => {
    const isDone = completedSubtasks.includes(subtaskId);
    let nextSubt: string[] = [];
    if (isDone) {
      nextSubt = completedSubtasks.filter(id => id !== subtaskId);
      setCompletedSubtasks(nextSubt);
      // Remove pure parent completion
      setCompletedTasks(prev => prev.filter(id => id !== parentTaskId));
    } else {
      nextSubt = [...completedSubtasks, subtaskId];
      setCompletedSubtasks(nextSubt);

      // Check if all subtasks of the parent are now completed
      const allTasks = phases.flatMap(p => p.tasks);
      const parentTask = allTasks.find(t => t.id === parentTaskId);
      if (parentTask) {
        const parentSubtIds = parentTask.subtasks.map(s => s.id);
        const allCompleted = parentSubtIds.every(id => id === subtaskId || completedSubtasks.includes(id));
        if (allCompleted) {
          setCompletedTasks(prev => {
            if (!prev.includes(parentTaskId)) return [...prev, parentTaskId];
            return prev;
          });
        }
      }
    }
  };

  const updateTaskNotes = (taskId: string, text: string) => {
    setTaskNotes(prev => ({
      ...prev,
      [taskId]: text
    }));
  };

  const updatePhaseNotes = (phaseId: number, text: string) => {
    setPhaseNotes(prev => ({
      ...prev,
      [phaseId]: text
    }));
  };

  const toggleBookmark = (taskId: string) => {
    setBookmarkedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleDailyFocus = (taskId: string) => {
    setDailyFocusList(prev => {
      const isFocused = prev.includes(taskId);
      if (isFocused) {
        return prev.filter(id => id !== taskId);
      } else {
        if (prev.length >= 5) {
          alert("Focus threshold reached limit! Maintain standard bounds by resolving today's 5 focus objectives first.");
          return prev;
        }
        return [...prev, taskId];
      }
    });
  };

  const addDevHoursLog = (phaseId: number, hours: number, description: string) => {
    const newLog: DevHoursLog = {
      id: "log_" + Date.now(),
      date: new Date().toISOString().split('T')[0],
      phaseId,
      hours,
      description: description || "Refined general step integration guidelines."
    };
    setDevHoursLogs(prev => [newLog, ...prev]);
  };

  const deleteDevHoursLog = (logId: string) => {
    setDevHoursLogs(prev => prev.filter(l => l.id !== logId));
  };

  const clearChatHistory = () => {
    setChatHistory([
      {
        id: "chat_init",
        role: "assistant",
        content: "Core dialogue system refreshed. Ask me any technical UE5 questions, movement constraints, or request advice on current architectural milestones!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const resetAllProgress = () => {
    if (confirm("MANDATORY CLEARING: Are you sure you want to reset all Valmora game production records, notes, analytics, and metrics back to Phase 0? This action is irreversible.")) {
      setCompletedPhases([]);
      setCompletedTasks([]);
      setCompletedSubtasks([]);
      setTaskNotes({});
      setPhaseNotes({});
      setBookmarkedTasks([]);
      setDailyFocusList([]);
      setDevHoursLogs([]);
      clearChatHistory();
      setSelectedPhaseId(0);
      setSelectedTaskId(null);
      setCreatedObjects([
        {
          id: "obj_1",
          name: "Player Core Avatar",
          category: "Player",
          isCustom: false,
          notes: "Main mover-based player actor representing input-directed client actions.",
          customProperties: {}
        },
        {
          id: "obj_2",
          name: "Wild Boar AI",
          category: "NPC",
          isCustom: false,
          notes: "Neutral animal NPC that wanders and flees when player trace approaches.",
          customProperties: { Faction: "WildAnimal", StateTree: "ST_Boar_Behavior" }
        },
        {
          id: "obj_3",
          name: "Dungeon Metal Lever",
          category: "DynamicInteractable",
          isCustom: false,
          notes: "A dynamic switch that unlocks iron security grates on interaction triggers.",
          customProperties: { Cooldown: "1.5s", State: "Closed" }
        }
      ]);
    }
  };

  // State import/export routines
  const exportProgressStateJSON = (): string => {
    const payload = {
      completedPhases,
      completedTasks,
      completedSubtasks,
      taskNotes,
      phaseNotes,
      bookmarkedTasks,
      dailyFocusList,
      devHoursLogs,
      settings,
      createdObjects,
      version: "1.3"
    };
    return JSON.stringify(payload, null, 2);
  };

  const importProgressStateJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.completedPhases) setCompletedPhases(parsed.completedPhases);
      if (parsed.completedTasks) setCompletedTasks(parsed.completedTasks);
      if (parsed.completedSubtasks) setCompletedSubtasks(parsed.completedSubtasks);
      if (parsed.taskNotes) setTaskNotes(parsed.taskNotes);
      if (parsed.phaseNotes) setPhaseNotes(parsed.phaseNotes);
      if (parsed.bookmarkedTasks) setBookmarkedTasks(parsed.bookmarkedTasks);
      if (parsed.dailyFocusList) setDailyFocusList(parsed.dailyFocusList);
      if (parsed.devHoursLogs) setDevHoursLogs(parsed.devHoursLogs);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.createdObjects) setCreatedObjects(parsed.createdObjects);
      return true;
    } catch (e) {
      console.error("Failed to parse progress file payload:", e);
      return false;
    }
  };

  return {
    phases,
    completedPhases,
    completedTasks,
    completedSubtasks,
    taskNotes,
    phaseNotes,
    bookmarkedTasks,
    dailyFocusList,
    devHoursLogs,
    chatHistory,
    setChatHistory,
    settings,
    setSettings,
    selectedPhaseId,
    setSelectedPhaseId,
    selectedTaskId,
    setSelectedTaskId,
    toggleTaskCompletion,
    toggleSubtaskCompletion,
    updateTaskNotes,
    updatePhaseNotes,
    toggleBookmark,
    toggleDailyFocus,
    addDevHoursLog,
    deleteDevHoursLog,
    clearChatHistory,
    resetAllProgress,
    exportProgressStateJSON,
    importProgressStateJSON,
    createdObjects,
    setCreatedObjects
  };
}
