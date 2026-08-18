import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const CommandGenerator: React.FC = () => {
  const [branchType, setBranchType] = useState('feat');
  const [ticketId, setTicketId] = useState('AUTH-102');
  const [taskDesc, setTaskDesc] = useState('login-con-google');
  const [commitMessage, setCommitMessage] = useState('agregar soporte para inicio de sesion con Google OAuth');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const cleanDesc = taskDesc.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
  const branchName = ticketId.trim()
    ? `${branchType}/${ticketId.trim().toUpperCase()}-${cleanDesc}`
    : `${branchType}/${cleanDesc}`;

  const baseBranch = branchType === 'hotfix' ? 'main' : 'develop';

  const steps = [
    {
      step: 1,
      title: `Actualizar ${baseBranch} y crear rama limpia`,
      comment: `Nace de ${baseBranch} con la versión más reciente del equipo`,
      command: `git checkout ${baseBranch} && git pull origin ${baseBranch} && git checkout -b ${branchName}`
    },
    {
      step: 2,
      title: "Desarrollar y guardar cambios atómicos",
      comment: "Usa Conventional Commits para describir claramente tu aporte",
      command: `git add . && git commit -m "${branchType}(${cleanDesc.slice(0, 15)}): ${commitMessage}"`
    },
    {
      step: 3,
      title: `Sincronizarse con lo nuevo de ${baseBranch} (Rebase)`,
      comment: `Ejecuta esto antes de subir para evitar conflictos en ${baseBranch}`,
      command: `git fetch origin ${baseBranch} && git rebase origin/${baseBranch}`
    },
    {
      step: 4,
      title: `Publicar tu rama y abrir PR hacia ${baseBranch}`,
      comment: "Usa -u la primera vez o --force-with-lease si hiciste rebase",
      command: `git push -u origin ${branchName}`
    },
    {
      step: 5,
      title: `Limpieza tras el merge del Pull Request en ${baseBranch}`,
      comment: `Regresa a ${baseBranch} y borra la rama que ya fue integrada`,
      command: `git checkout ${baseBranch} && git pull origin ${baseBranch} && git branch -d ${branchName}`
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const fullScript = steps.map(s => `# Paso ${s.step}: ${s.title}\n${s.command}`).join('\n\n');
    navigator.clipboard.writeText(fullScript);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div id="interactive-command-generator" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            Herramienta Interactiva del Equipo (develop ➔ main)
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Generador de Comandos para tu Tarea
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Genera automáticamente los comandos basados en <strong className="text-emerald-300">develop</strong> (o <strong className="text-rose-300">main</strong> para hotfixes).
          </p>
        </div>

        <button
          id="btn-copy-all-commands"
          onClick={handleCopyAll}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start md:self-auto cursor-pointer"
        >
          {copiedAll ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copiedAll ? '¡Secuencia Copiada!' : 'Copiar Toda la Secuencia'}
        </button>
      </div>

      {/* Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
            Tipo de Rama
          </label>
          <select
            id="select-branch-type"
            value={branchType}
            onChange={(e) => setBranchType(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="feat">feat (Nueva funcionalidad ➔ develop)</option>
            <option value="fix">fix (Corrección de bug ➔ develop)</option>
            <option value="refactor">refactor (Refactorización ➔ develop)</option>
            <option value="chore">chore (Mantenimiento ➔ develop)</option>
            <option value="hotfix">hotfix (Emergencia producción ➔ main)</option>
            <option value="docs">docs (Documentación ➔ develop)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
            Ticket ID (Opcional)
          </label>
          <input
            id="input-ticket-id"
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="ej: PROJ-42"
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
            Descripción Corta
          </label>
          <input
            id="input-task-desc"
            type="text"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="ej: login-con-google"
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
          Mensaje de Commit
        </label>
        <input
          id="input-commit-msg"
          type="text"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="ej: agregar soporte para inicio de sesion con Google OAuth"
          className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Generated Branch Badge */}
      <div className="mt-5 p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="text-slate-400">Rama:</span>
          <code className="bg-slate-900 px-2.5 py-1 rounded text-emerald-400 font-mono font-semibold text-xs sm:text-sm">
            {branchName}
          </code>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Base / Destino del PR:</span>
          <span className="bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 rounded text-xs font-semibold">
            {baseBranch}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Estrategia Validada</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-6 space-y-3.5">
        {steps.map((item, idx) => (
          <div
            key={item.step}
            id={`generated-step-${item.step}`}
            className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <span className="font-semibold text-sm text-white">{item.title}</span>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">{item.comment}</span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-200">
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-emerald-300 select-all">{item.command}</span>
              </div>
              <button
                id={`btn-copy-step-${item.step}`}
                onClick={() => handleCopy(item.command, idx)}
                className="shrink-0 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copiar comando"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
