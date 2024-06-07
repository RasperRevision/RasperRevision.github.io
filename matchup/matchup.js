const container = document.querySelector('.elements');
const stopwatch = document.querySelector('.stopwatch');
const pills = document.querySelectorAll('.dropdown-item');
const finished = document.querySelector('.matchup_finished');
const score = document.querySelector('.score');

let timer;
let s = 0, m = 0;
let formattedTime;
let score_value, length;
let isGerman = false;
let json_data;
let definitionChosen = "", termChosen = "";

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


function pickRandomItems(array, count) {
  if (array.length <= count) return array;

  let indexes = new Set();
  while (indexes.size < count) {
    indexes.add(Math.floor(Math.random() * array.length));
  }

  return [...indexes].map(index => array[index]);
}

async function process() {
  const selection = pickRandomItems(json_data, 5);

  let count = 0;
  const nums = shuffle([0, 7, 14, 21, 28, 35, 42, 49, 56, 63]);

  selection.forEach(item => {
    const definition = document.createElement('button');

    definition.textContent = item.meaning != null ? item.meaning : item.english;

    definition.classList.add('rbtn', 'definition', 'text-light', 'turquoise', 'position-absolute');
    definition.style.fontSize = '20px';
    definition.style.textShadow = '1px 1px 10px black';
    definition.style.left = (Math.random() * (window.innerWidth - 500)) + 'px';
    definition.style.top = 'calc(' + nums[count] + '%' + ' + 250px)';

    count++;

    const term = document.createElement('button');

    term.textContent = item.term != null ? item.term : item.german;

    term.classList.add('rbtn', 'term', 'primary', 'position-absolute');
    term.style.fontSize = '20px';
    term.style.textShadow = '1px 1px 10px black';
    term.style.left = (Math.random() * (window.innerWidth - 500)) + 'px';
    term.style.top = 'calc(' + nums[count] + '%' + ' + 250px)';

    document.querySelector('.elements').appendChild(definition);
    document.querySelector('.elements').appendChild(term);
    count++;
  });

  return new Promise((resolve) => { waitForButton(resolve); });
}

function updateScore() { score.textContent = `${score_value}/${length}`; }

async function matchup(topic, subject) {
  let rangeInput, rangeLabel, modal;
  if (topic != null && subject != null) {
    const modalContainer = document.createElement('div');
    const modalHtml = '<div class="modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title text-black">Matchup</h5></div><div class="modal-body"><p class="text-black mb-1">Subject: <span id="subject" class=text-black></span><br>Topic: <span id="topic" class=text-black></span><br><br>Game type:</p><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked><label class="form-check-label text-black" for="flexRadioDefault1" id="complete"></label></div><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"><label class="form-check-label text-black" for="flexRadioDefault2">Number of questions to finish: <label class="form-label text-black" for="customRange1" id="rangeLabel">1</label><div data-mdb-range-init class="range d-inline w-auto"><input type="range" class="form-range" id="customRange1" min="1" max="100" value="1" /></div></label></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="location.href=\'/matchup\'">Cancel</button><button type="button" class="btn btn-primary begin-game">Begin game</button></div></div></div></div>';

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
    json_data = shuffle(response);
    length = json_data.length;

    startStopwatch();
    score_value = 0;
    updateScore();

    if (topic != null && subject != null) {
      rangeInput.max = length - 1;

      document.getElementById("complete").textContent = `Complete (${length} questions)`;

      await new Promise((resolve) => {
        document.querySelector('.begin-game').addEventListener('click', resolve);
      });

      modal.hide();

      if (document.querySelectorAll(".form-check-input")[1].checked) {
        length = rangeInput.value;
        updateScore();
        for (let i = 0; i < length; i++) {
          await process();
          for (let j = 0; j < length - i; j++) {
            if (termChosen == json_data[j].term || termChosen == json_data[j].german) {
              json_data.splice(j, 1);
              j--;
            }
          }
        }
      } else {
        while (true) {
          if (json_data.length == 0) { break; }
          await process();
          for (let j = 0; j < json_data.length; j++) {
            if (termChosen == json_data[j].term || termChosen == json_data[j].german) {
              json_data.splice(j, 1);
              j--;
            }
          }
        }
      }
    }

    // end
    container.style.display = 'none';
    clearInterval(timer);
    finished.innerHTML = `Complete <div style="font-size:100px;"> ${pad(m)}:${pad(s)}</div>`;
    const home = document.createElement('button');
    home.textContent = 'Home';
    home.classList.add('btn');
    home.classList.add('btn-primary');
    home.classList.add('ms-4');
    home.addEventListener('click', function () { location.href = '/'; });
    const restart = document.createElement('button');
    restart.textContent = 'Restart';
    restart.classList.add('btn');
    restart.classList.add('btn-warning');
    restart.addEventListener('click', function () { location.reload(); });
    finished.appendChild(restart);
    finished.appendChild(home);
    return;
  });
}

function waitForButton(callback) {
  const handleDefClick = (event) => {
    definitionChosen = event.target.textContent;
    document.querySelectorAll(".definition").forEach((item) => {
      item.style.outline = '';
    });
    event.target.style.outline = '5px solid white';
    if (termChosen != "") {
      for (let i = 0; i < json_data.length; i++) {
        const item = json_data[i];
        if ((item.term == termChosen && item.meaning == definitionChosen) ||
          (item.german == termChosen && item.english == definitionChosen)) {
          while (container.firstChild) { container.removeChild(container.firstChild); }
          callback(event);
          cleanup();
          score_value++;
          updateScore();
          break;
        }
      }
    }
  }

  const handleTermClick = (event) => {
    termChosen = event.target.textContent;
    document.querySelectorAll(".term").forEach((item) => {
      item.style.outline = '';
    });
    event.target.style.outline = '5px solid white';

    if (definitionChosen != "") {
      for (let i = 0; i < json_data.length; i++) {
        const item = json_data[i];
        if ((item.term == termChosen && item.meaning == definitionChosen) ||
          (item.german == termChosen && item.english == definitionChosen)) {
          while (container.firstChild) { container.removeChild(container.firstChild); }
          callback(event);
          cleanup();
          score_value++;
          updateScore();
          break;
        }
      }
    }
  }

  const cleanup = () => {
    document.querySelectorAll('.definition').forEach((definition_element) => {
      definition_element.removeEventListener('click', handleDefClick);
    });

    document.querySelectorAll('.term').forEach((term_element) => {
      term_element.removeEventListener('click', handleTermClick);
    });
  }

  document.querySelectorAll('.definition').forEach((definition_element) => {
    definition_element.addEventListener('click', handleDefClick);
  });

  document.querySelectorAll('.term').forEach((term_element) => {
    term_element.addEventListener('click', handleTermClick);
  });

  return cleanup;
}

async function getJSON() {
  return await ((await fetch('/subjects.json')).json());
}

const jsonFileName = getParameterByName('json');

if (jsonFileName != null) {
 let current_subject, current_topic;
  getJSON().then((data) => {
    data.forEach((item) => {
      item.topics.forEach((topic) => {
        if (topic.jsonFile == jsonFileName) {
          current_topic = topic.displayName;
          current_subject = item.displayName;
          matchup(current_topic, current_subject);
        }
      });
    });
  });
} else {
  // if there is no json parameter, this makes the no-json element appear
  document.querySelector('.no-json').classList.remove('invis');
  term_element.classList.add('invis');
}
