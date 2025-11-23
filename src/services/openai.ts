import { ccamData } from '../data/ccam_codes';
import type { CCAMAct } from '../types';

export interface AnalyzedAct {
    code: string | null;
    description: string;
    price: number;
    type: string;
}

// Mock data for fallback/demo mode
const MOCK_ACTS: AnalyzedAct[] = [
    {
        code: 'HBLD038',
        description: 'Couronne céramique (Mock)',
        price: 550,
        type: 'Prothèse'
    },
    {
        code: 'HBQK002',
        description: 'Radiographie panoramique (Mock)',
        price: 21.28,
        type: 'Radio'
    }
];

export const analyzeQuoteImage = async (base64Image: string): Promise<AnalyzedAct[]> => {
    // 1. Check for Mock Mode
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';

    if (useMock) {
        console.log("🔒 Mock Mode Active: Returning fake data.");
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_ACTS), 1500);
        });
    }

    // 2. Call Backend API
    try {
        const response = await fetch('/api/analyze-quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur serveur');
        }

        const data = await response.json();
        return data.acts || [];

    } catch (error) {
        console.error("Erreur API:", error);
        throw error;
    }
};

// Helper to map analyzed acts to our internal CCAMAct type
export const mapAnalyzedToCCAM = (analyzedActs: AnalyzedAct[]): CCAMAct[] => {
    return analyzedActs.map(act => {
        // 1. Try to find exact code match
        const exactMatch = ccamData.find(c => c.code === act.code);
        if (exactMatch) return exactMatch;

        // 2. Try to find fuzzy description match (simple includes)
        const fuzzyMatch = ccamData.find(c =>
            c.label_patient.toLowerCase().includes(act.description.toLowerCase()) ||
            c.keywords.some(k => act.description.toLowerCase().includes(k))
        );

        if (fuzzyMatch) return fuzzyMatch;

        // 3. Fallback: Create a temporary "Unknown" act
        return {
            code: act.code || 'INCONNU',
            label_patient: act.description,
            label_technical: "Acte non reconnu dans la base locale",
            description: "Acte identifié par l'IA mais non présent dans la base locale.",
            price_avg_province: act.price, // Use the quoted price as reference
            base_remboursement: 0,
            reimbursable: false,
            keywords: [],
            category: act.type as any
        };
    });
};
