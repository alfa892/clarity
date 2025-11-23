import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ActCard } from './components/ActCard';
import { QuoteBuilder } from './components/QuoteBuilder';
import { HomePage } from './components/HomePage';
import { ScanPage } from './components/ScanPage';
import { ResultPage } from './components/ResultPage';
import { DashboardPage } from './components/DashboardPage';
import { DentistQuoteEditor } from './components/DentistQuoteEditor';
import { DentistLogin } from './components/DentistLogin';
import { MagicLinkLanding } from './components/MagicLinkLanding';
import { ccamData } from './data/ccam_codes';
import type { CCAMAct, DentistUser, Quote } from './types';
import { ArrowLeft } from 'lucide-react';

function App() {
  const buildMagicLink = (quote: Quote): Quote => {
    const token = quote.magicLinkToken || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10));
    const expiresAt = quote.linkExpiresAt || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
    const url = quote.magicLinkUrl || `https://klarity.app/d/${token}`;
    return {
      ...quote,
      magicLinkToken: token,
      magicLinkUrl: url,
      linkExpiresAt: expiresAt,
      openCount: quote.openCount ?? 0,
      lastOpenedAt: quote.lastOpenedAt ?? null,
      deliveryChannels: quote.deliveryChannels ?? [],
    };
  };

  const [view, setView] = useState<'home' | 'scan' | 'manual' | 'result' | 'dashboard' | 'editor' | 'login' | 'magic'>('home');
  const [selectedResultAct, setSelectedResultAct] = useState<CCAMAct | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteActs, setQuoteActs] = useState<CCAMAct[]>(() => {
    const saved = localStorage.getItem('ccam_quote');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeMagicQuote, setActiveMagicQuote] = useState<Quote | null>(null);
  const [user, setUser] = useState<DentistUser | null>(() => {
    const saved = localStorage.getItem('dentist_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [dentistQuotes, setDentistQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('dentist_quotes');
    if (!saved) return [];
    try {
      const parsed: Quote[] = JSON.parse(saved);
      return parsed.map(q => buildMagicLink({ ...q, openCount: q.openCount ?? 0, lastOpenedAt: q.lastOpenedAt ?? null }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ccam_quote', JSON.stringify(quoteActs));
  }, [quoteActs]);

  useEffect(() => {
    localStorage.setItem('dentist_quotes', JSON.stringify(dentistQuotes));
  }, [dentistQuotes]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dentist_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dentist_user');
    }
  }, [user]);

  const filteredActs = useMemo(() => {
    if (!searchTerm) return ccamData;

    const lowerTerm = searchTerm.toLowerCase();
    return ccamData.filter(act =>
      act.code.toLowerCase().includes(lowerTerm) ||
      act.label_patient.toLowerCase().includes(lowerTerm) ||
      act.label_technical.toLowerCase().includes(lowerTerm) ||
      act.keywords.some(k => k.toLowerCase().includes(lowerTerm))
    );
  }, [searchTerm]);

  const addToQuote = (act: CCAMAct) => {
    setQuoteActs(prev => [...prev, act]);
  };

  const removeFromQuote = (index: number) => {
    setQuoteActs(prev => prev.filter((_, i) => i !== index));
  };

  const handleScanComplete = (results: CCAMAct[]) => {
    if (results.length > 0) {
      setSelectedResultAct(results[0]);
      setQuoteActs(prev => [...prev, ...results]);
    }
    setView('result');
  };

  const handleSaveQuote = (quote: Quote) => {
    const quoteWithLink = buildMagicLink(quote);
    setDentistQuotes(prev => [quoteWithLink, ...prev]);
    setActiveMagicQuote(quoteWithLink);
    setView('dashboard');
  };

  const handleMagicLinkOpen = (quoteId: string) => {
    const now = new Date().toISOString();
    setDentistQuotes(prev => {
      const updated = prev.map(q => q.id === quoteId ? { ...q, openCount: (q.openCount ?? 0) + 1, lastOpenedAt: now } : q);
      const target = updated.find(q => q.id === quoteId) || null;
      setActiveMagicQuote(target);
      return updated;
    });
    setView('magic');
  };

  const handleLogin = (newUser: DentistUser) => {
    setUser(newUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const handleDentistAccess = () => {
    setView(user ? 'dashboard' : 'login');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        handleDentistAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {view === 'login' && (
        <DentistLogin onLogin={handleLogin} onCancel={() => setView('home')} />
      )}

      {view === 'magic' && activeMagicQuote && (
        <MagicLinkLanding
          quote={activeMagicQuote}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'home' && (
        <>
          <HomePage onNavigate={setView} />
          <div className="fixed bottom-4 right-4 opacity-20 hover:opacity-100 transition-opacity">
            <button onClick={handleDentistAccess} className="text-xs text-slate-400">Accès Praticien</button>
          </div>
        </>
      )}

      {view === 'scan' && (
        <ScanPage
          onScanComplete={handleScanComplete}
          onCancel={() => setView('home')}
        />
      )}

      {view === 'result' && selectedResultAct && (
        <ResultPage
          act={selectedResultAct}
          onBack={() => setView('home')}
        />
      )}

      {view === 'dashboard' && (
        user ? (
          <DashboardPage
            user={user}
            onNavigate={setView}
            quotes={dentistQuotes}
            onOpenMagicLink={handleMagicLinkOpen}
            onLogout={handleLogout}
          />
        ) : (
          <DentistLogin onLogin={handleLogin} onCancel={() => setView('home')} />
        )
      )}

      {view === 'editor' && (
        user ? (
          <DentistQuoteEditor
            onBack={() => setView('dashboard')}
            onSave={handleSaveQuote}
          />
        ) : (
          <DentistLogin onLogin={handleLogin} onCancel={() => setView('home')} />
        )
      )}

      {view === 'manual' && (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="mb-8 flex items-center">
            <button
              onClick={() => setView('home')}
              className="mr-4 p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Recherche Manuelle</h1>
              <p className="text-slate-500 mt-1">Trouvez les codes CCAM et ajoutez-les à votre devis.</p>
            </div>
          </div>

          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                {searchTerm ? 'Résultats de recherche' : 'Actes fréquents'}
              </h2>
              {filteredActs.length > 0 ? (
                filteredActs.map(act => (
                  <ActCard key={act.code} act={act} onAdd={addToQuote} />
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-100">
                  Aucun acte trouvé pour "{searchTerm}". Essayez un autre code ou mot-clé.
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <QuoteBuilder selectedActs={quoteActs} onRemoveAct={removeFromQuote} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
