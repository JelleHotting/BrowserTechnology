// ==============================
// DOM-elementen ophalen
// ==============================
const form = document.querySelector("form");
const bsnField = document.querySelector("#bsn-field");
const bsnFeedback = document.querySelector("#bsn-error");
const maritalAgreementSection = document.querySelector(".marital-agreement");
const finalSettlementSection = document.querySelector(".final-settlement");
const childrenInfoSection = document.querySelector(".children-info");
const deceasedChildInfoSection = document.querySelector(".deceased-child-info");
const grandchildrenInfoSection = document.querySelector(".grandchildren-info");
const testamentInfoSection = document.querySelector(".testament-info");
const notaryInfoSection = document.querySelector(".notary-info");

// ==============================
// Constanten
// ==============================
const visibilityUpdateDelay = 50;
const bsnLengthErrorMessage = "Voer een BSN van 9 cijfers in (zonder spaties of punten).";
const bsnElfproefErrorMessage = "Dit BSN lijkt niet te kloppen. Controleer de 9 cijfers.";

const routingRules = [
  {
    selector: 'input[name="maritalStatus"]',
    targetSectionByValue: {
      ja: maritalAgreementSection,
      nee: childrenInfoSection,
    },
  },
  {
    selector: 'input[name="maritalAgreement"]',
    defaultTargetSection: finalSettlementSection,
  },
  {
    selector: 'input[name="finalSettlement"]',
    defaultTargetSection: childrenInfoSection,
  },
  {
    selector: 'input[name="children"]',
    targetSectionByValue: {
      ja: deceasedChildInfoSection,
      nee: testamentInfoSection,
    },
  },
  {
    selector: 'input[name="deceasedChild"]',
    targetSectionByValue: {
      ja: grandchildrenInfoSection,
      nee: testamentInfoSection,
    },
  },
  {
    selector: 'input[name="deceasedChildGrandchildren"]',
    defaultTargetSection: testamentInfoSection,
  },
  {
    selector: 'input[name="testament"]',
    targetSectionByValue: {
      ja: notaryInfoSection,
    },
  },
];

// ==============================
// Hulpfuncties
// ==============================

// Geeft terug of een element zichtbaar is in de pagina.
function isVisible(element) {
  return Boolean(element && element.getClientRects().length);
}

// Bron (APA): GitHub Copilot. (2026, 10 maart). Antwoorden op prompts over
// formuliervalidatie [Large language model output]. OpenAI.
// Toegepast op de required-logica: alleen zichtbare velden blijven verplicht.
function rememberOriginalRequiredFields() {
  if (!form) {
    return;
  }

  const requiredFields = form.querySelectorAll("[required]");

  for (let i = 0; i < requiredFields.length; i++) {
    requiredFields[i].dataset.originalRequired = "true";
  }
}

function syncVisibleRequiredFields() {
  if (!form) {
    return;
  }

  const originalRequiredFields = form.querySelectorAll(
    '[data-original-required="true"]'
  );

  for (let i = 0; i < originalRequiredFields.length; i++) {
    const field = originalRequiredFields[i];
    field.required = isVisible(field);
  }
}

// Controleert een BSN met de elfproef.
function isValidBsnElfproef(bsn) {
  if (!/^\d{9}$/.test(bsn)) {
    return false;
  }

  if (bsn.length !== 9) {
    return false;
  }

  let checksum = 0;

  for (let i = 0; i < 8; i++) {
    checksum += Number(bsn[i]) * (9 - i);
  }

  checksum -= Number(bsn[8]);

  return checksum % 11 === 0;
}

