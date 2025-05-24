document.addEventListener("DOMContentLoaded", function () {
  window.AgentInfo = {
    vAgentID: "0000",
    vProject: "Project name",
    vURL: window.location.href,
    thankspageurl: "/thanks.htm",
  };

  const popUp = document.getElementById("popUpGetTuch");
  const formMappings = {
    popup: {
      name: document.querySelector(".name-input"),
      email: document.querySelector(".email-input"),
      phone: document.querySelector(".phone-input"),
      message: document.querySelector(".message-input"),
      nameLabel: document.querySelector(".name-label"),
      emailLabel: document.querySelector(".email-label"),
      phoneLabel: document.querySelector(".phone-label"),
      messageLabel: document.querySelector(".message-label"),
      submit: document.querySelector(".submit-button"),
    },
    default: {
      name: document.getElementById("name_Default"),
      email: document.getElementById("email_Default"),
      phone: document.getElementById("phone_Default"),
      message: document.getElementById("message_Default"),
      submit: document.getElementById("submit_Default"),
    },
  };

  function showError(inputElement, message) {
    clearError(inputElement);
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-msg";
    errorSpan.style.color = "red";
    errorSpan.style.fontSize = "12px";
    errorSpan.textContent = message;
    inputElement.parentNode.appendChild(errorSpan);
  }

  function clearError(inputElement) {
    const existingError = inputElement.parentNode.querySelector(".error-msg");
    if (existingError) {
      existingError.remove();
    }
  }

  function validateFieldOnInput(inputElement, pattern, errorMessage) {
    inputElement.addEventListener("input", () => {
      if (pattern.test(inputElement.value.trim())) {
        clearError(inputElement);
      } else {
        showError(inputElement, errorMessage);
      }
    });
  }

  function attachSubmitHandler(formKey, suffix) {
    const form = formMappings[formKey];
    const { name, email, phone, message, submit } = form;

    if (!name || !email || !phone || !message || !submit) {
      console.error(`Form elements missing for form key: ${formKey}`);
      return;
    }

    const FormInfo = {
      SenderControlID: name.id,
      SenderControlMobileID: phone.id,
      SenderControlEmailID: email.id,
      SenderControlMsgID: message.id,
    };

    // Apply validation to all forms (popup and default)
    validateFieldOnInput(name, /.+/, "Name is required.");
    validateFieldOnInput(
      email,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Enter a valid email address."
    );
    validateFieldOnInput(
      phone,
      /^[0-9]{10}$/,
      "Enter a valid 10-digit phone number."
    );
    validateFieldOnInput(message, /.+/, "Enter Message");

    submit.onclick = function (e) {
      e.preventDefault();

      clearError(name);
      clearError(email);
      clearError(phone);
      clearError(message);

      let isValid = true;

      if (!name.value.trim()) {
        showError(name, "Name is required.");
        isValid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        showError(email, "Enter a valid email address.");
        isValid = false;
      }

      const phonePattern = /^[0-9]{10}$/;
      if (!phone.value.trim() || !phonePattern.test(phone.value.trim())) {
        showError(phone, "Enter a valid 10-digit phone number.");
        isValid = false;
      }

      if (!message.value.trim()) {
        showError(message, "Enter Message");
        isValid = false;
      }

      if (!isValid) return;

      if (typeof SubmitQueryData === "function") {
        SubmitQueryData(window.AgentInfo, FormInfo);
        if (formKey === "popup") {
          setTimeout(() => {
            popUp.style.display = "none";
            popUp.classList.add("display-n");
          }, 1000);
        }
      } else {
        alert("Form script not available.");
      }
    };

    submit.id = `submit_${suffix}`;
    submit.name = `submit_${suffix}`;
    submit.textContent = "Submit";
  }

  function populatePopupFromCard(card, suffix) {
    const projectName = card.querySelector(".card_head")?.textContent.trim();
    const projectLocation = card
      .querySelector(".card_loctaion")
      ?.textContent.trim();
    const projectTypo = card.querySelector(".card_type")?.textContent.trim();
    const projectPrising = card
      .querySelector(".card_price")
      ?.textContent.trim();
    const projectStatus = card
      .querySelector(".card_status")
      ?.textContent.trim();
    const projectImage = card.querySelector("img")?.getAttribute("src");

    window.AgentInfo.vProject = projectName || "Project name";
    window.AgentInfo.vURL = window.location.href;

    popUp.style.display = "block";
    popUp.classList.remove("display-n");

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el && value) el.textContent = value;
    };
    const setImage = (id, src) => {
      const img = document.getElementById(id);
      if (img && src) img.src = src;
    };

    setText("popupProjectName", projectName);
    setText("popupProjectLoctaion", projectLocation);
    setText("popupProjectTypo", projectTypo);
    setText("popupProjectPrice", projectPrising);
    setText("popupProjectStatus", projectStatus);
    setImage("popupProjectImage", projectImage);

    const form = formMappings.popup;
    form.name.id = `name_${suffix}`;
    form.email.id = `email_${suffix}`;
    form.phone.id = `phone_${suffix}`;
    form.message.id = `message_${suffix}`;

    form.nameLabel.setAttribute("for", form.name.id);
    form.emailLabel.setAttribute("for", form.email.id);
    form.phoneLabel.setAttribute("for", form.phone.id);
    form.messageLabel.setAttribute("for", form.message.id);

    if (typeof SubmitQueryData === "function") {
      attachSubmitHandler("popup", suffix);
    } else {
      const script = document.createElement("script");
      script.id = "queryform-script";
      script.src = `https://api2.gtftech.com/scripts/queryform.min.ssl.js?v=${new Date().getTime()}`;
      script.onload = () => attachSubmitHandler("popup", suffix);
      document.body.appendChild(script);
    }
  }

  // Open popup buttons
  const openPopup = document.querySelectorAll(".open_popup");
  const closPopup = document.querySelector("#clsPop");

  openPopup.forEach((button) => {
    button.addEventListener("click", () => {
      const projectId = button.getAttribute("data-project-id") || "popup";
      const card = button.closest(".cards");
      if (card) populatePopupFromCard(card, projectId);
    });
  });

  // Close popup
  if (closPopup) {
    closPopup.addEventListener("click", () => {
      popUp.style.display = "none";
      popUp.classList.add("display-n");
    });
  }

  // Default project open on delay
  const defaultCard = document.getElementById("project_plater");
  const defaultBtn = document.getElementById("defaultPopupTrigger");

  if (defaultBtn && defaultCard) {
    defaultBtn.addEventListener("click", () => {
      populatePopupFromCard(defaultCard, "defaultProject");
    });

    window.addEventListener("load", () => {
      setTimeout(() => defaultBtn.click(), 3000);
    });
  }

  // Static form (Get in Touch) setup
  if (typeof SubmitQueryData === "function") {
    attachSubmitHandler("default", "Default");
  } else {
    const script = document.createElement("script");
    script.id = "queryform-script";
    script.src = `https://api2.gtftech.com/scripts/queryform.min.ssl.js?v=${new Date().getTime()}`;
    script.onload = () => attachSubmitHandler("default", "Default");
    document.body.appendChild(script);
  }
});
