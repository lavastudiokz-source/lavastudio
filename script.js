document.addEventListener("DOMContentLoaded", function () {
  /* Vertical image slider */
  const slideshow = document.querySelector(".slideshow");
  const track = document.querySelector(".slideshow-track");

  if (slideshow && track) {
    let offset = 0;
    const speed = 0.22;

    const originalSlides = Array.from(track.children).filter(function (item) {
      return item.classList.contains("slide") && !item.classList.contains("slide-clone");
    });

    track.querySelectorAll(".slide-clone").forEach(function (clone) {
      clone.remove();
    });

    originalSlides.forEach(function (slide) {
      const clone = slide.cloneNode(true);
      clone.classList.add("slide-clone");
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    function setSlideHeights() {
      const sliderHeight = slideshow.clientHeight;
      const slides = track.querySelectorAll(".slide");

      slides.forEach(function (slide) {
        slide.style.height = sliderHeight + "px";
      });
    }

    function getResetPoint() {
      return originalSlides.reduce(function (total, slide) {
        return total + slide.offsetHeight;
      }, 0);
    }

    function animateSlider() {
      const resetPoint = getResetPoint();
      offset += speed;

      if (offset >= resetPoint) {
        offset = 0;
      }

      track.style.transform = "translateY(-" + offset + "px)";
      requestAnimationFrame(animateSlider);
    }

    setSlideHeights();
    window.addEventListener("resize", function () {
      offset = 0;
      setSlideHeights();
    });
    animateSlider();
  }

  /* Project access demo */
  const projectIdInput = document.getElementById("projectId");
  const projectPinInput = document.getElementById("projectPin");
  const projectSearchButton = document.getElementById("projectSearchButton");
  const projectDashboard = document.getElementById("projectDashboard");
  const projectError = document.getElementById("projectError");
  const dashboardProjectId = document.getElementById("dashboardProjectId");
  const projectEmptyState = document.getElementById("projectEmptyState");

  function formatProjectId(value) {
    const digits = String(value || "").replace(/[^0-9]/g, "").slice(0, 12);
    const groups = [];

    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }

    return groups.length ? "Lava-" + groups.join("-") : "Lava-";
  }

  function moveCursorToEnd(input) {
    requestAnimationFrame(function () {
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }

  if (projectIdInput) {
    projectIdInput.value = "Lava-";

    projectIdInput.addEventListener("focus", function () {
      if (!projectIdInput.value || !projectIdInput.value.startsWith("Lava-")) {
        projectIdInput.value = "Lava-";
      }
      moveCursorToEnd(projectIdInput);
    });

    projectIdInput.addEventListener("input", function () {
      projectIdInput.value = formatProjectId(projectIdInput.value);
      moveCursorToEnd(projectIdInput);
    });
  }

  if (projectPinInput) {
    projectPinInput.addEventListener("input", function () {
      projectPinInput.value = projectPinInput.value.replace(/[^0-9]/g, "").slice(0, 4);
    });
  }

  function openProjectDemo() {
    if (!projectIdInput || !projectPinInput) return;

    const cleanId = projectIdInput.value.replace(/[^0-9]/g, "");
    const pin = projectPinInput.value;

    if (cleanId === "000000000000" && pin === "1234") {
      if (projectError) projectError.style.display = "none";
      if (dashboardProjectId) dashboardProjectId.textContent = "Lava-0000-0000-0000";
      if (projectDashboard) projectDashboard.classList.add("is-visible");
      if (projectEmptyState) projectEmptyState.classList.add("is-hidden");
    } else {
      if (projectDashboard) projectDashboard.classList.remove("is-visible");
      if (projectEmptyState) projectEmptyState.classList.remove("is-hidden");
      if (projectError) projectError.style.display = "block";
    }
  }

  if (projectSearchButton) {
    projectSearchButton.addEventListener("click", openProjectDemo);
  }

  [projectIdInput, projectPinInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        openProjectDemo();
      }
    });
  });

  /* Contact notice modal */
  const noticeModal = document.getElementById("noticeModal");
  const noticeOk = document.getElementById("noticeOk");

  if (noticeModal && noticeOk) {
    document.body.classList.add("modal-open");

    noticeOk.addEventListener("click", function () {
      document.body.classList.remove("modal-open");
      noticeModal.setAttribute("aria-hidden", "true");
    });
  }
});