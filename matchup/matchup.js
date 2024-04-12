const container = document.querySelector('.elements');
const sect = document.querySelector('.match-up');
const stopwatch = document.querySelector('.stopwatch');
const pills = document.querySelectorAll('.nav-link');
const term_element = document.querySelector('.term');

let timer;
let s = 0, m = 0;
let formattedTime;

let definition_found = false;
let symbol_found = false;
let has_symbols;

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

  var jsonUrl = jsonFile + '.json';

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', jsonUrl, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
  };
  xobj.send(null);
}

function pickRandomItems(array, correct) {
    if (array.length <= 10) {
        return array;
    }
    
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

    if (!randomItems.contains(correct)) {
        randomItems.pop();
        randomItems.push(correct);
    }

    return randomItems;
}

async function processItem(data, current_item) {
  term_element.innerHTML = current_item.term;
  symbol_found = false;
  definition_found = false;
  console.log('next item');
  data = pickRandomItems(data, current_item);
  data.forEach(item => {
    if (item.symbol != null) {
      const symbol = document.createElement('button');
      const symbol_img = document.createElement('img');

      symbol.setAttribute('data-img-path', item.symbol);
      symbol_img.src = 'imgs/' + item.symbol;
      symbol_img.style.height = '60px';
      symbol.appendChild(symbol_img);
      symbol.classList.add('btn', 'symbol');

      symbol.style.position = 'absolute';
      symbol.style.left = (Math.random() * (window.innerWidth - 500) + 250) + 'px';
      symbol.style.top = (Math.random() * (window.innerHeight - 500) + 250) + 'px';

      document.querySelector('.elements').appendChild(symbol);
    }

    const definition = document.createElement('button');

    definition.textContent = item.meaning;
    definition.classList.add('btn', 'definition', 'text-light');
    definition.style.position = 'absolute';
    definition.style.fontSize = '20px';
    definition.style.textShadow = '1px 1px 10px black';
    definition.style.left = (Math.random() * (window.innerWidth - 500) + 250) + 'px';
    definition.style.top = (Math.random() * (window.innerHeight - 500) + 250) + 'px';

    document.querySelector('.elements').appendChild(definition);
  });

  return new Promise((resolve) => {
    waitForButton(current_item, resolve);
  });
}

function waitForButton(current_item, callback) {
  const handleImgClick = (event) => {
    let symbol_button;
    if (event.target.classList.contains('btn')) {
      symbol_button = event.target;
    } else {
      symbol_button = event.target.parentElement;
    }
    const symbol_text = symbol_button.getAttribute("data-img-path");
    console.log(symbol_text);
    console.log(current_item.symbol);
    if (definition_found && symbol_text == current_item.symbol) {
      console.log("definition is found and symbol is correct");
      while (container.firstChild) { container.removeChild(container.firstChild); }
      callback(event);
      cleanup();
    } else if (symbol_text == current_item.symbol) { 
      console.log("symbol is correct");
      symbol_found = true;
    }
  }

  const handleTextClick = (event) => {
    console.log("text button pressed");
    container.childNodes.forEach(function (child) {
      child.classList.remove("btn-info");
    });
    event.target.classList.add("btn-info");
    if (symbol_found && event.target.innerHTML == current_item.meaning) {
      while (container.firstChild) { container.removeChild(container.firstChild); }
      callback(event);
      cleanup();
    } else if (event.target.innerHTML == current_item.meaning) {
      definition_found = true;
      if (!has_symbols) {
        while (container.firstChild) { 
          container.removeChild(container.firstChild); 
          callback(event);
          cleanup();
        }
      }
    }
  }

  const cleanup = () => {
    if (has_symbols) {
      document.querySelectorAll('.symbol').forEach((symbol_element) => {
        symbol_element.removeEventListener('click', handleImgClick);
      });
    }
    document.querySelectorAll('.definition').forEach((definition_element) => {
      definition_element.removeEventListener('click', handleTextClick);
    });
  }
  
  if (has_symbols) {
    document.querySelectorAll('.symbol').forEach((symbol_element) => {
      symbol_element.addEventListener('click', handleImgClick);
    });
  }
  document.querySelectorAll('.definition').forEach((definition_element) => {
    definition_element.addEventListener('click', handleTextClick);
  });

  return cleanup;
}

async function matchup() {
  loadJSON(async function (response) {
    response = shuffle(response);

    has_symbols = response[0].symbol == null ? false : true;

    let count = 1;
    for (const item of response) { 
      console.log(count);
      await processItem(response, item);
      count++;
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
    }
  });

  matchup();
  startStopwatch();
}
