$(document).ready(function () {

  $('#userNumber').keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });

  $('#getNumberForm').submit(function () {
    var receivedNum = $('#userNumber').val();
    console.log(receivedNum);

    // Get random ASCII art
    $.getScript('scripts/art.js', function () {
      var randomArt = asciiArt[Math.floor(Math.random() * asciiArt.length)] + tag;

      // Send phone number to Twilio
      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/',
        dataType: 'JSON',
        data: JSON.stringify({receivedNum, randomArt}),
        success: function (results) {
          console.log(results);
        },
        error: function (results) {
          console.log(results);
        }
      });
    });

    // Clear phone number input field on submit and prevent page reload
    $('#userNumber').val('')
    return false;
  });
});
