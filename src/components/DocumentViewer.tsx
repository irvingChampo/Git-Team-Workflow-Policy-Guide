import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Search,
  BookOpen,
  GitBranch,
  Terminal,
  ShieldAlert,
  Lock,
  FileText,
  Activity,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { WORKFLOW_SECTIONS, RAW_MARKDOWN_CONTENT } from '../data/workflowDocument';

export const DocumentViewer: React.FC = () => {
  const [copiedDoc, setCopiedDoc] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const handleCopyFullDoc = () => {
    navigator.clipboard.writeText(RAW_MARKDOWN_CONTENT);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([RAW_MARKDOWN_CONTENT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'GIT_WORKFLOW.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const CodeSnippet: React.FC<{ code: string; id: string; language?: string }> = ({ code, id, language = 'bash' }) => {
    return (
      <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="uppercase">{language}</span>
          <button
            onClick={() => handleCopySnippet(code, id)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {copiedSnippetId === id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-300/90 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-lg">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="doc-search-input"
            type="text"
            placeholder="Buscar reglas, comandos, nomenclaturas o soluciones de conflicto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            id="btn-copy-full-doc"
            onClick={handleCopyFullDoc}
            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            {copiedDoc ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedDoc ? '¡Markdown Copiado!' : 'Copiar Todo el Markdown'}
          </button>

          <button
            id="btn-download-markdown"
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar GIT_WORKFLOW.md
          </button>
        </div>
      </div>

      {/* Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedSection('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedSection === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          Ver Documento Completo
        </button>
        {WORKFLOW_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedSection(sec.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedSection === sec.id
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Document Content Sections */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 text-slate-200 shadow-2xl space-y-12 divide-y divide-slate-800/80">

        {/* Header Document Banner */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Protocolo Oficial del Repositorio
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Guía de Git para Equipos de Alto Rendimiento
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Estrategia de ramas efímeras, eliminación de commits de merge innecesarios, rebase preventivo y resolución segura de conflictos.
          </p>
        </div>

        {/* Section 1 */}
        {(selectedSection === 'all' || selectedSection === 'diagnostico') && (
          <section id="section-diagnostico" className="pt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                1. Diagnóstico y Filosofía de Trabajo
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 font-semibold">Fundamentos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-rose-400 font-bold text-sm mb-3 flex items-center gap-2">
                  ❌ ¿Por qué se rompía el flujo antes?
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Ramas de semanas sin actualizar:</strong> Desviación masiva respecto a <code>main</code>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Uso de <code>git pull</code> tradicional:</strong> Genera commits tipo <em>"Merge branch 'main' of..."</em> que ensucian el historial.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Commits masivos:</strong> Dificultad para revisar y revertir bugs aislados.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-emerald-400 font-bold text-sm mb-3 flex items-center gap-2">
                  ✅ Los 4 Principios de la Nueva Estrategia
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <span><strong>Ramas de vida corta:</strong> Máximo 1 a 3 días de duración por rama.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span><strong>Historial lineal con Rebase:</strong> Sin ramas cruzadas ni merges fantasmas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span><strong>La rama <code>main</code> es sagrada:</strong> Siempre desplegable y protegida.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">4.</span>
                    <span><strong>Pull Request obligatorio:</strong> Mínimo 1 aprobación para integrar código.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Section 2 */}
        {(selectedSection === 'all' || selectedSection === 'estrategia') && (
          <section id="section-estrategia" className="pt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-emerald-400" />
                2. Estrategia de Ramas y Nomenclatura
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-semibold">Convención</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Adoptamos una arquitectura <strong>Trunk-Based modificada con ramas efímeras</strong>. La rama principal es <code>main</code> y todas las ramas de trabajo nacen y mueren tras fusionarse a través de un Pull Request con <em>Squash and Merge</em>.
            </p>

            {/* Table of branch prefixes */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 text-slate-300 font-semibold uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Prefijo</th>
                    <th className="p-3.5">Propósito</th>
                    <th className="p-3.5">Ejemplo de Nombre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 bg-slate-950/40">
                  <tr>
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">feat/</td>
                    <td className="p-3.5">Nuevas características o pantallas de usuario</td>
                    <td className="p-3.5 font-mono text-xs text-slate-300">feat/login-google, feat/CART-10-pasarela-pago</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-rose-400 font-bold">fix/</td>
                    <td className="p-3.5">Corrección de errores o bugs en código</td>
                    <td className="p-3.5 font-mono text-xs text-slate-300">fix/calculo-iva, fix/AUTH-40-token-invalido</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-amber-400 font-bold">hotfix/</td>
                    <td className="p-3.5">Correcciones críticas directas a producción</td>
                    <td className="p-3.5 font-mono text-xs text-slate-300">hotfix/caida-checkout-stripe</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-indigo-400 font-bold">refactor/</td>
                    <td className="p-3.5">Mejora de arquitectura o limpieza sin cambiar comportamiento</td>
                    <td className="p-3.5 font-mono text-xs text-slate-300">refactor/modularizar-servicios-auth</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-cyan-400 font-bold">chore/</td>
                    <td className="p-3.5">Actualización de dependencias, configs, linter o CI/CD</td>
                    <td className="p-3.5 font-mono text-xs text-slate-300">chore/actualizar-vite-v6</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-mono text-purple-400 font-bold">docs/</td>
                    <td className="p-3.5">Modificaciones únicamente en documentación o README</td>
                    <td className="p-3.5 font-mono text-xs text-slate-300">docs/actualizar-guia-instalacion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Section 3 */}
        {(selectedSection === 'all' || selectedSection === 'ciclo-vida') && (
          <section id="section-ciclo-vida" className="pt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                3. Ciclo de Vida Diario Paso a Paso
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-300 font-semibold">Comandos</span>
            </div>

            {/* Step 3.0 */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 font-bold text-sm text-white mb-2">
                <span className="w-5 h-5 rounded bg-amber-600 text-white text-xs flex items-center justify-center font-mono">0</span>
                Configuración Inicial Obligatoria (Una sola vez en tu equipo)
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Esto asegura que cada vez que hagas <code>git pull</code>, Git use <code>rebase</code> de forma nativa sin generar commits basura.
              </p>
              <CodeSnippet
                id="cmd-step-0"
                code={`git config --global pull.rebase true\ngit config --global fetch.prune true\ngit config --global rebase.autoStash true`}
              />
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1">Paso 1: Iniciar nueva tarea desde main actualizado</h4>
                <p className="text-xs text-slate-400 mb-2">Nunca inicies una tarea desde una rama vieja o desactualizada.</p>
                <CodeSnippet
                  id="cmd-step-1"
                  code={`git checkout main\ngit pull origin main\ngit checkout -b feat/registro-usuarios`}
                />
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1">Paso 2: Desarrollar con commits atómicos</h4>
                <p className="text-xs text-slate-400 mb-2">Guarda progresivamente tus cambios con Conventional Commits (feat, fix, refactor, test, chore).</p>
                <CodeSnippet
                  id="cmd-step-2"
                  code={`git add src/features/auth/register.tsx\ngit commit -m "feat(auth): agregar validacion de contrasena segura en registro"`}
                />
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1">Paso 3: Sincronizarte con lo nuevo de main usando Rebase</h4>
                <p className="text-xs text-slate-400 mb-2">⚠️ REGLA: Nunca uses <code>git merge main</code>. Usa <code>rebase</code> para mantener el árbol recto.</p>
                <CodeSnippet
                  id="cmd-step-3"
                  code={`git fetch origin main\ngit rebase origin/main`}
                />
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1">Paso 4: Subir tu rama y abrir Pull Request</h4>
                <p className="text-xs text-slate-400 mb-2">Usa <code>--force-with-lease</code> si ya habías subido la rama y realizaste un rebase.</p>
                <CodeSnippet
                  id="cmd-step-4"
                  code={`# Primera vez que la subes:\ngit push -u origin feat/registro-usuarios\n\n# Si ya existía en remoto y le hiciste rebase:\ngit push --force-with-lease origin feat/registro-usuarios`}
                />
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1">Paso 5: Fusión (Squash & Merge) y Limpieza</h4>
                <p className="text-xs text-slate-400 mb-2">Tras la aprobación del PR en GitHub/GitLab, limpia tu rama local.</p>
                <CodeSnippet
                  id="cmd-step-5"
                  code={`git checkout main\ngit pull origin main\ngit branch -d feat/registro-usuarios`}
                />
              </div>
            </div>
          </section>
        )}

        {/* Section 4 */}
        {(selectedSection === 'all' || selectedSection === 'conflictos') && (
          <section id="section-conflictos" className="pt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                4. Protocolo de Resolución de Conflictos con Rebase
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-rose-950 text-rose-300 font-semibold">Protocolo</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <p className="text-sm text-slate-300">
                Cuando dos desarrolladores tocan las mismas líneas, Git detiene el rebase para que decidas qué código conservar. Sigue estos 4 pasos:
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white">1. Ver qué archivos tienen conflicto:</strong>
                  <CodeSnippet id="cmd-conf-1" code={`git status`} />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white">2. Abrir el archivo y eliminar los marcadores de Git:</strong>
                  <p className="text-xs text-slate-400 my-1">
                    Deja únicamente el código final deseado y borra <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> y <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white">3. Marcar como resuelto y continuar (¡NO HAGAS git commit!):</strong>
                  <CodeSnippet id="cmd-conf-3" code={`git add src/archivo-resuelto.ts\ngit rebase --continue`} />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-white">4. Si algo sale mal y quieres empezar de nuevo:</strong>
                  <CodeSnippet id="cmd-conf-4" code={`git rebase --abort`} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 5 */}
        {(selectedSection === 'all' || selectedSection === 'politicas') && (
          <section id="section-politicas" className="pt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                5. Políticas de Protección del Repositorio
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 font-semibold">Seguridad</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1">🔒 Prohibido Push Directo a main</h4>
                <p className="text-slate-400">Todo cambio debe ingresar obligatoriamente a través de un Pull Request.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1">👥 Mínimo 1 Aprobación Requerida</h4>
                <p className="text-slate-400">Ningún PR se fusiona sin que un compañero lo haya revisado y aprobado.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1">🔄 Require branch to be up to date</h4>
                <p className="text-slate-400">Obliga a que la rama esté al día con <code>main</code> antes de permitir el merge.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-emerald-400 mb-1">🧪 CI / Build Checks en Verde</h4>
                <p className="text-slate-400">Pruebas unitarias, compilación de TypeScript y lint deben pasar sin errores.</p>
              </div>
            </div>
          </section>
        )}

        {/* Section 6 */}
        {(selectedSection === 'all' || selectedSection === 'cheat-sheet') && (
          <section id="section-cheat-sheet" className="pt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                6. Cheat Sheet & 5 Reglas de Oro
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-semibold">Referencia</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
              <h4 className="font-bold text-sm text-cyan-300 mb-3 uppercase tracking-wider">
                🌟 Las 5 Reglas Inquebrantables del Equipo
              </h4>
              <ol className="space-y-2 text-xs sm:text-sm text-slate-200">
                <li><strong>1. Nunca trabajes directamente en <code>main</code>.</strong></li>
                <li><strong>2. No hagas <code>git merge main</code> en tu rama local; usa siempre <code>git rebase origin/main</code>.</strong></li>
                <li><strong>3. Haz <code>fetch/pull</code> antes de empezar a programar y antes de abrir tu PR.</strong></li>
                <li><strong>4. Avisa al equipo antes de modificar configuraciones o dependencias globales.</strong></li>
                <li><strong>5. Revisa los Pull Requests de tus compañeros en menos de 24 horas.</strong></li>
              </ol>
            </div>
          </section>
        )}

        {/* Section 7 */}
        {(selectedSection === 'all' || selectedSection === 'caso-practico') && (
          <section id="section-caso-practico" className="pt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                7. Caso Práctico Completo: Carlos y Ana
              </h2>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-semibold">Ejemplo Real</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <p className="font-bold text-white mb-1">📖 Contexto del caso:</p>
                <p>
                  Carlos inicia la tarea de agregar el <strong>Botón de Logout</strong>. Mientras programa, Ana sube a <code>main</code> cambios en el mismo archivo <code>Navbar.tsx</code> (agregó el Avatar de usuario).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-emerald-400">1. Carlos crea su rama desde main limpio:</span>
                  <CodeSnippet id="case-1" code={`git checkout main && git pull origin main\ngit checkout -b feat/boton-logout`} />
                </div>

                <div>
                  <span className="font-semibold text-emerald-400">2. Carlos realiza sus cambios y hace commit:</span>
                  <CodeSnippet id="case-2" code={`git add src/components/Navbar.tsx\ngit commit -m "feat(nav): agregar boton de logout en barra superior"`} />
                </div>

                <div>
                  <span className="font-semibold text-emerald-400">3. Carlos se sincroniza con lo nuevo que subió Ana a main:</span>
                  <CodeSnippet id="case-3" code={`git fetch origin main\ngit rebase origin/main`} />
                </div>

                <div>
                  <span className="font-semibold text-rose-400">4. Git detecta conflicto en Navbar.tsx:</span>
                  <CodeSnippet
                    id="case-4"
                    language="tsx"
                    code={`<<<<<<< HEAD (Avatar de Ana en main)\n<img src="/avatar-ana.png" alt="Perfil" className="w-8 h-8 rounded-full" />\n=======\n<button onClick={handleLogout} className="bg-rose-600 px-3 py-1 rounded">Logout</button>\n>>>>>>> feat(nav): agregar boton de logout`}
                  />
                </div>

                <div>
                  <span className="font-semibold text-emerald-400">5. Carlos une ambos cambios y continúa el rebase:</span>
                  <CodeSnippet
                    id="case-5"
                    code={`# Carlos edita Navbar.tsx dejando tanto el avatar como el boton\ngit add src/components/Navbar.tsx\ngit rebase --continue\n\n# Carlos sube su rama lista para el PR:\ngit push -u origin feat/boton-logout`}
                  />
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300">
                  ✅ <strong>Resultado:</strong> Ana aprueba el PR de Carlos, se hace <em>Squash & Merge</em> y el historial de <code>main</code> se mantiene 100% lineal sin un solo commit de merge basura.
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
