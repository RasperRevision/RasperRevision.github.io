const sect = document.querySelector('.quiz');
const option1 = document.querySelector('.opt1');
const option2 = document.querySelector('.opt2');
const option3 = document.querySelector('.opt3');
const option4 = document.querySelector('.opt4');

let timer;
let stopwatch = document.querySelector('.stopwatch');
let s = 0;
let m = 0;
let formattedTime;

function startQuizStopwatch() {
  timer = setInterval(updateStopwatch, 1000);
}

function stopStopwatch() {
  clearInterval(timer);
}

function updateStopwatch() {
  s++;

  if (s === 60) {
    s = 0;
    m++;
  }

  formattedTime = pad(m) + ':' + pad(s);
  stopwatch.innerHTML = formattedTime;
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

function quiz(subject, topic) {
  console.log("Test 1 passed");

  fetch('/subjects/' + subject + '/' + topic + '.json')
    .then(response => response.json())
    .then(data => {
      console.log("Test 2 passed");
      
      let shuffled = shuffle(data);

      shuffled.forEach(item => {
        document.querySelector('.key_term').innerHTML = item.term;
        let random_option = Math.floor(Math.random * 4);
        if (random_option == 0) {
          option1.innerHTML = item.meaning;
        } else if (random_option == 1) {
          option2.innerHTML = item.meaning;
        } else if (random_option == 2) {
          option3.innerHTML = item.meaning;
        } else {
          option4.innerHTML = item.meaning;
        }
      });



      });
  })
  .catch(error => console.error('Error fetching JSON', error));

}
