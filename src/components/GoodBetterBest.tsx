import React, { useMemo, useState } from 'react';
import { Crown, Diamond, HeartHandshake, Scale, Star } from 'lucide-react';
import type { CCAMAct } from '../types';

interface GoodBetterBestProps {
    acts: CCAMAct[];
    defaultChoice?: 'good' | 'better' | 'best';
}

interface Option {
    id: 'good' | 'better' | 'best';
    title: string;
    description: string;
    multiplier: number;
    badge?: string;
}

export const GoodBetterBest: React.FC<GoodBetterBestProps> = ({ acts, defaultChoice = 'better' }) => {
    const [selected, setSelected] = useState<Option['id']>(defaultChoice);
    const base = useMemo(() => {
        if (!acts.length) return 900;
        return acts.reduce((sum, act) => sum + (act.price_avg_province || act.base_remboursement || 250), 0);
    }, [acts]);

    const options: Option[] = [
        {
            id: 'good',
            title: 'Standard',
            description: 'Solution économique, matériaux basiques, confort correct.',
            multiplier: 0.8,
        },
        {
            id: 'better',
            title: 'Recommandée',
            description: 'Équilibre entre confort, esthétique et durabilité.',
            multiplier: 1,
            badge: 'Conseillée',
        },
        {
            id: 'best',
            title: 'Premium',
            description: 'Matériaux haut de gamme, esthétique renforcée et long terme.',
            multiplier: 1.35,
            badge: 'Longévité',
        },
    ];

    const iconFor = (id: Option['id']) => {
        if (id === 'best') return <Diamond size={18} />;
        if (id === 'better') return <HeartHandshake size={18} />;
        return <Scale size={18} />;
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Crown size={18} className="text-health-500" />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">Comparateur</p>
                        <p className="text-lg font-bold text-slate-900">Good / Better / Best</p>
                    </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Option choisie : {selected}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.map((option) => {
                    const price = Math.round(base * option.multiplier);
                    const monthly = Math.max(25, Math.ceil(price / 4));
                    const isSelected = selected === option.id;
                    return (
                        <button
                            type="button"
                            key={option.id}
                            onClick={() => setSelected(option.id)}
                            className={`text-left h-full rounded-2xl border p-4 transition-all ${isSelected ? 'border-slate-900 shadow-lg shadow-slate-900/10 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                    {iconFor(option.id)}
                                </div>
                                {option.badge && (
                                    <span className={`text-[11px] px-2 py-1 rounded-full font-bold uppercase tracking-wide ${isSelected ? 'bg-white/15 text-white' : 'bg-health-50 text-health-700'}`}>
                                        {option.badge}
                                    </span>
                                )}
                            </div>
                            <p className={`text-base font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>{option.title}</p>
                            <p className={`text-sm mb-3 ${isSelected ? 'text-white/80' : 'text-slate-600'}`}>{option.description}</p>
                            <div className={`text-2xl font-extrabold ${isSelected ? 'text-health-200' : 'text-slate-900'}`}>{price} €</div>
                            <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>ou {monthly} €/mois en 4x</p>
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center space-x-2 text-sm text-slate-600">
                <Star size={16} className="text-health-500" />
                <span>Choisissez l’option recommandée pour optimiser confort et longévité.</span>
            </div>
        </div>
    );
};
