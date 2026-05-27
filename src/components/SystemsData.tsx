/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Network,
  Activity,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Workflow,
  Folder,
  PlusCircle,
  Compass,
  ZoomIn,
  ZoomOut,
  Move,
  RefreshCw,
  Sliders,
  Database,
  SlidersHorizontal,
  FileCode,
  Layers,
  Clock,
  Unlock,
  History,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Phase, SimulatedObject, Task } from '../types';

interface SystemsDataProps {
  createdObjects: SimulatedObject[];
  phases: Phase[];
  completedTasks: string[];
  onNavigate: (tab: 'dashboard' | 'roadmap' | 'focus' | 'ai-mentor' | 'notes' | 'architect' | 'systems' | 'analytics' | 'search' | 'settings') => void;
  onSelectPhase: (phaseId: number) => void;
}

interface GraphNode {
  id: string;
  label: string;
  category: string;
  phaseId: number;
  x: number;
  y: number;
  description: string;
  unrealType: string;
}

interface GraphEdge {
  from: string;
  to: string;
  type: 'Cast' | 'Interface' | 'Data';
}

interface CouplingCell {
  row: string;
  col: string;
  status: 'Direct' | 'Indirect' | 'Decoupled' | 'None';
  risk: 'Low' | 'Medium' | 'High';
  explanation: string;
  solution: string;
}

