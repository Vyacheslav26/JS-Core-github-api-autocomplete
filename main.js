const searchInput = document.getElementById('search');
const autocomplete = document.getElementById('autocomplete');
const result = document.querySelector('.result');
const nameEl = result.querySelector('.name');
const ownerEl = result.querySelector('.owner');
const starsEl = result.querySelector('.stars');
const removeBtn = result.querySelector('.remove-btn');
const repositoriesList = document.getElementById('repositories-list');

let repositories = [];

function fetchRepositories(query) {
  return fetch(`https://api.github.com/search/repositories?q=${query}`)
    .then(response => response.json())
    .then(data => data.items.slice(0, 5));
}

function renderAutocomplete(repos) {
  autocomplete.innerHTML = '';
  repos.forEach(repo => {
    const repoEl = document.createElement('div');
    repoEl.textContent = repo.name;
    repoEl.addEventListener('click', () => {
      addRepository(repo);
      searchInput.value = '';
      autocomplete.innerHTML = '';
    });
    autocomplete.appendChild(repoEl);
  });
}

function addRepository(repo) {
  repositories.push(repo);
  const repoEl = document.createElement('li');
  repoEl.innerHTML = `
    <div class="repo-info">
      <ul>
        <li class="name">Name: ${repo.name}</li>
        <li class="owner">Owner: ${repo.owner.login}</li>
        <li class="stars">Stars: ${repo.stargazers_count}</li>
      </ul>
      <img src="img/images.png" width="30" height="30" class="remove-btn">
    </div>
  `;
  repoEl.querySelector('.remove-btn').addEventListener('click', () => {
    removeRepository(repo);
    repoEl.remove();
  });
  repositoriesList.appendChild(repoEl);
}

function removeRepository(repo) {
  repositories = repositories.filter(r => r.id !== repo.id);
}

function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, 600);
  };
}

const debouncedFetchRepositories = debounce(async (query) => {
  if (query) {
    const repos = await fetchRepositories(query);
    renderAutocomplete(repos);
  } else {
    autocomplete.innerHTML = '';
  }
}, 600);

searchInput.addEventListener('input', (event) => {
  debouncedFetchRepositories(event.target.value.trim());
});

document.addEventListener('click', (event) => {
  if (!autocomplete.contains(event.target)) {
    autocomplete.innerHTML = '';
  }
});
