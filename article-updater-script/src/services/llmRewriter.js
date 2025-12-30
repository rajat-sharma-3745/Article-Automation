import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const rewriteArticle = async (originalArticle, referenceArticles) => {
    try {
        const prompt = `You are a content rewriter and SEO expert.
    
    ORIGINAL ARTICLE:
    Title: ${originalArticle.title}
    Content: ${originalArticle.content || originalArticle.description}
    
    REFERENCE ARTICLE 1 (Top ranking):
    Title: ${referenceArticles[0].title}
    Content: ${referenceArticles[0].content.substring(0, 3000)}
    
    REFERENCE ARTICLE 2 (Second ranking):
    Title: ${referenceArticles[1].title}
    Content: ${referenceArticles[1].content.substring(0, 3000)}
    
    TASK:
    Rewrite the original article by:
    1. Matching the tone, style, and formatting of the reference articles
    2. Using similar heading structure and paragraph length
    3. Making it more engaging and SEO-friendly
    4. Keeping the core message but improving clarity
    5. Using markdown format with proper headings (##, ###), bold (**text**), and lists
    
    Return ONLY the rewritten article content in markdown format. Do not include the title.`;
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1200,
            },
        });

        return response.text;
    } catch (error) {
        console.error('Gemini API error:', error.message);
        throw error;
    }
}