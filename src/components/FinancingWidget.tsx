import React from 'react';
import { CreditCard, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { mutuelleOptions } from '../data/mutuelle_options';

interface FinancingWidgetProps {
    resteCharge: number;
}

export const FinancingWidget: React.FC<FinancingWidgetProps> = ({ resteCharge }) => {
    const monthly = Math.max(25, Math.ceil(resteCharge / 4));
    const betterMutuelle = mutuelleOptions.find(m => m.highlight) || mutuelleOptions[0];
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-5 space-y-4">
            <div className="flex items-center space-x-2">
                <CreditCard size={18} className="text-health-500" />
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">Financement</p>
                    <p className="text-lg font-bold text-slate-900">Payer en 4x ou optimiser</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <Wallet size={16} className="text-health-600" />
                            <span className="font-semibold text-slate-900">Paiement 4x</span>
                        </div>
                        <span className="text-xs text-health-700 font-bold bg-health-50 px-2 py-1 rounded-full">Instantané</span>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900">{monthly} €/mois</p>
                    <p className="text-xs text-slate-500">Aucun dossier papier, validation en ligne sécurisée.</p>
                    <button className="mt-3 w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Continuer</button>
                </div>

                <div className="border border-health-100 rounded-2xl p-4 bg-health-50/60">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <ShieldCheck size={16} className="text-health-700" />
                            <span className="font-semibold text-slate-900">Optimiser mutuelle</span>
                        </div>
                        <span className="text-xs text-health-700 font-bold bg-white px-2 py-1 rounded-full">+Remboursement</span>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">
                        {betterMutuelle.name}: {betterMutuelle.coverage} • {betterMutuelle.delay}
                    </p>
                    <p className="text-xs text-slate-500">Compatibilité : {betterMutuelle.compatibility} • {betterMutuelle.monthly} €/mois</p>
                    <button className="mt-3 w-full py-2.5 bg-health-600 text-white rounded-xl font-bold hover:bg-health-500 flex items-center justify-center space-x-2">
                        <Sparkles size={16} />
                        <span>Voir 3 mutuelles compatibles</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
