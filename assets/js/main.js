/**
* Template Name: UpConstruction - v1.3.0
* Template URL: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Mobile Navigation System
   */
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');
  const navbar = document.querySelector('.navbar');
  const body = document.body;
  const mobileNavBreakpoint = window.matchMedia('(max-width: 1279px)');

  function setImportantStyle(element, styles) {
    if (!element) return;

    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value, 'important');
    });
  }

  function ensureMobileNavIcons() {
    if (mobileNavShow && !mobileNavShow.querySelector('.mobile-nav-bars')) {
      mobileNavShow.insertAdjacentHTML(
        'afterbegin',
        '<span class="mobile-nav-bars" aria-hidden="true"><span></span><span></span><span></span></span>'
      );
    }

    if (mobileNavHide && !mobileNavHide.querySelector('.mobile-nav-close-icon')) {
      mobileNavHide.insertAdjacentHTML(
        'afterbegin',
        '<span class="mobile-nav-close-icon" aria-hidden="true"><span></span><span></span></span>'
      );
    }

    const bars = mobileNavShow ? mobileNavShow.querySelector('.mobile-nav-bars') : null;
    if (bars) {
      setImportantStyle(bars, {
        display: 'block',
        position: 'relative',
        width: '22px',
        height: '16px'
      });

      bars.querySelectorAll('span').forEach((bar, index) => {
        setImportantStyle(bar, {
          display: 'block',
          position: 'absolute',
          left: '0',
          top: `${index * 7}px`,
          width: '22px',
          height: '2px',
          background: '#1a252f',
          'border-radius': '3px'
        });
      });
    }

    const closeIcon = mobileNavHide ? mobileNavHide.querySelector('.mobile-nav-close-icon') : null;
    if (closeIcon) {
      setImportantStyle(closeIcon, {
        display: 'block',
        position: 'relative',
        width: '22px',
        height: '22px'
      });

      closeIcon.querySelectorAll('span').forEach((bar, index) => {
        setImportantStyle(bar, {
          display: 'block',
          position: 'absolute',
          top: '10px',
          left: '0',
          width: '22px',
          height: '2px',
          background: '#ffffff',
          'border-radius': '3px',
          transform: index === 0 ? 'rotate(45deg)' : 'rotate(-45deg)'
        });
      });
    }
  }

  ensureMobileNavIcons();

  function setMobileNavButtonState(isOpen) {
    if (!mobileNavBreakpoint.matches) {
      setImportantStyle(mobileNavShow, {
        display: 'none',
        visibility: 'hidden',
        opacity: '0'
      });

      setImportantStyle(mobileNavHide, {
        display: 'none',
        visibility: 'hidden',
        opacity: '0'
      });

      return;
    }

    setImportantStyle(mobileNavShow, {
      display: isOpen ? 'none' : 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      visibility: isOpen ? 'hidden' : 'visible',
      opacity: isOpen ? '0' : '1',
      position: 'fixed',
      top: '8px',
      right: 'clamp(12px, calc(100vw - 382px), 96px)',
      width: '44px',
      height: '44px',
      'font-size': '0',
      background: '#ffffff',
      border: '1px solid rgba(26, 37, 47, 0.08)',
      'border-radius': '10px',
      'box-shadow': '0 6px 18px rgba(26, 37, 47, 0.16)',
      'z-index': '100008'
    });

    setImportantStyle(mobileNavHide, {
      display: isOpen ? 'flex' : 'none',
      'align-items': 'center',
      'justify-content': 'center',
      visibility: isOpen ? 'visible' : 'hidden',
      opacity: isOpen ? '1' : '0',
      position: 'fixed',
      top: '12px',
      right: 'clamp(12px, calc(100vw - 382px), 96px)',
      width: '44px',
      height: '44px',
      'font-size': '0',
      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      border: '0',
      'border-radius': '10px',
      'box-shadow': '0 6px 18px rgba(255, 107, 53, 0.28)',
      'z-index': '100008'
    });
  }

  setMobileNavButtonState(false);

  function closeContactNotification() {
    const notification = document.getElementById('contactNotification');
    const overlay = document.getElementById('notificationOverlay');

    if (notification) {
      notification.classList.remove('show');
      notification.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('show');
    body.style.overflow = '';
  }

  // Toggle mobile navigation
  function openMobileNav() {
    if (!mobileNavBreakpoint.matches) return;

    closeContactNotification();
    body.classList.add('mobile-nav-active');
    if (mobileNavShow) {
      mobileNavShow.classList.add('d-none');
      mobileNavShow.setAttribute('aria-expanded', 'true');
    }
    if (mobileNavHide) {
      mobileNavHide.classList.remove('d-none');
      mobileNavHide.setAttribute('aria-expanded', 'true');
    }
    setMobileNavButtonState(true);
  }

  function closeMobileNav() {
    body.classList.remove('mobile-nav-active');
    if (mobileNavShow) {
      mobileNavShow.classList.remove('d-none');
      mobileNavShow.setAttribute('aria-expanded', 'false');
    }
    if (mobileNavHide) {
      mobileNavHide.classList.add('d-none');
      mobileNavHide.setAttribute('aria-expanded', 'false');
    }
    setMobileNavButtonState(false);
    // Close all dropdowns when closing nav
    document.querySelectorAll('.navbar .dropdown').forEach(dropdown => {
      dropdown.classList.remove('dropdown-active');
      const indicator = dropdown.querySelector('.dropdown-indicator');
      if (indicator) {
        indicator.classList.remove('bi-chevron-up');
        indicator.classList.add('bi-chevron-down');
      }
    });
  }

  function handleMobileNavBreakpointChange() {
    if (!mobileNavBreakpoint.matches) {
      body.classList.remove('mobile-nav-active');
    }

    setMobileNavButtonState(false);
  }

  if (typeof mobileNavBreakpoint.addEventListener === 'function') {
    mobileNavBreakpoint.addEventListener('change', handleMobileNavBreakpointChange);
  } else if (typeof mobileNavBreakpoint.addListener === 'function') {
    mobileNavBreakpoint.addListener(handleMobileNavBreakpointChange);
  }

  // Event listeners for mobile nav toggle buttons
  if (mobileNavShow) {
    mobileNavShow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMobileNav();
    });

    mobileNavShow.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMobileNav();
      }
    });
  }

  if (mobileNavHide) {
    mobileNavHide.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMobileNav();
    });

    mobileNavHide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeMobileNav();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!body.classList.contains('mobile-nav-active')) return;

    const clickedInsideNavbar = navbar && navbar.contains(e.target);
    const clickedToggle = e.target.closest('.mobile-nav-toggle');

    if (!clickedInsideNavbar && !clickedToggle) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('mobile-nav-active')) {
      closeMobileNav();
    }
  });

  // Handle dropdown toggles in mobile nav (only for parent dropdown links)
  // Track last toggle time to prevent double-firing on mobile (touch + click)
  let lastDropdownToggle = 0;
  
  document.querySelectorAll('.navbar .dropdown > a').forEach(dropdownLink => {
    // Prevent the default anchor behavior completely on mobile
    dropdownLink.addEventListener('click', function(e) {
      // Check if we're on mobile
      if (body.classList.contains('mobile-nav-active')) {
        // Debounce - prevent double-firing on touch devices
        const now = Date.now();
        if (now - lastDropdownToggle < 300) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        lastDropdownToggle = now;
        
        // This is a dropdown parent link - prevent navigation and toggle dropdown
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const parentDropdown = this.parentElement;
        const indicator = this.querySelector('.dropdown-indicator');
        
        // Toggle current dropdown
        if (parentDropdown.classList.contains('dropdown-active')) {
          parentDropdown.classList.remove('dropdown-active');
          if (indicator) {
            indicator.classList.remove('bi-chevron-up');
            indicator.classList.add('bi-chevron-down');
          }
        } else {
          parentDropdown.classList.add('dropdown-active');
          if (indicator) {
            indicator.classList.remove('bi-chevron-down');
            indicator.classList.add('bi-chevron-up');
          }
        }
        
        return false;
      }
    }, true); // Use capture phase
  });

  // Handle clicks on regular nav links (NOT dropdown parents) - allow normal navigation
  document.querySelectorAll('.navbar > ul > li:not(.dropdown) > a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (body.classList.contains('mobile-nav-active')) {
        closeMobileNav();
      }
      // Allow the default link behavior - browser will navigate
    });
  });

  // Handle clicks on dropdown menu items - allow normal navigation
  document.querySelectorAll('.navbar .dropdown ul a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (body.classList.contains('mobile-nav-active')) {
        closeMobileNav();
      }
      // Allow the default link behavior - browser will navigate
    });
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined' && document.querySelector('.glightbox')) {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Porfolio isotope and filter
   */
  let portfolionIsotope = document.querySelector('.portfolio-isotope');

  if (portfolionIsotope) {

    let portfolioFilter = portfolionIsotope.getAttribute('data-portfolio-filter') ? portfolionIsotope.getAttribute('data-portfolio-filter') : '*';
    let portfolioLayout = portfolionIsotope.getAttribute('data-portfolio-layout') ? portfolionIsotope.getAttribute('data-portfolio-layout') : 'masonry';
    let portfolioSort = portfolionIsotope.getAttribute('data-portfolio-sort') ? portfolionIsotope.getAttribute('data-portfolio-sort') : 'original-order';

    window.addEventListener('load', () => {
      const portfolioContainer = document.querySelector('.portfolio-container');
      if (!portfolioContainer || typeof Isotope === 'undefined') {
        return;
      }

      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: portfolioLayout,
        filter: portfolioFilter,
        sortBy: portfolioSort
      });

      let menuFilters = document.querySelectorAll('.portfolio-isotope .portfolio-flters li');
      menuFilters.forEach(function(el) {
        el.addEventListener('click', function() {
          document.querySelector('.portfolio-isotope .portfolio-flters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aos_init === 'function') {
            aos_init();
          }
        }, false);
      });

    });

  }

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  if (typeof Swiper !== 'undefined' && document.querySelector('.slides-1')) {
    new Swiper('.slides-1', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });
  }

  /**
   * Init swiper slider with 2 slides at once in desktop view
   */
  if (typeof Swiper !== 'undefined' && document.querySelector('.slides-2')) {
    new Swiper('.slides-2', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },

        1200: {
          slidesPerView: 2,
          spaceBetween: 20
        }
      }
    });
  }

  /**
   * Initiate pURE cOUNTER
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Animation on scroll function and init
   */
  /**
   * Projects Section Functionality
   */
  
  // Image Carousel for Project Cards with Auto-rotation
  function initProjectCarousels() {
    const projectCards = document.querySelectorAll('.project-card-modern');
    
    projectCards.forEach((card, cardIndex) => {
      const images = card.querySelectorAll('.image-carousel img');
      if (images.length <= 1) return;
      
      let currentIndex = 0;
      let autoInterval;
      let hoverInterval;
      
      function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
      }
      
      function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      }
      
      // Start automatic rotation immediately with staggered timing
      function startAutoRotation() {
        autoInterval = setInterval(nextImage, 3000 + (cardIndex * 500)); // Stagger by 500ms per card
      }
      
      // Faster rotation on hover
      function startHoverRotation() {
        clearInterval(autoInterval);
        hoverInterval = setInterval(nextImage, 1200);
      }
      
      function stopHoverRotation() {
        clearInterval(hoverInterval);
        startAutoRotation();
      }
      
      // Initialize auto-rotation
      startAutoRotation();
      
      // Hover events for faster rotation
      card.addEventListener('mouseenter', startHoverRotation);
      card.addEventListener('mouseleave', stopHoverRotation);
      
      // Pause auto-rotation when page is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearInterval(autoInterval);
          clearInterval(hoverInterval);
        } else {
          startAutoRotation();
        }
      });
    });
  }
  
  // Filter Functionality
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn-modern');
    const projectCards = document.querySelectorAll('.project-card-modern');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach((card, index) => {
          if (filter === '*' || card.classList.contains(filter.substring(1))) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, index * 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
  
  // Initialize projects functionality
  if (document.querySelector('.projects-section-modern')) {
    initProjectCarousels();
    initProjectFilters();
  }

  function aos_init() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'slide',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', () => {
    aos_init();
  });

});
