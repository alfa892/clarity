import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, TrendingUp, Activity, Skull, Sparkles, Gauge, Timer } from 'lucide-react';
import type { CCAMAct } from '../types';
import { getInactionScenario } from '../data/inaction_scenarios';

interface InactionSimulatorProps {
    act: CCAMAct;
    currentPrice: number;
}

export const InactionSimulator: React.FC<InactionSimulatorProps> = ({ act, currentPrice }) => {
    const scenario = getInactionScenario(act, currentPrice);
    const [mode, setMode] = useState<'now' | 'future'>('now'); // toggle slider state
    const isFuture = mode === 'future';

    const safeTodayPrice = currentPrice && currentPrice > 0 ? currentPrice : Math.max(1, Math.round(scenario.futurePrice / 3));
    const delta = Math.max(scenario.futurePrice - safeTodayPrice, 0);
    const ratio = Math.max(1, Math.round(scenario.futurePrice / safeTodayPrice));

    const formatEuro = (value: number) => `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`;

    return (
        <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-2xl border border-white/10">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.15),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(248,113,113,0.12),transparent_35%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative z-10 p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                            <Sparkles className="text-amber-200" size={22} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Simulateur d'Inaction</p>
                            <h3 className="text-xl font-bold">Le coût réel de l'attente</h3>
                        </div>
                    </div>

                    <div className="relative inline-flex bg-white/10 border border-white/10 rounded-full p-1 w-full md:w-auto">
                        <motion.div
                            className="absolute top-1 bottom-1 rounded-full bg-white/20 backdrop-blur-sm"
                            animate={{ left: isFuture ? '50%' : '4px', width: 'calc(50% - 8px)' }}
                            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                        />
                        <button
                            className={`relative z-10 flex-1 px-4 py-2 text-sm font-semibold transition-colors ${!isFuture ? 'text-white' : 'text-slate-300'}`}
                            onClick={() => setMode('now')}
                            aria-pressed={!isFuture}
                        >
                            Aujourd'hui
                        </button>
                        <button
                            className={`relative z-10 flex-1 px-4 py-2 text-sm font-semibold transition-colors ${isFuture ? 'text-white' : 'text-slate-300'}`}
                            onClick={() => setMode('future')}
                            aria-pressed={isFuture}
                        >
                            Dans {scenario.timeframe}
                        </button>
                    </div>
                </div>

                {/* Timeline Slider */}
                <div className="relative">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-300 via-amber-300 to-rose-400"
                            animate={{ width: isFuture ? '100%' : '50%' }}
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        />
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center cursor-pointer"
                            animate={{ left: isFuture ? '100%' : '0%', x: isFuture ? '-50%' : '-0%' }}
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            onClick={() => setMode(prev => prev === 'now' ? 'future' : 'now')}
                            aria-label="Basculer la simulation dans le futur"
                            role="switch"
                            aria-checked={isFuture}
                        >
                            <Timer size={16} />
                        </motion.div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-300 mt-3 font-semibold">
                        <span>Action immédiate</span>
                        <span>Inaction ({scenario.timeframe})</span>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Medical Story */}
                    <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                            <div className="relative flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/30 to-rose-400/30 border border-white/10 flex items-center justify-center">
                                    <TrendingUp className={isFuture ? 'text-rose-200' : 'text-emerald-200'} size={22} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300 font-semibold">Projection médicale</p>
                                    <AnimatePresence mode="wait">
                                        <motion.h4
                                            key={isFuture ? scenario.futureCondition : act.label_patient}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-xl font-bold"
                                        >
                                            {isFuture ? scenario.futureCondition : act.label_patient}
                                        </motion.h4>
                                    </AnimatePresence>
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={isFuture ? scenario.description : act.description}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-sm text-slate-200 leading-relaxed"
                                        >
                                            {isFuture ? scenario.description : (act.description || "Intervenir tôt évite des traitements lourds et préserve votre confort.")}
                                        </motion.p>
                                    </AnimatePresence>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-50">
                                        <ArrowRight size={14} />
                                        {isFuture ? scenario.futureTreatment : "Traitement conservateur et indolore"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold mb-2">
                                    <span>Douleur</span>
                                    <span>{isFuture ? scenario.painLevel : 1}/10</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400"
                                        animate={{ width: isFuture ? `${scenario.painLevel * 10}%` : '12%' }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold mb-2">
                                    <span>Complexité</span>
                                    <span>{isFuture ? scenario.complexity : 2}/10</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-sky-300 to-purple-400"
                                        animate={{ width: isFuture ? `${scenario.complexity * 10}%` : '22%' }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold mb-2">
                                    <span>Risque financier</span>
                                    <span>x{ratio}</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500"
                                        animate={{ width: `${Math.min(ratio, 10) * 10}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Impact */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/10 via-transparent to-rose-300/10" />
                        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <motion.div
                                className="rounded-xl border border-white/10 bg-black/20 p-4 shadow-lg"
                                animate={{ scale: isFuture ? 0.97 : 1, borderColor: isFuture ? 'rgba(255,255,255,0.08)' : 'rgba(52,211,153,0.4)' }}
                            >
                                <div className="flex items-center gap-2 text-xs text-slate-300 mb-2 font-semibold">
                                    <Activity size={16} className="text-emerald-300" />
                                    Investir aujourd'hui
                                </div>
                                <div className="text-3xl font-bold">{formatEuro(safeTodayPrice)}</div>
                                <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-100 text-[11px] font-semibold">
                                    <Gauge size={14} />
                                    Remboursé / léger
                                </div>
                            </motion.div>

                            <motion.div
                                className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg"
                                animate={{ scale: isFuture ? 1.02 : 0.98, borderColor: 'rgba(248,113,113,0.45)', backgroundColor: isFuture ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)' }}
                            >
                                <div className="flex items-center gap-2 text-xs text-slate-300 mb-2 font-semibold">
                                    <AlertTriangle size={16} className="text-rose-300" />
                                    Coût si j'attends
                                </div>
                                <div className="text-3xl font-bold text-white">{formatEuro(scenario.futurePrice)}</div>
                                <div className={`mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold ${scenario.reimbursed ? 'bg-amber-300/15 text-amber-100' : 'bg-rose-400/15 text-rose-100'}`}>
                                    <TrendingUp size={14} />
                                    {scenario.reimbursed ? 'Remboursé partiellement' : 'Non remboursé'}
                                </div>
                            </motion.div>
                        </div>

                        <div className="relative mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                            <div>
                                <p className="text-[11px] text-slate-300 font-semibold">Surcoût</p>
                                <p className="text-lg font-bold text-rose-200">{formatEuro(delta)}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-300 font-semibold">Multiplicateur</p>
                                <p className="text-lg font-bold text-rose-200">x{ratio}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-300 font-semibold">Horizon</p>
                                <p className="text-lg font-bold text-amber-200">{scenario.timeframe}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning Footer */}
                <motion.div
                    className="flex items-start gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 px-4 py-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isFuture ? 1 : 0.8 }}
                >
                    <Skull className="text-rose-200 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-rose-50/90 leading-relaxed">
                        <span className="font-bold text-white">Attention :</span> les problèmes dentaires ne se résolvent jamais seuls. Plus on attend, plus la douleur, la chirurgie et le reste à charge explosent.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
