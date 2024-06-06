const option1 = document.querySelector('.opt1');
const option2 = document.querySelector('.opt2');
const option3 = document.querySelector('.opt3');
const option4 = document.querySelector('.opt4');
const section = document.querySelector('.quiz');
const home = document.querySelector('.home');
const restart = document.querySelector('.restart');
const term_element = document.querySelector('.key_term');
const score = document.querySelector('.score');

let current_file;
let timer;
let score_val, length;
let answerFound = false;
let s = 0, m = 0;

function startStopwatch() {
  timer = setInterval(function () {
    s++;
    if (s === 60) {
      s = 0;
      m++;
    }
    document.querySelector('.stopwatch').textContent = `${pad(m)}:${pad(s)}`;
  }, 1000);
}

function pad(value) {
  return value < 10 ? '0' + value : value;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]o]()-=+.$@#%^&*/g, "\\$&");
  var regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadJSON(callback) {
  if (!getParameterByName('json')) {
    document.querySelector('.no-json').classList.add('invis');
    term_element.classList.remove('invis');
    option1.classList.remove('invis');
    option2.classList.remove('invis');
    option3.classList.remove('invis');
    option4.classList.remove('invis');
    var jsonFile = document.querySelector('.file_input').files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
      try {
        var jsonString = event.target.result;
        var jsonArray = JSON.parse(jsonString);
        jsonArray.forEach(function (obj) {
          obj.newProperty = 'newValue';
        });

        if (isValidJsonStructure(jsonArray)) {
          callback(jsonArray);
        } else {
          throw new Error("Invalid file structure");
        }
      } catch (error) {
        alert(`Incompatible file: ${error.message}. The file should contain objects with either 'term' and 'meaning' or 'german' and 'english' properties.`);
        location.reload();
      }
    };
    reader.readAsText(jsonFile);
  } else {
    var jsonFile = `/json/${getParameterByName('json')}.json`;
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonFile, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == 200) {
        try {
          var response = JSON.parse(xobj.responseText);
          if (isValidJsonStructure(response)) {
            callback(response);
          } else {
            throw new Error("Invalid file structure");
          }
        } catch (error) {
          alert(`Incompatible file: ${error.message}. The file should contain objects with either 'term' and 'meaning' or 'german' and 'english' properties.`);
          location.reload();
        }
      }
    };
    xobj.send(null);
  }
}

function isValidJsonStructure(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    return false;
  }

  const validKeys = [['term', 'meaning'], ['german', 'english']];
  return jsonArray.every(obj =>
    validKeys.some(keys => keys.every(key => obj.hasOwnProperty(key)))
  );
}

function updateScore() {
  score.textContent = score_val + '/' + length;
}

function pickRandomItems(array, count) {
  if (array.length <= count) return array;

  let indexes = new Set();
  while (indexes.size < count) {
    indexes.add(Math.floor(Math.random() * array.length));
  }

  return [...indexes].map(index => array[index]);
}

async function processItem(item) {
  const answers = pickRandomItems(json_data, 4);
  const termElement = document.querySelector('.key_term');
  const random_option = Math.floor(Math.random() * 4);
  const meanings = [
    item.meaning || item.english,
    answers[0][item.term ? 'meaning' : 'english'],
    answers[1][item.term ? 'meaning' : 'english'],
    answers[2][item.term ? 'meaning' : 'english'],
  ];

  termElement.textContent = item.term || item.german;
  [option1, option2, option3, option4].forEach((option, i) => {
    option.textContent = meanings[(i + random_option) % 4];
  });

  return new Promise((resolve) => {
    waitForButton(item, resolve);
  });
}

function waitForButton(item, callback) {
  const handleClick = (event) => {
    const btn = event.target;
    const isCorrect = item.english ? btn.textContent === item.english : btn.textContent === item.meaning;

    btn.classList.add(isCorrect ? 'correct-opt' : 'incorrect-opt');
    if (isCorrect) {
      answerFound = true;
      score_val++;
      updateScore();
    }

    setTimeout(() => {
      btn.classList.remove(isCorrect ? 'correct-opt' : 'incorrect-opt');
      if (isCorrect) {
        callback(event);
        cleanup();
        answerFound = false;
      }
    }, 1000);
  };

  const cleanup = () => {
    [option1, option2, option3, option4].forEach(option => {
      option.removeEventListener('click', handleClick);
    });
  };

  [option1, option2, option3, option4].forEach(option => {
    option.addEventListener('click', handleClick);
  });

  return cleanup;
}

