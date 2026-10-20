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


  // --- Enquiry Modal & Form Submission (Web3Forms) ---
  const enquiryForm = document.getElementById('enquiryForm');
  const selectedCourseSelect = document.getElementById('selectedCourse');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const enquiryBtns = document.querySelectorAll('.btn-enquiry');
  const studentPhoneInput = document.getElementById('studentPhone');
  const phoneError = document.getElementById('phoneError');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitBtnIcon = document.getElementById('submitBtnIcon');
  const formStatusMsg = document.getElementById('formStatusMsg');

  // Trigger enquiry mapping from cards
  enquiryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCourse = btn.getAttribute('data-course');
      
      // Select corresponding option in dropdown
      if (selectedCourseSelect && targetCourse) {
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

  // Mobile Number Validation Helpers
  function showPhoneError(message) {
    if (phoneError) {
      phoneError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
      phoneError.style.display = 'flex';
    }
    if (studentPhoneInput) {
      studentPhoneInput.classList.add('is-invalid');
      studentPhoneInput.classList.remove('is-valid');
    }
  }

  function clearPhoneError() {
    if (phoneError) {
      phoneError.textContent = '';
      phoneError.style.display = 'none';
    }
    if (studentPhoneInput) {
      studentPhoneInput.classList.remove('is-invalid');
      if (studentPhoneInput.value.trim().length === 10) {
        studentPhoneInput.classList.add('is-valid');
      } else {
        studentPhoneInput.classList.remove('is-valid');
      }
    }
  }

  function validatePhoneNumber() {
    if (!studentPhoneInput) return true;
    const phoneVal = studentPhoneInput.value.trim();

    if (!phoneVal) {
      showPhoneError('Please enter your 10-digit mobile number.');
      return false;
    }

    if (phoneVal.length !== 10 || !/^\d{10}$/.test(phoneVal)) {
      showPhoneError(`Mobile number must be exactly 10 digits (currently ${phoneVal.length} digits).`);
      return false;
    }

    if (!/^[6-9]/.test(phoneVal)) {
      showPhoneError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return false;
    }

    clearPhoneError();
    return true;
  }

  // Real-time digit filtering and formatting on phone input
  if (studentPhoneInput) {
    studentPhoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, ''); // Allow only numbers

      // Auto-strip country code prefix if pasted (+91 / 91) or leading zero (0)
      if (val.length === 12 && val.startsWith('91')) {
        val = val.slice(2);
      } else if (val.length === 11 && val.startsWith('0')) {
        val = val.slice(1);
      }

      // Restrict strictly to 10 digits
      val = val.slice(0, 10);
      e.target.value = val;

      if (val.length === 10) {
        validatePhoneNumber();
      } else {
        if (studentPhoneInput.classList.contains('is-invalid')) {
          clearPhoneError();
        }
        studentPhoneInput.classList.remove('is-valid');
      }
    });

    studentPhoneInput.addEventListener('blur', () => {
      if (studentPhoneInput.value.trim().length > 0) {
        validatePhoneNumber();
      }
    });
  }

  // Handle Enquiry Form Submit with Web3Forms AJAX
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 10-digit mobile number validation
      if (!validatePhoneNumber()) {
        if (studentPhoneInput) studentPhoneInput.focus();
        return;
      }

      // Check required fields
      const nameInput = document.getElementById('studentName');
      if (nameInput && !nameInput.value.trim()) {
        nameInput.focus();
        return;
      }

      if (selectedCourseSelect && !selectedCourseSelect.value) {
        selectedCourseSelect.focus();
        return;
      }

      // Set Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
      }
      if (submitBtnText) submitBtnText.textContent = 'Sending Enquiry...';
      if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
      if (formStatusMsg) {
        formStatusMsg.style.display = 'none';
        formStatusMsg.textContent = '';
        formStatusMsg.className = 'form-status-msg';
      }

      // Prepare payload
      const formData = new FormData(enquiryForm);
      const dataObject = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(dataObject)
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          // Backup locally in localStorage
          try {
            const enquiriesList = JSON.parse(localStorage.getItem('btech_enquiries') || '[]');
            enquiriesList.push({
              name: dataObject.name || '',
              phone: dataObject.phone || '',
              course: dataObject.course || '',
              message: dataObject.message || '',
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('btech_enquiries', JSON.stringify(enquiriesList));
          } catch (storageErr) {
            console.error('LocalStorage error:', storageErr);
          }

          // Reset form fields and validation indicators
          enquiryForm.reset();
          clearPhoneError();
          if (studentPhoneInput) {
            studentPhoneInput.classList.remove('is-valid', 'is-invalid');
          }

          // Show success modal
          if (successModal) {
            successModal.classList.add('active');
          }
        } else {
          // Display error from Web3Forms
          if (formStatusMsg) {
            formStatusMsg.textContent = result.message || 'Unable to submit enquiry. Please try again or call us directly.';
            formStatusMsg.className = 'form-status-msg error';
            formStatusMsg.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Form submission network error:', err);
        if (formStatusMsg) {
          formStatusMsg.textContent = 'Network connection issue. Please check your internet or call our office directly.';
          formStatusMsg.className = 'form-status-msg error';
          formStatusMsg.style.display = 'block';
        }
      } finally {
        // Reset button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.style.cursor = '';
        }
        if (submitBtnText) submitBtnText.textContent = 'Send Enquiry';
        if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-paper-plane';
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
