const icon = document.getElementById("icon");
const icon1 = document.getElementById("a");
const icon2 = document.getElementById("b");
const icon3 = document.getElementById("c");

icon.addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('active');
  icon1.classList.toggle('a');
  icon2.classList.toggle('c');
  icon3.classList.toggle('b');
});
