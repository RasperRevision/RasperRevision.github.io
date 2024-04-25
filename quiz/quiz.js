const option1 = document.querySelector('.opt1');
const option2 = document.querySelector('.opt2');
const option3 = document.querySelector('.opt3');
const option4 = document.querySelector('.opt4');
const section = document.querySelector('.quiz');
const home = document.querySelector('.home');
const restart = document.querySelector('.restart');
const term_element = document.querySelector('.key_term');
const pills = document.querySelectorAll('.dropdown-item');
const score = document.querySelector('.score');

let current_file;

let timer;

let score_val, length;

let answerFound = false;
let s = 0, m = 0;

function startStopwatch() {
  let stopwatch = document.querySelector('.stopwatch');
  let formattedTime;

  timer = setInterval(function () {
    s++;
    if (s === 60) {
      s = 0;
      m++;
    }
    formattedTime = pad(m) + ':' + pad(s);
    stopwatch.innerHTML = formattedTime;
  }, 1000);
}

function stopStopwatch() { clearInterval(timer); }

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
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
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
      var jsonString = event.target.result;
      var jsonArray = JSON.parse(jsonString);
      jsonArray.forEach(function (obj) {
        obj.newProperty = 'newValue';
      });
      if ((jsonArray[0].term != null && jsonArray[0].meaning != null) || (jsonArray[0].german != null && jsonArray[0].english != null)) {
        callback(jsonArray);
      } else {
        alert("Incompatible file");
        location.reload();
      }
    };
    reader.readAsText(jsonFile);
  } else {
    var jsonFile = '/json/' + getParameterByName('json') + '.json';

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonFile, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
    };
    xobj.send(null);
  }
}

async function quiz() {
  startStopwatch();
  score_val = 0;
  loadJSON(async function (response) {
    json_data = shuffle(response);
    length = json_data.length;
    updateScore();

    for (let i = 0; i < json_data.length; i++) {
      await processItem(json_data[i]);
    }

    stopStopwatch();
    option1.classList.add('invis');
    option2.classList.add('invis');
    option3.classList.add('invis');
    option4.classList.add('invis');
    home.addEventListener('click', function () { location.href = '/'; });
    restart.addEventListener('click', function () { location.reload(); });
    term_element.style.cssText = 'text-align: center !important; border:none !important; background: none;';
    term_element.innerHTML = "Complete <div style=\"font-size:100px;\">" + pad(m) + ':' + pad(s) + "</div>";
    document.querySelector('.finish').classList.remove('invis');
  });
}

function updateScore() {
  score.innerHTML = score_val + '/' + length;
}

function pickRandomItems(array) {
  if (array.length <= 3) { return array; }

  let randomItems = [];
  let indexes = [];

  while (indexes.length < 5) {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }

  indexes.forEach(index => {
    randomItems.push(array[index]);
  });

  return randomItems;
}