export default function SystemsData({
  createdObjects,
  phases,
  completedTasks,
  onNavigate,
  onSelectPhase
}: SystemsDataProps) {
  const [activeTab, setActiveTab] = useState<'graph' | 'health' | 'timeline' | 'matrix'>('graph');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('Movement');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Pan & Zoom graph states
  const [scale, setScale] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 15 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Matrix states
  const [activeCellRow, setActiveCellRow] = useState<string>('Movement');
  const [activeCellCol, setActiveCellCol] = useState<string>('Interaction');

  // Tree states
  const [selectedTreeNode, setSelectedTreeNode] = useState<any | null>(null);

  // Inheritance tree configuration mapping
  const buildInheritanceTree = () => {
    const customObjects = createdObjects.filter(
      co => co.id !== 'obj_1' && co.id !== 'obj_2' && co.id !== 'obj_3'
    );

    const tree = [
      {
        id: "AActor",
        name: "AActor (Unreal Base Class)",
        category: "EngineBase",
        sysId: "WorldActors",
        phaseId: 0,
        description: "Standard Epic Games base level actor. Baseline container representing base persistent entities.",
        dependsOn: [] as string[],
        dependents: ["BP_WorldActor_Base", "AMoverCharacter_Base", "APawn"],
        children: [
          {
            id: "BP_WorldActor_Base",
            name: "BP_WorldActor_Base",
            category: "WorldSystemActor",
            sysId: "WorldActors",
            phaseId: 2,
            description: "Loose-coupled base class managing dynamic bounds, mesh overlays, and registry handles.",
            dependsOn: ["WorldActors System"],
            dependents: ["BP_HarvestableTree", "BP_BreakableRock", "BP_DungeonMetalGate"],
            children: [
              {
                id: "BP_HarvestableTree",
                name: "BP_HarvestableTree",
                category: "StaticInteractable",
                sysId: "WorldActors",
                phaseId: 2,
                description: "Physical timber node. Supports mechanical tool overrides and break thresholds.",
                dependsOn: ["BP_WorldActor_Base", "Destruction Subsystem"],
                dependents: ["Save System", "Inventory/Loot System"]
              },
              {
                id: "BP_BreakableRock",
                name: "BP_BreakableRock",
                category: "StaticInteractable",
                sysId: "WorldActors",
                phaseId: 2,
                description: "Ore mining mesh. Emits fractured particle debris on sword traces.",
                dependsOn: ["BP_WorldActor_Base", "Destruction Subsystem"],
                dependents: ["Save System", "Inventory/Loot System"]
              },
              {
                id: "BP_DungeonMetalGate",
                name: "BP_DungeonMetalGate",
                category: "DynamicInteractable",
                sysId: "Interaction",
                phaseId: 4,
                description: "Swinging door barrier. Activates using BPI_Interactable without explicit casting bounds.",
                dependsOn: ["BP_WorldActor_Base", "Interaction Interface"],
                dependents: ["Save System"]
              },
              ...customObjects
                .filter(co => co.category === 'DynamicInteractable' || co.category === 'StaticInteractable')
                .map(co => ({
                  id: co.id,
                  name: `BP_${co.name.replace(/[^a-zA-Z0-9]/g, '')}`,
                  category: co.category,
                  sysId: co.category === 'DynamicInteractable' ? "Interaction" : "WorldActors",
                  phaseId: co.category === 'DynamicInteractable' ? 4 : 2,
                  description: co.notes || "Custom architected actor defined in sandbox.",
                  dependsOn: ["BP_WorldActor_Base", co.category === 'DynamicInteractable' ? "Interaction Interface" : "WorldActors System"],
                  dependents: ["Save System", co.category === 'DynamicInteractable' ? "Inventory System" : "Loot System"]
                }))
            ]
          },
          {
            id: "AMoverCharacter_Base",
            name: "AMoverCharacter_Base",
            category: "EngineBase",
            sysId: "Movement",
            phaseId: 1,
            description: "Multiplayer-safe character base integrating Epic mechanical Mover behaviors.",
            dependsOn: ["Movement System"],
            dependents: ["BP_PlayerCharacter_Base"],
            children: [
              {
                id: "BP_PlayerCharacter_Base",
                name: "BP_PlayerCharacter_Base",
                category: "Player",
                sysId: "Movement",
                phaseId: 1,
                description: "Solo playable avatar. Maps input vectors directly to movement component intent vectors.",
                dependsOn: ["AMoverCharacter_Base", "Player Camera Manager"],
                dependents: ["Interaction System", "Inventory Component"]
              }
            ]
          },
          {
            id: "APawn",
            name: "APawn (Base Controller Shell)",
            category: "EngineBase",
            sysId: "AI",
            phaseId: 0,
            description: "Agent representation suited to custom external controller possess actions.",
            dependsOn: [],
            dependents: ["BP_NPC_Base"],
            children: [
              {
                id: "BP_NPC_Base",
                name: "BP_NPC_Base (AI Enabled)",
                category: "NPC",
                sysId: "AI",
                phaseId: 7,
                description: "Possessable AI pawn. Houses custom Sense Listeners and StateTree logic units.",
                dependsOn: ["APawn", "Interface BPI_Interactable", "HealthComponent"],
                dependents: ["BP_NPC_Villager_Base", "BP_NPC_Bandit_Base"],
                children: [
                  {
                    id: "BP_NPC_Villager_Base",
                    name: "BP_NPC_Villager_Base",
                    category: "NPC",
                    sysId: "AI",
                    phaseId: 7,
                    description: "Ambient villager. Performs random waypoint sweeps and reacts to simple dialog triggers.",
                    dependsOn: ["BP_NPC_Base", "AI Dialogue Subsystem"],
                    dependents: [] as string[]
                  },
                  {
                    id: "BP_NPC_Bandit",
                    name: "BP_NPC_Bandit",
                    category: "NPC",
                    sysId: "AI",
                    phaseId: 10,
                    description: "Hostile guard. Exercises threat metrics to possess high Aggro triggers.",
                    dependsOn: ["BP_NPC_Base", "AI Combat Subsystem"],
                    dependents: [] as string[]
                  },
                  ...customObjects
                    .filter(co => co.category === 'NPC')
                    .map(co => ({
                      id: co.id,
                      name: `BP_NPC_${co.name.replace(/[^a-zA-Z0-9]/g, '')}`,
                      category: co.category,
                      sysId: "AI",
                      phaseId: 7,
                      description: co.notes || "Custom AI StateTree agent defined in sandbox.",
                      dependsOn: ["BP_NPC_Base", "HealthComponent"],
                      dependents: ["Combat System"]
                    }))
                ]
              }
            ]
          },
          ...customObjects
            .filter(co => co.category === 'WorldSystemActor')
            .map(co => ({
              id: co.id,
              name: `SYS_${co.name.replace(/[^a-zA-Z0-9]/g, '')}`,
              category: co.category,
              sysId: "SaveSystem",
              phaseId: 8,
              description: co.notes || "Custom environment / game instance management subsystem.",
              dependsOn: ["AActor", "SaveSystem Node"],
              dependents: [] as string[]
            }))
        ]
      }
    ];

    return tree;
  };

  const renderProjectTreeNode = (node: any, depth: number = 0): React.ReactNode => {
    const status = getSystemStatus(node.sysId);
    let statusColor = 'text-slate-400 border-slate-900';
    if (status === 'Stable') statusColor = 'text-emerald-400 border-emerald-950 bg-emerald-950/5';
    else if (status === 'In Progress') statusColor = 'text-indigo-405 border-indigo-950 bg-indigo-955/5';
    else if (status === 'Blocked') statusColor = 'text-rose-455 border-rose-950 bg-rose-955/5';

    const isNodeSelected = selectedTreeNode?.id === node.id;

    return (
      <div key={node.id} className="space-y-1">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTreeNode(node);
          }}
          className={`flex items-center justify-between p-2 rounded border transition-all cursor-pointer text-xs ${
            isNodeSelected 
              ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 font-bold shadow-lg shadow-indigo-500/5' 
              : `hover:bg-slate-900/40 ${statusColor}`
          }`}
          style={{ marginLeft: `${depth * 10}px` }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {node.children && node.children.length > 0 ? (
              <span className="text-[10px] opacity-80 shrink-0">📂</span>
            ) : (
              <span className="text-[10px] opacity-55 shrink-0">📄</span>
            )}
            <span className="truncate">{node.name}</span>
          </div>
          <span className={`text-[7.5px] font-mono shrink-0 px-1 py-0.2 rounded font-black uppercase text-bold ${
            status === 'Stable' ? 'bg-emerald-500/10 text-emerald-400' :
            status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' :
            status === 'Blocked' ? 'bg-rose-500/10 text-rose-400' :
            'bg-slate-800 text-slate-500'
          }`}>
            {status}
          </span>
        </div>
        {node.children && (
          <div className="space-y-1">
            {node.children.map((child: any) => renderProjectTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const systemsList = [
    'Movement', 'Camera', 'WorldActors', 'Interaction', 'WaterVolume', 'Destruction', 'AI', 'SaveSystem', 'Inventory', 'Combat'
  ];

  // System Graph Nodes definitions with custom visual coordinates
  const nodes: GraphNode[] = [
    { id: 'Camera', label: 'Camera Controller', category: 'General', phaseId: 1, x: 80, y: 220, unrealType: 'PlayerCameraManager', description: 'Manages field of view inputs and orientation intentions decoupled from physical ticks.' },
    { id: 'Movement', label: 'Movement (Mover)', category: 'Movement', phaseId: 1, x: 220, y: 220, unrealType: 'MoverComponent', description: 'Multiplayer-safe physics state machine tracking velocity intentions.' },
    { id: 'WorldActors', label: 'World Actors Base', category: 'Actors', phaseId: 2, x: 360, y: 100, unrealType: 'BP_WorldActor_Base', description: 'Base persistent blueprints utilizing lightweight static meshes.' },
    { id: 'Interaction', label: 'Interaction System', category: 'Traces', phaseId: 4, x: 500, y: 100, unrealType: 'BPI_Interactable', description: 'Line trace collection executing decoupled blueprint interface triggers.' },
    { id: 'WaterVolume', label: 'Water Physics', category: 'MovementOverride', phaseId: 5, x: 360, y: 340, unrealType: 'MoverSwimmingSubsystem', description: 'Fluid volume collision modifying kinematic movement velocity multipliers.' },
    { id: 'Destruction', label: 'Health & Destruction', category: 'Stats', phaseId: 6, x: 640, y: 100, unrealType: 'HealthComponent', description: 'Reusable health trackers capturing weapon hits, trigger death meshes, and breakables.' },
    { id: 'AI', label: 'AI Behavior Trees', category: 'AI', phaseId: 7, x: 500, y: 340, unrealType: 'StateTreeComponent', description: 'Neural State Trees driving sensory scans and pathing intention loops.' },
    { id: 'SaveSystem', label: 'Save & Registry', category: 'Persistence', phaseId: 8, x: 640, y: 340, unrealType: 'SaveGame_Base', description: 'Serializes active actors locations and custom level state dictionaries.' },
    { id: 'Inventory', label: 'Inventory & Loot', category: 'Economy', phaseId: 9, x: 780, y: 100, unrealType: 'InventoryComponent', description: 'Data asset lists tracking materials gathered from harvested world components.' },
    { id: 'Combat', label: 'Combat & Damage', category: 'Action', phaseId: 10, x: 780, y: 340, unrealType: 'CombatComponent', description: 'Interprets impact sweeps and triggers ragdolls or death sequences.' }
  ];

  // Directed edges (Dependencies)
  const edges: GraphEdge[] = [
    { from: 'Camera', to: 'Movement', type: 'Data' },
    { from: 'WorldActors', to: 'Interaction', type: 'Interface' },
    { from: 'WorldActors', to: 'Destruction', type: 'Data' },
    { from: 'Movement', to: 'WaterVolume', type: 'Cast' },
    { from: 'Movement', to: 'AI', type: 'Cast' },
    { from: 'WorldActors', to: 'AI', type: 'Data' },
    { from: 'Interaction', to: 'Destruction', type: 'Interface' },
    { from: 'Interaction', to: 'SaveSystem', type: 'Data' },
    { from: 'WorldActors', to: 'SaveSystem', type: 'Data' },
    { from: 'Destruction', to: 'Inventory', type: 'Interface' },
    { from: 'Interaction', to: 'Inventory', type: 'Interface' },
    { from: 'Destruction', to: 'Combat', type: 'Data' },
    { from: 'AI', to: 'Combat', type: 'Cast' },
    { from: 'Inventory', to: 'Combat', type: 'Data' }
  ];

  // Dynamic system status calculation base on completing tasks
  const getSystemStatus = (sysId: string): 'Stable' | 'In Progress' | 'Blocked' | 'Missing' => {
    const phaseMap: { [key: string]: number } = {
      'Movement': 1,
      'Camera': 1,
      'WorldActors': 2,
      'Interaction': 4,
      'WaterVolume': 5,
      'Destruction': 6,
      'AI': 7,
      'SaveSystem': 8,
      'Inventory': 9,
      'Combat': 10
    };

    const phaseId = phaseMap[sysId];
    if (phaseId === undefined) return 'Missing';
    const phaseObj = phases.find(p => p.id === phaseId);
    if (!phaseObj) return 'Missing';

    if (phaseObj.status === 'Locked') {
      return 'Blocked';
    }

    const tasksInPhase = phaseObj.tasks;
    if (tasksInPhase.length === 0) return 'Missing';

    const completedInPhase = tasksInPhase.filter(t => completedTasks.includes(t.id));

    if (completedInPhase.length === tasksInPhase.length) {
      return 'Stable';
    } else if (completedInPhase.length > 0) {
      return 'In Progress';
    } else {
      return 'Missing';
    }
  };

  // Get active blockers for blocked/missing systems
  const getSystemBlockers = (sysId: string): string[] => {
    const depsMap: { [key: string]: string[] } = {
      'Movement': ['Camera'],
      'Camera': [],
      'WorldActors': [],
      'Interaction': ['WorldActors'],
      'WaterVolume': ['Movement'],
      'Destruction': ['WorldActors', 'Interaction'],
      'AI': ['WorldActors', 'Movement'],
      'SaveSystem': ['WorldActors', 'Interaction'],
      'Inventory': ['Interaction', 'Destruction'],
      'Combat': ['Destruction', 'AI']
    };

    const directDeps = depsMap[sysId] || [];
    const activeBlockers: string[] = [];

    directDeps.forEach(dep => {
      const status = getSystemStatus(dep);
      if (status !== 'Stable') {
        activeBlockers.push(dep);
      }
    });

    return activeBlockers;
  };

  // Panning handlers on dragging SVG
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only allow left mousedown drag
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(0.95);
    setPan({ x: 30, y: 15 });
  };

  // Unreal Engine Directory Asset Folder Mappings
  const originalDirectoryTree = [
    { path: "Content/Valmora/Characters/BP_PlayerCharacter_Base", name: "BP_PlayerCharacter_Base", category: "Player", sysId: "Movement", phaseId: 1 },
    { path: "Content/Valmora/Characters/AI/BP_NPC_Base", name: "BP_NPC_Base", category: "NPC", sysId: "AI", phaseId: 7 },
    { path: "Content/Valmora/World/StaticInteractables/BP_WorldActor_Base", name: "BP_WorldActor_Base", category: "WorldSystemActor", sysId: "WorldActors", phaseId: 2 },
    { path: "Content/Valmora/World/StaticInteractables/BP_HarvestableTree", name: "BP_HarvestableTree", category: "StaticInteractable", sysId: "WorldActors", phaseId: 2 },
    { path: "Content/Valmora/Interaction/DynamicObjects/BP_DungeonMetalGate", name: "BP_DungeonMetalGate", category: "DynamicInteractable", sysId: "Interaction", phaseId: 4 },
    { path: "Content/Valmora/Core/Systems/SYS_WeatherManager", name: "SYS_WeatherManager", category: "WorldSystemActor", sysId: "SaveSystem", phaseId: 8 }
  ];

  // Merging custom simulated objects created by the user
  const getSimFolderMatch = (categoryStr: string) => {
    switch (categoryStr) {
      case 'Player': return "Content/Valmora/Characters/";
      case 'NPC': return "Content/Valmora/Characters/AI/";
      case 'StaticInteractable': return "Content/Valmora/World/StaticInteractables/";
      case 'DynamicInteractable': return "Content/Valmora/Interaction/DynamicObjects/";
      case 'WorldSystemActor': return "Content/Valmora/Core/Systems/";
      default: return "Content/Valmora/Core/";
    }
  };

  const getSimSystemMatch = (categoryStr: string) => {
    switch (categoryStr) {
      case 'Player': return "Movement";
      case 'NPC': return "AI";
      case 'StaticInteractable': return "WorldActors";
      case 'DynamicInteractable': return "Interaction";
      case 'WorldSystemActor': return "SaveSystem";
      default: return "WorldActors";
    }
  };

  const mergedExplorerList = [
    ...originalDirectoryTree.map(e => ({ ...e, isCustom: false })),
    ...createdObjects.filter(co => co.id !== 'obj_1' && co.id !== 'obj_2' && co.id !== 'obj_3').map(co => {
      const folderPath = getSimFolderMatch(co.category);
      return {
        path: `${folderPath}${co.name.replace(/[^a-zA-Z0-9]/g, '')}`,
        name: co.name,
        category: co.category,
        sysId: getSimSystemMatch(co.category),
        phaseId: co.category === 'NPC' ? 7 : co.category === 'DynamicInteractable' ? 4 : co.category === 'StaticInteractable' ? 2 : 1,
        isCustom: true
      };
    })
  ];

  // Folder paths groupings for tree explorer panel
  const foldersList = [
    "Content/Valmora/Characters/",
    "Content/Valmora/Characters/AI/",
    "Content/Valmora/World/StaticInteractables/",
    "Content/Valmora/Interaction/DynamicObjects/",
    "Content/Valmora/Core/Systems/"
  ];

  // Active Selected Node detailed fields
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const activeNodeStatus = getSystemStatus(activeNode.id);
  const activeNodeBlockers = getSystemBlockers(activeNode.id);

  // Coupling Matrix original data
  const couplingMatrix: { [key: string]: { [key: string]: CouplingCell } } = {
    Movement: {
      Camera: {
        row: 'Movement', col: 'Camera',
        status: 'Direct', risk: 'Low',
        explanation: "Camera orientation directly generates movement vector space (OrientationIntent). This is a standard 3C dependency.",
        solution: "Decouple actor rotation from camera controls via separate Yaw/Pitch input production steps."
      },
      Interaction: {
        row: 'Movement', col: 'Interaction',
        status: 'Decoupled', risk: 'Low',
        explanation: "Player trace performs target collection separately from coordinate displacement physics.",
        solution: "Expose interaction triggers to input systems, keeping movement mechanics distinct."
      },
      WaterVolume: {
        row: 'Movement', col: 'WaterVolume',
        status: 'Direct', risk: 'High',
        explanation: "Overlapping fluid triggers dynamically override physics vectors (drag, buoyancy multipliers). High risk if not done early.",
        solution: "Implement dedicated Swimming overrides inside Mover component so physics switches state cleanly (Phase 5)."
      }
    },
    WorldActors: {
      Destruction: {
        row: 'WorldActors', col: 'Destruction',
        status: 'Indirect', risk: 'Medium',
        explanation: "Breakable world objects hold health state variables. Depletion swaps mesh instances.",
        solution: "Inherit BP_WorldActor_Base instead of writing unique break codes for every tree or stone."
      },
      SaveSystem: {
        row: 'WorldActors', col: 'SaveSystem',
        status: 'Decoupled', risk: 'Low',
        explanation: "Saves query UniqueInstanceIDs to serialize object states programmatically.",
        solution: "Avoid hard couplings. Save systems must read generic array state variables during serializations (Phase 8)."
      }
    },
    Interaction: {
      Inventory: {
        row: 'Interaction', col: 'Inventory',
        status: 'Indirect', risk: 'Medium',
        explanation: "Mining nodes or looting chests appends items to player slots on execution.",
        solution: "Implement BPI_Interactable function triggers that return specific loot collections directly."
      }
    }
  };

  const getCouplingState = (row: string, col: string): CouplingCell => {
    if (couplingMatrix[row]?.[col]) return couplingMatrix[row][col];
    if (couplingMatrix[col]?.[row]) return {
      ...couplingMatrix[col][row],
      row, col
    };

    if (row === col) {
      return {
        row, col,
        status: 'Direct', risk: 'Low',
        explanation: "Central system self-coupling. Coherent internal dependencies only.",
        solution: "Keep module sizes balanced and modular (split variables into structs/components)."
      };
    }

    return {
      row, col,
      status: 'Decoupled', risk: 'Low',
      explanation: "Zero physical coupling. These modules execute their workloads independently and only communicate through generic events or helper structures.",
      solution: "Maintain this clean boundaries standard. Avoid writing direct casts or references."
    };
  };

  const activeCellDetail = getCouplingState(activeCellRow, activeCellCol);

  return (
    <div className="space-y-6 animate-fade-in" id="systems_root_container">
      {/* Dynamic Tabs Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Network className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base font-sans font-bold text-slate-100 flex items-center gap-2">
              System Architecture & Coupling Analyzer
            </h2>
            <p className="text-xs text-slate-400">
              Interactive graphical plotting mapping casting pipelines, directory registries, status metrics, and blockers indexers.
            </p>
          </div>
        </div>

        {/* Action tab triggers */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg self-stretch md:self-auto overflow-x-auto shrink-0 select-none">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'graph' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" /> Projection Graph
          </button>
          
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'health' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Health & Blockers
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'timeline' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Systems History
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-mono font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'matrix' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/10' : 'text-slate-450 hover:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Coupling Matrix
          </button>
        </div>
      </div>

      {/* Dispatch View Tabs */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view_projection_graph">
          {/* SVG Connection Graph Panel (Span 7) */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col relative group">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 shrink-0">
              <div>
                <h3 className="text-xs font-mono font-semibold text-indigo-450 uppercase tracking-widest">
                  Unreal Blueprint Dependence Graph
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">Click nodes to analyze properties. Drag canvas to pan, scroll to zoom.</p>
              </div>

              {/* Pan Zoom HUD Controls */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded text-slate-400 font-mono text-[10px] select-none">
                <button 
                  onClick={() => setScale(s => Math.min(1.8, s + 0.1))} 
                  className="p-1 hover:text-slate-100 cursor-pointer" 
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setScale(s => Math.max(0.4, s - 0.1))} 
                  className="p-1 hover:text-slate-100 cursor-pointer" 
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={resetZoom} 
                  className="p-1 hover:text-slate-100 cursor-pointer border-l border-slate-800 shrink-0" 
                  title="Reset Coordinates"
                >
                  <RefreshCw className="w-3 h-3 block inline" />
                </button>
              </div>
            </div>

            {/* Canvas Area */}
            <div 
              className={`h-[420px] w-full bg-slate-900/30 border border-slate-900 rounded-xl relative overflow-hidden select-none cursor-move ${
                isDragging ? 'cursor-grabbing' : ''
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Core SVG Workspace */}
              <svg 
                ref={svgRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: '0 0', transition: isDragging ? 'none' : 'transform 100ms ease-out' }}
              >
                {/* Arrow Marker */}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" className="fill-slate-700" />
                  </marker>
                  <marker id="arrow-highlight" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" className="fill-indigo-500" />
                  </marker>
                </defs>

                {/* Render Edges / Connections */}
                {edges.map((edge, idx) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isHighlighted = selectedNodeId === edge.from || selectedNodeId === edge.to || hoveredNodeId === edge.from || hoveredNodeId === edge.to;
                  const edgeColor = isHighlighted ? 'stroke-indigo-500/60' : 'stroke-slate-800/50';
                  const edgeWidth = isHighlighted ? '2.5' : '1.5';

                  return (
                    <g key={`edge-${idx}`}>
                      <line
                        x1={fromNode.x + 65}
                        y1={fromNode.y + 20}
                        x2={toNode.x + 65}
                        y2={toNode.y + 20}
                        className={`${edgeColor} transition-all duration-350`}
                        strokeWidth={edgeWidth}
                        strokeDasharray={edge.type === 'Interface' ? '4 4' : 'none'}
                        markerEnd={isHighlighted ? 'url(#arrow-highlight)' : 'url(#arrow)'}
                      />
                    </g>
                  );
                })}

                {/* Render Interactive Nodes */}
                {nodes.map((node) => {
                  const nodeStatus = getSystemStatus(node.id);
                  const isNodeSelected = selectedNodeId === node.id;
                  const isNodeHovered = hoveredNodeId === node.id;

                  let borderLight = 'stroke-slate-800';
                  let bgFill = 'fill-slate-950';
                  let tagColor = 'fill-slate-500';

                  if (nodeStatus === 'Stable') {
                    borderLight = isNodeSelected ? 'stroke-emerald-400' : 'stroke-emerald-600/55';
                    bgFill = isNodeSelected ? 'fill-emerald-950/70' : 'fill-slate-950';
                    tagColor = 'fill-emerald-500';
                  } else if (nodeStatus === 'In Progress') {
                    borderLight = isNodeSelected ? 'stroke-indigo-400' : 'stroke-indigo-600/55';
                    bgFill = isNodeSelected ? 'fill-indigo-950/70' : 'fill-slate-950';
                    tagColor = 'fill-indigo-500';
                  } else if (nodeStatus === 'Blocked') {
                    borderLight = isNodeSelected ? 'stroke-rose-500' : 'stroke-rose-900/60';
                    bgFill = isNodeSelected ? 'fill-rose-950/40' : 'fill-slate-950';
                    tagColor = 'fill-rose-500';
                  } else {
                    borderLight = isNodeSelected ? 'stroke-slate-400' : 'stroke-slate-800';
                    bgFill = 'fill-slate-950';
                    tagColor = 'fill-slate-600';
                  }

                  return (
                    <g 
                      key={node.id} 
                      className="cursor-pointer pointer-events-auto"
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(node.id);
                      }}
                    >
                      {/* Node capsule container */}
                      <rect
                        x={node.x}
                        y={node.y}
                        width="130"
                        height="40"
                        rx="8"
                        className={`${bgFill} ${borderLight} transition-all duration-200 stroke-[1.5]`}
                      />

                      {/* Status indicator tag */}
                      <circle
                        cx={node.x + 15}
                        cy={node.y + 20}
                        r="3.5"
                        className={`${tagColor} ${nodeStatus === 'In Progress' || nodeStatus === 'Blocked' ? 'animate-pulse' : ''}`}
                      />

                      {/* Title label */}
                      <text
                        x={node.x + 28}
                        y={node.y + 24}
                        className={`text-[10px] select-none font-sans font-bold transition-all ${
                          isNodeSelected ? 'fill-white' : 'fill-slate-350'
                        }`}
                        fontWeight="650"
                      >
                        {node.id}
                      </text>

                      {/* Sub-label */}
                      <text
                        x={node.x + 28}
                        y={node.y + 33}
                        className="text-[8px] font-mono fill-slate-500 select-none"
                      >
                        {node.unrealType.substring(0, 16)}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Float HUD indicator overlay */}
              <div className="absolute bottom-3 left-3 flex gap-3 text-[9px] font-mono text-slate-500 bg-slate-950/75 border border-slate-850 px-2.5 py-1.5 rounded-lg">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Stable </span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> In Progress</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Blocked</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Missing</span>
              </div>
            </div>
          </div>

          {/* Side Panel: Living explorer directory + selected specification sheet (Span 5) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Spec Panel of currently selected node */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-905 pb-3">
                <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest block mb-1">
                  System Blueprint Sheet
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100 uppercase">{activeNode.label}</h3>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                    activeNodeStatus === 'Stable' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    activeNodeStatus === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    activeNodeStatus === 'Blocked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {activeNodeStatus}
                  </span>
                </div>
              </div>

              {/* Node description info */}
              <div className="space-y-3.5 text-xs text-slate-350">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-550 uppercase block">Engine Component class</span>
                  <code className="text-[10px] text-indigo-455 font-mono font-bold bg-slate-900 border border-slate-850 py-0.5 px-2 rounded block w-fit">
                    {activeNode.unrealType}
                  </code>
                </div>

                <p className="text-slate-300 leading-relaxed font-sans mt-1 text-[11px]">{activeNode.description}</p>

                {/* Blocked Info Card */}
                {activeNodeStatus === 'Blocked' && activeNodeBlockers.length > 0 && (
                  <div className="bg-rose-500/5 border border-rose-500/15 rounded-lg p-3 text-[11px] space-y-1 text-slate-400 bg-slate-950">
                    <span className="text-rose-400 font-bold block flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> Integration Blocked!
                    </span>
                    <p>The following parent systems must be marked Stable before implementing this system:</p>
                    <div className="flex gap-1.5 flex-wrap pt-1 font-mono text-[9px]">
                      {activeNodeBlockers.map(b => (
                        <span key={b} className="bg-rose-500/10 text-rose-450 px-1.5 py-0.5 rounded border border-rose-500/20 text-xs">
                          {b} System
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic List of Merged entities (Folder Assets) tracked inside this subsystem */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">
                    Associated Directory Blueprints
                  </span>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {mergedExplorerList.filter(e => e.sysId === activeNode.id).length === 0 ? (
                      <span className="text-[11px] font-mono font-bold text-slate-500 block italic">Zero folders registered.</span>
                    ) : (
                      mergedExplorerList.filter(e => e.sysId === activeNode.id).map((ent, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] font-mono bg-slate-900/50 border border-slate-900 p-2 rounded">
                          <span className="text-slate-200 truncate pr-2 max-w-[150px]">{ent.name}</span>
                          <span className={`text-[9px] font-bold shrink-0 ${
                            ent.isCustom ? 'text-indigo-400 bg-indigo-500/5 px-1 rounded border border-indigo-500/25' : 'text-slate-550'
                          }`}>
                            {ent.isCustom ? 'custom' : 'core'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Redirect open spec button */}
                <button
                  onClick={() => {
                    onSelectPhase(activeNode.phaseId);
                    onNavigate('roadmap');
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 text-[11px] font-mono tracking-wide py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all uppercase"
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-400" /> Open Phase {activeNode.phaseId} Specifications
                </button>
              </div>
            </div>

            {/* Living Explorer Hierarchy Mimicker View / Project Tree Visualizer */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 text-semibold">
                  <Folder className="w-3.5 h-3.5 text-indigo-400" /> 3. Project Tree Visualizer
                </h3>
                <p className="text-[10px] text-slate-550 font-mono leading-relaxed mt-0.5">
                  Static & dynamic actor Blueprint inheritance. Colors indicate live integration status. Click nodes for details.
                </p>
              </div>

              {/* Recursive Project Tree container */}
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                {buildInheritanceTree().map(rootNode => renderProjectTreeNode(rootNode))}
              </div>

              {/* Node Specification Panel on Select */}
              {selectedTreeNode ? (
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-xs space-y-3 animate-fade-in relative">
                  <span className="absolute top-2 right-2 text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 uppercase tracking-wider text-slate-500">
                    {selectedTreeNode.category}
                  </span>
                  <div>
                    <h4 className="font-mono text-xs font-bold text-indigo-400">{selectedTreeNode.name}</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-1">{selectedTreeNode.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-slate-550 block text-[8px] uppercase">Created In</span>
                      <span className="text-indigo-300 font-bold block mt-0.5">Phase {selectedTreeNode.phaseId}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-850">
                      <span className="text-slate-550 block text-[8px] uppercase">State Class</span>
                      <span className={`font-bold block mt-0.5 ${
                        getSystemStatus(selectedTreeNode.sysId) === 'Stable' ? 'text-emerald-400' : 'text-indigo-400 animate-pulse'
                      }`}>
                        {getSystemStatus(selectedTreeNode.sysId)}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono space-y-1.5 border-t border-slate-850 pt-2.5">
                    <div>
                      <span className="text-rose-455 font-bold block text-[9px] uppercase tracking-wide">Depends On (Interfaces & Bases)</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        {selectedTreeNode.dependsOn && selectedTreeNode.dependsOn.length > 0 
                          ? selectedTreeNode.dependsOn.join(', ') 
                          : 'None (Root Object Component)'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-indigo-405 font-bold block text-[9px] uppercase tracking-wide">Unlocks (Dependents)</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        {selectedTreeNode.dependents && selectedTreeNode.dependents.length > 0 
                          ? selectedTreeNode.dependents.join(', ') 
                          : 'None (Terminal Leaf Component)'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl text-center text-xs font-mono text-slate-500">
                  Click any blueprint element above to perform deep coupling diagnostics.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Systems Health Dashboard View */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in" id="view_systems_health_dashboard">
          {/* Main Status Panel (Span 8) */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <h3 className="text-sm font-sans font-bold text-slate-100 uppercase">System Diagnostics Dashboard</h3>
              <p className="text-xs text-slate-400">Dynamic computation of loose coupling matrices and subtask completeness metrics.</p>
            </div>

            {/* Grid checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nodes.map((node) => {
                const status = getSystemStatus(node.id);
                const blockers = getSystemBlockers(node.id);
                const phaseObj = phases.find(p => p.id === node.phaseId);

                return (
                  <div 
                    key={node.id} 
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer hover:border-slate-700 bg-slate-900/20 ${
                      status === 'Stable' ? 'border-emerald-500/10 hover:bg-emerald-500/5' :
                      status === 'In Progress' ? 'border-indigo-500/10 hover:bg-indigo-500/5' :
                      status === 'Blocked' ? 'border-rose-900/20 hover:bg-rose-950/10' :
                      'border-slate-850 hover:bg-slate-900/40'
                    }`}
                  >
                    <span className="pt-0.5">
                      {status === 'Stable' && <CheckCircle2 className="w-5 h-5 text-emerald-550" />}
                      {status === 'In Progress' && <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />}
                      {status === 'Blocked' && <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />}
                      {status === 'Missing' && <AlertCircle className="w-5 h-5 text-slate-500" />}
                    </span>

                    <div className="space-y-1 w-full min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-sans font-bold text-slate-201 text-xs">{node.label}</span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-black text-bold shrink-0 uppercase ${
                          status === 'Stable' ? 'bg-emerald-500/10 text-emerald-450' :
                          status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400' :
                          status === 'Blocked' ? 'bg-rose-500/10 text-rose-455' :
                          'bg-slate-900 text-slate-500'
                        }`}>
                          {status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-450 truncate">{node.description}</p>

                      {/* Progress bar inside system */}
                      <div className="w-full bg-slate-900 rounded-full h-1 my-1 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            status === 'Stable' ? 'bg-emerald-500' :
                            status === 'In Progress' ? 'bg-indigo-500' :
                            'bg-slate-800'
                          }`}
                          style={{ width: `${phaseObj ? phaseObj.progress : 0}%` }}
                        ></div>
                      </div>

                      {status === 'Blocked' && blockers.length > 0 && (
                        <div className="text-[9px] font-mono text-rose-450 block truncate">
                          Blocked by: {blockers.join(', ')}
                        </div>
                      )}
                      
                      {status === 'Missing' && (
                        <div className="text-[9px] font-mono text-slate-505 block">
                          Ready. Requires Phase {node.phaseId} speculative task checks.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Critical Warning Alert Panel (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Active Blockers Pipeline
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Critical architectural bottlenecks based on standard dependency hierarchies. Complete dependencies first to avoid massive refactoring later.
              </p>

              {/* Dynamic calculations of blockers */}
              <div className="space-y-3">
                {nodes.filter(n => getSystemStatus(n.id) === 'Blocked').length === 0 ? (
                  <div className="py-6 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-850 rounded-lg flex items-center justify-center gap-1.5 bg-slate-900/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Blockers. Pipeline Clear!
                  </div>
                ) : (
                  nodes.filter(n => getSystemStatus(n.id) === 'Blocked').map((node) => {
                    const blockers = getSystemBlockers(node.id);
                    return (
                      <div key={node.id} className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <strong className="text-rose-300 block font-semibold">{node.id} Subsystem</strong>
                          <span className="text-[9px] text-rose-455 font-mono">Phase {node.phaseId} Locked</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          This code cannot be checked due to unresolved interfaces:
                        </p>
                        <div className="flex flex-col gap-1 text-[10px] font-mono text-slate-300 bg-slate-950/85 p-2 rounded border border-slate-900">
                          {blockers.map(b => (
                            <span key={b} className="flex items-center gap-1.5 text-rose-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Requires {b} System Stable
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Pro Tips panel */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 bg-indigo-500/5 border-indigo-500/10">
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-indigo-400" /> Decoupled Development Rule
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every time you are tempted to reference a specific actor directly (e.g., casting to <code className="text-indigo-400">BP_EnemyBoar</code> to deduct health variables on sword swing), stop. 
              </p>
              <p className="text-xs text-slate-400 leading-relaxed font-bold">
                Casting forces both blueprints to load into memory synchronously. Standardize on Interfaces (Phase 4) and raw Structs instead!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Systems History Timelines View */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6" id="view_systems_timeline">
          <div className="border-b border-slate-900 pb-4">
            <h3 className="text-sm font-sans font-bold text-slate-100 uppercase">Architecture Evolution Timeline</h3>
            <p className="text-xs text-slate-400">Chronological history demonstrating how system modules expand and dependency matrices grow over time.</p>
          </div>

          <div className="relative border-l border-slate-800 ml-5 space-y-8 py-2">
            {/* Timeline Phase 0 always complete */}
            <div className="relative pl-8">
              <span className="absolute -left-[9px] top-1.5 bg-emerald-500 w-4 h-4 rounded-full border border-slate-950 flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
              </span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-mono font-bold text-emerald-400 uppercase tracking-wider">Phase 0 Achieved</span>
                  <span className="text-slate-500 font-mono text-[10px]">Project Rules Configured</span>
                </div>
                <h4 className="font-bold text-slate-201 text-sm">Baseline Standards Formulated</h4>
                <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
                  Established BP_ characters and Static/DynamicInteractable naming prefixes. Set up standard folder directory hierarchies and directory standards before spawning actors to completely shut down Blueprint class bloat early.
                </p>
              </div>
            </div>

            {/* Timeline Phase 1 checking */}
            {phases.slice(1).map((phase) => {
              const status = phase.status;
              const completedTasksCount = phase.tasks.filter(t => completedTasks.includes(t.id)).length;
              let iconColor = 'bg-slate-800 border-slate-950';
              let tagText = 'Locked';
              let tagColor = 'text-slate-500';

              if (status === 'Completed') {
                iconColor = 'bg-emerald-500';
                tagText = 'Completed';
                tagColor = 'text-emerald-400';
              } else if (status === 'Unlocked') {
                iconColor = 'bg-indigo-500';
                tagText = 'In Development';
                tagColor = 'text-indigo-400 text-bold';
              }

              return (
                <div key={phase.id} className="relative pl-8">
                  <span className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border border-slate-950 flex items-center justify-center ${iconColor}`}>
                    {status === 'Completed' && <CheckCircle2 className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />}
                    {status === 'Unlocked' && <Unlock className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />}
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span className={`font-mono font-bold uppercase tracking-wider ${tagColor}`}>Phase {phase.number} ({tagText})</span>
                      <span className="text-slate-500 font-mono text-[10.5px]">Completeness: {phase.progress}% ({completedTasksCount} / {phase.tasks.length} Resolved)</span>
                    </div>
                    <h4 className="font-bold text-slate-202 text-sm">{phase.title} Milestone</h4>
                    <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">{phase.goal}</p>
                    
                    {phase.progress > 0 && (
                      <div className="pt-1.5">
                        <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Evolution Summary</span>
                        <p className="text-[11px] text-indigo-300 italic leading-relaxed">
                          Refined dynamic codes decoupled metrics: {phase.tasks.filter(t => completedTasks.includes(t.id)).map(t => t.title).join(', ')}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Systems Coupling Matrix View */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in" id="view_systems_coupling_matrix">
          {/* Main Table Grid (Span 7) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-900 pb-3">
              <h3 className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest">
                Coupling Relationship Matrix
              </h3>
              <p className="text-[10px] text-slate-550 font-mono">Click cells to inspect details, analyze potential casting risk levels.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border border-slate-900 bg-slate-900/50 text-[10px] text-slate-500 font-mono text-left select-none">System</th>
                    {systemsList.map((sys) => (
                      <th key={sys} className="p-2 border border-slate-900 bg-slate-900/50 text-[9px] text-slate-450 font-mono text-center rotate-45 md:rotate-0 select-none">
                        {sys.substring(0, 5)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {systemsList.map((rowSys) => (
                    <tr key={rowSys}>
                      <td className="p-2 border border-slate-900 font-mono text-xs text-slate-350 bg-slate-900/40 select-none font-bold">
                        {rowSys}
                      </td>
                      {systemsList.map((colSys) => {
                        const cellState = getCouplingState(rowSys, colSys);
                        const isSelected = activeCellRow === rowSys && activeCellCol === colSys;
                        
                        return (
                          <td 
                            key={colSys} 
                            onClick={() => {
                              setActiveCellRow(rowSys);
                              setActiveCellCol(colSys);
                            }}
                            className={`p-2 border border-slate-900 text-center cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-indigo-500/25 border-indigo-500/50' 
                                : cellState.status === 'Direct' 
                                  ? 'bg-rose-500/10 hover:bg-rose-500/15' 
                                  : cellState.status === 'Indirect'
                                    ? 'bg-indigo-500/5 hover:bg-indigo-500/10'
                                    : 'bg-slate-950 hover:bg-slate-900'
                            }`}
                          >
                            <span className={`text-[9px] font-mono font-bold select-none ${
                              cellState.status === 'Direct' ? 'text-rose-400' :
                              cellState.status === 'Indirect' ? 'text-indigo-400' :
                              'text-slate-650'
                            }`}>
                              {cellState.status === 'Direct' ? 'DIR' :
                               cellState.status === 'Indirect' ? 'IND' :
                               'DEC'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Key Guide */}
            <div className="flex gap-4 text-[10px] font-mono text-slate-500 flex-wrap pt-2">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500/10 rounded-full border border-rose-500/20"></span> Direct Coupling (High risk of circular references)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500/5 rounded-full border border-indigo-500/20"></span> Indirect (Linked via gameplay interface classes)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></span> Decoupled Clean boundaries</span>
            </div>
          </div>

          {/* Matrix Detail specs (Span 5) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-805 pb-4 space-y-1">
              <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold block">Coupling Inspector</span>
              <h3 className="text-sm font-bold text-slate-200 uppercase">
                {activeCellDetail.row} <span className="text-slate-500">x</span> {activeCellDetail.col}
              </h3>
              <div className="flex gap-2 font-mono text-[9px] items-center pt-1.5 select-none">
                <span className={`px-2 py-0.5 rounded border ${
                  activeCellDetail.status === 'Direct' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  activeCellDetail.status === 'Indirect' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {activeCellDetail.status} Coupling
                </span>
                <span className={`px-2 py-0.5 rounded border ${
                  activeCellDetail.risk === 'High' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                  activeCellDetail.risk === 'Medium' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' :
                  'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}>
                  {activeCellDetail.risk} Risk Rated
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[9px] uppercase block">Analysis Overview</span>
                <p className="text-slate-350 leading-relaxed font-sans">{activeCellDetail.explanation}</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-slate-500 font-mono text-[9px] uppercase block">Architectural Decoupling Solution</span>
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-lg text-slate-350 leading-relaxed font-sans text-[11px] flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{activeCellDetail.solution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
