/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
  estimated_effort?: string; // e.g. "30m", "1h"
  tags?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  why_this_exists: string;
  steps: string[];
  subtasks: SubTask[];
  notes: string;
  examples: string[];
  dependencies: string[];
  blocked_by: string[];
  common_mistakes: string[];
  suggestions: string[];
  estimated_time: string; // e.g. "2h", "4h"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  validation_checklist: string[];
  ai_help_prompts: string[];
}

export interface Phase {
  id: number;
  number: number;
  title: string;
  description: string;
  goal: string;
  why_it_matters: string;
  dependencies: string[];
  blocked_by: string[];
  milestones: string[];
  tasks: Task[];
  examples: string[];
  suggestions: string[];
  common_mistakes: string[];
  architecture_notes: string[];
  validation_checklist: string[];
  ai_prompts: string[];
  estimated_time: string; // e.g. "12h"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number; // calculated completion %
  notes: string;
  status: 'Locked' | 'Unlocked' | 'Completed';
}

export interface SimulatedObject {
  id: string;
  name: string;
  category: 'Player' | 'NPC' | 'StaticInteractable' | 'DynamicInteractable' | 'WorldSystemActor' | 'System';
  isCustom: boolean;
  notes: string;
  customProperties: { [key: string]: string };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextPhaseId?: number;
  contextTaskId?: string;
}
