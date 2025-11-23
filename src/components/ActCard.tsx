import React from 'react';
import type { CCAMAct } from '../types';
import { Plus, Info } from 'lucide-react';

interface ActCardProps {
    act: CCAMAct;
    onAdd?: (act: CCAMAct) => void;
}

export const ActCard: React.FC<ActCardProps> = ({ act, onAdd }) => {
    const formatPrice = (price?: number) => {
        if (price === undefined) return 'Sur devis';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
    };

    return (
        <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-soft hover:border-medical-100 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                        {act.label_patient}
                    </h3>
                    <div className="flex items-center text-xs text-slate-400 font-mono">
                        <span className="bg-slate-50 px-2 py-0.5 rounded text-slate-500 mr-2">
                            {act.code}
                        </span>
                        <span className="uppercase tracking-wider text-[10px] font-semibold text-medical-600">
                            {act.category}
                        </span>
                    </div>
                </div>
                <div className="text-right pl-4">
                    <div className="text-lg font-bold text-medical-600">
                        {act.reimbursable ? formatPrice(act.base_remboursement) : 'Non remb.'}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Base Sécu</div>
                </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-4 border-l-2 border-medical-100 pl-3">
                {act.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center text-xs text-slate-400">
                    <Info size={14} className="mr-1.5 text-medical-400" />
                    <span className="truncate max-w-[200px] sm:max-w-xs" title={act.label_technical}>
                        {act.label_technical}
                    </span>
                </div>

                {onAdd && (
                    <button
                        onClick={() => onAdd(act)}
                        className="flex items-center justify-center px-4 py-2 bg-medical-50 text-medical-600 rounded-xl hover:bg-medical-500 hover:text-white transition-all duration-200 font-semibold text-sm group-hover:shadow-glow"
                    >
                        <Plus size={16} className="mr-1.5" />
                        Ajouter
                    </button>
                )}
            </div>
        </div>
    );
};
