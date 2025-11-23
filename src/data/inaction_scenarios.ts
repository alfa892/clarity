import type { CCAMAct } from '../types';

export interface InactionStep {
    label: string;
    delay: string;
    cost: number;
    pain: 'faible' | 'modérée' | 'élevée';
    note: string;
}

export interface InactionScenario {
    key: string;
    title: string;
    summary: string;
    steps: InactionStep[];
    codePrefixes?: string[];
    categories?: CCAMAct['category'][];
}

const scenarios: InactionScenario[] = [
    {
        key: 'implant',
        title: 'Reporter un implant',
        summary: "Un implant repoussé finit souvent en extraction + greffe osseuse.",
        codePrefixes: ['HBLD', 'HBMD', 'HBFD'],
        categories: ['implantologie', 'chirurgie'],
        steps: [
            { label: 'Petite lésion', delay: 'Aujourd’hui', cost: 50, pain: 'faible', note: 'Surveillance + hygiène renforcée.' },
            { label: 'Infection locale', delay: '3-6 mois', cost: 180, pain: 'modérée', note: 'Antibiotiques + urgence.' },
            { label: 'Perte d’os', delay: '9-12 mois', cost: 850, pain: 'élevée', note: 'Dévitalisation + couronne provisoire.' },
            { label: 'Extraction + implant', delay: '18-24 mois', cost: 1900, pain: 'élevée', note: 'Implant + greffe osseuse + couronne.' },
        ],
    },
    {
        key: 'couronne',
        title: 'Retarder une couronne',
        summary: "Une dent fissurée non protégée finit souvent en dévitalisation.",
        codePrefixes: ['HBLA', 'HBJD', 'HBLF'],
        categories: ['prothese', 'esthetique'],
        steps: [
            { label: 'Fissure stable', delay: 'Aujourd’hui', cost: 80, pain: 'faible', note: 'Surveillance + contention possible.' },
            { label: 'Hypersensibilité', delay: '6 mois', cost: 220, pain: 'modérée', note: 'Pose provisoire + traitement anti-douleur.' },
            { label: 'Pulpite', delay: '9-12 mois', cost: 650, pain: 'élevée', note: 'Dévitalisation + inlay-core.' },
            { label: 'Fracture', delay: '18 mois', cost: 1200, pain: 'élevée', note: 'Extraction + implant ou bridge.' },
        ],
    },
    {
        key: 'carie',
        title: 'Ignorer une carie',
        summary: "Une carie simple devient une pulpite puis une infection.",
        categories: ['soin', 'prevention'],
        steps: [
            { label: 'Caries débutantes', delay: 'Aujourd’hui', cost: 60, pain: 'faible', note: 'Composites superficiels.' },
            { label: 'Carie profonde', delay: '6 mois', cost: 180, pain: 'modérée', note: 'Soins multiples, anesthésie.' },
            { label: 'Pulpite', delay: '9 mois', cost: 450, pain: 'élevée', note: 'Dévitalisation complète.' },
            { label: 'Infection', delay: '12-18 mois', cost: 900, pain: 'élevée', note: 'Reprise de racine ou extraction.' },
        ],
    },
];

const defaultScenario: InactionScenario = {
    key: 'default',
    title: 'Attendre fait gonfler la note',
    summary: "Même un acte simple devient plus lourd avec le temps.",
    steps: [
        { label: 'Situation stable', delay: 'Aujourd’hui', cost: 60, pain: 'faible', note: 'Contrôle + hygiène.' },
        { label: 'Aggravation', delay: '6 mois', cost: 220, pain: 'modérée', note: 'Soins + médication.' },
        { label: 'Complication', delay: '12 mois', cost: 800, pain: 'élevée', note: 'Chirurgie ou prothèse.' },
    ],
};

export const getScenarioForActs = (acts: CCAMAct[]): InactionScenario => {
    const mainAct = acts[0];
    if (!mainAct) return defaultScenario;

    const byCode = scenarios.find(scenario =>
        scenario.codePrefixes?.some(prefix => mainAct.code.startsWith(prefix))
    );
    if (byCode) return byCode;

    const byCategory = scenarios.find(scenario =>
        scenario.categories?.includes(mainAct.category)
    );
    if (byCategory) return byCategory;

    return defaultScenario;
};
