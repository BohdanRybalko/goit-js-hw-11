import notiflix from 'notiflix';
import { renderImages } from './gallery';
import { fetchImages } from './api';

const form = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
let page = 1;

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return;
  }
  page = 1;
  gallery.innerHTML = '';
  try {
    const imageData = await fetchImages(searchQuery, page);
    handleImageData(imageData);
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
  } catch (error) {
    console.error('Error fetching more images:', error);
    notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
});

function handleImageData(data) {
  if (data.hits.length === 0) {
    notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  renderImages(data.hits);

  if (data.hits.length < 40) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}
