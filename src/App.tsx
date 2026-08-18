import React, { useState } from 'react';
import {
  GitBranch,
  BookOpen,
  Terminal,
  Layers,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  FileCode,
  Github
} from 'lucide-react';
import { DocumentViewer } from './components/DocumentViewer';
import { CommandGenerator } from './components/CommandGenerator';
import { ConflictSimulator } from './components/ConflictSimulator';
import { RAW_MARKDOWN_CONTENT } from './data/workflowDocument';

export default function App() {
  const [activeTab, setActiveTab] = useState<'document' | 'generator' | 'simulator'>('document');
  const [copiedDoc, setCopiedDoc] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([RAW_MARKDOWN_CONTENT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'GIT_WORKFLOW.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(RAW_MARKDOWN_CONTENT);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-sm sm:text-base">
                  Git Team Workflow & Policy
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  Protocolo Oficial
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Estrategia de ramas, sincronización con rebase y resolución de conflictos
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="header-btn-copy-doc"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
              title="Copiar archivo Markdown al portapapeles"
            >
              {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copiedDoc ? '¡Copiado!' : 'Copiar Markdown'}</span>
            </button>

            <button
              id="header-btn-download"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Descargar GIT_WORKFLOW.md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .md</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-800/60 py-2 scrollbar-none">
          <button
            id="tab-btn-document"
            onClick={() => setActiveTab('document')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'document'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Documento Completo
          </button>

          <button
            id="tab-btn-generator"
            onClick={() => setActiveTab('generator')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            Generador de Comandos
          </button>

          <button
            id="tab-btn-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            Simulador Rebase vs Merge
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Quick Notification banner */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Archivo disponible en la raíz del proyecto: <code className="text-emerald-300">/GIT_WORKFLOW.md</code>
              </h2>
              <p className="text-xs text-slate-400">
                Puedes copiar este archivo o descargarlo directamente para agregarlo como <code>GIT_WORKFLOW.md</code> o <code>CONTRIBUTING.md</code> en tu repositorio.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Guardar archivo ahora
          </button>
        </div>

        {/* View based on active tab */}
        {activeTab === 'document' && <DocumentViewer />}

        {activeTab === 'generator' && (
          <div className="space-y-6">
            <CommandGenerator />
            <DocumentViewer />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <ConflictSimulator />
            <DocumentViewer />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 text-center py-8 text-xs text-slate-500">
        <p>Protocolo de Ingeniería y Control de Versiones con Git • Diseñado para Equipos Ágiles</p>
      </footer>
    </div>
  );
}
