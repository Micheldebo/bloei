
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

function handleSupervisorStyles() {
const isDesktop = window.matchMedia('(min-width: 991px)').matches;
const supervisors = document.querySelectorAll('.supervisor-list .supervisor');

if (supervisors.length > 0) {
supervisors.forEach((supervisor, index) => {
  const isEven = (index + 1) % 2 === 0;

  supervisor.classList.toggle('even', isDesktop && isEven);

  const elements = {
    supervisorTitle: '.supervisor-column.text .supervisor-title',
    h4: '.supervisor-column.text .h4',
    richText: '.supervisor-column.text .rich-text',
    button: '.supervisor-column.text .button-secondary_red',
    label: '.supervisor-column.text .label',
    sideWrapper: '.supervisor-column.video-image .side-wrapper'
  };

  if (isEven) {
    supervisor.querySelectorAll(elements.supervisorTitle + ', ' + elements.h4 + ', ' + elements.label).forEach(el => {
      el.classList.toggle('white', isDesktop);
      el.classList.toggle('default-text-color', !isDesktop);
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
    }

    const sideWrapper = supervisor.querySelector(elements.sideWrapper);
    if (sideWrapper) {
      sideWrapper.classList.toggle('reverse-border', isDesktop);
    }

    Webflow.require('ix2').init(); // Reinitialize Webflow interactions
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

$('[data-click="faq"]').click(function(){
  if(!$(this).is('.open')){
    $('[data-click="faq"].open').each((i, item)=>{
      item.click();
    });
    $(this).addClass('open');    
  }
  else{
    $(this).removeClass('open');
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const cmsGrid = document.querySelector('.room-grid');
  const cmsItems = cmsGrid.querySelectorAll('.w-dyn-item');
  const itemCount = cmsItems.length;

  // Check if the viewport is desktop (adjust width as needed)
  if (window.innerWidth >= 992) {
    // Clear all grid styles
    cmsGrid.style.gridTemplateColumns = '';
    cmsGrid.style.justifyContent = '';

    // Apply styles based on item count
    if (itemCount === 1) {
      cmsGrid.style.display = 'flex';
      cmsGrid.style.justifyContent = 'center';
    } else if (itemCount === 2 || itemCount === 4) {
      cmsGrid.style.display = 'grid';
      cmsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (itemCount === 3 || itemCount === 6) {
      cmsGrid.style.display = 'grid';
      cmsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else if (itemCount === 5) {
      cmsGrid.style.display = 'grid';
      cmsGrid.style.gridTemplateRows = 'auto auto';
      cmsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      cmsItems[3].style.gridColumn = 'span 2';
    }
  }
});


document.addEventListener('DOMContentLoaded', () => {
const items = document.querySelectorAll('.multi-ref-list-wrapper .w-dyn-item');
const showMoreButton = document.querySelector('.show-more-button');

const itemsToShow = 5; // Number of items to show per click
let currentlyVisible = itemsToShow;

// Hide all items beyond the initial limit
items.forEach((item, index) => {
  if (index >= itemsToShow) {
    item.style.display = 'none';
  }
});

// Show more items when the button is clicked
if (showMoreButton) {
  showMoreButton.addEventListener('click', () => {
    const newLimit = currentlyVisible + itemsToShow;
    
    items.forEach((item, index) => {
      if (index < newLimit) {
        item.style.display = 'block';
      }
    });

    currentlyVisible = newLimit;

    // Hide the button if all items are visible
    if (currentlyVisible >= items.length) {
      showMoreButton.style.display = 'none';
    }
  });
}

// Hide the button if there are no extra items
if (items.length <= itemsToShow && showMoreButton) {
  showMoreButton.style.display = 'none';
}
});






