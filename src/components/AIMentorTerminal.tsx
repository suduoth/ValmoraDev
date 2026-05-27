/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  ChevronRight, 
  HelpCircle, 
  BookOpen, 
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, Phase, Task } from '../types';

interface AIMentorTerminalProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  clearChatHistory: () => void;
  activePhase: Phase | undefined;
  activeTask: Task | undefined;
  personalityChoice: 'unreal-pm' | 'technical-guru' | 'encouraging-partner';
}

export default function AIMentorTerminal({
  chatHistory,
  setChatHistory,
  clearChatHistory,
  activePhase,
  activeTask,
  personalityChoice
}: AIMentorTerminalProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // Build user message
    const userMessage: ChatMessage = {
      id: "msg_" + Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextPhaseId: activePhase?.id,
      contextTaskId: activeTask?.id
    };

    setChatHistory(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Setup payload matching our full-stack /api/chat express wrapper
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...chatHistory, userMessage],
          activePhase: activePhase ? { id: activePhase.id, title: activePhase.title, goal: activePhase.goal } : null,
          activeTask: activeTask ? { id: activeTask.id, title: activeTask.title, description: activeTask.description } : null,
          personalityChoice
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error code ${response.status} from mentor API`);
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: "msg_" + Date.now() + "_reply",
        role: 'assistant',
        content: data.response || "Dialogue channel returned unreadable results.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, assistantMessage]);

    } catch (err: any) {
      console.error("Failed to query AI mentor:", err);
      setErrorMessage(err.message || "Failed to establish secure proxy channel to Senior Unreal Mentor.");
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedPrompts = [
    {
      label: "Validate Mover Rotation",
      prompt: "Can you review standard Unreal Engine Mover system orientation setups? I want to make sure I'm doing rotation interpolation correct without breaking network authority."
    },
    {
      label: "Decouple Save Data",
      prompt: "I am writing a Unique ID-backed local save structure. How do I decouple World Actors mesh data from persistent JSON fields?"
    },
    {
      label: "Optimize AI Sensors",
      prompt: "How can I toggle AI controllers and perception sensors dynamically inside Level BeginPlay to keep server thread performance high?"
    }
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[650px]" id="ai_mentor_panel">
      {/* Top terminal bar header */}
      <header className="px-5 py-4 bg-slate-900 border-b border-slate-805 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-indigo-600/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Bot className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 font-sans">
              Senior Unreal Mentor & Project Manager
            </h3>
            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              STATUS: <span className="text-emerald-400 font-bold animate-pulse">● ACTIVE DIALOGUE</span> 
              {activePhase && <span className="text-slate-650">| Focus: Phase {activePhase.id}</span>}
            </p>
          </div>
        </div>

        <button 
          onClick={clearChatHistory}
          className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-950 transition-all cursor-pointer outline-none"
          title="Clear Chat Logs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </header>

      {/* Context awareness indicator card */}
      <div className="bg-slate-900/30 border-b border-slate-900 py-2.5 px-5 flex items-center justify-between gap-4 text-[10px] font-mono select-none">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          Active Working Context:
        </span>
        <div className="flex gap-2">
          {activePhase ? (
            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
              Phase {activePhase.id}: {activePhase.title.slice(0, 25)}...
            </span>
          ) : (
            <span className="bg-slate-900 text-slate-500 px-2 py-0.5 rounded border border-slate-800">None Active</span>
          )}
          {activeTask && (
            <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
              {activeTask.title.slice(0, 20)}...
            </span>
          )}
        </div>
      </div>

      {/* Main message area scroll container */}
      <div className="flex-grow p-5 overflow-y-auto space-y-4">
        {chatHistory.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar block */}
            <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-slate-300 border-slate-705' 
                : 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/10'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </span>

            {/* Bubble body */}
            <div className="space-y-1">
              <div className={`p-3.5 rounded-xl text-xs leading-relaxed font-sans whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-indigo-650 text-white font-medium rounded-tr-none'
                  : 'bg-slate-900/80 text-slate-250 border border-slate-805/40 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
              <span className={`text-[9px] font-mono text-slate-505 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
            <span className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </span>
            <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl rounded-tl-none space-y-2">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Consulting Dev Specifications...
              </span>
              <div className="h-2 w-48 bg-slate-800 rounded"></div>
              <div className="h-2 w-32 bg-slate-800 rounded"></div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mx-auto bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg text-xs flex gap-3 max-w-xl text-slate-205">
            <AlertCircle className="w-5 h-5 text-rose-450 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <strong className="text-slate-101 block mb-1">Mentor Synapse Error:</strong>
              {errorMessage}
              <button 
                onClick={() => handleSend("Describe current phase objectives and rules.")}
                className="text-indigo-400 underline block mt-2 font-semibold hover:text-indigo-300 cursor-pointer"
              >
                Retry diagnostic query
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Predefined prompt templates inside empty state or footer */}
      {chatHistory.length <= 1 && (
        <div className="px-5 py-3.5 bg-slate-900/20 border-t border-slate-900/60 space-y-2">
          <div className="text-[10px] font-mono text-slate-502 uppercase tracking-wide flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Need Architectural Guidance?
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {predefinedPrompts.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(btn.prompt)}
                className="p-2 text-left text-[11px] bg-slate-900 hover:bg-slate-850/80 border border-slate-805 rounded transition-all flex items-center justify-between text-slate-351 cursor-pointer outline-none"
              >
                <span>{btn.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input composition area */}
      <footer className="p-4 bg-slate-900/50 border-t border-slate-850 flex gap-3 items-center">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          disabled={isLoading}
          placeholder={isLoading ? "Analyzing blueprints..." : "Inquire about Mover physics, custom schemas, interface decouplers..."}
          className="flex-grow bg-slate-950 border border-slate-804/60 rounded-lg py-2.5 px-4 text-xs text-slate-201 placeholder-slate-550 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading}
          className={`px-4 py-2.5 rounded-lg text-white text-xs font-semibold flex items-center gap-2 border cursor-pointer outline-none transition-all ${
            input.trim() && !isLoading
              ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Inquire</span>
        </button>
      </footer>
    </div>
  );
}
