import axios from 'axios';
import notiflix from 'notiflix';
import { renderImages } from './gallery';

const API_KEY = '41213110-775d8605f206f9e1ea3c7d6a2';
const form = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return;
  }

  try {
    const imageData = await fetchImages(searchQuery, page);
    handleImageData(imageData);

    page = 1;
  } catch (error) {
    console.error('Error fetching images:', error);
    notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
});

loadMoreBtn.addEventListener('click', async function () {
  const searchQuery = form.elements.searchQuery.value.trim();
  page += 1;
  try {
    const imageData = await fetchImages(searchQuery, page);
    handleImageData(imageData);
    page++;
  } catch (error) {
    console.error('Error fetching more images:', error);
    notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
});

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

function handleImageData(data) {
  if (data.hits.length === 0) {
    notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  gallery.innerHTML = '';

  renderImages(data.hits);

  if (data.hits.length < 40) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}
