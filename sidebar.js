document.addEventListener('DOMContentLoaded', function () {
  fetch('/sidebar_header.html')
    .then(response => response.text())
    .then(html => {
      const sidebar_header_wrapper = document.createElement('div');
      sidebar_header_wrapper.innerHTML = html;
      document.querySelector('.main_wrapper').insertBefore(sidebar_header_wrapper, document.querySelector('.main_wrapper').children[0])
    }).catch(error => console.error('Error fetching sidebar:', error));

  var icon = document.createElement('div');
  var icon1 = document.createElement('div');
  var icon2 = document.createElement('div');
  var icon3 = document.createElement('div');

  icon.id = "icon";
  icon.classList.add('hamburger-icon');
  icon1.id = "a";
  icon1.classList.add('icon-1');
  icon2.id = "b";
  icon2.classList.add('icon-2');
  icon3.id = "c";
  icon3.classList.add('icon-3');

  icon.appendChild(icon1);
  icon.appendChild(icon2);
  icon.appendChild(icon3);
  document.body.appendChild(icon);

  icon.addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('active');
    icon1.classList.toggle('a');
    icon2.classList.toggle('c');
    icon3.classList.toggle('b');
  });
});
