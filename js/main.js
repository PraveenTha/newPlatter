document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    const staticFormSection = document.querySelector("#get-tuch");

    if (window.pageYOffset > 100) {
      header.classList.add("sticky");
      if (staticFormSection) {
        staticFormSection.classList.add("hide-popup");
        staticFormSection.classList.remove("show-popup");
      }
    } else {
      header.classList.remove("sticky");

      if (staticFormSection) {
        if (window.innerWidth <= 767 && !sessionStorage.getItem("popupShown")) {
          staticFormSection.classList.add("show-popup");
          staticFormSection.classList.remove("hide-popup");
          sessionStorage.setItem("popupShown", "true");
        } else if (window.innerWidth >= 991) {
          staticFormSection.classList.add("show-popup");
          staticFormSection.classList.remove("hide-popup");
        } else {
          staticFormSection.classList.add("hide-popup");
          staticFormSection.classList.remove("show-popup");
        }
      }
    }
  });

  /* Amenities sectiion */
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  let slides = Array.from(document.querySelectorAll(".swiper-slide"));
  const slideWidth = slides[0].offsetWidth;

  // Add data-slide attributes for custom numbering
  slides.forEach((slide, index) => {
    slide.setAttribute("data-slide", String(index + 1).padStart(2, "0"));
  });

  // Clone first and last slides
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.classList.add("clone");
  lastClone.classList.add("clone");

  // Append/prepend clones
  swiperWrapper.appendChild(firstClone);
  swiperWrapper.insertBefore(lastClone, slides[0]);

  let allSlides = document.querySelectorAll(".swiper-slide");
  let currentIndex = 1;

  // Initial transform
  function updateSliderPosition(animate = true) {
    swiperWrapper.style.transition = animate ? "transform 0.5s ease" : "none";
    swiperWrapper.style.transform = `translateX(-${
      currentIndex * slideWidth
    }px)`;
  }

  // Show the correct number in ::before using data-slide
  function updateSlideNumbers() {
    allSlides.forEach((slide) => {
      const number = slide.getAttribute("data-slide");
      slide.style.setProperty("--slide-number", `"${number}"`);
    });
  }

  // Initial
  updateSlideNumbers();
  updateSliderPosition(false);

  // Next button
  document
    .querySelector(".swiper-button-next")
    .addEventListener("click", () => {
      if (currentIndex >= allSlides.length - 1) return;
      currentIndex++;
      updateSliderPosition();

      setTimeout(() => {
        if (allSlides[currentIndex].classList.contains("clone")) {
          currentIndex = 1;
          updateSliderPosition(false);
        }
      }, 500);
    });

  // Prev button
  document
    .querySelector(".swiper-button-prev")
    .addEventListener("click", () => {
      if (currentIndex <= 0) return;
      currentIndex--;
      updateSliderPosition();

      setTimeout(() => {
        if (allSlides[currentIndex].classList.contains("clone")) {
          currentIndex = allSlides.length - 2;
          updateSliderPosition(false);
        }
      }, 500);
    });

  // On resize
  window.addEventListener("resize", () => {
    updateSliderPosition(false);
  });

  // Auto slide change
  let autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 4000); // Change slide every 4 seconds

  function nextSlide() {
    if (currentIndex >= allSlides.length - 1) return;
    currentIndex++;
    updateSliderPosition();

    setTimeout(() => {
      if (allSlides[currentIndex].classList.contains("clone")) {
        currentIndex = 1;
        updateSliderPosition(false);
      }
    }, 500);
  }

  // Optional: Pause auto-slide on hover
  const swiper = document.querySelector(".swiper");
  swiper.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
  swiper.addEventListener("mouseleave", () => {
    autoSlideInterval = setInterval(nextSlide, 4000);
  });

  const mainImg = document.querySelector(".gallery-img-box img");
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const thumbnails = document.querySelectorAll(".g-img img");
  let currentIndexs = 0;

  // Manual update via thumbnail click
  thumbnails.forEach((img) => {
    img.addEventListener("click", () => {
      if (mainImg && img.src) {
        mainImg.src = img.src;
        currentIndexs = Array.from(galleryItems).findIndex(
          (item) => item.src === img.src
        );
      }
    });
  });

  // Auto-update every 3 seconds
  function autoUpdateImage() {
    if (!galleryItems.length || !mainImg) return;
    mainImg.src = galleryItems[currentIndexs].src;
    currentIndexs = (currentIndexs + 1) % galleryItems.length;
  }

  // Start auto rotation
  if (galleryItems.length > 0) {
    mainImg.src = galleryItems[0].src; // Set first image
    setInterval(autoUpdateImage, 3000); // Update every 3 seconds
  }

  const toggleBtn = document.querySelector("#desktop_ham");
  const mobileMenu = document.querySelector(".menu_bar ul.menu");
  const menuItem = document.querySelectorAll(".menu_bar ul li");
  toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("close_menu");
    mobileMenu.classList.toggle("show_menu");
  });
  menuItem.forEach((item) => {
    item.addEventListener("click", () => {
      toggleBtn.classList.remove("close_menu");
      mobileMenu.classList.remove("show_menu");
    });
  });

  $(".read-mor-les").click(function () {
    $(".read-out").slideToggle(300);

    // Change text based on visibility
    if ($(".read-out").is(":visible")) {
      $(this).text("Read less");
    } else {
      $(this).text("Read more");
    }
  });
});
