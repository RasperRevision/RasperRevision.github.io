(function () {
  emailjs.init("3cguN9VXD2T04KNVy");
})();

function sendFeedback() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  var templateParams = {
    from_name: name,
    from_email: email,
    message: message
  };

  emailjs.send('service_3ff5xym', 'template_jv9m0fn', templateParams)
    .then(function (response) {
      console.log('SUCCESS!', response.status, response.text);
    }, function (error) {
      console.log('FAILED...', error);
    });

  return false;
}