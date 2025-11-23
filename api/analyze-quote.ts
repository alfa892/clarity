import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'Image data is required' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Tu es un expert en tarification dentaire française. Analyse cette image de devis. 
          Extrais chaque acte médical identifié. 
          Pour chaque acte, retourne un objet JSON avec : 
          - code (ex: HBLD038, si visible, sinon null)
          - description (le libellé patient simplifié)
          - price (le montant total de l'acte, en nombre)
          - type (Soin, Prothèse, Implant, etc.)
          
          Retourne UNIQUEMENT un JSON valide sous la forme : { "acts": [...] }. Pas de markdown.`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyse ce devis dentaire." },
                        {
                            type: "image_url",
                            image_url: {
                                url: image,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("Empty response from AI");

        // Clean up markdown if present
        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonString);

        return res.status(200).json(parsed);

    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
