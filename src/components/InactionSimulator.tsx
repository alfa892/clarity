import React, { useMemo, useState } from 'react';
import { AlertTriangle, Clock, Flame, Sparkles, TrendingUp } from 'lucide-react';
import type { CCAMAct } from '../types';
import { getScenarioForActs } from '../data/inaction_scenarios';

interface InactionSimulatorProps {
    acts: CCAMAct[];
    compact?: boolean;
}

export const InactionSimulator: React.FC<InactionSimulatorProps> = ({ acts, compact = false }) => {
    const scenario = useMemo(() => getScenarioForActs(acts), [acts]);
    const [index, setIndex] = useState(0);
    const step = scenario.steps[index];
    const baseCost = scenario.steps[0]?.cost || 0;
    const maxCost = Math.max(...scenario.steps.map(s => s.cost));
    const deltaCost = Math.max(0, step.cost - baseCost);

    const painTone = step.pain === 'faible' ? 'text-green-700 bg-green-50' : step.pain === 'modérée' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50';
    const painBullet = step.pain === 'faible' ? 'bg-green-500' : step.pain === 'modérée' ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className={`rounded-3xl border ${compact ? 'bg-white border-slate-100' : 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-800'} shadow-soft`}>
            <div className={`flex items-center justify-between px-5 py-4 ${compact ? '' : 'bg-white/5 rounded-t-3xl border-b border-white/10'}`}>
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${compact ? 'bg-health-50 text-health-600' : 'bg-white/10 text-white'}`}>
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className={`text-xs uppercase font-bold tracking-wide ${compact ? 'text-slate-500' : 'text-white/60'}`}>Simulateur d’inaction</p>
                        <p className={`text-base font-bold ${compact ? 'text-slate-900' : 'text-white'}`}>{scenario.title}</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${compact ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-white'}`}>
                    {deltaCost.toFixed(0)} € perdus
                </div>
            </div>

            <div className={`${compact ? 'p-5' : 'p-6'} space-y-4`}>
                <p className={`${compact ? 'text-slate-600' : 'text-white/70'} text-sm leading-relaxed`}>
                    {scenario.summary}
                </p>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        {scenario.steps.map((item) => (
                            <div key={item.delay} className="flex flex-col items-center flex-1">
                                <span className={`${compact ? 'text-slate-500' : 'text-white/60'} font-medium`}>{item.delay}</span>
                                <span className={`${compact ? 'text-slate-900' : 'text-white'} font-semibold mt-0.5`}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.cost)}</span>
                            </div>
                        ))}
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={scenario.steps.length - 1}
                        step={1}
                        value={index}
                        onChange={(e) => setIndex(parseInt(e.target.value, 10))}
                        className="w-full accent-health-500 cursor-pointer"
                    />
                </div>

                <div className={`rounded-2xl p-4 border ${compact ? 'border-slate-100 bg-white' : 'border-white/10 bg-white/5'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <Clock size={16} className={compact ? 'text-slate-400' : 'text-white/60'} />
                            <span className={`text-xs uppercase font-bold tracking-wide ${compact ? 'text-slate-500' : 'text-white/60'}`}>{step.delay}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-1 ${compact ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-white'}`}>
                            <TrendingUp size={14} />
                            <span>{((step.cost / Math.max(1, baseCost)) - 1).toFixed(1)}x</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className={`text-sm font-bold ${compact ? 'text-slate-900' : 'text-white'}`}>{step.label}</p>
                            <p className={`${compact ? 'text-slate-600' : 'text-white/70'} text-sm`}>{step.note}</p>
                        </div>
                        <div className={`px-3 py-2 rounded-xl text-right ${compact ? 'bg-slate-50 text-slate-900 border border-slate-100' : 'bg-white/10 text-white border border-white/10'}`}>
                            <div className="text-[11px] uppercase tracking-wide font-semibold opacity-60">Coût futur</div>
                            <div className="text-lg font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(step.cost)}</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 mt-3">
                        <div className={`w-2 h-2 rounded-full ${painBullet}`} />
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${painTone}`}>
                            Douleur {step.pain}
                        </div>
                        <div className={`flex items-center space-x-1 ${compact ? 'text-slate-500' : 'text-white/60'} text-xs`}>
                            <Flame size={14} />
                            <span>Aggravation progressive</span>
                        </div>
                    </div>
                </div>

                {!compact && (
                    <div className="flex items-center justify-between text-sm text-white/80 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                        <div className="flex items-center space-x-2">
                            <Sparkles size={16} className="text-health-300" />
                            <span>Décider aujourd’hui évite +{(maxCost - baseCost).toFixed(0)} € et 2 rendez-vous lourds.</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-xs uppercase font-semibold">Plan recommandé</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
