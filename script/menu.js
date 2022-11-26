let aux = [];

$(document).ready(function () {
  $(".menu > img").css("left", "400px");
  $("#fog-index").css("opacity", "1");

  initializeFirebase();

  const dbRefPlayers = firebase.database().ref().child("jugadores");

  dbRefPlayers.on("child_added", (snap) => {

    var player = snap.val();

    let obj = {
      nombre: player.nombre,
      score: player.score,
    }
    aux.push(obj);
    //console.log(player);
  });
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

  let str = "";

  for (let index = 0; index < aux.length; index++) {
    str += `
    <tr>
    <td>`+ aux[index].nombre + `</td>
    <td>`+ aux[index].score + `</td>
  </tr>
    
    `;
    $("#scoresxd").html(str);
  }


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

function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCjfVDplX8NuQc2hr9Npz6tb3QgByXG4gI",
    authDomain: "gcww-76500.firebaseapp.com",
    projectId: "gcww-76500",
    storageBucket: "gcww-76500.appspot.com",
    messagingSenderId: "204226126815",
    appId: "1:204226126815:web:b1cd64f8df6b306eb95a6a"
  };
  firebase.initializeApp(firebaseConfig);
}
