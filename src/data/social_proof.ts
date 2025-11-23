import type { CCAMAct } from '../types';

export interface Review {
    id: string;
    name: string;
    city: string;
    snippet: string;
    tags: string[];
    rating: number;
}

const reviews: Review[] = [
    {
        id: 'r1',
        name: 'Michel L.',
        city: 'Lyon',
        snippet: 'Implant parfaitement indolore, suivi clair. Je n’ai rien senti.',
        tags: ['implant', 'chirurgie'],
        rating: 5,
    },
    {
        id: 'r2',
        name: 'Sarah P.',
        city: 'Bordeaux',
        snippet: 'Couronne céramique esthétique, résultat très naturel.',
        tags: ['couronne', 'prothese', 'esthetique'],
        rating: 5,
    },
    {
        id: 'r3',
        name: 'Nadia K.',
        city: 'Paris',
        snippet: 'Traitement carie rapide, explications simples, aucun stress.',
        tags: ['carie', 'soin', 'prevention'],
        rating: 4,
    },
    {
        id: 'r4',
        name: 'Julien D.',
        city: 'Marseille',
        snippet: 'Greffe osseuse + implant : prise en charge complète, rendez-vous bien coordonnés.',
        tags: ['implant', 'greffe', 'chirurgie'],
        rating: 5,
    },
    {
        id: 'r5',
        name: 'Elodie V.',
        city: 'Nantes',
        snippet: 'Facette et alignement : sourire impeccable et process fluide.',
        tags: ['esthetique', 'orthodontie'],
        rating: 5,
    },
];

export const getReviewsForActs = (acts: CCAMAct[]): Review[] => {
    if (!acts.length) return reviews.slice(0, 3);
    const tags = new Set<string>();
    acts.forEach(act => {
        tags.add(act.category);
        if (act.code.toLowerCase().includes('hbl')) tags.add('implant');
        if (act.code.toLowerCase().includes('hbj')) tags.add('couronne');
        if (act.code.toLowerCase().includes('hbd')) tags.add('carie');
    });
    const scored = reviews
        .map(review => {
            const score = review.tags.some(tag => tags.has(tag)) ? 1 : 0;
            return { review, score };
        })
        .sort((a, b) => b.score - a.score || b.review.rating - a.review.rating);
    return scored.slice(0, 3).map(s => s.review);
};
