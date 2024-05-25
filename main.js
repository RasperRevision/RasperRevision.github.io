const games = document.querySelectorAll('.game');
const game_parent = document.querySelector('.games');

let title = document.querySelector('.welcome_title');
let topic_chosen = "";

var current_page_num = 1;

// prevents page from becoming stuck loading
window.addEventListener('popstate', function (event) {
  if (window.location.pathname === '/') {
    location.reload();
  }
});

/*window.addEventListener('scroll', function (event) {
  if (this.oldScroll > this.scrollY) {
    // scroll up
    if (document.getElementById('page' + (current_page_num - 1)) != null) {
      current_page_num--;
      const y = document.getElementById('page' + current_page_num).getBoundingClientRect().top + window.scrollY - 190;
      window.scroll({
        top: y,
        behavior: 'smooth'
      });
      console.log(y);
    }
  } else {
    // scroll down
    if (document.getElementById('page' + (current_page_num + 1)) != null) {
      current_page_num++;
      const y = document.getElementById('page' + current_page_num).getBoundingClientRect().top + window.scrollY + 240;
      window.scroll({
        top: y,
        behavior: 'smooth'
      });
      console.log(y);
    }
  }

  this.oldScroll = this.scrollY;
});
*/
async function getJson() {
  // Matchup, quiz, fill in the blank, equations

  const data = await (await fetch('/subjects.json')).json();
  var row1, row2, row3;

  row1 = document.createElement('div');
  row1.classList.add('home_btn_row');
  row1.style.flexBasis = '100%';
  document.querySelector('.subjects').appendChild(row1);

  if (data.length > 4) {
    row2 = document.createElement('div');
    row2.classList.add('home_btn_row');
    row2.style.flexBasis = '100%';
    document.querySelector('.subjects').appendChild(row2);
  }

  if (data.length > 8) {
    row3 = document.createElement('div');
    row3.classList.add('home_btn_row');
    row3.style.flexBasis = '100%';
    document.querySelector('.subjects').appendChild(row3);
  }

  data.forEach(function (subject) {
    const subject_btn = document.createElement('button');
    subject_btn.classList.add('home_btn', subject.bg);
    subject_btn.innerHTML = subject.displayName;
    subject_btn.addEventListener('click', function () {
      document.querySelector('.subjects').classList.add('invis');
      document.querySelector('.welcome_title').innerHTML = "Select a topic";
      document.querySelector(subject.topicParent).classList.remove('invis');
    });

    if (subject.index == 4 && (data.length == 5 || data.length == 6 || data.length == 9)) {
      row2.appendChild(subject_btn);
    } else if (subject.index == 7 && (data.length == 9 || data.length == 10)) {
      row3.appendChild(subject_btn);
    } else if (subject.index == 8 && data.length == 9) {
      row3.appendChild(subject_btn);
    } else if (subject.index <= 4) {
      row1.appendChild(subject_btn);
    } else if (subject.index <= 8) {
      row2.appendChild(subject_btn);
    } else if (subject.index <= 12) {
      row3.appendChild(subject_btn);
    }

    if (subject.topics.length > 12) {
      var page_count = Math.ceil(subject.topics.length / 12);

      var pages = [];

      for (let i = 1; i <= page_count; i++) {
        var rows = [];

        if (i == page_count) {
          var modulus = subject.topics.length % 12;
          var p_row1, p_row2, p_row3;

          p_row1 = document.createElement('div');
          p_row1.classList.add('home_btn_row');
          p_row1.style.flexBasis = '100%';
          rows.push(p_row1);

          if (modulus == 0) {
            modulus = 12;
          }
          if (modulus > 4) {
            p_row2 = document.createElement('div');
            p_row2.classList.add('home_btn_row');
            p_row2.style.flexBasis = '100%';
            rows.push(p_row2);
          }
          if (modulus > 8) {
            p_row3 = document.createElement('div');
            p_row3.classList.add('home_btn_row');
            p_row3.style.flexBasis = '100%';
            rows.push(p_row3);
          }
        } else {
          var p_row1, p_row2, p_row3;

          p_row1 = document.createElement('div');
          p_row1.classList.add('home_btn_row');
          p_row1.style.flexBasis = '100%';
          rows.push(p_row1);

          p_row2 = document.createElement('div');
          p_row2.classList.add('home_btn_row');
          p_row2.style.flexBasis = '100%';
          rows.push(p_row2);

          p_row3 = document.createElement('div');
          p_row3.classList.add('home_btn_row');
          p_row3.style.flexBasis = '100%';
          rows.push(p_row3);
        }

        var page = document.createElement('div');
        page.classList.add('d-inline-flex', 'flex-column', 'h-100', 'w-100', 'mb-5', 'page');
        page.id = 'page' + i;

        rows.forEach(function (row) { page.appendChild(row); });

        pages.push(page);
      }

      pages.forEach(function (item) {
        document.querySelector(subject.topicParent).appendChild(item);
      })

    } else {
      var t_row1, t_row2, t_row3;

      t_row1 = document.createElement('div');
      t_row1.classList.add('home_btn_row');
      t_row1.style.flexBasis = '100%';
      document.querySelector(subject.topicParent).appendChild(t_row1);

      if (subject.topics.length > 4) {
        t_row2 = document.createElement('div');
        t_row2.classList.add('home_btn_row');
        t_row2.style.flexBasis = '100%';
        document.querySelector(subject.topicParent).appendChild(t_row2);
      }
      if (subject.topics.length > 8) {
        t_row3 = document.createElement('div');
        t_row3.classList.add('home_btn_row');
        t_row1.style.flexBasis = '33.33333%';
        t_row2.style.flexBasis = '33.33333%';
        t_row3.style.flexBasis = '33.33333%';
        document.querySelector(subject.topicParent).appendChild(t_row3);
      }
    }

    subject.topics.forEach(function (topic) {
      const topic_btn = document.createElement('button');
      topic_btn.classList.add('home_btn', topic.bg);
      topic_btn.innerHTML = topic.displayName;

      topic_btn.addEventListener('click', function () {
        document.querySelector('.welcome_title').innerHTML = "Select an activity";
        document.querySelector(subject.topicParent).classList.add('invis');

        var binary_games = topic.games.toString(2);
        document.querySelector('.games').classList.remove('invis');

        while (binary_games.length < 4) { binary_games = '0' + binary_games; }

        if (binary_games[0] == '1') {
          document.querySelector('.game-matchup').classList.remove('invis');
        }
        if (binary_games[1] == '1') {
          document.querySelector('.game-quiz').classList.remove('invis');
        }
        if (binary_games[2] == '1') {
          document.querySelector('.game-blank').classList.remove('invis');
        }
        if (binary_games[3] == '1') {
          document.querySelector('.game-equations').classList.remove('invis');
        }

        topic_chosen = topic.jsonFile;
      });

      if (subject.topics.length <= 12) {
        if (topic.index == 4 && (subject.topics.length == 5 || subject.topics.length == 6 || subject.topics.length == 9)) {
          t_row2.appendChild(topic_btn);
        } else if (topic.index == 7 && (subject.topics.length == 9 || subject.topics.length == 10)) {
          t_row3.appendChild(topic_btn);
        } else if (topic.index == 8 && subject.topics.length == 9) {
          t_row3.appendChild(topic_btn);
        } else if (topic.index <= 4) {
          t_row1.appendChild(topic_btn);
        } else if (topic.index <= 8) {
          t_row2.appendChild(topic_btn);
        } else if (topic.index <= 12) {
          t_row3.appendChild(topic_btn);
        }
      } else {
        if (topic.index % 12 == 0) {
          pages[Math.ceil(topic.index / 12) - 1].children[2].appendChild(topic_btn);
        } else if (topic.index % 12 == 4 && (subject.topics.length % 12 == 5 || subject.topics.length % 12 == 6 || subject.topics.length % 12 == 9)) {
          pages[Math.ceil(topic.index / 12) - 1].children[1].appendChild(topic_btn);
        } else if (topic.index % 12 == 7 && (subject.topics.length % 12 == 9 || subject.topics.length % 12 == 10)) {
          pages[Math.ceil(topic.index / 12) - 1].children[2].appendChild(topic_btn);
        } else if (topic.index % 12 == 8 && subject.topics.length % 12 == 9) {
          pages[Math.ceil(topic.index / 12) - 1].children[2].appendChild(topic_btn);
        } else if (topic.index % 12 <= 4) {
          pages[Math.ceil(topic.index / 12) - 1].children[0].appendChild(topic_btn);
        } else if (topic.index % 12 <= 8) {
          pages[Math.ceil(topic.index / 12) - 1].children[1].appendChild(topic_btn);
        } else if (topic.index % 12 < 12 || topic.index % 12 == 0) {
          pages[Math.ceil(topic.index / 12) - 1].children[2].appendChild(topic_btn);
        }
      }
    })
  });
}

getJson();

// Adds event listeners to each activity button to start the corresponding game with the corresponding JSON file.
games.forEach(function (game) {
  game.addEventListener('click', function () {
    game_parent.classList.add('invis');
    title.innerHTML = 'Loading...';

    if (game.innerHTML == "Matchup") {
      location.href = '/matchup/?json=' + topic_chosen;
    } else if (game.innerHTML == "Quiz") {
      location.href = '/quiz/?json=' + topic_chosen;
    } else if (game.innerHTML == "Fill in the Blank") {
      window.location.href = '/fill-in-the-blank?json=' + topic_chosen;
    } else if (game.innerHTML == "Equations") {
      window.location.href = '/equations?json=physics_equations.json'
    }
  });
});

