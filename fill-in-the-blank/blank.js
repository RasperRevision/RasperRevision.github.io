document.addEventListener("DOMContentLoaded", function () {
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
    if (jsonFile) {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', jsonFile + '.json', true);
      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) { callback(JSON.parse(xobj.responseText)); }
      };
      xobj.send(null);
    } else {
      document.querySelector('.no-json').classList.remove('invis');
      document.querySelector('.yes-json').classList.add('invis');
    }
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const themesElement = document.getElementById("themes");
  const quoteElement = document.getElementById("quote");
  const inputElement = document.getElementById("input");
  const submitButton = document.getElementById("submit-btn");
  const nextButton = document.getElementById("next-btn");
  const resultElement = document.getElementById("result");
  const pills = document.querySelectorAll('.nav-link');

  let quotes;
  let shuffledQuotes;
  let currentQuoteIndex = 0;

  function displayQuote() {
    const quoteObj = shuffledQuotes[currentQuoteIndex];
    const themesTitleCase = quoteObj.themes.map(theme => toTitleCase(theme));
    themesElement.textContent = `${themesTitleCase.join(", ")}`;
    quoteElement.textContent = maskQuote(quoteObj.quote);
  }

  function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  function maskQuote(quote) {
    return quote.replace(/\b\w+(?:[']\w+)?|[^\s]/g, match => {
      if (match.trim() === "") return match;
      if (/[^a-zA-Z]/.test(match)) return match;
      if (Math.random() < 0.4) return "_".repeat(match.length);
      else return match;
    });
  }

  function removePunctuation(text) {
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "").replace(/\s{2,}/g, " ");
  }

  function checkInput() {
    const userGuess = removePunctuation(inputElement.value.trim());
    const actualQuote = shuffledQuotes[currentQuoteIndex].quote;
    resultElement.textContent = (userGuess.toLowerCase() === removePunctuation(actualQuote.toLowerCase())) ? "Correct!" : "Incorrect. The correct quote is: " + actualQuote;
    resultElement.classList.add((userGuess.toLowerCase() === removePunctuation(actualQuote.toLowerCase())) ? 'alert-success' : 'alert-danger');
    submitButton.classList.add('invis');
    nextButton.classList.remove('invis');
  }

  function nextQuote() {
    currentQuoteIndex++;
    if (currentQuoteIndex >= shuffledQuotes.length) {
      currentQuoteIndex = 0;
      shuffledQuotes = shuffle([...quotes]);
    }
    inputElement.value = "";
    resultElement.textContent = "";
    submitButton.classList.remove('invis');
    nextButton.classList.add('invis');
    displayQuote();
  }

  submitButton.addEventListener("click", function () { checkInput(); });
  nextButton.addEventListener("click", function () { nextQuote(); });

  inputElement.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (nextButton.classList.contains('invis')) { checkInput(); }
      else { nextQuote(); }
    }
  });

  loadJSON(function (response) {
    quotes = response;
    shuffledQuotes = shuffle([...quotes]);
    displayQuote();

    const jsonFileName = getParameterByName('json');
    pills.forEach(pill => {
      if (pill.getAttribute('href').includes(jsonFileName)) {
        pill.classList.add('active');
      }
    });
  });
});
