let omit = [];
const container = document.querySelector('.elements');
const sect = document.querySelector('.match-up');

let timer;
let stopwatch = document.querySelector('.stopwatch');
let s = 0;
let m = 0;
let formattedTime;

function startStopwatch() {
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

function script(subject, topic) {
  console.log("Test 1 passed");
  let sym_found = false;
  let mean_found = false;

  fetch('/subjects/' + subject + '/' + topic + '.json')
    .then(response => response.json())
    .then(data => {
      console.log("Test 2 passed");
      if (omit.length != data.length) {
        omit.sort(function (a, b) {
          return b - a;
        });

        omit.forEach(item => {
          data.splice(item, 1);
        })
      } else {
        document.querySelector('.elements').style.display = 'none';
        stopStopwatch();
        document.querySelector('.term').innerHTML = pad(m) + ':' + pad(s);
        throw new Error('hello');
      }
      
      const randomIndex = Math.floor(Math.random() * data.length);

      let symbol = data[randomIndex].symbol;
      let term = data[randomIndex].term;
      let meaning = data[randomIndex].meaning;

      document.querySelector('.term').innerHTML = term;

      data.forEach(item => {
        console.log("Test 3 passed");
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
              while (container.firstChild) {
                container.removeChild(container.firstChild);
              }
              omit.push(randomIndex);
              script(subject, topic);
            } else if (sym_text == symbol) {
              sym_found = true;
            }
          })

          document.querySelector('.elements').appendChild(sym);
        }

        const mean = document.createElement('button');

        mean.textContent = item.meaning;
        mean.classList.add('btn');

        mean.style.position = 'absolute';
        mean.style.fontSize = '20px';
        mean.style.left = (Math.random() * (window.innerWidth - 500) + 250) + 'px';
        mean.style.top = (Math.random() * (window.innerHeight - 500) + 250) + 'px';


        mean.addEventListener('click', function () {
          if (sym_found && mean.innerHTML == meaning) {
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }
            omit.push(randomIndex);
            script(subject, topic);
          } else if (mean.innerHTML == meaning) {
            mean_found = true;
            if (item.symbol == null) {
              while (container.firstChild) {
                container.removeChild(container.firstChild);
              }
              omit.push(randomIndex);
              script(subject, topic);
            }
          }
        })

        document.querySelector('.elements').appendChild(mean);
      });
    })
    .catch(error => console.error('Error fetching JSON', error));

}
