$(document).ready(function () {
  $(".menu > img").css("left", "400px");
  $("#fog-index").css("opacity", "1");
});

$("#btn-configuracion").click(function () {

  // Get the modal
  var modal = document.getElementById("modal-configuracion");

  // Get the button that opens the modal
  var btn = document.getElementById("btn-configuracion");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[1];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

$("#btn-configuracion-pausa").click(function () {
  // Get the modal
  var modal = document.getElementById("modal-configuracion-pausa");

  // Get the button that opens the modal
  var btn = document.getElementById("btn-configuracion-pausa");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[1];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

});

$("#btn-puntuaciones").click(function () {

  // Get the modal
  var modal = document.getElementById("modal-puntuaciones");

  // Get the button that opens the modal
  var btn = document.getElementById("btn-puntuaciones");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[2];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

$("#btn-jugar").click(function () {

  // Get the modal
  var modal = document.getElementById("modal-jugar");

  // Get the button that opens the modal
  var btn = document.getElementById("btn-jugar");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

$("#btn-pausa").click(function () {

  // Get the modal
  var modal = document.getElementById("modal-pausa");

  // Get the button that opens the modal
  var btn = document.getElementById("btn-pausa");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

$("#btn-unjugador").click(function () {
  var nivel = $('#select-nivel').val();
  console.log(nivel);
  switch (nivel) {
    case '1':
      window.location.href = "scene1game.html"
      break;
    case '2':
      window.location.href = "scene2game.html"
      break;
    case '3':
      window.location.href = "scene3game.html"
      break;
  }
});
$("#btn-abandonar").click(function () {
  window.location.href = "http://127.0.0.1:5500"
});
