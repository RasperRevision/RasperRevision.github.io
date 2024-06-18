const themesElement = document.getElementById("themes");
const quoteElement = document.getElementById("quote");
const inputElement = document.getElementById("input");
const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");
const resultElement = document.getElementById("result");
const score = document.querySelector('.score');
const stopwatch = document.querySelector('.stopwatch');

let shuffledQuotes;
let score_value, length;
let s = 0, m = 0;

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]o]()-=+.$@#%^&*/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', `${jsonFileName}.json`, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
  };
  xobj.send(null);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayQuote() {
  const quoteObj = shuffledQuotes[score_value];
  const themesTitleCase = quoteObj.themes.map(theme => toTitleCase(theme));
  themesElement.textContent = `${themesTitleCase.join(", ")}`;
  quoteElement.textContent = maskQuote(quoteObj.quote);
}

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function maskQuote(quote) {
  return quote.replace(/\b\w+(?:[']\w+)?|[^\s]/g, match => {
    if (match.trim() === "") return match;
    if (/[^a-zA-Z]/.test(match)) return match;
    if (Math.random() < 0.4) return "_".repeat(match.length);
    else return match;
  });
}

function removePunctuation(text) {
  return text.replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "").replace(/\s{2,}/g, " ");
}

function checkInput() {
  const userGuess = removePunctuation(inputElement.value.trim());
  const actualQuote = shuffledQuotes[score_value].quote;
  let correct = userGuess.toLowerCase() === removePunctuation(actualQuote.toLowerCase());
  resultElement.textContent = correct ? "Correct!" : "Incorrect. The correct quote is: " + actualQuote;
  resultElement.classList.add(correct ? 'alert-success' : 'alert-danger');
  if (correct) {
    submitButton.classList.add('invis');
    nextButton.classList.remove('invis');
  } else {
    setTimeout(function () {
      resultElement.textContent = "";
      inputElement.value = "";
    }, 2000)
  }
}

function nextQuote() {
  score_value++;
  updateScore();
  if (score_value == length) {
    clearInterval(timer);

    const home = document.createElement('button');
    home.textContent = 'Home';
    home.classList.add('btn', 'btn-primary', 'ms-4');
    home.addEventListener('click', function () { location.href = '/'; });

    const restart = document.createElement('button');
    restart.textContent = 'Restart';
    restart.classList.add('btn', 'btn-warning');
    restart.addEventListener('click', function () { location.reload(); });

    document.querySelector('.container').innerHTML = `Complete <div style="font-size:100px;color:black;"> ${pad(m)}:${pad(s)}</div>`;
    document.querySelector('.container').classList.add('text-black', 'text-center')
    document.querySelector('.container').appendChild(home)
    document.querySelector('.container').appendChild(restart);
  } else {
    inputElement.value = "";
    resultElement.textContent = "";
    submitButton.classList.remove('invis');
    nextButton.classList.add('invis');
    displayQuote();
  }
}

function startStopwatch() {
  timer = setInterval(function () {
    s++;
    if (s === 60) {
      s = 0;
      m++;
    }

    formattedTime = pad(m) + ':' + pad(s);
    stopwatch.textContent = formattedTime;
  }, 1000);
}

function pad(value) { return value < 10 ? '0' + value : value; }

submitButton.addEventListener("click", function () { checkInput(); });
nextButton.addEventListener("click", function () { nextQuote(); });

inputElement.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (nextButton.classList.contains('invis')) { checkInput(); }
    else { nextQuote(); }
  }
});

