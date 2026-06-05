import { useState, useEffect } from 'preact/hooks';
import { PGlite } from '@electric-sql/pglite';
import { Database, Play, AlertCircle } from 'lucide-preact';

export function App() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [query, setQuery] = useState('SELECT 1 as "All systems go!";');
  const [results, setResults] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function initDB() {
      try {
        const pglite = new PGlite();
        await pglite.waitReady;
        
        // Setup initial demo data
        await pglite.exec(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            role VARCHAR(50)
          );
          INSERT INTO users (name, role) VALUES 
          ('Alice', 'Admin'), 
          ('Bob', 'Developer'), 
          ('Charlie', 'Designer')
          ON CONFLICT DO NOTHING;
        `);

        setDb(pglite);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize database');
      } finally {
        setIsInitializing(false);
      }
    }
    initDB();
  }, []);

  const runQuery = async () => {
    if (!db) return;
    setError(null);
    try {
      const res = await db.query(query);
      setResults(res.rows as any[]);
      if (res.rows.length > 0) {
        setColumns(Object.keys(res.rows[0] as Record<string, unknown>));
      } else {
        setColumns([]);
      }
    } catch (err: any) {
      setError(err.message);
      setResults([]);
      setColumns([]);
    }
  };

  return (
    <div class="min-h-screen p-4 md:p-8 flex flex-col font-sans">
      <header class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-primary/20 rounded-xl">
          <Database class="text-primary" size={28} />
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">WASM Data Forge</h1>
          <p class="text-sm text-slate-400">In-browser PostgreSQL engine</p>
        </div>
      </header>

      <main class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <section class="bg-bg-panel rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden shadow-xl">
          <div class="bg-slate-800/50 border-b border-slate-700/50 p-3 px-4 flex justify-between items-center">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">SQL Editor</span>
            <button 
              onClick={runQuery}
              disabled={isInitializing || !db}
              class="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Play size={16} />
              Run Query
            </button>
          </div>
          <textarea
            value={query}
            onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)}
            class="w-full flex-1 bg-transparent p-4 text-emerald-400 font-mono text-sm resize-none focus:outline-none"
            spellcheck={false}
            placeholder="Type your SQL query here..."
          />
        </section>

        {/* Results Panel */}
        <section class="bg-bg-panel rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden shadow-xl">
          <div class="bg-slate-800/50 border-b border-slate-700/50 p-3 px-4">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Output</span>
          </div>
          <div class="p-4 flex-1 overflow-auto">
            {isInitializing ? (
              <div class="flex items-center justify-center h-full text-slate-500 animate-pulse">
                Booting PostgreSQL Engine...
              </div>
            ) : error ? (
              <div class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle class="shrink-0 mt-0.5" size={18} />
                <span class="text-sm font-mono">{error}</span>
              </div>
            ) : results.length === 0 ? (
              <div class="flex items-center justify-center h-full text-slate-500 text-sm">
                No results or query executed successfully.
              </div>
            ) : (
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-300">
                  <thead class="bg-slate-800 text-slate-400">
                    <tr>
                      {columns.map(col => (
                        <th key={col} class="px-4 py-2 font-medium">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-700/50">
                    {results.map((row, i) => (
                      <tr key={i} class="hover:bg-slate-800/30 transition-colors">
                        {columns.map(col => (
                          <td key={col} class="px-4 py-2 whitespace-nowrap">{String(row[col])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
