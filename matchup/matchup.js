let omit = [];
const container = document.querySelector('.elements');
const sect = document.querySelector('.match-up');
const stopwatch = document.querySelector('.stopwatch');
const pills = document.querySelectorAll('.nav-link');
const term_element = document.querySelector('.term');

let timer;
let s = 0;
let m = 0;
let formattedTime;

function startStopwatch() { timer = setInterval(updateStopwatch, 1000); }

function stopStopwatch() { clearInterval(timer); }

function updateStopwatch() {
  s++;

  if (s === 60) {
    s = 0;
    m++;
  }

  formattedTime = pad(m) + ':' + pad(s);
  stopwatch.innerHTML = formattedTime;
}

function pad(value) { return value < 10 ? '0' + value : value; }

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]o]()-=+.$@#%^&*/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadJSON(callback) {
  var jsonFile = getParameterByName('json');

  if (!jsonFile) {
    console.error("JSON file name not provided in URL.");
    return;
  }

  var jsonUrl = '/subjects/Music/' + jsonFile;

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', jsonUrl, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
  };
  xobj.send(null);
}

function script(subject, topic) {
  let sym_found = false;
  let mean_found = false;
  let data;

  loadJSON(function (response) {
    data = response;

    if (data.length != omit.length) {
      omit.sort(function (a, b) { return b - a; });
      omit.forEach(item => { data.splice(item, 1); })
    } else {
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
    }

    const randomIndex = Math.floor(Math.random() * data.length);

    let symbol = data[randomIndex].symbol;
    let term = data[randomIndex].term;
    let meaning = data[randomIndex].meaning;

    document.querySelector('.term').innerHTML = term;

    data.forEach(item => {
      if (item.symbol != null) {
        const sym = document.createElement('button');
        const sym_img = document.createElement('img');
        const sym_text = item.symbol;
        sym_img.src = '/subjects/' + subject + '/imgs/' + item.symbol;
        sym_img.style.height = '60px';
        sym.appendChild(sym_img);
        sym.classList.add('btn');

        sym.style.position = 'absolute';
        sym.style.left = (Math.random() * (window.innerWidth - 500) + 250) + 'px';
        sym.style.top = (Math.random() * (window.innerHeight - 500) + 250) + 'px';
        sym.addEventListener('click', function () {
          if (mean_found && sym_text == symbol) {
            while (container.firstChild) { container.removeChild(container.firstChild); }
            omit.push(randomIndex);
            script(subject, topic);
          } else if (sym_text == symbol) { sym_found = true; }
        })

        document.querySelector('.elements').appendChild(sym);
      }

      const mean = document.createElement('button');

      mean.textContent = item.meaning;
      mean.classList.add('text-white');
      mean.classList.add('btn');
      mean.classList.add('text-light');

      mean.style.position = 'absolute';
      mean.style.fontSize = '20px';
      mean.style.left = (Math.random() * (window.innerWidth - 500) + 250) + 'px';
      mean.style.top = (Math.random() * (window.innerHeight - 500) + 250) + 'px';


      mean.addEventListener('click', function () {
        mean.classList.add("btn-info");
        if (sym_found && mean.innerHTML == meaning) {
          while (container.firstChild) { container.removeChild(container.firstChild); }
          omit.push(randomIndex);
          script(subject, topic);
        } else if (mean.innerHTML == meaning) {
          mean_found = true;
          if (item.symbol == null) {
            while (container.firstChild) { container.removeChild(container.firstChild); }
            omit.push(randomIndex);
            script(subject, topic);
          }
        }
      })
      document.querySelector('.elements').appendChild(mean);
    });
  });
}


const jsonFileName = getParameterByName('json');

if (jsonFileName != null) {
  pills.forEach(pill => {
    if (pill.getAttribute('href').includes(jsonFileName)) {
      pill.classList.add('active');
    }
  });

  script("Music", jsonFileName.replace('.json', ''));
  startStopwatch();
}
