const option1 = document.querySelector('.opt1');
const option2 = document.querySelector('.opt2');
const option3 = document.querySelector('.opt3');
const option4 = document.querySelector('.opt4');

const section = document.querySelector('.quiz');
const home = document.querySelector('.home');
const restart = document.querySelector('.restart');
const term_element = document.querySelector('.key_term');
const pills = document.querySelectorAll('.dropdown-item');

let current_file;

let timer;
let stopwatch = document.querySelector('.stopwatch');
let s = 0;
let m = 0;
let formattedTime;

let answerFound = false;

home.addEventListener('click', function () {
  location.reload();
});

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

function stopStopwatch() {
  clearInterval(timer);
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
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function quiz(file) {
  current_file = file;
  try {
    const response = await fetch(file);
    const data = await response.json();
    let shuffled = shuffle(data);
    for (const item of shuffled) { await processItem(item); }
    // end of quiz
    stopwatch.classList.add('invis');
    option1.classList.add('invis');
    option2.classList.add('invis');
    option3.classList.add('invis');
    option4.classList.add('invis');
    home.addEventListener('click', function () { location.href = '/'; });
    restart.addEventListener('click', function () { location.reload(); });
    term_element.style.cssText = 'text-align: center !important; border:none !important; background: none;';
    term_element.innerHTML = "Complete <div style=\"font-size:100px;\">" + pad(m) + ':' + pad(s) + "</div>";
    document.querySelector('.finish').classList.remove('invis');
  } catch (error) {
    console.error('Error fetching JSON', error);
  }
}

async function selectRandomMeaning() {
  try {
    const response = await fetch(current_file);
    const data = await response.json();
    let randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].meaning;
  } catch (error) {
    console.error('Error fetching JSON', error);
    return null;
  }
}

async function selectRandomEnglish() {
  try {
    const response = await fetch(current_file);
    const data = await response.json();
    let randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].english;
  } catch (error) {
    console.error('Error fetching JSON', error);
    return null;
  }
}


async function processItem(item) {
  if (item.term != null) {
    document.querySelector('.key_term').innerHTML = item.term;
    let random_option = Math.floor(Math.random() * 4);

    let meaning2 = await selectRandomMeaning();
    let meaning3 = await selectRandomMeaning();
    let meaning4 = await selectRandomMeaning();

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

    let meaning2 = await selectRandomEnglish();
    let meaning3 = await selectRandomEnglish();
    let meaning4 = await selectRandomEnglish();

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
    if (event.target.innerHTML === item.meaning) {
      answerFound = true;
      event.target.style.background = 'green';
      setTimeout(function () {
        callback(event);
        cleanup();
        event.target.style.background = 'rgb(39, 45, 53)';
        answerFound = false;
      }, 1000);
    } else {
      if (!answerFound) {
        event.target.style.background = 'red';
        setTimeout(function () {
          event.target.style.background = 'rgb(39, 45, 53)';
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
    if (event.target.innerHTML === item.english) {
      answerFound = true;
      event.target.style.background = 'green';
      setTimeout(function () {
        callback(event);
        cleanup();
        event.target.style.background = 'rgb(39, 45, 53)';
        answerFound = false;
      }, 1000);
    } else {
      if (!answerFound) {
        event.target.style.background = 'red';
        setTimeout(function () {
          event.target.style.background = 'rgb(39, 45, 53)';
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

  quiz(jsonFileName);
  startStopwatch();
}
