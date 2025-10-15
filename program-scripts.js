
// --- Swiper: Gallery slider (robust init, no jumping) ---
window.Webflow ||= [];
Webflow.push(() => {
const el = document.querySelector('.swiper.is-gallery');
if (!el) return;

// Destroy any accidental prior instance to prevent double init
if (el.swiper && typeof el.swiper.destroy === 'function') {
  el.swiper.destroy(true, true);
}

// Wait for slide images to have sizes before mounting
const imgs = [...el.querySelectorAll('.swiper-slide img')];
const waitForImages = imgs.length
  ? Promise.all(imgs.map(img => (
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise(res => {
            const onDone = () => res();
            img.addEventListener('load', onDone, { once: true });
            img.addEventListener('error', onDone, { once: true });
          })
    )))
  : Promise.resolve();

waitForImages.then(() => {
  const gallerySlider = new Swiper(el, {
    loop: true,
    loopPreventsSliding: true,
    initialSlide: 0,
    centeredSlides: true,
    slidesPerView: 2,
    speed: 800,
    grabCursor: true,
    parallax: true,
    navigation: {
      nextEl: '.button-right',
      prevEl: '.button-left',
    },
    on: {
      afterInit(swiper) {
        // Start on the first *real* slide (avoids landing on clones)
        swiper.slideToLoop(0, 0, false);
      },
      imagesReady(swiper) {
        swiper.update();
        swiper.slideToLoop(0, 0, false);
      }
    }
  });

  // Expose if you ever need to access later
  el._gallerySlider = gallerySlider;
});
});

// --- Supervisor styles (desktop alternates) ---
function handleSupervisorStyles() {
const isDesktop = window.matchMedia('(min-width: 991px)').matches;
const supervisors = document.querySelectorAll('.supervisor-list .supervisor');

if (!supervisors.length) return;

let needsIXReinit = false;

supervisors.forEach((supervisor, index) => {
  const isEven = (index + 1) % 2 === 0;
  supervisor.classList.toggle('even', isDesktop && isEven);

  const elements = {
    supervisorTitle: '.supervisor-column.text .supervisor-title',
    h4: '.supervisor-column.text .h4',
    richText: '.supervisor-column.text .rich-text',
    button: '.supervisor-column.text .button-secondary_red',
    label: '.supervisor-column.text .label',
    sideWrapper: '.supervisor-column.video-image .side-wrapper',
  };

  if (isEven) {
    supervisor.querySelectorAll(
      `${elements.supervisorTitle}, ${elements.h4}, ${elements.label}`
    ).forEach(el => {
      const toggled = el.classList.toggle('white', isDesktop);
      el.classList.toggle('default-text-color', !isDesktop && toggled);
    });

    const richText = supervisor.querySelector(elements.richText);
    if (richText) {
      const toggled = richText.classList.toggle('rich-text-white', isDesktop);
      richText.classList.toggle('rich-text', !isDesktop && toggled);
    }

    const button = supervisor.querySelector(elements.button);
    if (button) {
      const toggled = button.classList.toggle('button-secondary_red-white', isDesktop);
      button.classList.toggle('button-secondary_red', !isDesktop && toggled);
    }

    const sideWrapper = supervisor.querySelector(elements.sideWrapper);
    if (sideWrapper) {
      sideWrapper.classList.toggle('reverse-border', isDesktop);
    }

    // Mark that we changed classes that IX2 might depend on
    needsIXReinit = true;
  }
});

// Reinitialize Webflow interactions ONCE (not inside the loop)
if (needsIXReinit && window.Webflow && Webflow.require) {
  try {
    Webflow.require('ix2').init();
  } catch (_) {}
}
}

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', handleSupervisorStyles);

