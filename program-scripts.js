
document.addEventListener('DOMContentLoaded', function() {
// Define an array of objects, each containing the class name and image URL.
var cursorElements = [
{
  className: 'button-right',
  imageUrl: 'https://cdn.prod.website-files.com/66bef0bef6cb13624d51d95b/66cedc79aeb8a340f1671630_slider-next.svg'
},
{
  className: 'button-left',
  imageUrl: 'https://cdn.prod.website-files.com/66bef0bef6cb13624d51d95b/66cedc79bc5b2155823ab0df_slider-prev.svg'
}
]; // Correctly close the array here

// Create and append the cursor image for each element.
cursorElements.forEach(function(element) {
var cursorImage = document.createElement('img');
cursorImage.src = element.imageUrl;
cursorImage.classList.add('cursor-image');
document.body.appendChild(cursorImage);

var targetX = 0;
var targetY = 0;

document.addEventListener('mousemove', function(e) {
  targetX = e.clientX;
  targetY = e.clientY;
});

function updateCursor() {
  var currentX = parseInt(cursorImage.style.left) || 0;
  var currentY = parseInt(cursorImage.style.top) || 0;
  var dx = targetX - currentX;
  var dy = targetY - currentY;
  var vx = dx * 0.3;
  var vy = dy * 0.3;

  cursorImage.style.left = currentX + vx + 'px';
  cursorImage.style.top = currentY + vy + 'px';

  requestAnimationFrame(updateCursor);
}

updateCursor();

// Add event listeners for hover effect on elements with the specified class name.
var elements = document.querySelectorAll('.' + element.className);
elements.forEach(function(el) {
  el.addEventListener('mouseenter', function() {
    cursorImage.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  el.addEventListener('mouseleave', function() {
    cursorImage.style.transform = 'translate(-50%, -50%) scale(0)';
  });
});
}); // Close the forEach loop correctly
}); // Correctly close the DOMContentLoaded function


const gallerySlider = new Swiper(".swiper.is-gallery", {
// Parameters
loop: true,
slidesPerView: 2,
centeredSlides: true,
speed: 800,
grabCursor: true,
parallax: true,
navigation: {
  nextEl: '.button-right',
  prevEl: '.button-left',
} // Close the navigation object correctly
}); // Close the Swiper initialization correctly

// Function to handle adding/removing classes based on viewport width
function handleSupervisorStyles() {
// Check if the viewport width is 991px or greater
const isDesktop = window.matchMedia('(min-width: 991px)').matches;

// Get all elements with the class .supervisor within .supervisor-list
const supervisors = document.querySelectorAll('.supervisor-list .supervisor');

// Proceed only if there is at least one supervisor element
if (supervisors.length > 0) {
  supervisors.forEach((supervisor, index) => {
    const isEven = (index + 1) % 2 === 0; // Target every second supervisor (2, 4, 6,...)

    // Toggle the .even class for every second supervisor
    supervisor.classList.toggle('even', isDesktop && isEven);

    // List of elements to modify with specific classes
    const elements = {
      supervisorTitle: '.supervisor-column.text .supervisor-title',
      h4: '.supervisor-column.text .h4',
      richText: '.supervisor-column.text .rich-text',
      button: '.supervisor-column.text .button-secondary_red',
      label: '.supervisor-column.text .label',
      sideWrapper: '.supervisor-column.video-image .side-wrapper'
    };

    // Modify classes based on desktop view and if the supervisor is even
    if (isEven) {
      supervisor.querySelectorAll(elements.supervisorTitle + ', ' + elements.h4 + ', ' + elements.label).forEach(el => {
        el.classList.toggle('white', isDesktop);
      });

      const richText = supervisor.querySelector(elements.richText);
      if (richText) {
        richText.classList.toggle('rich-text-white', isDesktop);
        richText.classList.toggle('rich-text', !isDesktop);
      }

      const button = supervisor.querySelector(elements.button);
      if (button) {
        button.classList.toggle('button-secondary_red-white', isDesktop);
        button.classList.toggle('button-secondary_red', !isDesktop);
        Webflow.require('ix2').init(); // Reinitialize Webflow interactions
      }

      const sideWrapper = supervisor.querySelector(elements.sideWrapper);
      if (sideWrapper) {
        sideWrapper.classList.toggle('reverse-border', isDesktop);
      }
    }
  });
}
}

// Call the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', handleSupervisorStyles);

// Select all the .room elements inside .room-grid
const rooms = document.querySelectorAll('.room-grid .room');

// Loop through each .room element
rooms.forEach((room, index) => {
// Check if the index is even (nth element, zero-indexed)
if ((index + 1) % 2 === 0) {
const roomImageWrap = room.querySelector('.room-image-wrap');
const roomTag = room.querySelector('.room-tag');

// Add .reverse-border to .room-image-wrap
if (roomImageWrap) {
  roomImageWrap.classList.add('reverse-border');
}

// Add .reverse to .room-tag
if (roomTag) {
  roomTag.classList.add('reverse');
}
}
});




// Get the play button and lightbox video elements
const playButton = document.querySelector('.play-button');
const lightboxVideo = document.querySelector('#fullscreen-video');
const closeLightbox = document.querySelector('.close-lightbox');

// Trigger play and unmute video when play button is clicked
playButton.addEventListener('click', function () {
const videoSrc = document.querySelector('video').getAttribute('src'); // Adjust this selector to your actual video element
lightboxVideo.setAttribute('src', videoSrc);
lightboxVideo.muted = false; // Ensure video is unmuted
lightboxVideo.play(); // Start playing the video
});

// Stop and mute the video when the close button is clicked
closeLightbox.addEventListener('click', function () {
lightboxVideo.pause(); // Pause the video
lightboxVideo.muted = true; // Mute the video
lightboxVideo.currentTime = 0; // Reset video to start (optional)
});






