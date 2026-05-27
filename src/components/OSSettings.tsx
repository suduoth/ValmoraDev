/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  Trash2, 
  Sparkles, 
  HelpCircle,
  Database,
  Check,
  Bot,
  Sliders
} from 'lucide-react';
import { OSSettings as SettingsType } from '../hooks/useOSState';

interface OSSettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  resetAllProgress: () => void;
  exportProgressStateJSON: () => string;
  importProgressStateJSON: (jsonString: string) => boolean;
}

export default function OSSettings({
  settings,
  setSettings,
  resetAllProgress,
  exportProgressStateJSON,
  importProgressStateJSON
}: OSSettingsProps) {
  const [copied, setCopied] = useState(false);
  const [importReport, setImportReport] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleSound = () => {
    setSettings(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  const handlePersonalityChange = (perf: SettingsType['mentorPersonality']) => {
    setSettings(prev => ({
      ...prev,
      mentorPersonality: perf
    }));
  };

  const handleExport = () => {
    const jsonStr = exportProgressStateJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `valmora_gdos_snapshot_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importProgressStateJSON(text);
      if (success) {
        setImportReport("Pristine backup loaded successfully! Directing update events.");
        setTimeout(() => setImportReport(null), 4000);
      } else {
        setImportReport("CRITICAL ERROR: Selected backup payload contains corrupt or unreadable JSON variables.");
        setTimeout(() => setImportReport(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="settings_panel">
      {/* Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Workstation Controls */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-805 pb-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 font-sans">
              <Sliders className="w-4 h-4 text-indigo-400" /> Workstation Configuration
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Tune audio feedback and metrics limits</p>
          </div>

          <div className="space-y-4">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-805 rounded-xl">
              <div className="space-y-1 max-w-[70%]">
                <span className="text-xs font-semibold text-slate-205 flex items-center gap-1">
                  Audio Feedback Beeps
                </span>
                <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                  Generate gentle sine-wave chime sequences inside the workspace upon task actions.
                </p>
              </div>

              <button
                onClick={handleToggleSound}
                className={`p-2.5 rounded-lg border cursor-pointer outline-none transition-all ${
                  settings.soundEnabled 
                    ? 'bg-indigo-650 text-white border-indigo-500 shadow shadow-indigo-500/10' 
                    : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-350'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            {/* AI Personality Selection */}
            <div className="p-4 bg-slate-900 border border-slate-805 rounded-xl space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-205 flex items-center gap-1">
                  <Bot className="w-4 h-4 text-indigo-400" /> Mentor Personality Core
                </span>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  Toggle the cognitive behavior matrix injected into our full-stack chat advisor.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-1 font-mono text-[11px]">
                {[
                  { id: 'unreal-pm' as const, label: "Senior UE5 PM (Sequential Advisor)", desc: "Enforces roadmap paths, dependency validation, and general progress pacing." },
                  { id: 'technical-guru' as const, label: "Technical Guru (Source Specialist)", desc: "Discusses deep source structures, handles memory, coordinates C++ systems." },
                  { id: 'encouraging-partner' as const, label: "Design Buddy (Encouraging Partner)", desc: "Morale-focused. Breaks math down clearly, prevents lone-wolf burnouts." }
                ].map((p) => {
                  const isChecked = settings.mentorPersonality === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePersonalityChange(p.id)}
                      className={`p-3 text-left rounded-lg border transition-all flex justify-between items-center cursor-pointer outline-none ${
                        isChecked 
                          ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' 
                          : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-350'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block">{p.label}</span>
                        <span className="text-[10px] text-slate-505 block mt-0.5 leading-relaxed font-sans font-medium">{p.desc}</span>
                      </div>
                      {isChecked && <Check className="w-4 h-4 shrink-0 text-indigo-400 font-bold ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Storage Management snapshot backup */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="border-b border-slate-805 pb-3">
              <h3 className="text-sm font-semibold text-slate-101 flex items-center gap-2 font-sans">
                <Database className="w-4 h-4 text-indigo-400" /> Storage & Workspace Operations
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">Backup snapshot database configurations</p>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-401 leading-relaxed">
                Work completed represents physical creative assets. Download local snapshots as `.json` database records. Upload them back to populate progress databases easily.
              </p>

              {importReport && (
                <div className={`p-3 rounded-lg text-xs font-mono border ${
                  importReport.includes("ERROR") 
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {importReport}
                </div>
              )}

              {/* Import / Export Action group */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleExport}
                  className="px-4 py-3 bg-slate-900 border border-slate-800 hover:border-slate-705 text-xs text-slate-205 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer outline-none"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Download Backup</span>
                </button>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".json"
                  className="hidden"
                />
                
                <button
                  onClick={handleImportClick}
                  className="px-4 py-3 bg-slate-900 border border-slate-800 hover:border-slate-705 text-xs text-slate-205 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer outline-none"
                >
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>Upload Backup</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reset Workspace Area */}
          <div className="p-4 bg-rose-500/5 border border-rose-500/15 rounded-xl space-y-3 pt-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-rose-450 block uppercase tracking-wide">Developer Risk Zone</span>
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Erase local caches, clear logs, task completions, bookmarks, and revert interactive milestones back to standard base diagnostics.
              </p>
            </div>

            <button
              onClick={resetAllProgress}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer outline-none transition-all w-fit font-mono"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Full OS Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
