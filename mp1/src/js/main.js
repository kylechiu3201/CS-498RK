/* Your JS here. */

// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "20px 10px";
    document.getElementById("logo").style.fontSize = "25px";
  } else {
    document.getElementById("navbar").style.padding = "65px 10px";
    document.getElementById("logo").style.fontSize = "35px";
  }
}

var slideIndex = 1;
showSlides(slideIndex);
navbar_highlight(0);

document.getElementById("prev").addEventListener("click", function() {plusSlides(-1);}, false);
document.getElementById("next").addEventListener("click", function() {plusSlides(1);}, false);
document.getElementById("dot1").addEventListener("click", function() {currentSlide(1);}, false);
document.getElementById("dot2").addEventListener("click", function() {currentSlide(2);}, false);
document.getElementById("dot3").addEventListener("click", function() {currentSlide(3);}, false);

document.getElementById("nav0").addEventListener("click", function() {navbar_highlight(0);}, false);
document.getElementById("nav1").addEventListener("click", function() {navbar_highlight(1);}, false);
document.getElementById("nav2").addEventListener("click", function() {navbar_highlight(2);}, false);
document.getElementById("nav3").addEventListener("click", function() {navbar_highlight(3);}, false);
document.getElementById("nav4").addEventListener("click", function() {navbar_highlight(4);}, false);
document.getElementById("nav5").addEventListener("click", function() {navbar_highlight(5);}, false);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

function navbar_highlight(n) {
    var i;
    var choices = document.getElementsByClassName("navbar");
    console.log(choices.length);
    for (i = 0; i < choices.length; i++) {
        choices[i].className = choices[i].className.replace(" active", "");
    }
    choices[n].className += " active";
}



// Get the modal
var m1 = document.getElementById("m1");
var m2 = document.getElementById("m2");
var m3 = document.getElementById("m3");

// Get the button that opens the modal
var b1 = document.getElementById("b1");
var b2 = document.getElementById("b2");
var b3 = document.getElementById("b3");

// Get the <span> element that closes the modal
var s1 = document.getElementsByClassName("close")[0];
var s2 = document.getElementsByClassName("close")[1];
var s3 = document.getElementsByClassName("close")[2];

// When the user clicks on the button, open the modal
b1.onclick = function() {
  m1.style.display = "block";
}
b2.onclick = function() {
  m2.style.display = "block";
}
b3.onclick = function() {
  m3.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
s1.onclick = function() {
  m1.style.display = "none";
}
s2.onclick = function() {
  m2.style.display = "none";
}
s3.onclick = function() {
  m3.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == m1) {
    m1.style.display = "none";
  }
  else if(event.target == m2) {
	m2.style.display = "none";
  }
  else if(event.target == m3) {
	m3.style.display = "none";
  }
}

var home = document.getElementsById("home");
var dogs = document.getElementsById("dogs");
var myhero = document.getElementsById("myhero");
var about = document.getElementsById("about");