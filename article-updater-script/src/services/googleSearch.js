import axios from 'axios'
export const googleSearch = async (query) => {
    try {
        const url = 'https://www.googleapis.com/customsearch/v1';
        const params = {
            key: process.env.GOOGLE_API_KEY,
            cx: process.env.GOOGLE_CX,
            q: query,
            num: 4,
        }
        const { data } = await axios.get(url, { params });
        const results = data.items.filter((item)=>item.link && !item.link.includes("beyondchats.com")).slice(0,2).map(item => ({
            title: item.title,
            url: item.link,
            snippet: item.snippet
        }));

        console.log(`Found ${results.length} results for: ${query}`);
        return results;
    } catch (error) {
        console.error('Google search error:', error.message);
        return [];
    }
}