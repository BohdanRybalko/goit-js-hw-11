import notiflix from 'notiflix';
import { renderImages } from './gallery';
import { fetchImages } from './api';

const form = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.getElementById('gallery');
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