async function processItem(item) {
  const answers = pickRandomItems(json_data);
  if (item.term != null) {
    document.querySelector('.key_term').innerHTML = item.term;
    let random_option = Math.floor(Math.random() * 4);

    let meaning2 = answers[0].meaning;
    let meaning3 = answers[1].meaning;
    let meaning4 = answers[2].meaning;

    if (random_option == 0) {
      option1.innerHTML = item.meaning;
      option2.innerHTML = meaning2;
      option3.innerHTML = meaning3;
      option4.innerHTML = meaning4;
    } else if (random_option == 1) {
      option1.innerHTML = meaning2;
      option2.innerHTML = item.meaning;
      option3.innerHTML = meaning3;
      option4.innerHTML = meaning4;
    } else if (random_option == 2) {
      option1.innerHTML = meaning2;
      option2.innerHTML = meaning3;
      option3.innerHTML = item.meaning;
      option4.innerHTML = meaning4;
    } else {
      option1.innerHTML = meaning2;
      option2.innerHTML = meaning3;
      option3.innerHTML = meaning4;
      option4.innerHTML = item.meaning;
    }

    return new Promise((resolve) => {
      waitForButton(item, resolve);
    });
  } else {
    document.querySelector('.key_term').innerHTML = item.german;
    let random_option = Math.floor(Math.random() * 4);

    let meaning2 = answers[0].english;
    let meaning3 = answers[1].english;
    let meaning4 = answers[2].english;

    if (random_option == 0) {
      option1.innerHTML = item.english;
      option2.innerHTML = meaning2;
      option3.innerHTML = meaning3;
      option4.innerHTML = meaning4;
    } else if (random_option == 1) {
      option1.innerHTML = meaning2;
      option2.innerHTML = item.english;
      option3.innerHTML = meaning3;
      option4.innerHTML = meaning4;
    } else if (random_option == 2) {
      option1.innerHTML = meaning2;
      option2.innerHTML = meaning3;
      option3.innerHTML = item.english;
      option4.innerHTML = meaning4;
    } else {
      option1.innerHTML = meaning2;
      option2.innerHTML = meaning3;
      option3.innerHTML = meaning4;
      option4.innerHTML = item.english;
    }

    return new Promise((resolve) => {
      waitForGermanButton(item, resolve);
    });
  }

}


function waitForButton(item, callback) {
  const handleClick = (event) => {
    const btn = event.target;
    if (btn.innerHTML === item.meaning) {
      answerFound = true;
      btn.classList.add('correct-opt');
      score_val++;
      updateScore();
      setTimeout(function () {
        callback(event);
        cleanup();
        btn.classList.remove('correct-opt');
        answerFound = false;
      }, 1000);
    } else {
      if (!answerFound) {
        btn.classList.add('incorrect-opt');
        setTimeout(function () {
          btn.classList.remove('incorrect-opt');
          answerFound = false;
        }, 1000);
      }
    }
  };

  const cleanup = () => {
    option1.removeEventListener('click', handleClick);
    option2.removeEventListener('click', handleClick);
    option3.removeEventListener('click', handleClick);
    option4.removeEventListener('click', handleClick);
  };

  option1.addEventListener('click', handleClick);
  option2.addEventListener('click', handleClick);
  option3.addEventListener('click', handleClick);
  option4.addEventListener('click', handleClick);

  return cleanup;
}

function waitForGermanButton(item, callback) {
  const handleClick = (event) => {
    const btn = event.target;
    if (event.target.innerHTML === item.english) {
      answerFound = true;
      btn.classList.add('correct-opt');
      score_val++;
      updateScore();
      setTimeout(function () {
        callback(event);
        cleanup();
        btn.classList.remove('correct-opt');
        answerFound = false;
      }, 1000);
    } else {
      if (!answerFound) {
        btn.classList.add('incorrect-opt');
        setTimeout(function () {
          btn.classList.remove('incorrect-opt');
          answerFound = false;
        }, 1000);
      }
    }
  };

  const cleanup = () => {
    option1.removeEventListener('click', handleClick);
    option2.removeEventListener('click', handleClick);
    option3.removeEventListener('click', handleClick);
    option4.removeEventListener('click', handleClick);
  };

  option1.addEventListener('click', handleClick);
  option2.addEventListener('click', handleClick);
  option3.addEventListener('click', handleClick);
  option4.addEventListener('click', handleClick);

  return cleanup;
}

const jsonFileName = getParameterByName('json');

if (jsonFileName != null) {
  pills.forEach(pill => {
    if (pill.getAttribute('href').includes(jsonFileName)) {
      pill.classList.add('active');
      const dropdownMenu = pill.closest('.dropdown-menu');
      if (dropdownMenu) {
        const dropdownToggle = dropdownMenu.parentElement.querySelector('.dropdown-toggle');
        dropdownToggle.classList.add('active');
      }
    }
  });

  quiz();
} else {
  document.querySelector('.no-json').classList.remove('invis');
  term_element.classList.add('invis');
  document.querySelectorAll('.opt').forEach(element => {
    element.classList.add('invis');
  });
}
