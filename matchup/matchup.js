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

function loadJSON(callback) {
  if (!getParameterByName('json')) {
    console.log(document.querySelector('.no-json'));
    document.querySelector('.no-json').classList.add('invis');
    var jsonFile = document.querySelector('.file_input').files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
      var jsonString = event.target.result;
      var jsonArray = JSON.parse(jsonString);
      jsonArray.forEach(function (obj) { obj.newProperty = 'newValue'; });
      if ((jsonArray[0].term != null && jsonArray[0].meaning != null) || (jsonArray[0].german != null && jsonArray[0].english != null)) {
        callback(jsonArray);
      } else {
        alert("Incompatible file");
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
      if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
    };
    xobj.send(null);
  }
}

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

      document.getElementById("complete").textContent = `Complete (${length} questions)`

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

const jsonFileName = getParameterByName('json');

if (jsonFileName != null) {
  let current_topic, current_subject;
  // adds the active class to the link that links to the current page
  pills.forEach(pill => {
    if (pill.getAttribute('href').includes(jsonFileName)) {
      pill.classList.add('active');
      current_topic = pill.textContent;
      const dropdownMenu = pill.closest('.dropdown-menu');
      if (dropdownMenu) {
        const dropdownToggle = dropdownMenu.parentElement.querySelector('.dropdown-toggle');
        dropdownToggle.classList.add('active');
        current_subject = dropdownToggle.textContent;
      }
    }
  });

  matchup(current_topic, current_subject);
} else {
  // if there is no json parameter, this makes the no-json element appear
  document.querySelector('.no-json').classList.remove('invis');
  term_element.classList.add('invis');
}
