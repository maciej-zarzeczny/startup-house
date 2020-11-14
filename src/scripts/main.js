import { fetchNews } from './api.js';

// Load recent news
const newsList = document.querySelector('.newsList');
const pagesSelect = document.querySelector('#activePageSelect');
const newsTitle = document.querySelector('#newsTitle');

function loadNews(pageNumber, section, query) {
    newsList.innerHTML = '';
    newsTitle.innerHTML = 'Loading...';

    fetchNews(pageNumber, section, query)
        .then((res) => {
            // Render news
            res.data.results.map((news) => {
                const liElement = document.createElement('li');

                liElement.innerHTML = `                  
                      <article class="news">
                        <header>
                          <h3>${news.webTitle}</h3>
                        </header>
                        <section class="newsDetails">
                          <ul>
                            <li><strong>Section Name:</strong> ${news.sectionName}</li>
                            <li><strong>Publication Date:</strong> ${news.webPublicationDate}</li>
                          </ul>
                        </section>
                        <section class="newsActions">
                          <a target="_blank" rel="noopener noreferrer" href="${news.webUrl}" class="button">Full article</a>
                          <button onclick="" class="button button-outline">Read Later</button>
                        </section>
                      </article>                  
                `;

                liElement.querySelector('.newsActions > button').addEventListener('click', () => addToReadLater(news));
                newsList.appendChild(liElement);
            });

            // Render pages
            if (pagesSelect.childElementCount !== res.data.pages) {
                pagesSelect.innerHTML = '';
                for (let i = 1; i <= res.data.pages; i++) {
                    const optionElement = document.createElement('option');
                    optionElement.value = i;
                    optionElement.innerHTML = i.toString();

                    pagesSelect.appendChild(optionElement);
                }
            }

            // Set news title
            newsTitle.innerHTML = 'News List';
        })
        .catch((err) => {
            newsTitle.innerHTML = `Error (${err}), please try again`;
        });
}

// Read later list
let readLaterNews = JSON.parse(localStorage.getItem('readLaterNews'));
const readLaterList = document.querySelector('.readLaterList');

function setReadLaterNews() {
    readLaterList.innerHTML = '';

    readLaterNews.map((news) => {
        const liElement = document.createElement('li');
        liElement.innerHTML = `
        <h4 class="readLaterItem-title">${news.webTitle}</h4>
        <section>
          <a target="_blank" rel="noopener noreferrer" href="${news.webUrl}" class="button button-clear">Read</a>
          <button class="button button-clear">Remove</button>
        </section>
  `;

        liElement.querySelector('section > button').addEventListener('click', () => removeFromReadLater(news.id));
        readLaterList.appendChild(liElement);
    });
}

function addToReadLater(news) {
    readLaterNews.push(news);
    localStorage.setItem('readLaterNews', JSON.stringify(readLaterNews));
    setReadLaterNews();
}

function removeFromReadLater(newsId) {
    readLaterNews = readLaterNews.filter((news) => news.id !== newsId);
    localStorage.setItem('readLaterNews', JSON.stringify(readLaterNews));
    setReadLaterNews();
}

// Filtering
const queryInput = document.querySelector('#newsContentSearch');
const sectionSelect = document.querySelector('#sectionSelect');
const pageSelect = document.querySelector('#activePageSelect');

let query = '';
let section = '';
let debounceTimeout;
let lastQueryInput;

// Fetch news after query input changes
queryInput.addEventListener('keyup', (e) => {
    const { value } = e.target;
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }

    if (lastQueryInput !== value) {
        // Debounce query inputs not to call API on every key stroke
        debounceTimeout = setTimeout(() => {
            query = value;
            loadNews(1, section, query);
        }, 200);
    }

    lastQueryInput = value;
});

// Fetch news according to selected section
sectionSelect.addEventListener('change', (e) => {
    const { value } = e.target;

    if (value !== 'all') {
        section = value.toLowerCase();
    } else {
        section = '';
    }

    loadNews(1, section, query);
});

// Pagination
pageSelect.addEventListener('change', (e) => {
    const { value } = e.target;
    loadNews(value, section, query);
});

window.onload = () => {
    loadNews();
    setReadLaterNews();
};
