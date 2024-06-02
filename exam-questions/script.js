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
  container.innerHTML = ''; // Clear previous question and answers
  const main_question = document.createElement('h3');
  main_question.textContent = item.question;
  container.appendChild(main_question);

  for (const part of item.parts) {
    await processPart(part);
  }

  await new Promise(resolve => setTimeout(resolve, 2000));
}

async function processPart(part) {
  const sub_question = document.createElement('h6');
  sub_question.innerHTML = part.index + '. ' + part.question + ' <b>[' + part.answerBoxes.reduce((acc, box) => acc + box.marks, 0) + ' marks]</b>';
  container.appendChild(sub_question);

  const answer_boxes = [];
  const feedback_boxes = [];
  const mark_scheme_boxes = [];

  for (const box of part.answerBoxes) {
    if (box.type == 'l') {
      if (box.prompt) {
        const prompt = document.createElement('p');
        prompt.textContent = box.prompt;
        container.appendChild(prompt);
      }
      const answer_box = document.createElement('textarea');
      answer_box.classList.add('form-control', 'w-100', 'my-3');
      container.appendChild(answer_box);
      answer_boxes.push(answer_box);
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
      answer_boxes.push(answer_box);
      if (box.unitShown) {
        const answer_unit = document.createElement('p');
        answer_unit.classList.add('d-inline');
        answer_unit.textContent = box.unit;
        container.appendChild(answer_unit);
      }
    }

    const feedback = document.createElement('div');
    feedback.classList.add('feedback', 'my-2');
    container.appendChild(feedback);
    feedback_boxes.push(feedback);

    const mark_scheme = document.createElement('div');
    mark_scheme.classList.add('mark-scheme', 'my-2', 'invis');
    mark_scheme.innerHTML = `<b>Mark Scheme:</b><br>Answers: ${box.answers.join(', ')}<br>Alternatives: ${box.alternatives ? box.alternatives.join(', ') : 'None'}`;
    container.appendChild(mark_scheme);
    mark_scheme_boxes.push(mark_scheme);
  }

  const submit_btn = document.createElement('button');
  submit_btn.textContent = 'Submit';
  submit_btn.classList.add('rbtn', 'info', 'my-3');
  container.appendChild(submit_btn);

  return new Promise((resolve) => {
    submit_btn.addEventListener('click', function () {
      let correct = true;
      let allMarked = true;

      part.answerBoxes.forEach((box, boxIndex) => {
        let userAnswer = answer_boxes[boxIndex].value.trim();
        let feedback = feedback_boxes[boxIndex];
        feedback.innerHTML = '';

        if (box.type == 'l') {
          userAnswer = userAnswer.toLowerCase();
          const isCorrect = box.answers.includes(userAnswer) || (box.alternatives && box.alternatives.includes(userAnswer));

          if (box.exact) {
            if (!isCorrect) correct = false;
            feedback.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
            feedback.style.color = isCorrect ? 'green' : 'red';
          } else {
            const correct_btn = document.createElement('button');
            correct_btn.textContent = 'Correct';
            correct_btn.classList.add('btn', 'btn-success', 'mx-1');
            correct_btn.addEventListener('click', () => {
              feedback.textContent = 'Correct!';
              feedback.style.color = 'green';
              score_val += box.marks;
              updateScore();
              correct_btn.remove();
              incorrect_btn.remove();
              mark_scheme_boxes[boxIndex].classList.add('invis');
            });

            const incorrect_btn = document.createElement('button');
            incorrect_btn.textContent = 'Incorrect';
            incorrect_btn.classList.add('btn', 'btn-danger', 'mx-1');
            incorrect_btn.addEventListener('click', () => {
              feedback.textContent = 'Incorrect!';
              feedback.style.color = 'red';
              correct_btn.remove();
              incorrect_btn.remove();
              mark_scheme_boxes[boxIndex].classList.add('invis');
            });

            feedback.appendChild(correct_btn);
            feedback.appendChild(incorrect_btn);
            mark_scheme_boxes[boxIndex].classList.remove('invis');
            allMarked = false; // Wait until user marks all
          }
        } else {
          userAnswer = parseInt(userAnswer);
          if (box.answers[0] !== userAnswer) {
            correct = false;
            feedback.textContent = 'Incorrect!';
            feedback.style.color = 'red';
          } else {
            feedback.textContent = 'Correct!';
            feedback.style.color = 'green';
            score_val += box.marks;
          }
        }
      });

      if (correct && allMarked) {
        updateScore();
        container.innerHTML = '';
        resolve();
      }
    });
  });
}

async function exam() {
  startStopwatch();
  score_val = 0;
  loadJSON(async function (response) {
    json_data = shuffle(response);
    length = json_data.reduce((acc, item) => acc + item.parts.reduce((acc2, part) => acc2 + part.answerBoxes.reduce((acc3, box) => acc3 + box.marks, 0), 0), 0);
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
