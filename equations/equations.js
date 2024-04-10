document.addEventListener("DOMContentLoaded", function () {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

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
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonFile, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
    };
    xobj.send(null);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const form = document.querySelector('.form-control');
  const question = document.querySelector('.equation_question');
  const symbol_buttons = document.querySelectorAll('.symbol-button');
  const maths_buttons = document.querySelectorAll('.maths-button');
  const submit = document.querySelector('.submit_btn');
  const next = document.querySelector('.next_btn');
  const success = document.querySelector('.alert-success');
  const danger = document.querySelector('.alert-danger');

  let equations;
  let shuffled;
  let currentEquationIndex = 0;

  function displayEquation() {
    const equationObj = shuffled[currentEquationIndex];
    const parts = shuffle(equationObj.parts);
    question.textContent = 'State the equation linking ' + parts.join(', ');
  }

  symbol_buttons.forEach(function (symbol_button) {
    symbol_button.addEventListener('click', function () {
      form.textContent += symbol_button.textContent;
    });
  });

  maths_buttons.forEach(function (maths_button) {
    maths_button.addEventListener('click', function () {
      form.textContent += maths_button.textContent;
    });
  });

  function nextEquation() {
    currentEquationIndex++;
    if (currentEquationIndex >= shuffled.length) {
      currentEquationIndex = 0;
      shuffled = shuffle([...equations]);
    }
    form.textContent = "";
    displayEquation();
  }


  submit.addEventListener('click', function () {
    const correctAnswers = shuffled[currentEquationIndex].equations;

    if (correctAnswers.includes(form.textContent.trim())) {
      next.classList.remove('invis');
      submit.classList.add('invis');
      success.classList.remove('invis');
    } else {
      danger.classList.remove('invis');
      form.textContent = "";
      setTimeout(function () {
        danger.classList.add('invis');
      }, 5000);
    }
  });


  next.addEventListener('click', function () {
    submit.classList.remove('invis');
    next.classList.add('invis');
    success.classList.add('invis');
    nextEquation();
  })

  loadJSON(function (response) {
    equations = response;
    shuffled = shuffle([...equations]);
    displayEquation();
  });
});