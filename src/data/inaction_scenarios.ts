import type { CCAMAct } from '../types';

export interface InactionScenario {
    futureCondition: string;
    futureTreatment: string;
    futurePrice: number;
    reimbursed: boolean;
    painLevel: number; // 1-10
    complexity: number; // 1-10
    description: string;
    timeframe: string; // "1 an" | "2 ans"
}

const buildPrice = (base: number, factor: number, currentPrice?: number) => {
    if (currentPrice && currentPrice > 0) {
        return Math.max(base, Math.round(currentPrice * factor));
    }
    return base;
};

export const getInactionScenario = (act: CCAMAct, currentPrice?: number): InactionScenario => {
    // Logic based on act category or keywords
    const lowerLabel = act.label_patient.toLowerCase();
    const lowerTech = act.label_technical.toLowerCase();

    // 1. Scenario: Soin Carieux (Conservative) -> Dévitalisation + Couronne
    if (
        lowerLabel.includes('carie') ||
        lowerLabel.includes('obturation') ||
        lowerLabel.includes('composite') ||
        lowerTech.includes('restauration')
    ) {
        return {
            futureCondition: "Nécrose de la dent",
            futureTreatment: "Dévitalisation + Couronne + Inlay-Core",
            futurePrice: buildPrice(950, 2.5, currentPrice), // Approx: 600 (Couronne) + 300 (IC + Endo)
            reimbursed: true, // Partially, but high reste à charge usually
            painLevel: 8,
            complexity: 6,
            description: "La carie va atteindre le nerf. La douleur sera intense (rage de dent) et la dent deviendra cassante, nécessitant une couronne.",
            timeframe: "6 mois - 1 an"
        };
    }

    // 2. Scenario: Extraction -> Perte Osseuse + Implant
    if (
        lowerLabel.includes('extraction') ||
        lowerLabel.includes('avulsion')
    ) {
        return {
            futureCondition: "Perte osseuse & Déplacement des dents",
            futureTreatment: "Greffe osseuse + Implant + Couronne",
            futurePrice: buildPrice(2200, 3, currentPrice), // Approx: 1000 (Implant) + 600 (Couronne) + 600 (Greffe)
            reimbursed: false, // Implants generally not reimbursed
            painLevel: 4, // Less pain, more functional issue
            complexity: 9,
            description: "Sans racine, l'os se résorbe. Les dents voisines se couchent. Pour remplacer la dent plus tard, il faudra une chirurgie lourde (greffe).",
            timeframe: "1 an - 2 ans"
        };
    }

    // 3. Scenario: Détartrage/Gencive -> Parodontite
    if (
        lowerLabel.includes('détartrage') ||
        lowerLabel.includes('gencive') ||
        lowerLabel.includes('surfaçage')
    ) {
        return {
            futureCondition: "Parodontite (Déchaussement)",
            futureTreatment: "Surfaçage complet + Chirurgie parodontale",
            futurePrice: buildPrice(1200, 2.2, currentPrice), // Non reimbursed perio treatments
            reimbursed: false,
            painLevel: 5,
            complexity: 7,
            description: "L'inflammation va détruire l'os de soutien. Les dents vont bouger et finiront par tomber spontanément.",
            timeframe: "2 ans - 5 ans"
        };
    }

    // 4. Scenario: Couronne/Prothèse -> Perte de la dent
    if (
        lowerLabel.includes('couronne') ||
        lowerLabel.includes('bridge')
    ) {
        return {
            futureCondition: "Fracture de la racine",
            futureTreatment: "Extraction + Implant",
            futurePrice: buildPrice(1800, 2.4, currentPrice),
            reimbursed: false,
            painLevel: 6,
            complexity: 8,
            description: "La dent fragilisée risque de se fendre verticalement. Elle sera alors impossible à sauver et devra être extraite.",
            timeframe: "1 an - 3 ans"
        };
    }

    // 5. Fallback: aggravation silencieuse mais chère
    return {
        futureCondition: "Aggravation et perte de matière",
        futureTreatment: "Traitement complet + Couronne ou Implant",
        futurePrice: buildPrice(1500, 3, currentPrice),
        reimbursed: false,
        painLevel: 6,
        complexity: 7,
        description: "Sans intervention, la situation dégénère : plus d'inflammation, d'os perdu, et un traitement prothétique ou implantaire devient inévitable.",
        timeframe: "1 an - 2 ans"
    };
};
