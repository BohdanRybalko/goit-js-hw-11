import axios from 'axios';
import jquery from 'jquery';
import notiflix from 'notiflix';

const API_KEY = '41213110-775d8605f206f9e1ea3c7d6a2';
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return;
  }

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    });

    const { data } = response;

    if (data.hits.length === 0) {
      notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.innerHTML = '';

    renderImages(data.hits);

    loadMoreBtn.style.display = 'block';

    page = 1;
  } catch (error) {
    console.error('Error fetching images:', error);
    notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
});

loadMoreBtn.addEventListener('click', async function () {
  const searchQuery = form.elements.searchQuery.value.trim();

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page + 1,
        per_page: 40,
      },
    });

    const { data } = response;

    if (data.hits.length === 0) {
      notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.style.display = 'none';
      return;
    }
    renderImages(data.hits);

    page++;
  } catch (error) {
    console.error('Error fetching more images:', error);
    notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
});

function renderImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    card.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;

    gallery.appendChild(card);
  });
}
