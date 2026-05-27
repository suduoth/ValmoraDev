/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Sparkles, 
  CheckCircle, 
  Unlock, 
  Lock, 
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { Phase, Task } from '../types';

interface SearchFiltersProps {
  phases: Phase[];
  completedTasks: string[];
  bookmarkedTasks: string[];
  toggleBookmark: (taskId: string) => void;
  onSelectTask: (phaseId: number, taskId: string) => void;
}

export default function SearchFilters({
  phases,
  completedTasks,
  bookmarkedTasks,
  toggleBookmark,
  onSelectTask
}: SearchFiltersProps) {
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Hard' | 'Medium' | 'Easy'>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Search through all tasks across all phases
  const searchResults: { phase: Phase; task: Task }[] = [];

  phases.forEach(phase => {
    phase.tasks.forEach(task => {
      const text = `${phase.title} ${task.title} ${task.description} ${task.why_this_exists} ${task.common_mistakes.join(" ")} ${task.suggestions.join(" ")}`.toLowerCase();
      const matchesQuery = query.trim() === "" || text.includes(query.toLowerCase());
      
      const isDone = completedTasks.includes(task.id);
      const matchesCompletion = completionFilter === 'all' || 
        (completionFilter === 'completed' && isDone) || 
        (completionFilter === 'pending' && !isDone);

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesDifficulty = difficultyFilter === 'all' || task.difficulty === difficultyFilter;

      if (matchesQuery && matchesCompletion && matchesPriority && matchesDifficulty) {
        searchResults.push({ phase, task });
      }
    });
  });

  return (
    <div className="space-y-6 animate-fade-in" id="search_panel">
      {/* Search Header layout */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" /> Advanced Global Query engine
          </h2>
          <p className="text-xs text-slate-500 font-mono">Index-find phases, guidelines, variables, errors, and task checklist specs</p>
        </div>

        {/* Input & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keyword indexes (e.g. Mover, Rotation, Buoyancy, casting, ID)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-xs text-slate-201 outline-none focus:border-indigo-505 placeholder-slate-550 focus:ring-1 focus:ring-indigo-500 font-sans"
            />
            <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-400 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Priority: All</option>
              <option value="High">Priority: High</option>
              <option value="Medium">Priority: Medium</option>
              <option value="Low">Priority: Low</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-400 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Difficulty: All</option>
              <option value="Easy">Difficulty: Easy</option>
              <option value="Medium">Difficulty: Medium</option>
              <option value="Hard">Difficulty: Hard</option>
            </select>

            {/* Completion Filter */}
            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 text-xs text-slate-400 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results block */}
      {searchResults.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-955 border border-slate-800 rounded-xl">
          <span className="p-3.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-full inline-block">
            <Filter className="w-5 h-5 animate-pulse" />
          </span>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-300">No Query Results Logged</h4>
            <p className="text-[11px] text-slate-550 max-w-xs mx-auto font-mono leading-relaxed">
              Verify that filters do not exclude matching candidates, or simplify keyword parameters.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-slate-501 uppercase tracking-wide">
            Found {searchResults.length} candidate matching entries
          </div>
          {searchResults.map(({ phase, task }) => {
            const isDone = completedTasks.includes(task.id);
            const isBookmarked = bookmarkedTasks.includes(task.id);
            return (
              <div 
                key={task.id}
                className={`p-4 bg-slate-950 border rounded-xl space-y-3 transition-all flex flex-col justify-between hover:border-slate-705 ${
                  isDone ? 'border-emerald-500/10 bg-emerald-500/5' : 'border-slate-805'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                      Phase {phase.id}: {phase.title}
                    </span>
                    <h4 className={`text-xs font-sans font-semibold leading-relaxed flex items-center gap-1.5 ${
                      isDone ? 'text-slate-450 line-through' : 'text-slate-205'
                    }`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-401 leading-relaxed font-sans">{task.description}</p>
                  </div>

                  {/* Bookmark button */}
                  <button
                    onClick={() => toggleBookmark(task.id)}
                    className={`p-1.5 rounded transition-all cursor-pointer outline-none border ${
                      isBookmarked 
                        ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' 
                        : 'border-transparent text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Info summary strip */}
                <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-slate-900 flex-wrap gap-2 text-slate-500">
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                      task.priority === 'High' ? 'bg-rose-500/10 text-rose-455 border-rose-500/15' :
                      task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-455 border-amber-500/15' :
                      'bg-slate-900 text-slate-405 border-slate-805'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span className="bg-slate-900 border border-slate-805 px-2 py-0.5 rounded text-[9px]">
                      Difficulty: {task.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTask(phase.id, task.id)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline cursor-pointer outline-none"
                  >
                    <span>Inspect Step Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
