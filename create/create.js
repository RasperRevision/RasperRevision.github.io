const download = document.querySelector('.download');
const title = document.getElementById('title');
const addButton = document.querySelector('.add-item');
let itemIndex = 0;
let inputs = document.querySelectorAll('.form-control');

addButton.addEventListener('click', function () {
  const listItem = document.createElement('div');
  listItem.classList.add('list-group-item', 'bg-light');
  listItem.innerHTML = `
        <div class="input-group mb-2">
          <span class="input-group-text">Term</span>
          <input type="text" class="form-control">
        </div>
        <div class="input-group my-3">
          <span class="input-group-text">Definition</span>
          <textarea class="form-control"></textarea>
        </div>
        <button class="btn btn-danger delete-item">
          <i class="bi bi-trash3-fill"></i> Delete
        </button>
      `;
  const listGroup = document.querySelector('.list-group');
  listGroup.insertBefore(listItem, listGroup.lastElementChild);
  const deleteButtons = document.querySelectorAll('.delete-item');
  deleteButtons.forEach(function (button) {
    button.disabled = deleteButtons.length <= 1;
  });
  inputs = document.querySelectorAll('.form-control');
  inputs.forEach(function (input) {
    input.addEventListener('input', removeEmptyBorder);
  });
});

document.addEventListener('click', function (event) {
  if (event.target && event.target.classList.contains('delete-item')) {
    event.target.closest('.list-group-item').remove();
    const deleteButtons = document.querySelectorAll('.delete-item');
    deleteButtons.forEach(function (button) {
      button.disabled = deleteButtons.length <= 1;
    });
  }
});

title.addEventListener('input', function () {
  download.textContent = "Download " + this.value + ".json";
});

download.addEventListener('click', function () {
  if (title.value.trim() !== "") {
    title.classList.remove('empty');

    const jsonData = generateJSONData();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = title.value + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const complete = document.createElement('div');
    const complete_content = "Your download should have started. If not, please <a href='/contact'>contact us</a> and we will do our best to fix the issue. Once you have your JSON file, you can upload it to play it with either <a href='/matchup'>Matchup</a> or <a href='/quiz'>Quiz</a>. This file can be shared with anyone, and they can also upload it to play.";
    complete.innerHTML = complete_content;
    complete.classList.add('p-3');
    document.querySelector('.main_section').appendChild(complete);
  }
  else { title.classList.add('empty'); }
});

function generateJSONData() {
  const jsonData = [];

  document.querySelectorAll('.list-group-item.bg-light').forEach(function (item) {
    const termInput = item.querySelector('.input-group.mb-2 input');
    const definitionInput = item.querySelector('.input-group.my-3 textarea');

    if (termInput && definitionInput) {
      const termValue = termInput.value.trim();
      const definitionValue = definitionInput.value.trim();

      if (termValue !== "" && definitionValue !== "") {
        const newItem = {
          "term": termValue,
          "meaning": definitionValue
        };
        jsonData.push(newItem);
      }
    }
  });

  return JSON.stringify(jsonData, null, 2);
}