window.onload = function() {
  typeWriter();
};

const txt = "S.W.A.T. dos Gramados";
const speed = 80;
var i = 0;

function typeWriter() {
  if (i <= txt.length) {
    document.getElementById("name").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
