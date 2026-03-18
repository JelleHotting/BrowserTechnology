import { bsnFeedback, bsnField, form } from "./elements.js";
import {
  isVisible,
  isValidBsnElfproef,
  syncVisibleRequiredFields,
} from "./helpers.js";

const bsnLengthErrorMessage =
  "Voer een BSN van 9 cijfers in (zonder spaties of punten).";
const bsnElfproefErrorMessage =
  "Dit BSN lijkt niet te kloppen. Controleer de 9 cijfers.";

export function updateBsnElfproefValidity() {
  if (!bsnField) {
    return;
  }

  const bsn = bsnField.value.trim();
  const hasNineDigits = /^\d{9}$/.test(bsn);

  bsnField.dataset.cssValidationOff = hasNineDigits ? "true" : "false";

  if (!hasNineDigits) {
    bsnField.setCustomValidity("");
    bsnField.classList.remove("input-valid", "input-invalid");

    if (bsnFeedback) {
      bsnFeedback.textContent = bsnLengthErrorMessage;
      bsnFeedback.classList.remove("invalid");
    }

    return;
  }

  if (!isValidBsnElfproef(bsn)) {
    bsnField.setCustomValidity(bsnElfproefErrorMessage);
    bsnField.classList.add("input-invalid");
    bsnField.classList.remove("input-valid");

    if (bsnFeedback) {
      bsnFeedback.textContent = bsnElfproefErrorMessage;
      bsnFeedback.classList.add("invalid");
      bsnFeedback.classList.remove("valid");
    }

    return;
  }

  bsnField.setCustomValidity("");
  bsnField.classList.add("input-valid");
  bsnField.classList.remove("input-invalid");

  if (bsnFeedback) {
    bsnFeedback.textContent = bsnLengthErrorMessage;
    bsnFeedback.classList.remove("invalid");
  }
}

function showFieldError(field) {
  if (field.type === "radio") {
    const fieldset = field.closest("fieldset");
    const feedback = fieldset?.querySelector(".validation-feedback");

    if (feedback) {
      feedback.textContent = "Maak een keuze.";
      feedback.classList.add("invalid");
      feedback.classList.remove("valid");
    }

    field.focus();
    return;
  }

  field.classList.add("input-invalid");
  field.classList.remove("input-valid");

  const feedback =
    field.nextElementSibling?.classList.contains("validation-feedback")
      ? field.nextElementSibling
      : field.closest("label, fieldset")?.querySelector(".validation-feedback");

  if (feedback) {
    feedback.textContent = field.validationMessage;
    feedback.classList.add("invalid");
    feedback.classList.remove("valid");
  }

  field.focus();
}

function clearRadioFieldError(radioField) {
  const fieldset = radioField.closest("fieldset");
  const feedback = fieldset?.querySelector(".validation-feedback");

  if (feedback) {
    feedback.classList.remove("invalid");
  }
}

function validateVisibleRequiredRadioGroups() {
  if (!form) {
    return true;
  }

  const visibleRequiredRadios = form.querySelectorAll(
    'input[type="radio"][required]'
  );
  const validatedGroups = new Set();

  for (let radioIndex = 0; radioIndex < visibleRequiredRadios.length; radioIndex += 1) {
    const radio = visibleRequiredRadios[radioIndex];

    if (!isVisible(radio) || !radio.name || validatedGroups.has(radio.name)) {
      continue;
    }

    validatedGroups.add(radio.name);

    const group = form.querySelectorAll(
      `input[type="radio"][name="${radio.name}"]`
    );

    let hasVisibleSelection = false;

    for (let groupIndex = 0; groupIndex < group.length; groupIndex += 1) {
      if (isVisible(group[groupIndex]) && group[groupIndex].checked) {
        hasVisibleSelection = true;
        break;
      }
    }

    if (!hasVisibleSelection) {
      showFieldError(radio);
      return false;
    }
  }

  return true;
}

function validateVisibleRequiredFields() {
  if (!form) {
    return true;
  }

  syncVisibleRequiredFields();
  updateBsnElfproefValidity();

  if (!validateVisibleRequiredRadioGroups()) {
    return false;
  }

  const requiredFields = form.querySelectorAll("[required]");

  for (let fieldIndex = 0; fieldIndex < requiredFields.length; fieldIndex += 1) {
    const field = requiredFields[fieldIndex];

    if (!isVisible(field) || field.type === "radio") {
      continue;
    }

    if (!field.checkValidity()) {
      showFieldError(field);
      return false;
    }
  }

  return true;
}

export function bindStepValidation() {
  if (!form) {
    return;
  }

  if (bsnField) {
    bsnField.addEventListener("input", updateBsnElfproefValidity);
    bsnField.addEventListener("blur", updateBsnElfproefValidity);
  }

  const requiredRadios = form.querySelectorAll('input[type="radio"][required]');

  for (let radioIndex = 0; radioIndex < requiredRadios.length; radioIndex += 1) {
    requiredRadios[radioIndex].addEventListener("change", function (event) {
      if (event.target.checked) {
        clearRadioFieldError(event.target);
      }
    });
  }

  form.addEventListener("submit", function (event) {
    const isValidStep = validateVisibleRequiredFields();

    event.preventDefault();

    if (!isValidStep) {
      return;
    }

    window.location.href = "formulier2.html";
  });
}