// --- Rooms grid alternating borders/tags ---
(function initRoomsAlternating() {
const rooms = document.querySelectorAll('.room-grid .room');
rooms.forEach((room, index) => {
  if ((index + 1) % 2 === 0) {
    const roomImageWrap = room.querySelector('.room-image-wrap');
    const roomTag = room.querySelector('.room-tag');
    if (roomImageWrap) roomImageWrap.classList.add('reverse-border');
    if (roomTag) roomTag.classList.add('reverse');
  }
});
})();

// --- Lightbox video controls ---
(function initLightboxVideo() {
const playButton = document.querySelector('.play-button');
const lightboxVideo = document.querySelector('#fullscreen-video');
const closeLightbox = document.querySelector('.close-button');

if (playButton && lightboxVideo) {
  playButton.addEventListener('click', function () {
    const videoElement = document.querySelector('video'); // adjust if needed
    if (videoElement) {
      const videoSrc = videoElement.getAttribute('src');
      lightboxVideo.setAttribute('src', videoSrc || '');
      lightboxVideo.muted = false;
      lightboxVideo.play().catch(() => {});
    }
  });
}

if (closeLightbox && lightboxVideo) {
  closeLightbox.addEventListener('click', function () {
    lightboxVideo.pause();
    lightboxVideo.muted = true;
    lightboxVideo.currentTime = 0;
  });
}
})();

// --- FAQ toggle (jQuery/Webflow) ---
$('[data-click="faq"]').on('click', function () {
if (!$(this).is('.open')) {
  $('[data-click="faq"].open').each((_, item) => item.click());
  $(this).addClass('open');
} else {
  $(this).removeClass('open');
}
});

// --- Rooms grid responsive layout for CMS counts ---
document.addEventListener("DOMContentLoaded", function () {
const cmsGrid = document.querySelector('.room-grid');
if (!cmsGrid) {
  console.error("Error: '.room-grid' not found.");
  return;
}

const applyGridStyles = () => {
  const cmsItems = cmsGrid.querySelectorAll('.w-dyn-item');
  const itemCount = cmsItems.length;

  if (window.innerWidth >= 992) {
    cmsGrid.style.display = '';
    cmsGrid.style.gridTemplateColumns = '';
    cmsGrid.style.gridTemplateRows = '';
    cmsGrid.style.justifyContent = '';

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
      if (cmsItems[3]) {
        cmsItems[3].style.gridColumn = 'span 2';
      }
    }
  } else {
    // Reset for mobile/tablet if needed
    cmsGrid.style.display = '';
    cmsGrid.style.gridTemplateColumns = '';
    cmsGrid.style.gridTemplateRows = '';
    cmsGrid.style.justifyContent = '';
    const cmsItemsAll = cmsGrid.querySelectorAll('.w-dyn-item');
    cmsItemsAll.forEach(item => (item.style.gridColumn = ''));
  }
};

applyGridStyles();
// Re-apply on resize (debounced)
let gridResizeTO;
window.addEventListener('resize', () => {
  clearTimeout(gridResizeTO);
  gridResizeTO = setTimeout(() => {
    applyGridStyles();
    handleSupervisorStyles(); // also re-check even/desktop classes at breakpoint
  }, 150);
});
});

// --- Multi-ref "Show more" ---
document.addEventListener('DOMContentLoaded', () => {
const items = document.querySelectorAll('.multi-ref-list-wrapper .w-dyn-item');
const showMoreButton = document.querySelector('.show-more-button');

const itemsToShow = 5;
let currentlyVisible = itemsToShow;

items.forEach((item, index) => {
  if (index >= itemsToShow) item.style.display = 'none';
});

if (showMoreButton) {
  showMoreButton.addEventListener('click', () => {
    const newLimit = currentlyVisible + itemsToShow;
    items.forEach((item, index) => {
      if (index < newLimit) item.style.display = 'block';
    });
    currentlyVisible = newLimit;
    if (currentlyVisible >= items.length) {
      showMoreButton.style.display = 'none';
    }
  });

  if (items.length <= itemsToShow) {
    showMoreButton.style.display = 'none';
  }
}
});
