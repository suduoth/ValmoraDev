/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarketMetrics {
  title: string;
  score: number;
  status: 'Ready' | 'In Progress' | 'Risky' | 'Excellent';
  description: string;
}

export interface SystemRelation {
  source: string;
  target: string;
  type: 'inherits' | 'uses' | 'persists' | 'notifies';
}

export const marketCompletenessMetrics: MarketMetrics[] = [
  {
    title: "Game Feel (3Cs: Character, Camera, Controls)",
    score: 95,
    status: "Excellent",
    description: "Mover implementation handles rotation perfectly in the Input Production cycle. Complete integration of orientation intent avoids direct actor snapping, securing top-tier responsive gameplay feel."
  },
  {
    title: "State Persistence & Saves",
    score: 85,
    status: "Ready",
    description: "Unique-ID-backed serialization ensures local save structures record world changes (broken nodes, chest loot, NPC states) without Cloud dependencies or excessive database costs."
  },
  {
    title: "Architectural Decoupling",
    score: 90,
    status: "Excellent",
    description: "Unification of world objects under BP_WorldActor_Base reading state-driven definition archives removes tight couplings and cyclical class-casts."
  },
  {
    title: "AI Modular Logic",
    score: 75,
    status: "In Progress",
    description: "StateTrees mapped to distinct NPC definitions handle behaviors (idle, chasing, fleeing) without forcing AI mechanisms onto inert elements."
  },
  {
    title: "Content Loop (Gathering & Economy)",
    score: 60,
    status: "Risky",
    description: "Requires structured loot templates and recipe validations to tie gathering nodes into equipment triggers. Order of Phase 10 & 12 must be adhered to strictly."
  }
];

export const systemRelations: SystemRelation[] = [
  { source: "BP_PlayerCharacter_Base", target: "BPI_Interactable", type: "uses" },
  { source: "BP_WorldActor_Base", target: "DA_ActorDefinition", type: "inherits" },
  { source: "BP_WorldActor_Base", target: "BPI_Interactable", type: "inherits" },
  { source: "BP_NPC_Base", target: "BP_WorldActor_Base", type: "inherits" },
  { source: "SaveSystem", target: "BP_WorldActor_Base", type: "persists" },
  { source: "InventoryComponent", target: "BP_PlayerCharacter_Base", type: "uses" },
  { source: "InventoryComponent", target: "BP_WorldActor_Base", type: "uses" },
  { source: "QuestSystem", target: "BPI_Interactable", type: "notifies" }
];

export const dataGuidelines = {
  namingConventions: {
    Player: { prefix: "BP_", suffix: "Character_Base", description: "Standard playable avatar inheriting movement physics." },
    NPC: { prefix: "BP_NPC_", suffix: "Base", description: "Modular dynamic AI characters." },
    StaticInteractable: { prefix: "BP_", suffix: "_Base", description: "Inert harvested structures, e.g. Rock, Tree, Minerals" },
    DynamicInteractable: { prefix: "BP_", suffix: "_Base", description: "Responsive objects with dynamic state changes like Doors, Chests." },
    WorldSystemActor: { prefix: "BP_System_", suffix: "", description: "Global trackers like WeatherManager or TimeController." }
  },
  architecturalDecouplingAdvice: "Always separate data from actor runtime logic. Actors must serve only as visual and collision wrappers that configure themselves in construction scripts by absorbing Data Assets."
};
