/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Edit, 
  Trash2, 
  FileText, 
  Layers, 
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { Phase } from '../types';

interface NotesHubProps {
  phases: Phase[];
  taskNotes: { [taskId: string]: string };
  phaseNotes: { [phaseId: number]: string };
  updateTaskNotes: (taskId: string, text: string) => void;
  updatePhaseNotes: (phaseId: number, text: string) => void;
}

export default function NotesHub({
  phases,
  taskNotes,
  phaseNotes,
  updateTaskNotes,
  updatePhaseNotes
}: NotesHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [noteTypeFilter, setNoteTypeFilter] = useState<'all' | 'phase' | 'task'>('all');

  // Load all accumulated notes
  const accumulatedPhaseNotes = Object.entries(phaseNotes)
    .filter(([_, text]) => text.trim().length > 0)
    .map(([phIdStr, text]) => {
      const phId = parseInt(phIdStr);
      const ph = phases.find(p => p.id === phId);
      return {
        id: `phase_${phId}`,
        type: 'phase' as const,
        parentId: phId,
        title: ph ? `Phase ${ph.id}: ${ph.title}` : `Phase ${phId}`,
        text,
        subTitle: undefined as string | undefined
      };
    });

  const accumulatedTaskNotes = Object.entries(taskNotes)
    .filter(([_, text]) => text.trim().length > 0)
    .map(([taskId, text]) => {
      // Find parent task details
      const allTasks = phases.flatMap(p => p.tasks);
      const task = allTasks.find(t => t.id === taskId);
      const phase = phases.find(p => p.tasks.some(t => t.id === taskId));
      return {
        id: `task_${taskId}`,
        type: 'task' as const,
        parentId: taskId,
        title: task ? task.title : `Task ${taskId}`,
        text,
        subTitle: phase ? `Phase ${phase.id}: ${phase.title}` : undefined
      };
    });

  const allNotes = [...accumulatedPhaseNotes, ...accumulatedTaskNotes];

  // Apply filters
  const filteredNotes = allNotes.filter(n => {
    const typeMatches = noteTypeFilter === 'all' || n.type === noteTypeFilter;
    const queryMatches = searchQuery.trim() === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.text.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatches && queryMatches;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="notes_panel">
      {/* Search Header visual rail */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-5 rounded-xl">
        <div className="space-y-1">
          <h2 className="text-lg font-sans font-semibold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400 font-bold" /> Documentation Hub & Notes
          </h2>
          <p className="text-xs text-slate-500">Search and audit notes logged during development of milestones</p>
        </div>

        {/* Search Input bar */}
        <div className="relative w-full sm:w-72 shrink-0">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes index..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-201 outline-none focus:border-indigo-505 placeholder-slate-550 focus:ring-1 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* Navigation Filter Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-900 pb-2 select-none">
        <button
          onClick={() => setNoteTypeFilter('all')}
          className={`px-3 py-1.5 rounded text-xs transition-all font-mono cursor-pointer outline-none ${
            noteTypeFilter === 'all' 
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold' 
              : 'text-slate-500 hover:text-slate-350 bg-slate-950 border border-transparent'
          }`}
        >
          All Entries ({allNotes.length})
        </button>
        <button
          onClick={() => setNoteTypeFilter('phase')}
          className={`px-3 py-1.5 rounded text-xs transition-all font-mono cursor-pointer outline-none ${
            noteTypeFilter === 'phase' 
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold' 
              : 'text-slate-500 hover:text-slate-350 bg-slate-950 border border-transparent'
          }`}
        >
          Phase Notes ({accumulatedPhaseNotes.length})
        </button>
        <button
          onClick={() => setNoteTypeFilter('task')}
          className={`px-3 py-1.5 rounded text-xs transition-all font-mono cursor-pointer outline-none ${
            noteTypeFilter === 'task' 
              ? 'bg-indigo-600/10 text-indigo-405 border border-indigo-500/20 font-bold' 
              : 'text-slate-500 hover:text-slate-350 bg-slate-950 border border-transparent'
          }`}
        >
          Task Notes ({accumulatedTaskNotes.length})
        </button>
      </div>

      {/* Primary Grid results display */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-950 border border-slate-800 rounded-xl">
          <span className="p-3.5 bg-slate-900 border border-slate-800 text-slate-500 rounded-full inline-block">
            <FileText className="w-5 h-5 animate-pulse" />
          </span>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-300">No Custom Notes Found</h4>
            <p className="text-[11px] text-slate-550 max-w-xs mx-auto font-mono leading-relaxed">
              If search filters stand vacant, expand any Roadmap Phase view and type inside the notes panels to save.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-slate-950 border border-slate-805 p-5 rounded-xl space-y-3 hover:border-slate-705 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                    note.type === 'phase' 
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                      : 'bg-cyan-500/10 text-cyan-405 border border-cyan-500/15'
                  }`}>
                    {note.type} Note
                  </span>
                  <div className="text-[10px] font-mono text-slate-605 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Auto-Saved
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-205 leading-snug font-sans truncate">
                    {note.title}
                  </h4>
                  {note.subTitle && (
                    <span className="text-[10px] text-slate-550 font-mono block truncate">{note.subTitle}</span>
                  )}
                </div>

                <p className="text-xs text-slate-401 font-sans leading-relaxed whitespace-pre-wrap bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                  {note.text}
                </p>
              </div>

              {/* Action buttons (allow erasing) */}
              <div className="pt-3 border-t border-slate-900 flex justify-end gap-2.5 text-xs select-none">
                <button
                  onClick={() => {
                    if (confirm("Clear this custom note string?")) {
                      if (note.type === 'phase') {
                        updatePhaseNotes(note.parentId as number, "");
                      } else {
                        updateTaskNotes(note.parentId as string, "");
                      }
                    }
                  }}
                  className="text-[10px] font-mono text-rose-450 hover:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer outline-none font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Stop tracking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive tip footer */}
      <div className="bg-indigo-950/20 border border-indigo-500/10 p-4 rounded-xl text-xs flex gap-3 text-slate-300">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-101 font-semibold block">Documentation Integration Policy:</strong>
          These notes are cached locally inside your sandbox browser partition. When shifting workstations, download a diagnostic database backup via **OS Settings** to avoid losing records.
        </div>
      </div>
    </div>
  );
}
