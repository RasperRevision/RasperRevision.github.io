const container = document.querySelector('.elements');
const sect = document.querySelector('.match-up');
const stopwatch = document.querySelector('.stopwatch');
const pills = document.querySelectorAll('.dropdown-item');
const term_element = document.querySelector('.term');

let timer;
let s = 0, m = 0;
let formattedTime;

let isGerman = false;

function startStopwatch() {
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
  var jsonFile = getParameterByName('json');

  if (!jsonFile) {
    console.error("JSON file name not provided in URL.");
    return;
  }

  var jsonUrl = '/json/' + jsonFile + '.json';

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', jsonUrl, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
  };
  xobj.send(null);
}

function pickRandomItems(array, correct) {
  if (array.length <= 10) { return array; }

  let randomItems = [];
  let indexes = [];

  while (indexes.length < 10) {
    let randomIndex = Math.floor(Math.random() * array.length);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }

  indexes.forEach(index => {
    randomItems.push(array[index]);
  });

  if (!randomItems.includes(correct)) {
    randomItems.pop();
    randomItems.push(correct);
  }

  console.log(array, randomItems);
  return randomItems;
}

async function processItem(data, current_item) {
  term_element.innerHTML = current_item.term;

  data = pickRandomItems(data, current_item);
  let count = 0;
  const nums = shuffle([13, 21, 29, 37, 45, 53, 61, 69, 77, 85]);
  data.forEach(item => {
    const definition = document.createElement('button');

    definition.textContent = item.meaning;
    definition.classList.add('btn', 'definition', 'text-light');
    definition.style.position = 'absolute';
    definition.style.fontSize = '20px';
    definition.style.textShadow = '1px 1px 10px black';
    definition.style.left = (Math.random() * (window.innerWidth - 500)) + 'px';
    definition.style.top = nums[count] + '%';

    document.querySelector('.elements').appendChild(definition);
    count++;
  });

  return new Promise((resolve) => {
    waitForButton(current_item, resolve);
  });
}

async function processGermanItem(data, current_item) {
  term_element.innerHTML = current_item.german;

  data = pickRandomItems(data, current_item);
  let count = 0;
  const nums = shuffle([13, 21, 29, 37, 45, 53, 61, 69, 77, 85]);
  data.forEach(item => {
    const definition = document.createElement('button');

    definition.textContent = item.english;
    definition.classList.add('btn', 'definition', 'text-light');
    definition.style.position = 'absolute';
    definition.style.fontSize = '20px';
    definition.style.textShadow = '1px 1px 10px black';
    definition.style.left = (Math.random() * (window.innerWidth - 500)) + 'px';
    definition.style.top = nums[count] + '%';

    document.querySelector('.elements').appendChild(definition);
    count++;
  });

  return new Promise((resolve) => {
    waitForButton(current_item, resolve);
  });
}

function waitForButton(current_item, callback) {
  const handleClick = (event) => {
    if (isGerman) {
      if (event.target.innerHTML == current_item.english) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
          callback(event);
          cleanup();
        }
      }
    } else {
      if (event.target.innerHTML == current_item.meaning) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
          callback(event);
          cleanup();
        }
      }
    }

  }

  const cleanup = () => {
    document.querySelectorAll('.definition').forEach((definition_element) => {
      definition_element.removeEventListener('click', handleClick);
    });
  }

  document.querySelectorAll('.definition').forEach((definition_element) => {
    definition_element.addEventListener('click', handleClick);
  });

  return cleanup;
}

async function matchup() {
  loadJSON(async function (response) {
    response = shuffle(response);
    if (response[0].term == null) {
      isGerman = true;
      for (const item of response) {
        await processGermanItem(response, item);
      }
    } else {
      isGerman = false;
      for (const item of response) {
        await processItem(response, item);
      }
    }

    container.style.display = 'none';
    stopStopwatch();
    term_element.style.cssText = 'text-align: center !important; border:none !important; background: none;';
    term_element.innerHTML = "Complete <div style=\"font-size:100px;\">" + pad(m) + ':' + pad(s) + "</div>";
    stopwatch.classList.add('d-none');
    const home = document.createElement('button');
    home.innerHTML = 'Home';
    home.classList.add('btn');
    home.classList.add('btn-primary');
    home.classList.add('ms-4');
    home.addEventListener('click', function () {
      location.href = '/';
    });
    const restart = document.createElement('button');
    restart.innerHTML = 'Restart';
    restart.classList.add('btn');
    restart.classList.add('btn-warning');
    restart.addEventListener('click', function () {
      location.reload();
    });
    term_element.appendChild(restart);
    term_element.appendChild(home);
    return;
  });
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

  matchup();
  startStopwatch();
} else {
  document.querySelector('.no-json').classList.remove('invis');
  term_element.classList.add('invis');
}
