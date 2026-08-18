import React, { useState } from 'react';
import { GitMerge, GitBranch, AlertCircle, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

export const ConflictSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rebase' | 'merge'>('rebase');
  const [resolutionStep, setResolutionStep] = useState<number>(0);

  const conflictSteps = [
    {
      title: "1. Conflicto Detectado contra develop",
      desc: "Carlos ejecutó 'git rebase origin/develop' y Git encontró que tanto Ana como Carlos modificaron Navbar.tsx en develop.",
      code: `export function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <div className="font-bold text-lg">Mi Aplicación</div>
      <div className="flex items-center gap-3">
<<<<<<< HEAD (Cambios que Ana ya subió a develop)
        <span className="text-sm">Ana Gómez</span>
        <img src="/avatar-ana.png" alt="Perfil" className="w-8 h-8 rounded-full" />
=======
        <button onClick={handleLogout} className="bg-rose-600 px-3 py-1.5 rounded text-sm font-medium">
          Cerrar Sesión
        </button>
>>>>>>> a1b2c3d (feat: agregar boton de cerrar sesion)
      </div>
    </header>
  );
}`
    },
    {
      title: "2. Carlos Edita y Resuelve Manualmente",
      desc: "Carlos identifica que ambos cambios son necesarios: el avatar de Ana y su nuevo botón de logout.",
      code: `export function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <div className="font-bold text-lg">Mi Aplicación</div>
      <div className="flex items-center gap-3">
        {/* Integración limpia de ambos aportes en develop */}
        <span className="text-sm">Usuario Actual</span>
        <img src="/avatar.png" alt="Perfil" className="w-8 h-8 rounded-full" />
        <button onClick={handleLogout} className="bg-rose-600 px-3 py-1.5 rounded text-sm font-medium">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}`
    },
    {
      title: "3. Marcar Resuelto y Continuar hacia develop",
      desc: "Carlos ejecuta 'git add' y 'git rebase --continue'. Git aplica el commit sobre develop limpiamente sin crear un merge commit basura.",
      code: `$ git add src/components/Navbar.tsx
$ git rebase --continue
Applying: feat(nav): agregar boton de cerrar sesion con confirmacion
Successfully rebased and updated refs/heads/feat/boton-logout.
$ git push --force-with-lease origin feat/boton-logout`
    }
  ];

  return (
    <div id="conflict-simulator-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm tracking-wide uppercase">
            <Layers className="w-4 h-4" />
            Simulador Visual de Conflictos y Árbol de Git
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Rebase vs Merge en develop: ¿Por qué Rebase mantiene limpio tu repositorio?
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Compara visualmente cómo afecta cada método al historial antes del paso a producción en <strong className="text-emerald-400">main</strong>.
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            id="tab-toggle-rebase"
            onClick={() => setActiveTab('rebase')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'rebase'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Estrategia Recomendada: Rebase
          </button>
          <button
            id="tab-toggle-merge"
            onClick={() => setActiveTab('merge')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'merge'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Método Problemático: Merge directo
          </button>
        </div>
      </div>

      {/* Comparison diagrams */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Rebase Diagram */}
        <div className={`p-5 rounded-xl border transition-all ${
          activeTab === 'rebase'
            ? 'bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/20'
            : 'bg-slate-950/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <GitBranch className="w-4 h-4" /> Con Git Rebase contra develop
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-medium">Recomendado</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
            <div className="text-emerald-400 font-bold">Historial resultante en develop:</div>
            <div className="pl-2 border-l-2 border-emerald-500/40 space-y-1">
              <div>● feat: avatar de usuario (Ana)</div>
              <div>● feat: boton logout (Carlos) <span className="text-slate-500">&lt;-- aplicado limpiamente encima</span></div>
              <div>● feat: pasarela de pago stripe</div>
            </div>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              ✅ Al pasar a <strong>main</strong>, la Release entra 100% limpia y sin enredos de ramas.
            </div>
          </div>
        </div>

        {/* Right: Merge Diagram */}
        <div className={`p-5 rounded-xl border transition-all ${
          activeTab === 'merge'
            ? 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/20'
            : 'bg-slate-950/40 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <GitMerge className="w-4 h-4" /> Con Git Merge (Ramas cruzadas)
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 font-medium">Desordenado</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
            <div className="text-rose-400 font-bold">Historial resultante:</div>
            <div className="pl-2 border-l-2 border-rose-500/40 space-y-1">
              <div>● Merge branch 'develop' of github.com... <span className="text-rose-400 font-semibold">(Basura)</span></div>
              <div>|\</div>
              <div>| ● feat: boton logout</div>
              <div>● | feat: avatar de usuario</div>
              <div>|/</div>
            </div>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              ❌ Dificulta rastrear qué commit introdujo un error en producción.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive step-by-step resolution box */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h4 className="font-bold text-base text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Simulador de Resolución de Conflicto en Vivo (en develop)
          </h4>
          <div className="flex gap-2">
            {conflictSteps.map((s, idx) => (
              <button
                key={idx}
                id={`btn-conflict-step-${idx}`}
                onClick={() => setResolutionStep(idx)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  resolutionStep === idx
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Paso {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <span className="text-sm font-semibold text-indigo-300">
              {conflictSteps[resolutionStep].title}
            </span>
            <span className="text-xs text-slate-400">
              Archivo: <code className="text-slate-200">src/components/Navbar.tsx</code>
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            {conflictSteps[resolutionStep].desc}
          </p>

          <pre className="bg-slate-900/90 p-3 rounded-lg overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed border border-slate-800">
            <code>{conflictSteps[resolutionStep].code}</code>
          </pre>

          <div className="mt-3 flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">
              Paso {resolutionStep + 1} de {conflictSteps.length}
            </span>
            <button
              id="btn-next-conflict-step"
              onClick={() => setResolutionStep((prev) => (prev + 1) % conflictSteps.length)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {resolutionStep === conflictSteps.length - 1 ? 'Reiniciar simulación' : 'Ver siguiente paso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
