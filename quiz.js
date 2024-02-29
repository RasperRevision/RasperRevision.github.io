const option1 = document.querySelector('.opt1');
const option2 = document.querySelector('.opt2');
const option3 = document.querySelector('.opt3');
const option4 = document.querySelector('.opt4');

const section = document.querySelector('.quiz');

let current_subject;
let current_topic;

let qtimer;
let qstopwatch = document.querySelector('.quiz_stopwatch');
let qs = 0;
let qm = 0;
let qFormattedTime;

function startQuizStopwatch() {
  qtimer = setInterval(updateStopwatch, 1000);
}

function stopStopwatch() {
  clearInterval(qtimer);
}

function updateStopwatch() {
  qs++;

  if (qs === 60) {
    qs = 0;
    qm++;
  }

  qFormattedTime = pad(qm) + ':' + pad(qs);
  qstopwatch.innerHTML = qFormattedTime;
}

function pad(value) {
  return value < 10 ? '0' + value : value;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex > 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function quiz(subject, topic) {
  current_subject = subject;
  current_topic = topic;
  try {
    const response = await fetch('/subjects/' + subject + '/' + topic + '.json');
    const data = await response.json();
    let shuffled = shuffle(data);

    for (const item of shuffled) {
      await processItem(item);
    }

    console.log("finished");
  } catch (error) {
    console.error('Error fetching JSON', error);
  }
}

async function selectRandomMeaning() {
  try {
    const response = await fetch('/subjects/' + current_subject + '/' + current_topic + '.json');
    const data = await response.json();
    let randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].meaning;
  } catch (error) {
    console.error('Error fetching JSON', error);
    return null;
  }
}


async function processItem(item) {
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
}


function waitForButton(item, callback) {
  const handleClick = (event) => {
    if (event.target.innerHTML === item.meaning) {
      callback(event);
      cleanup();
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



