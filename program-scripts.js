
/* -------------------- Swiper Gallery (loop, no jump) -------------------- */
function initGalleryLoopStable() {
  const el = document.querySelector('.swiper.is-gallery');
  if (!el) return;

  // Kill any prior instance to avoid double-init
  if (el.swiper && typeof el.swiper.destroy === 'function') {
    try { el.swiper.destroy(true, true); } catch(_) {}
  }

  // Wait for images so sizes are known (prevents reflow jumps)
  const imgs = [...el.querySelectorAll('.swiper-slide img')];
  const waitForImages = imgs.length
    ? Promise.all(imgs.map(img =>
        (img.complete && img.naturalWidth > 0)
          ? Promise.resolve()
          : new Promise(res => {
              const done = () => res();
              img.addEventListener('load', done, { once: true });
              img.addEventListener('error', done, { once: true });
            })
      ))
    : Promise.resolve();

  waitForImages.then(() => {
    const swiper = new Swiper(el, {
      // LOOP ON (with protections against jumping to clones)
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
      // Avoid index shifts from observers/resize while page settles
      updateOnWindowResize: false,
      observeParents: false,
      observer: false,
      on: {
        init(s) {
          // Start at first *real* slide and enforce after late layout changes
          s.slideToLoop(0, 0, false);
          setTimeout(() => s.slideToLoop(0, 0, false), 80);
          requestAnimationFrame(() => s.slideToLoop(0, 0, false));
        },
        imagesReady(s) {
          s.update();
          s.slideToLoop(0, 0, false);
        }
      }
    });

    // Optional: final settle if other scripts thrash layout very late
    // setTimeout(() => swiper.slideToLoop(0, 0, false), 500);

    el._gallerySlider = swiper; // expose if you ever need to access it
  });
}

/* -------------------- Supervisor styles (desktop alternates) -------------------- */
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
      if (sideWrapper) sideWrapper.classList.toggle('reverse-border', isDesktop);

      needsIXReinit = true;
    }
  });

  if (needsIXReinit && window.Webflow && Webflow.require) {
    try { Webflow.require('ix2').init(); } catch (_) {}
  }
}

/* -------------------- Rooms grid alternating borders/tags -------------------- */
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

/* -------------------- Lightbox video controls -------------------- */
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

/* -------------------- FAQ toggle (jQuery/Webflow) -------------------- */
$('[data-click="faq"]').on('click', function () {
  if (!$(this).is('.open')) {
    $('[data-click="faq"].open').each((_, item) => item.click());
    $(this).addClass('open');
  } else {
    $(this).removeClass('open');
  }
});

/* -------------------- CMS grid layout helper -------------------- */
function applyGridStyles() {
  const cmsGrid = document.querySelector('.room-grid');
  if (!cmsGrid) return;

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
      if (cmsItems[3]) cmsItems[3].style.gridColumn = 'span 2';
    }
  } else {
    cmsGrid.style.display = '';
    cmsGrid.style.gridTemplateColumns = '';
    cmsGrid.style.gridTemplateRows = '';
    cmsGrid.style.justifyContent = '';
    cmsGrid.querySelectorAll('.w-dyn-item').forEach(item => (item.style.gridColumn = ''));
  }
}

/* -------------------- Orchestrate init order -------------------- */
document.addEventListener('DOMContentLoaded', function () {
  // 1) Apply your class-based styles first
  handleSupervisorStyles();
  applyGridStyles();

  // 2) Let layout settle, then init Swiper (looping but stable)
  requestAnimationFrame(() => {
    setTimeout(() => { initGalleryLoopStable(); }, 0);
  });

  // Re-apply styles on resize (debounced). Do NOT re-init Swiper.
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      applyGridStyles();
      handleSupervisorStyles();
      // Swiper remains intact; no re-init to avoid jump
    }, 150);
  });
});

/* -------------------- Multi-ref "Show more" -------------------- */
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
      if (currentlyVisible >= items.length) showMoreButton.style.display = 'none';
    });

    if (items.length <= itemsToShow) showMoreButton.style.display = 'none';
  }
});
