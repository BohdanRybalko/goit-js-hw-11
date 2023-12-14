import axios from 'axios';

const API_KEY = '41213110-775d8605f206f9e1ea3c7d6a2';

async function fetchImages(searchQuery, pageNum) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageNum,
        per_page: 40,
      },
    });

    const { data } = response;
    return data;
  } catch (error) {
    throw error;
  }
}

export { fetchImages };
