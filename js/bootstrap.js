var carousels = document.querySelectorAll('[data-ride="carousel"]');
for (var i = 0; i < carousels.length; i++) {
  var carousel = carousels[i];
  var interval = parseInt(carousel.getAttribute('data-interval')) || 5000;

  var items = carousel.querySelectorAll('.item');
  var activeIndex = 0;
  var isPaused = false;

  function showSlide(index) {
    items[activeIndex].classList.remove('active');
    activeIndex = index;
    items[activeIndex].classList.add('active');
  }

  function showNextSlide() {
    var nextIndex = (activeIndex + 1) % items.length;
    showSlide(nextIndex);
  }

  function showPrevSlide() {
    var prevIndex = (activeIndex - 1 + items.length) % items.length;
    showSlide(prevIndex);
  }

  var intervalId = setInterval(function () {
    if (!isPaused) {
      showNextSlide();
    }
  }, interval);

  carousel.addEventListener('mouseenter', function () {
    isPaused = true;
  });

  carousel.addEventListener('mouseleave', function () {
    isPaused = false;
  });

  var controls = carousel.querySelectorAll('[data-slide]');
  for (var j = 0; j < controls.length; j++) {
    controls[j].addEventListener('click', function () {
      var action = this.getAttribute('data-slide');
      if (action === 'prev') {
        showPrevSlide();
      } else if (action === 'next') {
        showNextSlide();
      } else {
        var index = parseInt(action);
        if (!isNaN(index)) {
          showSlide(index);
        }
      }
    });
  }
}

// var navbarToggle = document.querySelector('.navbar-toggle');
// var navbarCollapse = document.querySelector('.navbar-collapse');

// navbarToggle.addEventListener('click', function() {
//   if (navbarCollapse.classList.contains('in')) {
//     navbarCollapse.classList.remove('in');
//   } else {
//     navbarCollapse.classList.add('in');
//   }
// });
$(document).ready(function() {
  $(".navbar-toggle").on("click", function() {
    $("#navbar").toggleClass("in");
  });
});