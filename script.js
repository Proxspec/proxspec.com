const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const revealItems = document.querySelectorAll(".reveal");
const consultationTriggers = document.querySelectorAll(".consultation-trigger");
const requestPanel = document.querySelector("#request-form-section");
const consultationForm = document.querySelector("#consultation-request-form");
const consultationRelay = document.querySelector("#consultation-submit-relay");
const preferredContactField = document.querySelector("#preferred-contact");
const requestFormStatus = document.querySelector("#request-form-status");
const requestFormNote = document.querySelector("#request-form-note");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.classList.toggle("is-open", isOpen);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-open");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.16,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (consultationTriggers.length && requestPanel && preferredContactField) {
  consultationTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      preferredContactField.value = trigger.dataset.contactMethod === "call" ? "Call" : "Email";
      requestPanel.hidden = false;
      requestPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

if (consultationForm && consultationRelay) {
  consultationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(consultationForm);
    ["name", "organization", "email", "phone", "service", "preferred_contact", "details"].forEach((key) => {
      const relayField = consultationRelay.elements.namedItem(key);
      if (relayField) {
        relayField.value = (formData.get(key) || "").toString();
      }
    });

    if (requestFormStatus) {
      requestFormStatus.textContent = "Sending your request...";
    }

    consultationRelay.submit();

    window.setTimeout(() => {
      consultationForm.reset();
      preferredContactField.value = "Email";

      if (requestFormStatus) {
        requestFormStatus.textContent = "Your request was sent successfully.";
      }

      if (requestFormNote) {
        requestFormNote.textContent = "Your submission has been saved for follow-up.";
      }
    }, 800);
  });
}
