// Main script file for portfolio enhancements

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset for fixed header
        behavior: 'smooth'
      });
    });
  });
  
  // Dark/Light Mode Toggle
  function setupDarkModeToggle() {
    // Get toggle button
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    
    // Setup toggle functionality
    let darkMode = localStorage.getItem('darkMode') === 'enabled';
    
    // Initial theme setup
    if (darkMode) {
      document.body.classList.add('dark-mode');
      toggleBtn.innerHTML = '☀️';
    }
    
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      darkMode = !darkMode;
      
      // Update button icon
      toggleBtn.innerHTML = darkMode ? '☀️' : '🌙';
      
      // Save preference
      localStorage.setItem('darkMode', darkMode ? 'enabled' : 'disabled');
    });
  }
  
  // Animation for elements when they come into view
  function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Typing animation for the introduction text
  function setupTypingAnimation() {
    const element = document.querySelector('.typing-text');
    if (!element) return;
    
    const text = element.getAttribute('data-text') || element.textContent;
    element.textContent = '';
    let i = 0;
    
    function typeWriter() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }
    
    typeWriter();
  }
  
  // Initialize skills progress bars
  function initSkillBars() {
    const skills = document.querySelectorAll('.skill-progress');
    
    skills.forEach(skill => {
      const percentage = skill.getAttribute('data-progress') + '%';
      const progressBar = skill.querySelector('.progress-bar');
      
      setTimeout(() => {
        progressBar.style.width = percentage;
      }, 500);
    });
  }
  
  // Project filtering functionality
  function setupProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Show/hide projects based on filter
        projects.forEach(project => {
          if (filterValue === 'all' || project.classList.contains(filterValue)) {
            project.style.display = 'flex';
          } else {
            project.style.display = 'none';
          }
        });
      });
    });
  }
  
  // Form validation script
  function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form fields
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      // Reset validation
      resetValidation();
      
      // Validate fields
      let isValid = true;
      
      if (!nameInput.value.trim()) {
        showError(nameInput, 'name-error');
        isValid = false;
      }
      
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        showError(emailInput, 'email-error');
        isValid = false;
      }
      
      if (!messageInput.value.trim()) {
        showError(messageInput, 'message-error');
        isValid = false;
      }
      
      if (isValid) {
        // Form is valid, you can submit it
        alert('Message sent successfully!');
        contactForm.reset();
        // In a real implementation, you'd handle the form submission with AJAX or other methods
      }
    });
    
    // Validate email format
    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
    
    // Show error for invalid field
    function showError(inputElement, errorId) {
      inputElement.classList.add('invalid');
      document.getElementById(errorId).classList.add('visible');
    }
    
    // Reset all validation states
    function resetValidation() {
      const inputs = contactForm.querySelectorAll('input, textarea');
      const errors = contactForm.querySelectorAll('.error-message');
      
      inputs.forEach(input => input.classList.remove('invalid'));
      errors.forEach(error => error.classList.remove('visible'));
    }
  }
  
  // Carousel functionality for projects and certifications
  function setupCarousel(containerId, itemClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const items = container.querySelectorAll(`.${itemClass}`);
    const totalItems = items.length;
    if (totalItems <= 1) return;
    
    // Create carousel controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'carousel-controls';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev-btn';
    prevBtn.innerHTML = '&#10094;';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next-btn';
    nextBtn.innerHTML = '&#10095;';
    
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    
    // Create indicator dots
    for (let i = 0; i < totalItems; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot';
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
      
      indicators.appendChild(dot);
    }
    
    controlsDiv.appendChild(prevBtn);
    controlsDiv.appendChild(indicators);
    controlsDiv.appendChild(nextBtn);
    container.appendChild(controlsDiv);
    
    // Initialize carousel
    let currentIndex = 0;
    updateCarousel();
    
    // Setup event listeners for controls
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    });
    
    // Auto slide every 5 seconds
    let intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    }, 5000);
    
    // Pause auto-slide on hover
    container.addEventListener('mouseenter', () => {
      clearInterval(intervalId);
    });
    
    container.addEventListener('mouseleave', () => {
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }, 5000);
    });
    
    // Function to go to a specific slide
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }
    
    // Update carousel display
    function updateCarousel() {
      items.forEach((item, index) => {
        if (index === currentIndex) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
      
      // Update indicator dots
      const dots = indicators.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }
  
  // Initialize all features
  document.addEventListener('DOMContentLoaded', function() {
    // Add theme toggle button to DOM if it doesn't exist
    if (!document.getElementById('theme-toggle')) {
      const nav = document.querySelector('nav ul');
      if (nav) {
        const li = document.createElement('li');
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.innerHTML = '🌙';
        toggleBtn.style.background = 'transparent';
        toggleBtn.style.border = 'none';
        toggleBtn.style.fontSize = '1.5rem';
        toggleBtn.style.cursor = 'pointer';
        li.appendChild(toggleBtn);
        nav.appendChild(li);
      }
    }
    
    // Initialize all features
    setupDarkModeToggle();
    setupScrollAnimations();
    setupTypingAnimation();
    initSkillBars();
    setupProjectFilter();
    setupFormValidation();
    
    // Initialize carousels
    // For projects - Modify the ID to match your container
    setupCarousel('projects-carousel', 'project-card');
    
    // For certifications - Modify the ID to match your container
    setupCarousel('certifications-carousel', 'card');
  });