import axios from 'axios'

const API_BASE_URL = process.env.API_BASE_URL;
export async function updateArticle(articleId, rewrittenContent, references) {
  try {
    const updateData = {
      updatedContent: rewrittenContent,
      status: 'updated',
      references: references.map(ref => ({
        title: ref.title,
        url: ref.url
      }))
    };
    
    const response = await axios.patch(
      `${API_BASE_URL}/articles/${articleId}`,
      updateData
    );
    
    console.log(`Article ${articleId} updated successfully`);
    return response.data;
  } catch (error) {
    console.error('Error updating article:', error.message);
    throw error;
  }
}