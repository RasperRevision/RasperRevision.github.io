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

// Grid parameters
const gridSize = 100;
const gridMargin = 200; // Margin around the grid
let grid;

// Initialize the grid
function initializeGrid() {
  const numCols = Math.ceil((window.innerWidth - 2 * gridMargin) / gridSize);
  const numRows = Math.ceil((window.innerHeight - 2 * gridMargin) / gridSize);

  grid = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => []));
}

// Place an element in the grid
function placeElementInGrid(elem, gridX, gridY) {
  grid[gridY][gridX].push(elem);
}

// Check if the position is valid in terms of grid cells
function isPositionValidInGrid(gridX, gridY) {
  const neighbors = getNeighbors(gridX, gridY);

  for (const neighbor of neighbors) {
    if (grid[neighbor.y] && grid[neighbor.y][neighbor.x].length > 0) {
      return false;
    }
  }

  return true;
}

// Get neighboring grid cells
function getNeighbors(gridX, gridY) {
  const neighbors = [];

  for (let y = gridY - 1; y <= gridY + 1; y++) {
    for (let x = gridX - 1; x <= gridX + 1; x++) {
      if (x >= 0 && y >= 0 && x < grid[0].length && y < grid.length) {
        neighbors.push({ x, y });
      }
    }
  }

  return neighbors;
}

// Get random position within the window
function getRandomGridPosition() {
  const gridX = Math.floor(Math.random() * grid[0].length);
  const gridY = Math.floor(Math.random() * grid.length);
  return { gridX, gridY };
}

// Place element randomly in grid cells
function placeElementRandomly(elem) {
  let position;
  do {
    position = getRandomGridPosition();
  } while (!isPositionValidInGrid(position.gridX, position.gridY));

  placeElementInGrid(elem, position.gridX, position.gridY);
  elem.style.left = (position.gridX * gridSize + gridMargin) + 'px';
  elem.style.top = (position.gridY * gridSize + gridMargin) + 'px';
}

// Start the stopwatch
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

// Stop the stopwatch
function stopStopwatch() { clearInterval(timer); }

// Pad a value with leading zeros if necessary
function pad(value) { return value < 10 ? '0' + value : value; }

// Get a query parameter from the URL
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]o]()-=+.$@#%^&*/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Load JSON data
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

// Main script
function script() {
  let sym_found = false;
  let mean_found = false;
  let data;

  loadJSON(function (response) {
    data = response;

    if (data.length != omit.length) {
      omit.sort(function (a, b) { return b - a; });
      omit.forEach(item => { data.splice(item, 1); })
    } else {
      // end of game
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
        const element_symbol = document.createElement('button');
        const symbol_img = document.createElement('img');
        const symbol_text = item.symbol;
        symbol_img.src = 'imgs/' + item.symbol;
        symbol_img.style.height = '60px';
        element_symbol.appendChild(symbol_img);
        element_symbol.classList.add('btn');

        element_symbol.style.position = 'absolute';
        element_symbol.addEventListener('click', function () {
          if (mean_found && symbol_text == symbol) {
            while (container.firstChild) { container.removeChild(container.firstChild); }
            omit.push(randomIndex);
            script();
          } else if (symbol_text == symbol) { sym_found = true; }
        });
        placeElementRandomly(element_symbol);
        container.appendChild(element_symbol);

        document.querySelector('.elements').appendChild(element_symbol);
      }

      const element_definition = document.createElement('button');

      element_definition.textContent = item.meaning;
      element_definition.classList.add('text-white');
      element_definition.classList.add('btn');
      element_definition.classList.add('text-light');

      element_definition.style.position = 'absolute';
      element_definition.style.fontSize = '20px';
      element_definition.style.textShadow = '1px 1px 10px black';

      element_definition.addEventListener('click', function () {
        container.childNodes.forEach(function (child) {
          child.classList.remove("btn-info");
        });
        element_definition.classList.add("btn-info");
        if (sym_found && element_definition.innerHTML == meaning) {
          while (container.firstChild) { container.removeChild(container.firstChild); }
          omit.push(randomIndex);
          script();
        } else if (element_definition.innerHTML == meaning) {
          mean_found = true;
          if (item.symbol == null) {
            while (container.firstChild) { container.removeChild(container.firstChild); }
            omit.push(randomIndex);
            script();
          }
        }
      });
      placeElementRandomly(element_definition);
      container.appendChild(element_definition);
    });
  });
}

// Check if JSON file parameter is provided in the URL
const jsonFileName = getParameterByName('json');

if (jsonFileName != null) {
  pills.forEach(pill => {
    if (pill.getAttribute('href').includes(jsonFileName)) {
      pill.classList.add('active');
    }
  });

  initializeGrid(); // Initialize the grid
  script(); // Run the script
  startStopwatch(); // Start the stopwatch
}
