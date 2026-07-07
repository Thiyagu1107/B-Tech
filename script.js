document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Navbar & Scroll Progress ---
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header shadow/blur background on scroll
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });


  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      // Change icon
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars-staggered';
      }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
      });
    });
  }


  // --- Course Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Simple entry fade animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const faqHeader = item.querySelector('.faq-header');
    const faqBody = item.querySelector('.faq-body');
    const faqIcon = item.querySelector('.faq-icon-wrapper i');

    faqHeader.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-body').style.maxHeight = null;
          otherItem.querySelector('.faq-icon-wrapper i').className = 'fa-solid fa-plus';
        }
      });

      // Toggle current FAQ
      if (!isOpen) {
        item.classList.add('open');
        faqBody.style.maxHeight = faqBody.scrollHeight + "px";
        faqIcon.className = 'fa-solid fa-xmark';
      } else {
        item.classList.remove('open');
        faqBody.style.maxHeight = null;
        faqIcon.className = 'fa-solid fa-plus';
      }
    });
  });


  // --- Testimonial Slider ---
  const slider = document.getElementById('testimonialSlider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let currentSlide = 0;
  const slideCount = slides.length;
  let autoPlayInterval;

  function updateSlider() {
    // Translate slides
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSlider();
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  if (slider && slideCount > 0) {
    // Next/Prev Clicks
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoPlay();
      startAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoPlay();
      startAutoPlay();
    });

    // Dot clicks
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
        stopAutoPlay();
        startAutoPlay();
      });
    });

    // Start autoplay initially
    startAutoPlay();
  }


  // --- Enquiry Modal & Form Submission ---
  const enquiryForm = document.getElementById('enquiryForm');
  const selectedCourseSelect = document.getElementById('selectedCourse');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const enquiryBtns = document.querySelectorAll('.btn-enquiry');

  // Trigger enquiry mapping from cards
  enquiryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCourse = btn.getAttribute('data-course');
      
      // Select corresponding option in dropdown
      if (selectedCourseSelect) {
        for (let i = 0; i < selectedCourseSelect.options.length; i++) {
          const option = selectedCourseSelect.options[i];
          if (targetCourse.includes(option.text) || option.text.includes(targetCourse)) {
            selectedCourseSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Smooth scroll to contact/enquiry section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Handle Enquiry Form Submit
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('studentName').value;
      const phone = document.getElementById('studentPhone').value;
      const course = selectedCourseSelect.value;
      const msg = document.getElementById('enquiryMessage').value;

      // Simulated local persistence
      const enquiriesList = JSON.parse(localStorage.getItem('btech_enquiries') || '[]');
      enquiriesList.push({
        name,
        phone,
        course,
        message: msg,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('btech_enquiries', JSON.stringify(enquiriesList));

      // Reset form
      enquiryForm.reset();

      // Show success modal
      if (successModal) {
        successModal.classList.add('active');
      }
    });
  }

  // Close Success Modal
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    // Close on overlay click
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }
});
