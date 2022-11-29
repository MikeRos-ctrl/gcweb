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

    const listener = new THREE.AudioListener();
    const audioLoader = new THREE.AudioLoader();
    const backgroundSound = new THREE.Audio(listener);

    audioLoader.load('script/danger.mp3', function (xd) {
      backgroundSound.setBuffer(xd);
      backgroundSound.setLoop(true);
      backgroundSound.setVolume(0.3);
      //  backgroundSound.play();
    })


  });

});

$(document).on('click', '.uwu', function (event) {
  event.preventDefault();
  let idUser = $(this).attr("idUser");
  let nombre = aux[idUser].nombre;
  let score = aux[idUser].score;
  //  console.log(idUser);
  // console.log(nombre);
  //console.log(score);
  shareScore(nombre, score);
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
    <td class="uwu" idUser="`+ index + `"><button>compartir</button></td>
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
    apiKey: "AIzaSyCb1_WIxqQpqnWDfkGhULbbhUhr2UJRz2g",
    authDomain: "gcwremaster.firebaseapp.com",
    projectId: "gcwremaster",
    storageBucket: "gcwremaster.appspot.com",
    messagingSenderId: "44616214660",
    appId: "1:44616214660:web:8c3d58446a1d96cb437ad1"
  };
  firebase.initializeApp(firebaseConfig);
}

window.fbAsyncInit = function () {
  FB.init({
    appId: '841348103574844',
    xfbml: true,
    version: 'v2.9'
  });
  FB.AppEvents.logPageView();
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function shareScore(nombre, score) {
  FB.ui({
    method: 'share',
    quote: ":c",
    caption: "help",
    href: 'https://www.xd.com', //videogame link xd
    hashtag: "#Noticxdia_Cool",
  }, function (response) { });
}

