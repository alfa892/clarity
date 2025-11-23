import React from 'react';
import type { CCAMAct } from '../types';
import { Receipt, Trash2, ArrowRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface QuoteBuilderProps {
    selectedActs: CCAMAct[];
    onRemoveAct: (index: number) => void;
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({ selectedActs, onRemoveAct }) => {
    const totalBase = selectedActs.reduce((sum, act) => sum + (act.base_remboursement || 0), 0);

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(0, 102, 255); // Medical Blue
        doc.text("Devis Dentaire Explicatif", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);

        // Table
        const tableData = selectedActs.map(act => [
            act.code,
            act.label_patient,
            act.reimbursable ? `${act.base_remboursement?.toFixed(2)} €` : 'Non remb.'
        ]);

        autoTable(doc, {
            startY: 40,
            head: [['Code', 'Acte', 'Base Sécu']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [0, 102, 255] },
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 30, halign: 'right' }
            }
        });

        // Total
        const finalY = (doc as any).lastAutoTable.finalY || 40;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Base Sécurité Sociale : ${totalBase.toFixed(2)} €`, 14, finalY + 15);

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Ce document est une estimation à titre informatif.", 14, finalY + 25);

        doc.save('mon-devis-dentaire.pdf');
    };

    if (selectedActs.length === 0) {
        return (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 text-center sticky top-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Votre Devis est vide</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Ajoutez des actes depuis la recherche pour simuler votre remboursement.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-soft border border-medical-100/50 p-6 sticky top-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-medical-400 to-medical-600" />

            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Receipt className="mr-3 text-medical-600" size={24} />
                Votre Devis Simulé
            </h3>

            <div className="space-y-3 mb-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedActs.map((act, index) => (
                    <div key={`${act.code}-${index}`} className="group flex justify-between items-start p-3 bg-slate-50/80 hover:bg-white rounded-xl border border-transparent hover:border-medical-100 transition-all duration-200">
                        <div className="flex-1 min-w-0 mr-3">
                            <div className="font-semibold text-slate-800 text-sm truncate">{act.label_patient}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{act.code}</div>
                        </div>
                        <button
                            onClick={() => onRemoveAct(index)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                            aria-label="Retirer"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-100 pt-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-500">Total Base Sécu</span>
                    <span className="text-2xl font-bold text-medical-600">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalBase)}
                    </span>
                </div>

                <div className="mt-6 p-4 bg-medical-50/50 rounded-xl border border-medical-100 text-xs text-medical-800 leading-relaxed">
                    <strong>Note importante :</strong> Ce montant correspond à la base de remboursement de la Sécurité Sociale. Le reste à charge dépendra de votre mutuelle et des honoraires de votre praticien.
                </div>

                <button
                    onClick={exportToPDF}
                    className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg shadow-slate-900/10"
                >
                    Exporter en PDF <ArrowRight size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );
};
