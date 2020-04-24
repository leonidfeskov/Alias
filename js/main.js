const SYMBOLS_TRANSLIT = [
    'a', 'b', 'v', 'g', 'd', 'e', 'zh', 'z', 'i', 'ij', 'k', 'l', 'm', 'n', 'o',
    'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'shh', 'ee', 'ju', 'ja'
];
const SYMBOLS = [
    'а', 'б', 'в', 'г', 'д', 'е', 'ж',  'з', 'и', 'й',  'к', 'л', 'м', 'н', 'о',
    'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч',  'ш',  'щ',   'э',  'ю',  'я'
];
const TIMER = 60;
let timer = TIMER;
let summary = 0;

const body = document.querySelector('body');
const timerValueNode = document.querySelector('.js-timer-value');
const timerProgressNode = document.querySelector('.js-timer-progress');
const wordNode = document.querySelector('.js-word');
const buttonSuccessNode = document.querySelector('.js-button-success');
const buttonFailNode = document.querySelector('.js-button-fail');
const buttonReloadNode = document.querySelector('.js-button-reload');
const summaryNode = document.querySelector('.js-summary');
const selectSymbolNode = document.querySelector('.js-select-symbol');

const settingsSwitcherNode = document.querySelector('.js-settings-switcher');
const settingsModalNode = document.querySelector('.js-settings-modal');
const settingsButtonNode = document.querySelector('.js-settings-button');

function random(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomWord() {
    let symbol;
    const settingSymbol = localStorage.getItem('symbol');
    if (!settingSymbol || settingSymbol === 'ALL') {
        symbol = SYMBOLS_TRANSLIT[random(0, SYMBOLS_TRANSLIT.length - 1)];
    } else {
        symbol = settingSymbol;
    }
    const dictionary = window[`WORDS_${symbol.toUpperCase()}`];
    wordNode.innerText = dictionary[random(0, dictionary.length - 1)]
}

function updateSummary(status) {
    summaryNode.classList.add(`summary-${status}`)
    summaryNode.innerText = summary;
    setTimeout(() => {
        summaryNode.classList = 'summary';
    }, 500);
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function updateTimer(value) {
    const progress = value / 60;
    const dashoffset = CIRCUMFERENCE * (1 - progress);
    timerProgressNode.style.strokeDashoffset = dashoffset;
    timerProgressNode.style.strokeDasharray = CIRCUMFERENCE;
    timerProgressNode.style.stroke = `rgba(${parseInt(255 * (1 - progress))}, ${parseInt(255 * progress)}, 0)`;
    timerValueNode.innerText = timer;
}

buttonSuccessNode.addEventListener('click', () => {
    getRandomWord();
    summary++;
    updateSummary('inc');
});

buttonFailNode.addEventListener('click', () => {
    getRandomWord();
    summary--;
    updateSummary('dec');
});

buttonReloadNode.addEventListener('click', () => {
    window.location.reload();
});

settingsSwitcherNode.addEventListener('click', () => {
    settingsModalNode.classList.toggle('g-hidden');
});

settingsButtonNode.addEventListener('click', () => {
    settingsModalNode.classList.toggle('g-hidden');
});

SYMBOLS.forEach((symbol, index) => {
    const option = document.createElement('option');
    option.innerText = symbol;
    option.value = SYMBOLS_TRANSLIT[index];
    selectSymbolNode.appendChild(option);
});

if (localStorage.getItem('symbol')) {
    selectSymbolNode.value = localStorage.getItem('symbol');
}

selectSymbolNode.addEventListener('change', (event) => {
    localStorage.setItem('symbol', event.target.value);
});

getRandomWord();

const timerInterval = setInterval(() => {
    timer--;
    updateTimer(timer);
    if (timer <= 5) {
        body.classList = '';
        body.classList.add(`body-timer-${timer}`);
    }
    if (timer === 0) {
        clearInterval(timerInterval);
        buttonSuccessNode.style.display = 'none';
        buttonFailNode.style.display = 'none';
        buttonReloadNode.style.display = 'inline-block';
    }
}, 1000);
