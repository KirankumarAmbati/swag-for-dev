const DATA_URL = 'https://peaceful-chandrasekhar-efde8e.netlify.com/assets/json/data.json';

/**
 * Initialising global variables
 */
let swagCache,
    contentEl    = document.querySelector('#content'),
    filterInput  = document.querySelector('#filter'),
    sortingInput = document.querySelector('#sorting');

/**
 * Fetches the JSON swag list. Once it has got the data, it will call the given callback function
 * with one argument: a list of objects.
 */
const fetchSwag = callback => {
    let req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const responseText = req.responseText;
            const swag = JSON.parse(responseText);
            callback(swag);
        }
    };

    req.open('GET', DATA_URL, true);
    req.send();
};

const renderSwag = swag => {
    contentEl.innerHTML = '';
    
    swagCache = swag;
    
    const filter = getFilter();
    const sorting = getSorting();

    swag
        .filter(v => {
            if (filter === 'All difficulties') {
                return true;
            }

            return v.difficulty === filter.toLowerCase();
        })
        .sort((a, b) => {
            switch (sorting) {
                case 'Alphabetical':            return a.name > b.name;
                case 'Alphabetical, reversed':  return a.name < b.name;
                case 'Difficulty':              return difficultyIndex(a.difficulty) > difficultyIndex(b.difficulty);
                case 'Difficulty, reversed':    return difficultyIndex(a.difficulty) < difficultyIndex(b.difficulty);
            }
        })
        .map(item => {
            contentEl.innerHTML += `
                <div class='item'>
                    <div class='title flex'>
                        <h1>${item.name}</h1>
                        <div class='difficulty ${item.difficulty}'></div>
                    </div>
                    <p class='swag'>Stickers</p>
                    <img src='${item.image}'></img>
                    <p class='desciption'>${item.description}</p>
                    <a href='${item.reference}'>Check it out</a>
                </div>
            `;
        });
};

const difficultyIndex = diff => ['easy', 'medium', 'hard'].indexOf(diff);

const getFilter = () => filterInput.value;
const getSorting = () => sortingInput.value;

const attemptRender = () => swagCache === undefined ? fetchSwag(renderSwag) : renderSwag(swagCache);

window.addEventListener('load', () => {
    attemptRender();
    
    filterInput.addEventListener('input', attemptRender);
    sortingInput.addEventListener('input', attemptRender);
});