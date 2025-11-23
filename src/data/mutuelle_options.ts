export interface MutuelleOption {
    id: string;
    name: string;
    coverage: string;
    delay: string;
    compatibility: string;
    monthly: number;
    highlight?: boolean;
}

export const mutuelleOptions: MutuelleOption[] = [
    {
        id: 'm1',
        name: 'SantéPlus Optimum',
        coverage: '200% BR + forfait implant 500€',
        delay: 'Sans carence',
        compatibility: 'Implants / Couronne',
        monthly: 32,
        highlight: true,
    },
    {
        id: 'm2',
        name: 'NeoMutuelle Confort',
        coverage: '180% BR + prothèse 350€',
        delay: 'Carence 3 mois',
        compatibility: 'Couronne / Inlay-Core',
        monthly: 27,
    },
    {
        id: 'm3',
        name: 'Direct Santé Flex',
        coverage: '150% BR + plafond dentaire 900€',
        delay: 'Sans carence',
        compatibility: 'Soins / orthodontie légère',
        monthly: 24,
    },
];
