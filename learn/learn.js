function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]o]()-=+.$@#%^&*/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadJSON(url, callback) {
  var jsonUrl = 'json/' + url + '.json';

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', jsonUrl, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
  };
  xobj.send(null);
}

const container = document.getElementById('container');
const subject = document.getElementById('subject');
const title = document.getElementById('title');
const pagesContainer = document.getElementById('pages');
const navbar = document.getElementById('navbar');

function showMainContent(json) {
  subject.textContent = json.subject;
  title.textContent = json.title;
  navbar.innerHTML = '';

  json.pages.forEach(page => {
    const anchorLink = document.createElement('a');
    anchorLink.textContent = page.title;
    anchorLink.href = '#' + page.title.toLowerCase().replace(/\s+/g, '-');
    anchorLink.classList.add('nav-link');
    navbar.appendChild(anchorLink);

    const section = document.createElement('section');
    section.id = page.title.toLowerCase().replace(/\s+/g, '-');

    const pageTitle = document.createElement('h2');
    pageTitle.textContent = page.title;
    section.appendChild(pageTitle);

    const objectivesWrapper = document.createElement('div');
    objectivesWrapper.classList.add('mt-3', 'mb-4', 'dark', 'p-3', 'rounded-4', 'objective-wrapper');

    const objectivesTitle = document.createElement('h6');
    objectivesTitle.textContent = 'Objectives';
    objectivesWrapper.appendChild(objectivesTitle);

    const objectivesList = document.createElement('ul');
    page.objectives.forEach(function (objective) {
      const objective_element = document.createElement('li');
      objective_element.innerHTML = objective;
      objectivesList.appendChild(objective_element);
    });

    objectivesWrapper.appendChild(objectivesList);

    section.appendChild(objectivesWrapper);
    const pageContent = document.createElement('div');
    pageContent.innerHTML = page.content;
    section.appendChild(pageContent);

    pagesContainer.appendChild(section);
  });
}

const jsonFileName = getParameterByName('json');

if (jsonFileName != null) {
  loadJSON(jsonFileName, showMainContent);
}
