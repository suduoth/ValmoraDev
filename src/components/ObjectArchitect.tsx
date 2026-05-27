/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  PlusCircle, 
  Settings, 
  Folder, 
  Database, 
  Workflow, 
  FileCode,
  Sparkles,
  Info,
  Copy,
  BookOpen,
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { dataGuidelines } from '../data/projectData';
import { SimulatedObject } from '../types';

interface ObjectArchitectProps {
  createdObjects: SimulatedObject[];
  setCreatedObjects: React.Dispatch<React.SetStateAction<SimulatedObject[]>>;
  completedTasks: string[];
  phases: any[];
}

export default function ObjectArchitect({ 
  createdObjects, 
  setCreatedObjects,
  completedTasks,
  phases
}: ObjectArchitectProps) {
  const [objectName, setObjectName] = useState<string>('Forest Berry Bush');
  const [category, setCategory] = useState<SimulatedObject['category']>('StaticInteractable');
  const [npcFaction, setNpcFaction] = useState<string>('WildAnimal');
  const [objectNotes, setObjectNotes] = useState<string>('A wild herb bush. Offers simple consumable berries when harvested.');
  const [isWaterConnected, setIsWaterConnected] = useState<boolean>(false);
  const [hasLoot, setHasLoot] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Find which phases are completed to map system statuses
  const isPhaseCompleted = (phaseId: number) => {
    const phase = phases?.find(p => p.id === phaseId);
    if (!phase) return false;
    return phase.tasks.every((t: any) => completedTasks.includes(t.id));
  };

  const getSystemWarnings = () => {
    const warnings: string[] = [];
    if (category === 'NPC') {
      if (!isPhaseCompleted(6)) {
        warnings.push("Requires Health Component (Phase 6 is incomplete). NPC will compile but lack damage & break triggers.");
      }
      if (!isPhaseCompleted(7)) {
        warnings.push("Requires AI Behavior StateTree (Phase 7 is incomplete). NPC will default to generic controller possess actions.");
      }
    } else if (category === 'DynamicInteractable') {
      if (!isPhaseCompleted(4)) {
        warnings.push("Requires Interaction System (Phase 4 is incomplete). Traces will fail to call interface triggers.");
      }
    } else if (category === 'StaticInteractable') {
      if (!isPhaseCompleted(2)) {
        warnings.push("Requires World Actor Base (Phase 2 is incomplete). Subclass casting boundaries will remain unstable.");
      }
    } else if (category === 'WorldSystemActor') {
      if (!isPhaseCompleted(8)) {
        warnings.push("Requires Save System (Phase 8 is incomplete). Level serialization dictionary will discard state updates.");
      }
    }
    return warnings;
  };

  // Handle generating a new object and adding to catalog
  const handleCreateObject = (e: FormEvent) => {
    e.preventDefault();
    if (!objectName.trim()) return;

    const normalizedId = "obj_" + Date.now();
    const newObj: SimulatedObject = {
      id: normalizedId,
      name: objectName,
      category,
      isCustom: true,
      notes: objectNotes || "No specific details logged.",
      customProperties: category === 'NPC' ? { Faction: npcFaction } : {}
    };

    setCreatedObjects(prev => [newObj, ...prev]);
    // Reset fields
    setObjectName('');
    setObjectNotes('');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Select first object to detail
  const [selectedSimId, setSelectedSimId] = useState<string>("obj_1");
  const activeSim = createdObjects.find(o => o.id === selectedSimId) || createdObjects[0];

  // Logic: Calculate strict naming conventions dynamically
  const getSimNamingMatch = (sim: SimulatedObject) => {
    const rawName = sim.name.replace(/[^a-zA-Z0-9]/g, '');
    switch (sim.category) {
      case 'Player':
        return { prefix: "BP_", suffix: "Character_Base", className: `BP_Player${rawName}_Base` };
      case 'NPC':
        return { prefix: "BP_NPC_", suffix: "Base", className: `BP_NPC_${rawName}` };
      case 'StaticInteractable':
        return { prefix: "BP_", suffix: "Base", className: `BP_${rawName}_Base` };
      case 'DynamicInteractable':
        return { prefix: "BP_", suffix: "Base", className: `BP_${rawName}_Base` };
      case 'WorldSystemActor':
        return { prefix: "BP_System_", suffix: "", className: `BP_System_${rawName}` };
      default:
        return { prefix: "SYS_", suffix: "", className: `SYS_${rawName}` };
    }
  };

  const namingMeta = getSimNamingMatch(activeSim);

  // Logic: Calculate direct Content Path under Phase 0 conventions
  const getSimFolderMatch = (sim: SimulatedObject) => {
    switch (sim.category) {
      case 'Player':
        return "Content/Valmora/Characters/";
      case 'NPC':
        return "Content/Valmora/Characters/AI/";
      case 'StaticInteractable':
        return "Content/Valmora/World/StaticInteractables/";
      case 'DynamicInteractable':
        return "Content/Valmora/Interaction/DynamicObjects/";
      case 'WorldSystemActor':
        return "Content/Valmora/Core/Systems/";
      default:
        return "Content/Valmora/Core/";
    }
  };

  const folderMeta = getSimFolderMatch(activeSim);

  // Logic: Blueprint Data Asset mapping templates for Phase 2
  const generateSimDA = (sim: SimulatedObject) => {
    const nameMatch = getSimNamingMatch(sim).className;
    return `/**
 * DA_ActorDefinition Data Asset Template
 * File: DA_${sim.name.replace(/[^a-zA-Z0-9]/g, '')}_Definition.uasset
 * Ingestion Target: ${nameMatch}
 */
{
  "ActorID": "${sim.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}_001",
  "ActorType": "${sim.category}",
  "VisualMesh": "StaticMesh'/Game/Valmora/Meshes/SM_${sim.name.replace(/[^a-zA-Z0-9]/g, '')}'",
  "MaxHealth": ${sim.category === 'StaticInteractable' ? 30 : sim.category === 'Player' ? 100 : 50},
  "CanBeDestroyed": ${sim.category !== 'WorldSystemActor' && sim.category !== 'Player'},
  "HasAI": ${sim.category === 'NPC'},
  "LootTable": ${sim.category === 'StaticInteractable' ? `"Loot_Materials_${sim.name.replace(/[^a-zA-Z0-9]/g, '')}"` : 'null'},
  "InteractionText": "${sim.category === 'StaticInteractable' ? 'Gather' : sim.category === 'DynamicInteractable' ? 'Interact' : 'Talk'}",
  "Tags": ["Valmora", "${sim.category.toLowerCase()}", "${sim.name.toLowerCase().split(' ')[0]}"]
}`;
  };

  // Logic: Save serialization mapping for Phase 8
  const generateSimSaveJSON = (sim: SimulatedObject) => {
    const rawClass = getSimNamingMatch(sim).className;
    return `{
  "UID": "Valmora_Map_Primary_${sim.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}_1104",
  "BlueprintClass": "${rawClass}",
  "Location": { "X": 105.4, "Y": -2240.2, "Z": 45.0 },
  "Rotator": { "Pitch": 0.0, "Yaw": 45.0, "Roll": 0.0 },
  "SaveState": {
    "CurrentHealth": ${sim.category === 'StaticInteractable' ? 30 : sim.category === 'Player' ? 100 : 50},
    "IsDestroyed": false,
    "GlobalUnlockTriggered": true,
    "DynamicLootPool": ["IT_Berries", "IT_Fiber"],
    "CustomParams": {
      "bIsOpen": false,
      "InteractionCount": 1
    }
  }
}`;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="object_architect_panel">
      {/* Intro Subtitle */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
        <span className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
          <Workflow className="w-6 h-6" />
        </span>
        <div>
          <h2 className="text-base font-sans font-bold text-slate-100">Simulate Object Creation & Architecture</h2>
          <p className="text-xs text-slate-400">
            Define a brand-new actor or sub-system to project required Epic structures, persistent folder nodes, and save schemas cleanly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left pane: Creator input Form & simulated Catalog */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section: Creator Form */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-indigo-400" /> 1. Creator Sandbox
            </h3>

            <form onSubmit={handleCreateObject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Object or System Name</label>
                <input 
                  type="text" 
                  value={objectName}
                  onChange={(e) => setObjectName(e.target.value)}
                  placeholder="e.g. Ancient Copper Ore Node"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-sans focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Architecture Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SimulatedObject['category'])}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 font-sans focus:outline-none focus:border-indigo-500 transition-all font-semibold cursor-pointer"
                >
                  <option value="StaticInteractable">StaticInteractable (Rock, Trees, Ores)</option>
                  <option value="DynamicInteractable">DynamicInteractable (Doors, Switches, Chests)</option>
                  <option value="NPC">NPC (Villagers, Wild Beasts, Enforcers)</option>
                  <option value="Player">Player (Controllable Avatars)</option>
                  <option value="WorldSystemActor">WorldSystemActor (Global Weather, Triggers)</option>
                </select>
              </div>

              {category === 'NPC' && (
                <div className="space-y-1.5 animate-slide-up">
                  <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase">NPC Controller Faction</label>
                  <select 
                    value={npcFaction}
                    onChange={(e) => setNpcFaction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 font-sans focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="Villager">Villager (Neutral state trees)</option>
                    <option value="WildAnimal">WildAnimal (Wanders & flees)</option>
                    <option value="HostileBandit">HostileBandit (Aggressive line tracing)</option>
                    <option value="CommerceMerchant">CommerceMerchant (Stores system components)</option>
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Architectural Description</label>
                <textarea 
                  value={objectNotes}
                  onChange={(e) => setObjectNotes(e.target.value)}
                  placeholder="Enter high-level purpose..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-350 font-sans focus:outline-none focus:border-indigo-500 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Dynamic Subsystem Warn Banner */}
              {getSystemWarnings().length > 0 && (
                <div className="bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-lg space-y-1.5 animate-slide-up select-none">
                  <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-450 shrink-0" /> Architectural Warning
                  </span>
                  <div className="space-y-1 text-[10px] text-slate-400 font-mono leading-normal">
                    {getSystemWarnings().map((warn, i) => (
                      <div key={i} className="flex gap-1.5 items-start">
                        <span className="text-rose-500 font-bold shrink-0">•</span>
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-bold font-sans tracking-wide transition-all uppercase cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Deploy Simulation Entry
              </button>
            </form>
          </div>

          {/* Section: Active Simulation Catalog Selection */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" /> 2. Project Object Directory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select any generated block template below to resolve dynamic Unreal structures and serialization rules.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {createdObjects.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => setSelectedSimId(sim.id)}
                  className={`w-full text-left p-2.5 rounded border transition-all flex items-center justify-between cursor-pointer ${
                    selectedSimId === sim.id 
                      ? 'bg-indigo-500/10 border-indigo-500/35' 
                      : 'bg-slate-900 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-black block">
                      {sim.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {sim.name}
                    </span>
                  </div>
                  {sim.isCustom ? (
                    <span className="text-[9px] font-mono font-bold text-indigo-400 border border-indigo-500/20 px-1 py-0.5 rounded bg-indigo-500/5">
                      custom
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-semibold text-slate-600 border border-slate-800 px-1 py-0.5 rounded bg-slate-950">
                      core
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right pane: Architectural rules analysis & templates */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold block mb-0.5">
              Active Simulation Target Details
            </span>
            <h2 className="text-lg font-bold text-slate-200">{activeSim.name}</h2>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{activeSim.notes}</p>
          </div>

          {/* Direct Naming and Folder Structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Required Naming Match (Phase 0)</span>
              <div className="flex items-center justify-between">
                <code className="text-xs text-indigo-400 font-mono font-bold">{namingMeta.className}</code>
                <button 
                  onClick={() => handleCopy(namingMeta.className, 'name')}
                  className="bg-slate-950 hover:bg-slate-850 p-1 rounded border border-slate-850 text-slate-400 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copiedText === 'name' && (
                <span className="text-[9px] text-emerald-400 font-mono block animate-fade-in">Copied to clipboard!</span>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Content Folder Path (Phase 0)</span>
              <div className="flex items-center justify-between">
                <code className="text-[10px] text-slate-250 font-mono">{folderMeta}</code>
                <button 
                  onClick={() => handleCopy(folderMeta, 'folder')}
                  className="bg-slate-950 hover:bg-slate-850 p-1 rounded border border-slate-850 text-slate-400 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copiedText === 'folder' && (
                <span className="text-[9px] text-emerald-400 font-mono block animate-fade-in">Copied to clipboard!</span>
              )}
            </div>
          </div>

          {/* Related Data Integration tabs */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase text-indigo-400 tracking-wider">
              3. Blueprint & Structural Compliance Rules
            </h4>

            {/* Ingestion Data Asset schema */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-400" /> DA_ActorDefinition Data Asset (Phase 2)
                </span>
                <button 
                  onClick={() => handleCopy(generateSimDA(activeSim), 'da')}
                  className="text-[10px] font-mono text-slate-400 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> {copiedText === 'da' ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="font-mono text-[10px] text-slate-400 overflow-x-auto bg-slate-950 p-3 rounded border border-slate-850 whitespace-pre max-h-56">
                {generateSimDA(activeSim)}
              </pre>
            </div>

            {/* Persistent ID Generation strategy */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-400" /> Save/Load Registry Configuration Serializer (Phase 8)
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The local serialization algorithm manages world states inside local directories base on Unique ID lookups.
              </p>
              <pre className="font-mono text-[10px] text-slate-400 overflow-x-auto bg-slate-950 p-3 rounded border border-slate-850 whitespace-pre max-h-56">
                {generateSimSaveJSON(activeSim)}
              </pre>
            </div>

            {/* Dynamic System Diagnostics & Integration Analyzer */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" /> Live System Integration Diagnostics
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Analyzing coupling requirements for <strong className="text-slate-300">{activeSim.name}</strong> based on sequential UE5 loose coupling standards:
              </p>
              
              <div className="space-y-2">
                {activeSim.category === 'NPC' && (
                  <>
                    <div className="p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg flex gap-2 text-[11px] text-slate-400">
                      <AlertTriangle className="w-4 h-4 text-rose-450 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-300 block font-semibold">Requires StateTree / Behavior Trees (Phase 7)</strong>
                        This NPC is currently a static mannequin. It requires high-performance State Trees to perform pathfinding and behavior triggers.
                      </div>
                    </div>
                    <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg flex gap-2 text-[11px] text-slate-400">
                      <AlertTriangle className="w-4 h-4 text-amber-550 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 block font-semibold">Requires Universal Health & Damage (Phase 6)</strong>
                        To react to weapon traces, player damage pipelines, or trigger a fleeing state, a reusable HealthComponent must be registered.
                      </div>
                    </div>
                    <div className="p-2.5 bg-indigo-505/5 border border-indigo-500/15 rounded-lg flex gap-2 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300 block font-semibold">Requires Interactable Interface (Phase 4)</strong>
                        Dialogue triggers and trading systems must register through BPI_Interactable to handle player prompt lines decoupling.
                      </div>
                    </div>
                  </>
                )}

                {activeSim.category === 'DynamicInteractable' && (
                  <>
                    <div className="p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg flex gap-2 text-[11px] text-slate-400">
                      <AlertTriangle className="w-4 h-4 text-rose-455 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-300 block font-semibold">Requires Decoupled Interface Traces (Phase 4)</strong>
                        DO NOT cast directly from the player. Standardize communication by implementing BPI_Interactable on this blueprint.
                      </div>
                    </div>
                    <div className="p-2.5 bg-amber-505/5 border border-amber-500/10 rounded-lg flex gap-2 text-[11px] text-slate-400">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 block font-semibold">Requires Persistence Serializers (Phase 8)</strong>
                        Dynamic states (e.g. Open/Closed level flags, lock triggers) must write to save arrays to prevent state resets on level reloads.
                      </div>
                    </div>
                  </>
                )}

                {activeSim.category === 'StaticInteractable' && (
                  <>
                    <div className="p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg flex gap-2 text-[11px] text-slate-400">
                      <AlertTriangle className="w-4 h-4 text-rose-455 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-300 block font-semibold">Requires Destruction & Break Triggers (Phase 6)</strong>
                        Resource nodes require a simple Break state to switch Static Mesh matrices into fractured remains on tool hit.
                      </div>
                    </div>
                    <div className="p-2.5 bg-indigo-505/5 border border-indigo-500/15 rounded-lg flex gap-2 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300 block font-semibold font-medium">Loot Table Assets Coupling (Phase 9)</strong>
                        Harvesting this actor requires integrating Loot Table data assets to inject materials back into the player slots.
                      </div>
                    </div>
                  </>
                )}

                {activeSim.category === 'Player' && (
                  <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg flex gap-2 text-[11px] text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300 block font-semibold">Mover System Alignment (Phase 1)</strong>
                      Player translations must feed movement intent vectors directly to the Mover physics component, decoupling from primitive actor transforms to protect multiplayer sweeps.
                    </div>
                  </div>
                )}

                {activeSim.category === 'WorldSystemActor' && (
                  <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg flex gap-2 text-[11px] text-slate-400">
                    <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-300 block font-semibold">Global Subsystem Binding (Phase 2 & 8)</strong>
                      World managers must register as GameInstance subsystems or level actors, saving state in global save profiles correctly.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interface implementation specification */}
            {(activeSim.category === 'StaticInteractable' || activeSim.category === 'DynamicInteractable' || activeSim.category === 'NPC') && (
              <div className="bg-indigo-505/10 border border-indigo-500/15 rounded-lg p-4 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">
                  BPI_Interactable Implementation Specs (Phase 4)
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Since this object behaves as an interactive entity in Valmora, it must override standard interface triggers:
                </p>
                <div className="font-mono text-[10px] text-slate-300 space-y-1 bg-slate-950/70 p-2.5 rounded border border-slate-850">
                  <div>- <span className="text-indigo-400 font-semibold">CanInteract()</span>: Returns true when weapon is compatible.</div>
                  <div>- <span className="text-indigo-400 font-semibold">Interact()</span>: Deducts health value and appends item stacks.</div>
                  <div>- <span className="text-indigo-400 font-semibold">GetInteractionData()</span>: Emits context: `&quot;[E] {activeSim.category === 'StaticInteractable' ? 'Harvest' : 'Activate'} {activeSim.name}&quot;`</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