async function quiz(topic, subject) {
  let rangeInput, rangeLabel, modal;
  if (topic != null && subject != null) {
    const modalContainer = document.createElement('div');
    const modalHtml = '<div class="modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title text-black">Quiz</h5></div><div class="modal-body"><p class="text-black mb-1">Subject: <span id="subject" class=text-black></span><br>Topic: <span id="topic" class=text-black></span><br><br>Game type:</p><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked><label class="form-check-label text-black" for="flexRadioDefault1" id="complete"></label></div><div class="form-check">  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"><label class="form-check-label text-black" for="flexRadioDefault2">Number of questions to finish: <label class="form-label text-black" for="customRange1" id="rangeLabel">1</label><div data-mdb-range-init class="range  w-auto"><input type="range" class="form-range" id="customRange1" min="1" max="100" value="1" /></div></label></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="location.href=\'/quiz\'">Cancel</button><button type="button" class="btn btn-primary begin-game">Begin game</button></div></div></div></div>';

    modalContainer.innerHTML = modalHtml;

    document.querySelector('.quiz_content').appendChild(modalContainer);

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
    json_data = shuffle(response);
    length = json_data.length;

    if (topic != null && subject != null) {
      rangeInput.max = length - 1;

      document.getElementById("complete").textContent = `Complete (${length} questions)`

      await new Promise((resolve) => {
        document.querySelector('.begin-game').addEventListener('click', resolve);
      });

      modal.hide();

      if (document.querySelectorAll(".form-check-input")[1].checked) {
        length = rangeInput.value;
      }
    }

    startStopwatch();
    score_val = 0;
    updateScore();

    for (let i = 0; i < length; i++) {
      await processItem(json_data[i]);
    }

    endGame();
  });
}

function endGame() {
  clearInterval(timer);
  [option1, option2, option3, option4].forEach((option) => {
    option.classList.add('invis');
  });
  home.addEventListener('click', function () {
    location.href = '/';
  });
  restart.addEventListener('click', function () {
    location.reload();
  });
  term_element.innerHTML = `Complete <div style="font-size:100px;"> ${pad(m)}:${pad(s)}</div>`;
  document.querySelector('.finish').classList.remove('invis');
}

async function getSubjectJSON() {
  const data = await (await fetch('/subjects.json')).json();
  var dropdownHTML = '<div class="accordion mt-3" id="subjectAccordion">';
  data.forEach((item) => {
    const subject = item.displayName.replace(/\s/g, "");
    var topics = "";
    item.topics.forEach((topic) => {
      if (topic.games.toString(2)[1] == 1) {
        topics += `<a href="?json=${topic.jsonFile}" class="subject_link link-offset-1 link-light link-underline-opacity-50 link-underline-opacity-100-hover">${topic.displayName}</a>`;
      }
    });
    dropdownHTML +=
      `<div class="accordion-item" style="background: none !important; border: none;">
        <h2 class="accordion-header" id="${subject}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${subject}" aria-expanded="false" aria-controls="collapse${subject}">
            ${item.displayName}
          </button>
        </h2>
        <div id="collapse${subject}" class="accordion-collapse collapse" aria-labelledby="${subject}" data-bs-parent="#subjectAccordion">
          <div class="accordion-body">
            <ul class="list-group" id="${subject}ListGroup">
              ${topics}
            </ul>
          </div>
        </div>
      </div>`;
  });
  dropdownHTML += '</div>';
  return dropdownHTML;
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
  let current_topic, current_subject;
  document.querySelectorAll('.subject_link').forEach(l => {
    if (l.getAttribute('href').includes(jsonFileName)) {
      current_topic = l.textContent;
      const i = l.closest('.accordion-item');
      if (i) {
        current_subject = i.querySelector(".accordion-button").textContent;
      }
    }
  });

  quiz(current_topic, current_subject);

} else {
  document.querySelector('.no-json').classList.remove('invis');
  term_element.classList.add('invis');
  document.querySelectorAll('.opt').forEach(element => {
    element.classList.add('invis');
  });
}
