const option1 = document.querySelector('.opt1');
const option2 = document.querySelector('.opt2');
const option3 = document.querySelector('.opt3');
const option4 = document.querySelector('.opt4');
const section = document.querySelector('.quiz');
const home = document.querySelector('.home');
const restart = document.querySelector('.restart');
const finished = document.querySelector('.finished-text');
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
  container.innerHTML = '';
  const main_question = document.createElement('h3');
  main_question.textContent = item.question;
  container.appendChild(main_question);

  let partCount = 0;
  for (const part of item.parts) {
    partCount++;
    await processPart(part, partCount);
  }
  main_question.textContent = '';
}

async function processPart(part, partCount) {
  // creates a container div for the current question part
  const part_container = document.createElement('div');
  part_container.classList.add(`part${partCount}`);
  container.appendChild(part_container);

  // title for sub question
  const sub_question = document.createElement('h6');
  sub_question.innerHTML = `${part.index}. ${part.question}<b> [${part.answerBoxes.reduce((acc, box) => acc + box.marks, 0)} marks]</b>`;
  part_container.appendChild(sub_question);

  const answer_boxes = [];
  const mark_scheme_boxes = [];
  const feedback_boxes = [];

  var count = 0;
  for (const box of part.answerBoxes) {
    // creates answer boxes
    if (box.type == 'l') {
      const answer_box = document.createElement('textarea');
      answer_box.classList.add('form-control', 'w-100', 'my-3');
      part_container.appendChild(answer_box);
      answer_boxes.push(answer_box);
    } else {
      const answer_box = document.createElement('input');
      answer_box.classList.add('form-control', 'w-auto', 'd-inline', 'mx-3');
      part_container.appendChild(answer_box);
      answer_boxes.push(answer_box);
    }

    const feedback = document.createElement('div');
    feedback.classList.add(`feedback${count}`, 'my-2');
    part_container.appendChild(feedback);
    feedback_boxes.push(feedback);

    const mark_scheme = document.createElement('div');
    mark_scheme.classList.add(`mark_scheme${count}`, 'my-2');
    part_container.appendChild(mark_scheme);
    mark_scheme_boxes.push(mark_scheme);
  }

  // creates submit button
  const submit_btn = document.createElement('button');
  submit_btn.textContent = 'Submit';
  submit_btn.classList.add('rbtn', 'info', 'my-3');
  part_container.appendChild(submit_btn);

  // defines what will happen if the submit button is pressed
  return new Promise((resolve) => {
    submit_btn.addEventListener('click', function () {
      let answer_box_values = [];
      answer_boxes.forEach(() => {
        answer_box_values.push(false);
      });

      // goes through each answer box to check if it's correct
      part.answerBoxes.forEach((box, boxIndex) => {
        let userAnswer = answer_boxes[boxIndex].value.trim();
        let current_feedback = feedback_boxes[boxIndex];
        current_feedback.innerHTML = '';

        if (box.exact) {
          // converts userAnswer to appropriate format, whether it is an int or string.
          try {
            userAnswer = parseInt(userAnswer);
          } catch (e) {
            userAnswer = userAnswer.toLowerCase();
          }

          // checks if it is correct
          if (box.answers[0] !== userAnswer) {
            current_feedback.textContent = 'Incorrect!';
            current_feedback.style.color = 'red';
          } else {
            current_feedback.textContent = 'Correct!';
            current_feedback.style.color = 'green';
            score_val += box.marks;
            updateScore();
            answer_box_values[boxIndex] = true;
          }
        } else {
          // non-exact answers are always strings
          userAnswer = userAnswer.toLowerCase();

          // creates mark scheme text
          let current_mark_scheme = mark_scheme_boxes[boxIndex];
          const ms_text = `<h6>Self-marked-question. Select the number of marks you think you deserve based on the mark scheme.</h6><div class="dropdown d-inline me-2"><button class="btn btn-secondary dropdown-toggle dropdownButton${boxIndex}" type="button" data-bs-toggle="dropdown" aria-expanded="false">Select</button><ul class="dropdown-menu dropdown${boxIndex}"></ul></div>mark(s)<br><h6 class=mt-3>Mark scheme</h6><ul class=markScheme${boxIndex}></ul><h6 class=allow></h6><ul class=altMarkScheme${boxIndex}>`;
          current_mark_scheme.innerHTML = ms_text;

          // sets up mark dropdown properly
          for (let i = 0; i <= box.marks; i++) {
            const temp_element = document.createElement('li');
            const temp_text = `<a class="dropdown-item" style="cursor: pointer">${i}</a>`
            temp_element.innerHTML = temp_text;
            document.querySelector(`.dropdown${boxIndex}`).appendChild(temp_element);
          }

          // allows the user to select number of marks
          document.querySelector(`.dropdown${boxIndex}`).querySelectorAll('.dropdown-item').forEach((item) => {
            item.addEventListener('click', function () {
              document.querySelector(`.dropdownButton${boxIndex}`).textContent = item.textContent;
              if (parseInt(item.textContent) == box.marks) {
                current_feedback.textContent = 'Correct!';
                current_feedback.style.color = 'green';
                if (!answer_box_values[boxIndex]) {
                  answer_box_values[boxIndex] = true;
                  score_val += box.marks;
                  updateScore();
                }
                if (!answer_box_values.includes(false)) {
                  document.querySelector(`.part${partCount}`).remove();
                  resolve();
                }
              } else {
                current_feedback.textContent = 'Incorrect!';
                current_feedback.style.color = 'red';
              }
            });
          });

          // shows the mark scheme
          box.answers.forEach((answer) => {
            const answer_text = document.createElement('li');
            answer_text.textContent = answer;
            document.querySelector(`.markScheme${boxIndex}`).appendChild(answer_text);
          });

          if (box.alternatives != null) {
            document.querySelector('.allow').textContent = 'Allow:'
            box.alternatives.forEach((alt) => {
              const alt_element = document.createElement('li');
              alt_element.textContent = alt;
              document.querySelector(`.altMarkScheme${boxIndex}`).appendChild(alt_element);
            });
          }
        }
      });

      // moves on if everything is correct  
      if (!answer_box_values.includes(false)) {
        document.querySelector(`.part${partCount}`).remove();
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

    // end of game
    stopStopwatch();
    home.addEventListener('click', function () { location.href = '/'; });
    restart.addEventListener('click', function () { location.reload(); });
    finished.style.cssText = 'text-align: center !important; border:none !important; background: none;';
    finished.innerHTML = `Complete <div style="font-size:100px;">${pad(m)}:${pad(s)}</div>`;
    document.getElementById('finish-wrapper').classList.remove('invis');
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
