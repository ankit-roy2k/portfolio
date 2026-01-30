document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navItems = document.querySelectorAll(".nav-links a");

  navItems.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  // Scroll Animation for elements
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
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
  });

  // Experience Counter Animation
  const counterElement = document.getElementById("exp-counter");
  if (counterElement) {
    const target = 3;
    const duration = 1000; // 1 seconds
    const step = 50; // Update every 50ms
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counterElement.textContent = Math.floor(current);
    }, step);
  }
});

/* Projects Slider & Modal Logic */
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

// Auto-Slide Logic for Projects
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".project-slider");

  sliders.forEach((slider) => {
    // Find the next button in this slider to trigger the move
    const nextBtn = slider.querySelector(".next-btn");

    if (nextBtn) {
      setInterval(() => {
        // Only move if modal is not open (optional, but good UX)
        if (document.getElementById("imageModal").style.display !== "flex") {
          moveSlider(nextBtn, 1);
        }
      }, 3000); // 3 seconds
    }
  });

  // Typing Effect Logic
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
      const currentText = textArray[textIndex];

      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Faster when deleting
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Normal typing speed
      }

      if (!isDeleting && charIndex === currentText.length) {
        // Finished typing word, pause before deleting
        isDeleting = true;
        typeSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next word
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    // Start the typing loop
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
            window.location.href = "index.html";
          } else {
            console.log("response", response);
            alert("Something went wrong! Please try again later.");
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
          }
        })
        .catch((error) => {
          console.log("error", error);
          alert("Something went wrong! Please try again later.");
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }
});
