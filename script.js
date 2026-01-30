document.addEventListener("DOMContentLoaded", () => {
    // Prevent browser from restoring scroll position
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Experience Counter Animation
    let counterInterval;
    function startCounter() {
        const counterElement = document.getElementById("exp-counter");
        if (!counterElement) return;

        // Reset
        clearInterval(counterInterval);
        counterElement.textContent = "0";

        const target = 4; // Updated to 4 based on user's HTML change "4 years"
        const duration = 1000;
        const step = 50;
        const increment = target / (duration / step);
        let current = 0;

        counterInterval = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counterInterval);
          }
          // specific formatting if needed, but Math.floor is fine for integers
          // If user wants decimal like 3.5, we might need to adjust, but looks like integer 4 now.
          // The previous target was 3. User changed text to "4 years" in index.html recently.
          // Let's assume integer 4.
          counterElement.textContent = Math.floor(current); 
          if(current < target && Math.floor(current) < target && (current + increment) >= target) {
               counterElement.textContent = target; // Ensure it hits the target exactly at end
          }
        }, step);
    }

    // SPA Routing Logic
    function router() {
      // Get the hash or default to #home
      const hash = window.location.hash || "#home";
      const sectionId = hash.substring(1); // remove '#'
  
      // Hide all sections
      document.querySelectorAll(".spa-section").forEach((section) => {
        section.style.display = "none";
      });
  
      // Show the active section
      const activeSection = document.getElementById(sectionId);
      if (activeSection) {
        activeSection.style.display = "block";
        // Force scroll to top when switching sections
        window.scrollTo(0, 0);

        // Restart animations if Home
        if (sectionId === "home") {
            startCounter();
        }

      } else {
          // Fallback to home if hash invalid
          const home = document.getElementById("home");
          if(home) {
              home.style.display = 'block';
              startCounter();
          }
      }
  
      // Update Nav Active State
      const navItems = document.querySelectorAll(".nav-links a");
      navItems.forEach((link) => {
          link.classList.remove("active");
          if(link.getAttribute("href") === hash) {
              link.classList.add("active");
          }
      });
  
      // Close Mobile Menu if open
      const navLinks = document.querySelector(".nav-links");
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }
    }
  
    // Listen for hash changes
    window.addEventListener("hashchange", router);
  
    // Run on initial load
    router();
  
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
  
    if (mobileBtn) {
      mobileBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    }
  
    // Scroll Animation - Changed to observe any visible section
    const observerOptions = {
      threshold: 0.1,
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);
  
    document.querySelectorAll(".card, .hero, h2").forEach((el) => {
      // Set initial state
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "all 0.6s ease-out";
      observer.observe(el);
    });

    // Typing Effect
    const typingElement = document.querySelector(".typing-text");
    if (typingElement) {
      const textArray = [
        "build digital experiences.",
        "provide technical solutions.",
        "design scalable architectures.",
        "engineer robust applications.",
      ];
      let textIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typeSpeed = 100;
  
      function type() {
          // Only type if Home is visible (optimization)
          const homeSection = document.getElementById("home");
          if(homeSection && homeSection.style.display === "none") {
               setTimeout(type, 500); // Check again later
               return;
          }
  
        const currentText = textArray[textIndex];
  
        if (isDeleting) {
          typingElement.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
          typeSpeed = 50;
        } else {
          typingElement.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
          typeSpeed = 100;
        }
  
        if (!isDeleting && charIndex === currentText.length) {
          isDeleting = true;
          typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % textArray.length;
          typeSpeed = 500;
        }
  
        setTimeout(type, typeSpeed);
      }
      setTimeout(type, 1000);
    }
  
    // Contact Form Handling
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const email = formData.get("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return;
        }
  
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalBtnText = submitBtn.innerText;
        
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;
  
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(Object.fromEntries(formData)),
        })
          .then(async (response) => {
            if (response.status === 200) {
              alert("Message sent successfully!");
              window.location.hash = "#home";
              contactForm.reset(); 
            } else {
              console.log("response", response);
              alert("Something went wrong! Please try again later.");
            }
          })
          .catch((error) => {
            console.log("error", error);
            alert("Something went wrong! Please try again later.");
          })
          .finally(() => {
               submitBtn.innerText = originalBtnText;
               submitBtn.disabled = false;
          });
      });
    }

    // Auto-Slide Logic for Projects
    const sliders = document.querySelectorAll(".project-slider");
    sliders.forEach((slider) => {
      // Find the next button in this slider to trigger the move
      const nextBtn = slider.querySelector(".next-btn");

      if (nextBtn) {
        setInterval(() => {
          // Only move if modal is not open (optional, but good UX)
          const modal = document.getElementById("imageModal");
          if (modal && modal.style.display !== "flex") {
            moveSlider(nextBtn, 1);
          }
        }, 3000); // 3 seconds
      }
    });
});
  
  /* Projects Slider & Modal Logic - Functions outside DOMContentLoaded needs to be globally accessible if called by onclick in HTML */
  
  // Slider Logic
  function moveSlider(btn, direction) {
    const slider = btn.parentElement;
    const wrapper = slider.querySelector(".slider-wrapper");
    const images = wrapper.querySelectorAll(".slider-img");
    const dots = slider.querySelectorAll(".dot");
  
    let currentIndex = 0;
  
    // Find current index
    dots.forEach((dot, index) => {
      if (dot.classList.contains("active")) {
        currentIndex = index;
      }
    });
  
    // Calculate new index
    let newIndex = currentIndex + direction;
  
    if (newIndex < 0) {
      newIndex = images.length - 1;
    } else if (newIndex >= images.length) {
      newIndex = 0;
    }
  
    // Update Slider Position
    wrapper.style.transform = `translateX(-${newIndex * 100}%)`;
  
    // Update Dots
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[newIndex].classList.add("active");
  }
  
  // Modal Logic
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  let currentModalImages = [];
  let currentModalIndex = 0;
  
  function openModal(imgElement) {
    modal.style.display = "flex";
    modalImg.src = imgElement.src;
  
    // Collect all images in the current slider to enable modal navigation
    const sliderWrapper = imgElement.closest(".slider-wrapper");
    currentModalImages = Array.from(
      sliderWrapper.querySelectorAll(".slider-img"),
    );
    currentModalIndex = currentModalImages.indexOf(imgElement);
  }
  
  function closeModal() {
    modal.style.display = "none";
  }
  
  function changeModalImage(direction) {
    currentModalIndex += direction;
  
    if (currentModalIndex < 0) {
      currentModalIndex = currentModalImages.length - 1;
    } else if (currentModalIndex >= currentModalImages.length) {
      currentModalIndex = 0;
    }
  
    const newImg = currentModalImages[currentModalIndex];
    modalImg.src = newImg.src;
  }
  
  // Close modal on outside click
  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  };
