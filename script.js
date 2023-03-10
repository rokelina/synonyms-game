const startBtn = document.querySelector('.start-app');
const wordItem = document.getElementById('word-item');
const promptWord = document.querySelector('h2');
const form = document.getElementById('word-form');
const formInput = document.getElementById('word-input');
const solutionContainer = document.getElementById('solution-container');
const submitedWord = document.querySelector('h3');
const solutionMessage = document.querySelector('.solution-message');
const solutionBtn = document.querySelector('.solution-button');
const solutionWrapper = document.getElementById('solution-box');
const solutionList = document.querySelector('.solution-list');
const restartBtn = document.getElementById('restart-button');

async function getData() {
  try {
    const res = await fetch('./dataset/thesaurus.json');
    if (!res.ok) {
      throw new Error('Something went wrong');
    }
    const data = await res.json();
    console.log(res);
    return data;
  } catch (error) {
    console.error('Something went wrong');
  }
}

function getRandomWord(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length + 1);
  const randomWord = arr[randomIndex].word;
  const allSynonyms = arr
    .filter((obj) => obj.word === randomWord)
    .map((obj) => obj.synonyms)
    .flat()
    .map((word) => word.toLowerCase());

  const synonymArray = [...new Set(allSynonyms)];
  const outputWord = {
    word: randomWord,
    synonyms: synonymArray,
  };

  return outputWord;
}

async function generatePrompt() {
  const wordsArray = await getData();
  const randomWordObject = getRandomWord(wordsArray);
  promptWord.textContent = randomWordObject.word;
  solutionList.textContent = randomWordObject.synonyms;
}

function onStart() {
  generatePrompt();
  show(wordItem);
  disable(startBtn);
  startBtn.style.opacity = '0';
  startBtn.style.cursor = 'auto';
}

function onSubmit(e) {
  e.preventDefault();
  const input = formInput.value;
  if (input.trim() === '') {
    alert('Type a synonym');
    return;
  }
  //compare the value of input with the text content of li
  const array = solutionList.textContent.split(',');
  if (array.includes(input.trim().toLowerCase())) {
    solutionMessage.textContent = '???? Correct!';
  } else {
    solutionMessage.textContent = "???? That doesn't seem to be a synonym";
  }

  submitedWord.textContent = input;
  formInput.value = '';
  show(solutionContainer);
  show(restartBtn);
  disable(formInput);
}

function onRestart() {
  enable(formInput);
  generatePrompt();
  hide(solutionContainer);
  hide(restartBtn);
  solutionBtn.textContent = 'Show solution';
  hide(solutionWrapper);
}

function toggleSolution() {
  if (solutionBtn.textContent === 'Show solution') {
    show(solutionWrapper);
    solutionList.textContent = solutionList.textContent.split(',').join(', ');
    solutionBtn.textContent = 'Hide solution';
  } else {
    hide(solutionWrapper);
    solutionBtn.textContent = 'Show solution';
  }
}

function show(item) {
  if (item.classList.contains('hidden')) {
    item.classList.remove('hidden');
  }
}

function hide(item) {
  if (!item.classList.contains('hidden')) {
    item.classList.add('hidden');
  }
}

function disable(item) {
  item.disabled = true;
}

function enable(item) {
  item.disabled = false;
}

function init() {
  startBtn.addEventListener('click', onStart);
  form.addEventListener('submit', onSubmit);
  solutionBtn.addEventListener('click', toggleSolution);
  restartBtn.addEventListener('click', onRestart);
}

init();
