/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle, 
  Clock, 
  Layers, 
  AlertCircle,
  Code2,
  ListTodo,
  ArrowRight,
  Workflow,
  Sparkles,
  Award,
  Bookmark,
  Plus,
  HelpCircle,
  BookOpen,
  Info,
  Calendar,
  Share2,
  BookmarkCheck,
  Zap,
  CheckCircle2,
  CircleAlert
} from 'lucide-react';
import { Phase, Task, ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface RoadmapViewProps {
  phases: Phase[];
  completedPhases: number[];
  completedTasks: string[];
  completedSubtasks: string[];
  taskNotes: { [taskId: string]: string };
  phaseNotes: { [phaseId: number]: string };
  bookmarkedTasks: string[];
  dailyFocusList: string[];
  selectedPhaseId: number;
  setSelectedPhaseId: (phaseId: number) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (taskId: string | null) => void;
  toggleTaskCompletion: (taskId: string) => void;
  toggleSubtaskCompletion: (subtaskId: string, parentTaskId: string) => void;
  updateTaskNotes: (taskId: string, text: string) => void;
  updatePhaseNotes: (phaseId: number, text: string) => void;
  toggleBookmark: (taskId: string) => void;
  toggleDailyFocus: (taskId: string) => void;
  addDevHoursLog: (phaseId: number, hours: number, description: string) => void;
  onNavigate: (tab: 'dashboard' | 'roadmap' | 'focus' | 'ai-mentor' | 'notes' | 'architect' | 'systems' | 'analytics' | 'search' | 'settings') => void;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

interface CodeSnippet {
  title: string;
  language: string;
  content: string;
}

const PHASE_CODE_SNIPPETS: { [phaseId: number]: CodeSnippet[] } = {
  0: [
    {
      title: "BP_WorldActor_Base.h",
      language: "cpp",
      content: `#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "BP_WorldActor_Base.generated.h"

UCLASS()
class VALMORA_API ABP_WorldActor_Base : public AActor
{
    GENERATED_BODY()
    
public:
    ABP_WorldActor_Base();

protected:
    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Valmora|Rules")
    UDataAsset* ActorDefinition;
};`
    },
    {
      title: "DA_ActorDefinition.json",
      language: "json",
      content: `{
  "ActorID": "static_rock_01",
  "Category": "StaticInteractable",
  "Mesh": "StaticMesh'/Game/Valmora/Meshes/SM_BreakableRock.SM_BreakableRock'",
  "HealthValue": 50.0,
  "CanBeInteracted": true
}`
    }
  ],
  1: [
    {
      title: "MoverMovementIntent.cpp",
      language: "cpp",
      content: `void AMoverCharacter::ProduceInput(const FMoverInputCmdContext& InputCmd)
{
    // Generate orientation intent from input vector space
    FVector MoveDirection = GetLastMovementInputVector();
    MoveDirection.Normalize();

    FMoverInputCmdContext Context;
    Context.SetOrientationIntent(MoveDirection.Rotation());
    Context.SetControlRotation(PlayerController->GetControlRotation());
    
    MoverComponent->QueueInputContext(Context);
}`
    }
  ],
  2: [
    {
      title: "ConstructionScript.txt",
      language: "blueprint",
      content: `[Event Construction Script] -> [Read Data Asset Reference] -> [IsValid?]
                                                 |
                                                 v
                                    [Set Static Mesh Component Mesh]
                                                 |
                                                 v
                                    [Apply Material Overrides Array]`
    }
  ],
  3: [
    {
      title: "BuoyancyForceCalculator.cpp",
      language: "cpp",
      content: `FVector UBuoyancyComponent::CalculateBuoyancyForce(float WaterHeight, float ActorDepth)
{
    if (ActorDepth < WaterHeight)
    {
        float SubmergedRatio = FMath::Clamp((WaterHeight - ActorDepth) / BoundsHeight, 0.0f, 1.0f);
        float DisplacementVolume = SubmergedRatio * Volume;
        float BuoyantForce = FluidDensity * GravityForce * DisplacementVolume;
        
        return FVector(0.f, 0.f, BuoyantForce);
    }
    return FVector::ZeroVector;
}`
    }
  ],
  4: [
    {
      title: "BPI_Interactable.h",
      language: "cpp",
      content: `#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "BPI_Interactable.generated.h"

UINTERFACE(MinimalAPI, Blueprintable)
class UBPI_Interactable : public UInterface
{
    GENERATED_BODY()
};

class VALMORA_API IBPI_Interactable
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Valmora|Interact")
    bool CanInteract(AActor* Interactor);

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Valmora|Interact")
    void Interact(AActor* Interactor);
};`
    }
  ],
  5: [
    {
      title: "FrictionDragApplication.cpp",
      language: "cpp",
      content: `void USwimmingMoverMode::ApplyFluidLimits(float DeltaTime, FVector& Velocity)
{
    float FluidDragCoefficient = 2.5f;
    FVector Resistance = -Velocity * FluidDragCoefficient * DeltaTime;
    
    Velocity += Resistance;
    Velocity.Z += GravityScalar * GetGravityZ() * DeltaTime;
}`
    }
  ]
};

export default function RoadmapView({
  phases,
  completedPhases,
  completedTasks,
  completedSubtasks,
  taskNotes,
  phaseNotes,
  bookmarkedTasks,
  dailyFocusList,
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
  onNavigate,
  setChatHistory
}: RoadmapViewProps) {
  // State elements
  const [activeCodeTab, setActiveCodeTab] = useState<number>(0);
  const [activeSnippetIndex, setActiveSnippetIndex] = useState<{ [taskId: string]: number }>({});
  const [hoursToLog, setHoursToLog] = useState<{ [phaseId: number]: string }>({});
  const [logDescription, setLogDescription] = useState<{ [phaseId: number]: string }>({});
  const [securedSystemAlert, setSecuredSystemAlert] = useState<string | null>(null);

  const handleToggleTaskCompletion = (taskId: string, taskTitle: string) => {
    const isNowDone = !completedTasks.includes(taskId);
    toggleTaskCompletion(taskId);
    if (isNowDone) {
      setSecuredSystemAlert(taskTitle);
      setTimeout(() => {
        setSecuredSystemAlert(null);
      }, 4000);
      
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.5);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(523.25, audioCtx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        
        osc.start();
        osc2.start();
        osc.stop(audioCtx.currentTime + 0.6);
        osc2.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        // Fallback for secure tab policy
      }
    }
  };

  const activePhase = phases.find(p => p.id === selectedPhaseId) || phases[0];

  // Helper: check if phase dependency is completely met
  const isPhaseUnlocked = (phase: Phase): boolean => {
    if (phase.id === 0) return true;
    return phase.dependencies.every(depTitle => {
      const depNum = getPhaseIdByTitle(depTitle);
      return depNum !== null && completedPhases.includes(depNum);
    });
  };

  const getPhaseIdByTitle = (title: string): number | null => {
    const match = title.match(/Phase\s+(\d+)/i) || title.match(/(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return null;
  };

  const isSelectedUnlocked = isPhaseUnlocked(activePhase);
  const isSelectedCompleted = completedPhases.includes(activePhase.id);

  const handleConsultMentor = (query: string, taskTitle?: string) => {
    const consultPrompt = taskTitle 
      ? `Task Context: "${taskTitle}"\n\nQuestion: ${query}`
      : query;

    const userMessage: ChatMessage = {
      id: "msg_" + Date.now(),
      role: 'user',
      content: consultPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextPhaseId: activePhase.id,
      contextTaskId: selectedTaskId || undefined
    };

    setChatHistory(prev => [...prev, userMessage]);
    onNavigate('ai-mentor');
  };

  const handleQuickLogHours = (phaseId: number) => {
    const hoursVal = parseFloat(hoursToLog[phaseId] || "1.0");
    if (isNaN(hoursVal) || hoursVal <= 0) {
      alert("Invalid hours format configured.");
      return;
    }
    const desc = logDescription[phaseId]?.trim() || "Worked on sequential milestone checklists.";
    addDevHoursLog(phaseId, hoursVal, desc);
    
    // Clear quick logger
    setHoursToLog(prev => ({ ...prev, [phaseId]: "" }));
    setLogDescription(prev => ({ ...prev, [phaseId]: "" }));
    alert(`Success: Logged ${hoursVal} hours securely to Phase ${phaseId} sprint ledger.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative" id="roadmap_panel">
      {/* Floating System Secured Banner Alert */}
      <AnimatePresence>
        {securedSystemAlert && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            className="fixed top-6 right-6 z-50 bg-slate-950 border border-emerald-500/30 text-slate-100 p-4 rounded-xl shadow-2xl shadow-emerald-500/5 max-w-sm space-y-2 font-mono flex gap-3 select-none"
          >
            <span className="p-1 px-2 text-[9px] bg-emerald-500/10 rounded-md text-emerald-400 border border-emerald-500/20 font-black animate-pulse">
              SECURED
            </span>
            <div className="space-y-0.5 min-w-0">
              <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">System Integration Stabilized</h5>
              <p className="text-xs font-bold text-emerald-450 truncate">&quot;{securedSystemAlert}&quot;</p>
              <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">
                Modular boundary sweeps verified nominal. Decentralized memory limits active.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 1. Left Side Column: Sequential Phases Nav List */}
      <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col max-h-[750px] sticky top-6">
        <header className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Project Timeline</h3>
            <p className="text-[10px] text-slate-500 font-mono">Sequential dependency order</p>
          </div>
          <span className="text-[10px] bg-slate-950 text-indigo-400 font-bold px-2 py-0.5 rounded border border-indigo-500/10 font-mono">
            Phase 0 - 5
          </span>
        </header>

        <div className="overflow-y-auto p-4 space-y-2.5">
          {phases.map((phase) => {
            const unlocked = isPhaseUnlocked(phase);
            const completed = completedPhases.includes(phase.id);
            const isSelected = selectedPhaseId === phase.id;

            return (
              <motion.button
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={phase.id}
                onClick={() => {
                  setSelectedPhaseId(phase.id);
                  setSelectedTaskId(null);
                }}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 cursor-pointer relative group ${
                  isSelected 
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-md' 
                    : unlocked
                      ? 'bg-slate-900 border-slate-805 hover:border-slate-705'
                      : 'bg-slate-950/60 border-slate-900/70 opacity-40 hover:opacity-50'
                }`}
              >
                {/* Completion indicators */}
                <div className="mt-0.5 shrink-0 select-none">
                  {completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : unlocked ? (
                    <Unlock className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-700" />
                  )}
                </div>

                <div className="space-y-1 w-full overflow-hidden text-ellipsis">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-mono uppercase font-bold text-indigo-400">
                      PHASE {phase.id}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">{phase.estimated_time}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-205 leading-snug group-hover:text-slate-100 transition-colors">
                    {phase.title}
                  </h4>
                  {phase.progress > 0 && (
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden shrink-0 mt-1 flex border border-slate-900">
                      <motion.div 
                        className="bg-indigo-500 h-full rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.progress}%` }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Right Side Column: Deep dive selection criteria */}
      <div className="lg:col-span-8 space-y-6">
        {/* Phase Header detail strip */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="pb-5 border-b border-slate-900 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-450 bg-indigo-500/10 border border-indigo-505/20 px-2.5 py-0.5 rounded w-fit block">
                PHASE {activePhase.id} DIRECTIVE
              </span>
              <h2 className="text-xl font-bold text-slate-105 tracking-tight font-sans">
                {activePhase.title}
              </h2>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-450 mt-1">
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-805 flex items-center gap-1">
                  <Workflow className="w-3.5 h-3.5 text-indigo-400" /> Complexity: {activePhase.difficulty}
                </span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-805 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Estimate: {activePhase.estimated_time}
                </span>
              </div>
            </div>

            {/* Locked vs active label widget */}
            <div className="bg-slate-900/60 border border-slate-850 rounded-lg p-3.5 max-w-xs text-right shrink-0 select-none">
              <div className={`text-xs font-mono font-bold ${
                isSelectedCompleted ? 'text-emerald-400' : isSelectedUnlocked ? 'text-indigo-405' : 'text-rose-455'
              }`}>
                {isSelectedCompleted ? '● STAGE MASTERED' : isSelectedUnlocked ? '● PROGRESSING' : '🔒 STAGE LOCKED'}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal mt-1 block">
                {isSelectedCompleted ? 'Checked off and locked in snapshot.' : isSelectedUnlocked ? 'Fulfill task parameters to unlock subsequent phases.' : 'Check off prerequisite sequential phases first.'}
              </p>
            </div>
          </div>

          {/* Goal card & Why it matters layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-400 font-bold block mb-1">Creative Objective</span>
              <p className="text-xs text-slate-205 leading-relaxed font-semibold font-sans">{activePhase.goal}</p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-rose-400 font-bold block mb-1 font-semibold">Decoupling Importance</span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{activePhase.why_it_matters}</p>
            </div>
          </div>

          {/* Active Phase Milestone logs indicators */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-100 uppercase font-mono tracking-wider flex items-center gap-1.5 select-none">
              <Award className="w-4 h-4 text-indigo-440" /> Milestone Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activePhase.milestones.map((mil, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-850 rounded-lg p-3 text-slate-351 flex gap-2 w-full truncate">
                  <span className="text-indigo-455 font-mono font-bold shrink-0">{idx + 1}.</span>
                  <span className="truncate whitespace-normal leading-relaxed">{mil}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Locked Warnings */}
          {!isSelectedUnlocked && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs flex gap-3 text-slate-300">
              <CircleAlert className="w-5 h-5 text-rose-450 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <strong className="text-slate-101 block mb-1 font-semibold">Roadmap Dependency Guard Alert:</strong>
                Do not skip sequential development bounds. Standard Epic Games mover classes require completed base modules:
                <div className="flex flex-wrap gap-2 mt-2">
                  {activePhase.dependencies.map((depName, idx) => (
                    <span key={idx} className="bg-rose-500/15 border border-rose-500/20 text-[10px] px-2 py-0.5 rounded font-mono text-rose-300 animate-pulse">
                      {depName} Required
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Detailed Tasks Section */}
        <div className="space-y-5">
          <div className="flex justify-between items-center select-none">
            <h3 className="text-sm font-semibold text-slate-101 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <ListTodo className="w-4.5 h-4.5 text-indigo-400" /> Production Action Specs Block
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              {activePhase.tasks.filter(t => completedTasks.includes(t.id)).length} / {activePhase.tasks.length} Complete
            </span>
          </div>

          <div className="space-y-5">
            {activePhase.tasks.map((task) => {
              const isTaskDone = completedTasks.includes(task.id);
              const isBookmarked = bookmarkedTasks.includes(task.id);
              const isFocused = dailyFocusList.includes(task.id);
              const currentNote = taskNotes[task.id] || "";
              
              const isInspecting = selectedTaskId === task.id;

              return (
                <motion.div 
                  layout
                  key={task.id}
                  className={`border rounded-xl p-5 space-y-4 transition-all ${
                    isTaskDone 
                      ? 'bg-emerald-500/5 border-emerald-500/25 shadow-sm shadow-emerald-555/5' 
                      : 'bg-slate-950 border-slate-805'
                  }`}
                >
                  {/* Task Header info */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border ${
                          task.priority === 'High' ? 'bg-rose-500/10 text-rose-455 border-rose-500/20' : 'bg-slate-900 text-slate-405 border-slate-805'
                        }`}>
                          {task.priority} Priority
                        </span>
                        <span className="bg-slate-900 border border-slate-850 text-slate-500 text-[9px] font-mono px-1.5 rounded">
                          Estimate: {task.estimated_time}
                        </span>
                      </div>
                      <h4 className={`text-sm font-semibold font-sans leading-relaxed flex items-center gap-2 ${isTaskDone ? 'text-slate-500 line-through' : 'text-slate-101'}`}>
                        {task.title}
                      </h4>
                      {!isTaskDone && <p className="text-xs text-slate-401 leading-relaxed font-sans">{task.description}</p>}
                    </div>

                    {/* Action buttons list */}
                    <div className="flex gap-1.5 select-none">
                      {/* Queue Focus */}
                      <button
                        onClick={() => toggleDailyFocus(task.id)}
                        className={`p-1.5 rounded border transition-all cursor-pointer outline-none ${
                          isFocused 
                            ? 'bg-rose-500/15 text-rose-450 border-rose-500/25' 
                            : 'bg-slate-900 border-slate-805 text-slate-550 hover:text-slate-350'
                        }`}
                        title={isFocused ? "Remove from Daily Focus Mode" : "Pin to Daily Focus mode Queue"}
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Bookmark toggle */}
                      <button
                        onClick={() => toggleBookmark(task.id)}
                        className={`p-1.5 rounded border transition-all cursor-pointer outline-none ${
                          isBookmarked 
                            ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25' 
                            : 'bg-slate-900 border-slate-805 text-slate-550 hover:text-slate-350'
                        }`}
                        title={isBookmarked ? "Delete index Bookmark" : "Bookmark task specs"}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Complete task */}
                      <button
                        onClick={() => handleToggleTaskCompletion(task.id, task.title)}
                        disabled={!isSelectedUnlocked}
                        className={`p-1.5 rounded border transition-all cursor-pointer outline-none ${
                          isTaskDone 
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 animate-pulse' 
                            : 'bg-slate-900 border-slate-805 text-slate-550 hover:text-slate-350'
                        }`}
                        title={isTaskDone ? "Mark Pending" : "Master Task Specification"}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Collapsed Resolved State summary for completed task */}
                  {isTaskDone && !isInspecting ? (
                    <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg text-xs leading-relaxed animate-fade-in select-none">
                      <div className="flex items-center gap-2 text-emerald-400/80 font-mono text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-405 animate-ping"></span>
                        <span>[SYSTEM STABILIZED & SECURED] Clean blueprint boundary parameters asserted.</span>
                      </div>
                      <button
                        onClick={() => setSelectedTaskId(task.id)}
                        className="text-[10px] uppercase font-mono font-bold text-indigo-400 hover:text-indigo-300 outline-none hover:underline cursor-pointer"
                      >
                        Inspect Specifications
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Why this exists statement */}
                      <div className="p-3.5 bg-slate-900/50 rounded-xl border border-slate-900 text-xs">
                        <strong className="text-[10px] font-mono uppercase tracking-wider text-indigo-405 block mb-0.5">Architectural Importance:</strong>
                        <span className="text-slate-401 leading-relaxed font-sans">{task.why_this_exists}</span>
                      </div>

                      {/* SUBTASKS */}
                      {task.subtasks.length > 0 && (
                        <div className="space-y-2 border-t border-slate-900/45 pt-3 pl-1">
                          <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500 flex items-center gap-1">
                            <Share2 className="w-3.5 h-3.5" /> Sub-milestone Checks
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {task.subtasks.map((sub) => {
                              const isSubDone = completedSubtasks.includes(sub.id);
                              return (
                                <label 
                                  key={sub.id} 
                                  className={`p-2.5 rounded-lg border transition-all select-none flex items-center gap-2.5 cursor-pointer ${
                                    isSubDone 
                                      ? 'bg-emerald-500/5 border-emerald-500/15 text-slate-450' 
                                      : 'bg-slate-900/40 border-slate-855 text-slate-300 hover:text-slate-100'
                                  }`}
                                >
                                  <input 
                                    type="checkbox"
                                    checked={isSubDone}
                                    onChange={() => toggleSubtaskCompletion(sub.id, task.id)}
                                    disabled={!isSelectedUnlocked}
                                    className="rounded border-slate-700 text-indigo-505 focus:ring-indigo-500 focus:ring-offset-slate-950 bg-slate-950 w-3.5 h-3.5 shrink-0"
                                  />
                                  <div className="space-y-0.5 leading-tight truncate">
                                    <span className={isSubDone ? 'line-through text-slate-550' : 'font-medium'}>{sub.title}</span>
                                    <span className="text-[8px] font-mono text-slate-500 block">Effort: {sub.estimated_effort} | Tags: {sub.tags.join(", ")}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Secondary Details accordion */}
                  <div className="flex gap-2.5 pt-1.5 select-none">
                    <button
                      onClick={() => setSelectedTaskId(isInspecting ? null : task.id)}
                      className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer outline-none hover:underline"
                    >
                      <span>{isInspecting ? "Collapse Directives" : "Expand Architectural Directives (Mistakes, Code, Suggestions)"}</span>
                      <ArrowRight className={`w-3 h-3 transition-transform ${isInspecting ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* EXPANDED SYSTEM ARCHITECTURE SHEETS */}
                  {isInspecting && (
                    <div className="pt-4 border-t border-slate-900 space-y-4 animate-fade-in pl-1">
                      
                      {/* Tips vs Mistakes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans leading-relaxed">
                        <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-rose-450 font-semibold block">Avoid Coding Pitfalls:</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-350 list-none pl-0">
                            {task.common_mistakes.map((mis, idx) => (
                              <li key={idx} className="flex gap-1.5 items-start">
                                <span className="text-rose-450 font-bold">✗</span>
                                <span>{mis}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Refactoring Suggestions:</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-350 list-none pl-0">
                            {task.suggestions.map((sug, idx) => (
                              <li key={idx} className="flex gap-1.5 items-start">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span>{sug}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Code Snippets embedded */}
                      {(PHASE_CODE_SNIPPETS[activePhase.id] || []).length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500 block flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5" /> Reference Template Code Snip
                          </span>
                          <div className="flex border-b border-slate-900 gap-1 overflow-x-auto text-[10px] font-mono">
                            {(PHASE_CODE_SNIPPETS[activePhase.id] || []).map((snip, idx) => {
                              const taskIdSnip = activeSnippetIndex[task.id] ?? 0;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setActiveSnippetIndex(prev => ({ ...prev, [task.id]: idx }))}
                                  className={`px-3 py-1.5 border-t border-x rounded-t-md transition-all cursor-pointer ${
                                    taskIdSnip === idx 
                                      ? 'bg-slate-900 border-slate-800 text-indigo-400 font-bold' 
                                      : 'border-transparent text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {snip.title}
                                </button>
                              );
                            })}
                          </div>

                          <div className="bg-slate-900 border border-slate-800 rounded-b-lg rounded-tr-lg p-3.5 font-mono text-[10.5px] text-slate-300 overflow-x-auto max-h-[220px]">
                            <pre className="whitespace-pre">{(PHASE_CODE_SNIPPETS[activePhase.id] || [])[activeSnippetIndex[task.id] ?? 0]?.content}</pre>
                          </div>
                        </div>
                      )}

                      {/* Interactive AI Inquire templates */}
                      {task.ai_help_prompts && task.ai_help_prompts.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10.5px] font-mono font-bold text-indigo-400 uppercase flex items-center gap-1 select-none">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Discuss Specific Task With AI Mentor
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {task.ai_help_prompts.map((p, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleConsultMentor(p, task.title)}
                                className="p-2.5 text-left bg-slate-900 hover:bg-slate-850/80 border border-slate-805 rounded-xl text-xs flex justify-between items-center transition-all cursor-pointer text-slate-300 outline-none"
                              >
                                <span className="font-medium font-mono leading-relaxed truncate">{p}</span>
                                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Notes block auto-saved */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1 select-none">
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Custom task notes (Autosaves)
                        </label>
                        <textarea
                          value={currentNote}
                          onChange={(e) => updateTaskNotes(task.id, e.target.value)}
                          placeholder="Log coordinate offsets, bugs, refactor decisions or variables checklist..."
                          className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs text-slate-300 placeholder-slate-550 focus:outline-none focus:border-indigo-500 outline-none h-20"
                        />
                      </div>

                    </div>
                  )}

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4. Side Quest Checklist - Log Hours and Notes to Phase */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-900 pb-2">
            <h3 className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Plus className="w-4 h-4 text-indigo-400 shrink-0" /> Quick Phase Hours Logger
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Accumulate worked sprint hours to this phase index</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="number"
              step="0.1"
              min="0.1"
              value={hoursToLog[activePhase.id] || ""}
              onChange={(e) => setHoursToLog(prev => ({ ...prev, [activePhase.id]: e.target.value }))}
              placeholder="1.5 (hrs)"
              className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-28 font-mono text-center"
            />
            
            <input 
              type="text"
              value={logDescription[activePhase.id] || ""}
              onChange={(e) => setLogDescription(prev => ({ ...prev, [activePhase.id]: e.target.value }))}
              placeholder="Describe work completed inside phase..."
              className="bg-slate-900 border border-slate-800 px-4 py-2 text-xs text-slate-201 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 flex-grow"
            />

            <button
              onClick={() => handleQuickLogHours(activePhase.id)}
              className="bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/20 text-white font-semibold rounded-lg px-4 py-2 text-xs transition-all cursor-pointer outline-none shrink-0"
            >
              Log Work
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
