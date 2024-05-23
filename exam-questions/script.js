const option1 = document.querySelector('.opt1');
const option2 = document.querySelector('.opt2');
const option3 = document.querySelector('.opt3');
const option4 = document.querySelector('.opt4');
const section = document.querySelector('.quiz');
const home = document.querySelector('.home');
const restart = document.querySelector('.restart');
const term_element = document.querySelector('.key_term');
const score = document.querySelector('.score');
const container = document.querySelector('.quiz_content');

let current_file;

let timer;

let score_val, length;

let answerFound = false;
let s = 0, m = 0;

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]o]()-=+.$@#%^&*/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function updateScore() {
  score.innerHTML = score_val + '/' + length;
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
    var jsonFile = getParameterByName('json') + '.json';

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonFile, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
    };
    xobj.send(null);
  }
}

function pad(value) { return value < 10 ? '0' + value : value; }

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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

async function processItem(item) {
  console.log(item);
  const main_question = document.createElement('h3');
  main_question.textContent = item.question;
  container.appendChild(main_question);

  item.parts.forEach((part) => {
    const sub_question = document.createElement('h6');
    sub_question.textContent = part.question + ' <b>[' + part.marks + ']</b>';
    container.appendChild(sub_question);
    part.answerBoxes.forEach((box) => {
      if (box.type == 'l') {
        const answer_box = document.createElement('textarea');
        answer_box.classList.add('form-control', 'w-100', 'my-3');
        container.appendChild(answer_box);
      } else {
        if (box.prompt) {
          const answer_prompt = document.createElement('p');
          answer_prompt.classList.add('d-inline');
          answer_prompt.textContent = box.prompt;
          container.appendChild(answer_prompt);
        }
        const answer_box = document.createElement('input');
        answer_box.classList.add('form-control', 'w-auto', 'd-inline', 'mx-3');
        container.appendChild(answer_box);
        if (box.unitShown) {
          const answer_unit = document.createElement('p');
          answer_unit.classList.add('d-inline');
          answer_unit.textContent = box.unit;
          container.appendChild(answer_unit);
        }
      }
    });
    const submit_btn = document.createElement('button');
    submit_btn.textContent = 'Submit';
    submit_btn.classList.add('rbtn', 'info');
    container.appendChild(submit_btn);
  });

  return new Promise((resolve) => {
    waitForButton(item, resolve);
  });
}

function waitForButton(item, callback) {
  const submit_btn = container.querySelector('button.rbtn.info');

  submit_btn.addEventListener('click', function () {
    let correct = true;

    item.parts.forEach((part, partIndex) => {
      part.answerBoxes.forEach((box, boxIndex) => {
        let userAnswer;

        if (box.type == 'l') {
          userAnswer = container.querySelectorAll('textarea')[partIndex].value.trim();
          if (boxIndex == partIndex) {
            if (box.answers.includes(userAnswer)) {
              console.log("Correct!");
            } else {
              console.log("Incorrect!");
            }
          }
        } else {
          userAnswer = container.querySelectorAll('input.form-control')[partIndex].value.trim();

          console.log(`partIndex: ${partIndex}, boxIndex: ${boxIndex}, userAnswer: '${userAnswer}', expected answers: '${box.answers}'`);

          if (boxIndex == partIndex) {
            if (box.answers.includes(userAnswer)) {
              console.log("Correct!");
            } else {
              console.log("Incorrect!");
            }
          }
        }

        if (userAnswer !== box.answer) {
          correct = false;
        }
      });
    });

    if (correct) {
      score_val++;
    }

    updateScore();
    container.innerHTML = '';
    callback();
  });
}



async function exam() {
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

    // end of game
    home.addEventListener('click', function () { location.href = '/'; });
    restart.addEventListener('click', function () { location.reload(); });
    term_element.style.cssText = 'text-align: center !important; border:none !important; background: none;';
    term_element.innerHTML = "Complete <div style=\"font-size:100px;\">" + pad(m) + ':' + pad(s) + "</div>";
    document.querySelector('.finish').classList.remove('invis');
  });
}

const jsonFileName = getParameterByName('json');

if (jsonFileName == null) {
  document.querySelector('.no-json').classList.remove('invis');
  term_element.classList.add('invis');
  document.querySelectorAll('.opt').forEach(element => {
    element.classList.add('invis');
  });
} else {
  exam();
}