function updateBsnElfproefValidity() {
  if (!bsnField) {
    return;
  }

  const bsn = bsnField.value.trim();
  const hasNineDigits = /^\d{9}$/.test(bsn);

  // Zodra er 9 cijfers zijn ingevoerd, neemt JS de foutweergave over.
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

  // Alleen elfproef tonen zodra er exact 9 cijfers zijn ingevuld.
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

// Zoek op basis van gekozen waarde de volgende sectie.
function getNextSectionForRule(rule, selectedValue) {
  if (rule.targetSectionByValue && rule.targetSectionByValue[selectedValue]) {
    return rule.targetSectionByValue[selectedValue];
  }

  if (rule.defaultTargetSection) {
    return rule.defaultTargetSection;
  }

  return null;
}

// ==============================
// Validatie
// ==============================

// Markeer een veld als ongeldig en toon de foutmelding in het feedback-element.
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

  for (let i = 0; i < visibleRequiredRadios.length; i++) {
    const radio = visibleRequiredRadios[i];

    if (!isVisible(radio) || !radio.name || validatedGroups.has(radio.name)) {
      continue;
    }

    validatedGroups.add(radio.name);

    const group = form.querySelectorAll(
      `input[type="radio"][name="${radio.name}"]`
    );

    let hasVisibleSelection = false;

    for (let j = 0; j < group.length; j++) {
      if (isVisible(group[j]) && group[j].checked) {
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

// Valideer alleen de zichtbare verplichte velden; geeft false terug bij een fout.
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

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];

    if (!isVisible(field)) {
      continue;
    }

    if (field.type === "radio") {
      continue;
    }

    if (!field.checkValidity()) {
      showFieldError(field);
      return false;
    }
  }

  return true;
}

// ==============================
// Routing en scroll
// ==============================

// Plan een smooth scroll naar de volgende sectie.
function scheduleSectionUpdate(targetSection) {
  setTimeout(function () {
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }, visibilityUpdateDelay);
}

// ==============================
// Event listeners koppelen
// ==============================

// Blokkeer submit als niet alle zichtbare verplichte velden geldig zijn.
function bindStepValidation() {
  if (!form) {
    return;
  }

  if (bsnField) {
    bsnField.addEventListener("input", updateBsnElfproefValidity);
    bsnField.addEventListener("blur", updateBsnElfproefValidity);
  }

  const requiredRadios = form.querySelectorAll('input[type="radio"][required]');

  for (let i = 0; i < requiredRadios.length; i++) {
    requiredRadios[i].addEventListener("change", function (event) {
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

function bindVisibilityBasedRequiredFields() {
  if (!form) {
    return;
  }

  form.addEventListener("change", function () {
    syncVisibleRequiredFields();
  });
}

// Koppel per routingregel een change-listener om smooth te scrollen.
function bindRoutingRules() {
  for (let i = 0; i < routingRules.length; i++) {
    const rule = routingRules[i];
    const inputs = document.querySelectorAll(rule.selector);

    for (let j = 0; j < inputs.length; j++) {
      const input = inputs[j];

      input.addEventListener("change", function (event) {
        const nextSection = getNextSectionForRule(rule, event.target.value);

        if (nextSection) {
          scheduleSectionUpdate(nextSection);
        }
      });
    }
  }
}

// File Picker - toont geselecteerde bestandsnaam
const maritalAgreementFileInput = document.getElementById("maritalAgreementFile");
const maritalAgreementFileNameDisplay = document.getElementById("maritalAgreementFileName");

function displayFileInfo() {
    if (maritalAgreementFileInput.files && maritalAgreementFileInput.files.length > 0) {
        const fileName = maritalAgreementFileInput.files[0].name;
        const fileSize = maritalAgreementFileInput.files[0].size;
        
        // Formateer bestandsgrootte
        const fileSizeInKB = (fileSize / 1024).toFixed(2);
        
        maritalAgreementFileNameDisplay.innerHTML = `
            <div class="file-info" style="display: flex; align-items: center; gap: 8px;">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="margin-right: 4px;">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
          </svg>
          <span style="font-size: 1rem;"><strong>${fileName}</strong> (${fileSizeInKB} KB)</span>
          <button type="button" class="file-delete-btn" aria-label="Bestand verwijderen" style="background: none; border: none; cursor: pointer; padding: 4px;">
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
          </button>
            </div>
        `;
        maritalAgreementFileNameDisplay.classList.add("has-file");
        
        // Add event listener to delete button
        const deleteBtn = maritalAgreementFileNameDisplay.querySelector(".file-delete-btn");
        deleteBtn.addEventListener("click", clearFile);
    } else {
        maritalAgreementFileNameDisplay.innerHTML = "";
        maritalAgreementFileNameDisplay.classList.remove("has-file");
    }
}

function clearFile() {
    maritalAgreementFileInput.value = "";
    displayFileInfo();
}

maritalAgreementFileInput.addEventListener("change", displayFileInfo);

// ==============================
// Initialisatie
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  rememberOriginalRequiredFields();
  syncVisibleRequiredFields();
  bindVisibilityBasedRequiredFields();
  bindRoutingRules();
  bindStepValidation();
});