function getSubjectJSON() {
  getJSON().then((data) => {
    var dropdownHTML = '<div class="accordion mt-3" id="subjectAccordion">';
    data.forEach((item) => {
      const subject = item.displayName.replace(/\s/g, "");
      var topics = "";
      item.topics.forEach((topic) => {
        var binary_games = topic.games.toString(2);
        while (binary_games.length < 4) {
          binary_games = "0" + binary_games;
        }
        if (binary_games[2] == "1") {
          topics += `<a href="?json=${topic.jsonFile}" class="subject_link link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">${topic.displayName}</a>`;
        }
      });
      if (topics != "") {
        dropdownHTML += `<div class="accordion-item" style="background: none !important; border: none;"><h2 class="accordion-header" id="${subject}"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"data-bs-target="#collapse{subject}" aria-expanded="false" aria-controls="collapse${subject}">${item.displayName}</button></h2><div id="collapse${subject}" class="accordion-collapse collapse" aria-labelledby="${subject}"data-bs-parent="#subjectAccordion"><div class="accordion-body"><ul class="list-group" id="${subject}ListGroup">${topics}</ul></div></div></div>`;
      }
    });
    dropdownHTML += '</div>';
    return dropdownHTML;
  });
}

async function getJSON() {
  return await ((await fetch('/subjects.json')).json());
}

function updateScore() { score.textContent = `${score_value}/${length}`; }

function blank(topic, subject) {
  let rangeInput, rangeLabel, modal;
  if (topic != null && subject != null) {
    const modalContainer = document.createElement('div');
    const modalHtml = '<div class="modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title text-black">Fill in the blank</h5></div><div class="modal-body"><p class="text-black mb-1">Subject: <span id="subject" class=text-black></span><br>Topic: <span id="topic" class=text-black></span><br><br>Game type:</p><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked><label class="form-check-label text-black" for="flexRadioDefault1" id="complete"></label></div><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"><label class="form-check-label text-black" for="flexRadioDefault2">Number of questions to finish: <label class="form-label text-black" for="customRange1" id="rangeLabel">1</label><div data-mdb-range-init class="range d-inline w-auto"><input type="range" class="form-range" id="customRange1" min="1" max="100" value="1" /></div></label></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="location.href=\'/fill-in-the-blank\'">Cancel</button><button type="button" class="btn btn-primary begin-game">Begin game</button></div></div></div></div>';

    modalContainer.innerHTML = modalHtml;

    document.body.appendChild(modalContainer);

    modalContainer.querySelector('#subject').textContent = subject;
    modalContainer.querySelector('#topic').textContent = topic;

    rangeInput = document.getElementById('customRange1');
    rangeLabel = document.getElementById('rangeLabel');

    modal = new bootstrap.Modal(modalContainer.querySelector('.modal'));
    modal.show();

    rangeInput.addEventListener('input', () => {
      rangeLabel.textContent = rangeInput.value;
    });
  }

  loadJSON(async function (response) {
    shuffledQuotes = shuffle(response);
    length = shuffledQuotes.length;

    score_value = 0;
    updateScore();
    rangeInput.max = length - 1;

    document.getElementById("complete").textContent = `Complete (${length} questions)`;

    await new Promise((resolve) => {
      document.querySelector('.begin-game').addEventListener('click', resolve);
    });

    modal.hide();

    if (document.querySelectorAll(".form-check-input")[1].checked) {
      length = rangeInput.value;
      updateScore();
    }

    startStopwatch();
    displayQuote();
  });
}

document.querySelector(".mobile_nav").style.minHeight = "45px";
document.querySelector(".mobile_nav_btn").addEventListener('click', function () {
  document.querySelector('.bi-caret-down-fill').classList.toggle('rotated');
  if (document.querySelector(".mobile_nav").style.minHeight != '45px') {
    document.querySelector(".mobile_nav").style.minHeight = '45px';
    document.querySelector(".accordion_content").innerHTML = '';
  } else {
    document.querySelector(".mobile_nav").style.minHeight = 'calc(100vh - 121px)';
    getSubjectJSON().then((s) => {
      document.querySelector(".accordion_content").innerHTML = s;
    });
  }
});

const jsonFileName = getParameterByName('json');
if (jsonFileName != null) {
  let current_subject, current_topic;
  getJSON().then((data) => {
    data.forEach((item) => {
      item.topics.forEach((topic) => {
        if (topic.jsonFile == jsonFileName) {
          current_topic = topic.displayName;
          current_subject = item.displayName;
          blank(current_topic, current_subject);
        }
      });
    });
  });
} else {
  document.querySelector('.no-json').classList.remove('invis');
  document.querySelector('.yes-json').classList.add('invis');
}
