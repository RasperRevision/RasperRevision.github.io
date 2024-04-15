(function () {
  emailjs.init("3cguN9VXD2T04KNVy");
})();

function sendFeedback() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  if (name != "" && email != "" && message != ""){

    var templateParams = {
      from_name: name,
      from_email: email,
      message: message
    };

    emailjs.send('service_3ff5xym', 'template_jv9m0fn', templateParams)
      .then(function (response) {
        document.getElementById('success').classList.remove('d-none');
        console.log('SUCCESS!', response.status, response.text);
      }, function (error) {
        document.getElementById('failure').classList.remove('d-none');
        console.log('FAILED...', error);
      });

    return false;
  }
}
