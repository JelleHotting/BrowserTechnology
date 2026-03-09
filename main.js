
// * Hier halen we de belangrijkste stukken van het formulier op.
// * Dit is nodig zodat we straks de flow kunnen sturen zonder overal opnieuw te zoeken.
const form = document.querySelector("form");
const submitButton = form?.querySelector('.next-question-btn');
const maritalAgreement = document.querySelector(".marital-agreement");
const finalSettlement = document.querySelector(".final-settlement");
const childrenInfo = document.querySelector(".children-info");
const deceasedChildInfo = document.querySelector(".deceased-child-info");
const grandchildrenInfo = document.querySelector(".grandchildren-info");
const testamentInfo = document.querySelector(".testament-info");
const notaryInfo = document.querySelector(".notary-info");
const VISIBILITY_UPDATE_DELAY = 50;

// * Even kort wachten tot de zichtbaarheid van secties goed staat.
// * Daarna pas scrollen, anders spring je soms naar een verkeerde plek.
// * Meteen ook hidden velden uitzetten, zodat de validatie clean blijft.
function scheduleSectionUpdate(targetSection) {
  setTimeout(() => {
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }

    if (form) {
      disableHiddenFields(form);
      updateSubmitButtonState();
    }
  }, VISIBILITY_UPDATE_DELAY);
}

// * Kleine helper om niet steeds dezelfde listener-code te copy-pasten.
// * Bij een keuze bepalen we direct wat de volgende logische sectie is.
function bindChoiceScroll(selector, getNextSection) {
  const inputs = document.querySelectorAll(selector);

  inputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const nextSection = getNextSection(event.target.value);
      if (nextSection) {
        scheduleSectionUpdate(nextSection);
      }
    });
  });
}

// * Dit is de route van het formulier.
// * Per antwoord sturen we de gebruiker door naar de volgende relevante stap.
bindChoiceScroll("input[name=maritalStatus]", (value) => {
  if (value === "ja") return maritalAgreement;
  if (value === "nee") return childrenInfo;
  return null;
});

bindChoiceScroll("input[name=maritalAgreement]", () => finalSettlement);
bindChoiceScroll("input[name=finalSettlement]", () => childrenInfo);

bindChoiceScroll("input[name=children]", (value) => {
  if (value === "ja") return deceasedChildInfo;
  if (value === "nee") return testamentInfo;
  return null;
});

bindChoiceScroll("input[name=deceasedChild]", (value) => {
  if (value === "ja") return grandchildrenInfo;
  if (value === "nee") return testamentInfo;
  return null;
});

bindChoiceScroll("input[name=deceasedChildGrandchildren]", () => testamentInfo);

bindChoiceScroll("input[name=testament]", (value) => {
  if (value === "ja") return notaryInfo;
  return null;
});

// * Even checken welke velden echt zichtbaar zijn voor de gebruiker.
// * Hidden velden zetten we uit, anders krijg je vage required-errors bij submit.
// * Dit was de makkelijkste manier om de submit-data relevant te houden.
function disableHiddenFields(form) {
  for (const element of form.elements) {
    const wasRequired = element.matches("[required]") || element.dataset.wasRequired === "true";

    if (wasRequired) {
      element.dataset.wasRequired = "true";
    }

    const isHidden = element.offsetParent === null;
    element.disabled = isHidden;
    element.required = wasRequired && !isHidden;
  }
}

function hasValueForRequiredField(field) {
  if (field.type === "radio") {
    return Boolean(
      form?.querySelector(`input[type="radio"][name="${field.name}"]:checked`),
    );
  }

  if (field.type === "checkbox") {
    return field.checked;
  }

  if (field.type === "file") {
    return Boolean(field.files && field.files.length > 0);
  }

  return field.value.trim() !== "";
}

function updateSubmitButtonState() {
  if (!form || !submitButton) {
    return;
  }

  const requiredFields = Array.from(form.elements).filter(
    (element) => element instanceof HTMLInputElement && element.required && !element.disabled,
  );

  const checkedRadioNames = new Set();
  const allRequiredCompleted = requiredFields.every((field) => {
    if (field.type === "radio") {
      if (checkedRadioNames.has(field.name)) {
        return true;
      }

      checkedRadioNames.add(field.name);
      return hasValueForRequiredField(field);
    }

    return hasValueForRequiredField(field);
  });

  submitButton.disabled = !allRequiredCompleted;

}

// * Hier pakken we de onderdelen voor upload + bestandsweergave.
// * Zo kunnen we meteen feedback tonen na het kiezen van een bestand.
const maritalAgreementFileInput = document.getElementById(
  "maritalAgreementFile",
);
const maritalAgreementFileNameDisplay = document.getElementById(
  "maritalAgreementFileName",
);

function displayFileInfo() {
  if (!maritalAgreementFileInput || !maritalAgreementFileNameDisplay) {
    return;
  }

  // * Is er een bestand gekozen? Dan laten we direct zien wat er klaarstaat.
  // * Inclusief delete-knop, zodat je snel opnieuw kan kiezen.
  if (
    maritalAgreementFileInput.files &&
    maritalAgreementFileInput.files.length > 0
  ) {
    const fileName = maritalAgreementFileInput.files[0].name;
    const fileSize = maritalAgreementFileInput.files[0].size;
    const fileSizeInKB = (fileSize / 1024).toFixed(2);

    maritalAgreementFileNameDisplay.innerHTML = `
      <div class="file-info">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
        </svg>
        <span><strong>${fileName}</strong> (${fileSizeInKB} KB)</span>
        <button type="button" class="file-delete-btn" aria-label="Bestand verwijderen">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </button>
      </div>
    `;
    maritalAgreementFileNameDisplay.classList.add("has-file");

    const deleteBtn =
      maritalAgreementFileNameDisplay.querySelector(".file-delete-btn");
    deleteBtn.addEventListener("click", clearFile);
  } else {
    // * Niks gekozen = ook geen oude info laten staan.
    maritalAgreementFileNameDisplay.innerHTML = "";
    maritalAgreementFileNameDisplay.classList.remove("has-file");
  }
}

function clearFile() {
  if (!maritalAgreementFileInput) {
    return;
  }

  maritalAgreementFileInput.value = "";
  displayFileInfo();
  updateSubmitButtonState();
}

if (maritalAgreementFileInput) {
  maritalAgreementFileInput.addEventListener("change", () => {
    displayFileInfo();
    updateSubmitButtonState();
  });
}

// * Helper om validatieresultaat te retourneren.
const validationResult = (valid, message) => ({ valid, message });

// * BSN checken we in een paar stappen zodat de gebruiker snelle feedback krijgt.
function validateBSN(bsn) {
  const cleanBSN = bsn.replace(/\D/g, "");

  if (cleanBSN.length !== 9) {
    return validationResult(false, "❌ BSN moet uit 9 cijfers bestaan");
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanBSN[i]) * (9 - i);
  }

  return sum % 11 !== 0
    ? validationResult(false, "❌ BSN is ongeldig (volgorde cijfers klopt niet)")
    : validationResult(true, "");
}

// * Algemene datumcheck die we op meerdere plekken kunnen hergebruiken.
function validateDate(dateValue, fieldName = "Datum") {
  if (!dateValue) {
    return validationResult(false, `❌ ${fieldName} is verplicht`);
  }

  const selectedDate = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    return validationResult(false, `❌ ${fieldName} kan niet in de toekomst liggen`);
  }

  const minYear = new Date("1900-01-01");
  if (selectedDate < minYear) {
    return validationResult(false, `❌ ${fieldName} moet na 1900 liggen`);
  }

  return validationResult(true, "");
}

// * Extra regel tussen 2 datums: de volgorde moet logisch zijn.
function validateMaritalAgreementDate(maritalDate, deceasedDate) {
  if (!maritalDate || !deceasedDate) {
    return validationResult(false, "❌ Beide datums zijn verplicht");
  }

  const maritalDateObj = new Date(maritalDate);
  const deceasedDateObj = new Date(deceasedDate);

  return maritalDateObj >= deceasedDateObj
    ? validationResult(false, "❌ Huwelijksdatum moet vóór overlijdensdatum liggen")
    : validationResult(true, "");
}

// * Algemene validatie voor numerieke velden.
function validateNumberField(value, fieldName = "Nummer") {
  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return validationResult(false, `❌ ${fieldName} is verplicht`);
  }

  return !/^\d+$/.test(cleanedValue)
    ? validationResult(false, `❌ ${fieldName} mag alleen cijfers bevatten`)
    : validationResult(true, "");
}

// * Voorletters moeten hoofdletters zijn, gescheiden door punten.
function validateInitials(value) {
  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return validationResult(false, "❌ Voorletter(s) zijn verplicht");
  }

  return !/^[A-Z](\.[A-Z])*\.?$/.test(cleanedValue)
    ? validationResult(false, "❌ Gebruik alleen hoofdletters en punten (bijv. J.P. of A.B.C.)")
    : validationResult(true, "");
}

// * Tussenvoegsel is optioneel, maar als het ingevuld is moet het aan bepaalde regels voldoen.
function validatePrefix(value) {
  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return validationResult(true, "");
  }

  return !/^[a-z\s']+$/.test(cleanedValue)
    ? validationResult(false, "❌ Tussenvoegsel mag alleen kleine letters bevatten (bijv. van der, de)")
    : validationResult(true, "");
}

// * Algemene tekstvalidatie helper.
const validateTextField = (value, fieldName, minLength = 2) => {
  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return validationResult(false, `❌ ${fieldName} is verplicht`);
  }

  if (!/^[A-Za-zÀ-ÿ\s\-']+$/.test(cleanedValue)) {
    return validationResult(false, `❌ ${fieldName} mag alleen letters bevatten (bijv. Jansen, van der Berg)`);
  }

  return cleanedValue.length < minLength
    ? validationResult(false, `❌ ${fieldName} moet minimaal ${minLength} letters bevatten`)
    : validationResult(true, "");
};

// * Achternaam en vestigingsplaats gebruiken dezelfde logica.
const validateLastName = (value) => validateTextField(value, "Achternaam");
const validateCity = (value) => validateTextField(value, "Vestigingsplaats");

// * Hier tonen we feedback direct onder het veld, da's duidelijker voor de user.
// * Bij een geldig veld tonen we niks, alleen bij fouten.
function showValidationFeedback(inputElement, validation) {
  let feedbackElement = inputElement.nextElementSibling;

  // * Oude feedback en markeringen opruimen.
  if (feedbackElement?.classList.contains("validation-feedback")) {
    feedbackElement.remove();
  }
  inputElement.classList.remove("input-valid", "input-invalid");

  // * Alleen feedback tonen bij fouten.
  if (!validation.valid) {
    const feedback = document.createElement("div");
    feedback.className = "validation-feedback invalid";
    feedback.textContent = validation.message;
    feedback.setAttribute("role", "alert");

    inputElement.parentElement.insertBefore(
      feedback,
      inputElement.nextElementSibling,
    );
    inputElement.classList.add("input-invalid");
  }
}

// * Alles pas koppelen als de pagina klaar is.
// * Scheelt null-errors omdat de velden dan sowieso bestaan.
document.addEventListener("DOMContentLoaded", () => {
  if (form) {
    disableHiddenFields(form);
    updateSubmitButtonState();
    form.addEventListener("input", updateSubmitButtonState);
    form.addEventListener("change", updateSubmitButtonState);
  }

  // * Configuratie van alle velden met hun validators en required status.
  const fieldValidations = [
    {
      field: document.getElementById("bsn-field"),
      validator: validateBSN,
      required: true,
      emptyMessage: "❌ BSN is verplicht",
      realTimeOnInput: true,
    },
    {
      field: document.getElementById("deceasedDate"),
      validator: (val) => validateDate(val, "Overlijdensdatum"),
      required: true,
      emptyMessage: "❌ Overlijdensdatum is verplicht",
      onChange: true,
    },
    {
      field: document.querySelector(".deceased-info .initial"),
      validator: validateInitials,
      required: true,
      emptyMessage: "❌ Voorletter(s) zijn verplicht",
    },
    {
      field: document.querySelector(".deceased-info .prefix"),
      validator: validatePrefix,
      required: false,
    },
    {
      field: document.querySelector(".deceased-info .lastname"),
      validator: validateLastName,
      required: true,
      emptyMessage: "❌ Achternaam is verplicht",
    },
    {
      field: document.querySelector(".notary-info .initial"),
      validator: validateInitials,
      required: false,
    },
    {
      field: document.getElementById("notaryPrefix"),
      validator: validatePrefix,
      required: false,
    },
    {
      field: document.getElementById("notaryLastname"),
      validator: validateLastName,
      required: false,
    },
    {
      field: document.getElementById("notaryCity"),
      validator: validateCity,
      required: false,
    },
    {
      field: document.getElementById("notaryProtocol"),
      validator: (val) => validateNumberField(val, "Protocolnummer"),
      required: false,
    },
    {
      field: document.getElementById("notaryDate"),
      validator: (val) => validateDate(val, "Datum testament"),
      required: false,
      onChange: true,
    },
  ];

  const bsnField = document.getElementById("bsn-field");
  const deceasedDateField = document.getElementById("deceasedDate");
  const maritalAgreementDateField = document.getElementById("maritalAgreementDate");

  // * Helper functie voor real-time validatie.
  const setupRealTimeValidation = (field, validator, onChange = false) => {
    if (!field) return;

    const validate = () => {
      if (!field.value.trim() && !onChange) return;
      const result = validator(field.value);
      showValidationFeedback(field, result);
    };

    field.addEventListener("input", () => {
      const hasFeedback = field.nextElementSibling?.classList.contains("validation-feedback");
      if (hasFeedback && field.value.trim()) {
        validate();
      }
    });

    if (onChange) {
      field.addEventListener("change", () => {
        const hasFeedback = field.nextElementSibling?.classList.contains("validation-feedback");
        if (hasFeedback) validate();
      });
    }
  };

  // * BSN heeft speciale input filtering.
  if (bsnField) {
    bsnField.addEventListener("input", () => {
      bsnField.value = bsnField.value.replace(/\D/g, "");
      const hasFeedback = bsnField.nextElementSibling?.classList.contains("validation-feedback");
      if (hasFeedback && bsnField.value.length === 9) {
        showValidationFeedback(bsnField, validateBSN(bsnField.value));
      }
    });
    bsnField.addEventListener("blur", () => {
      const result = !bsnField.value.trim() 
        ? { valid: false, message: "❌ BSN is verplicht" }
        : validateBSN(bsnField.value);
      showValidationFeedback(bsnField, result);
    });
  }

  // * Datumvelden valideren bij blur.
  if (deceasedDateField) {
    const validate = () => {
      const result = !deceasedDateField.value
        ? { valid: false, message: "❌ Overlijdensdatum is verplicht" }
        : validateDate(deceasedDateField.value, "Overlijdensdatum");
      showValidationFeedback(deceasedDateField, result);
    };
    deceasedDateField.addEventListener("blur", validate);
    deceasedDateField.addEventListener("change", () => {
      const hasFeedback = deceasedDateField.nextElementSibling?.classList.contains("validation-feedback");
      if (hasFeedback) validate();
    });
  }

  // * Huwelijksdatum heeft speciale validatie met overlijdensdatum.
  if (maritalAgreementDateField) {
    const validate = () => {
      if (maritalAgreementDateField.value && deceasedDateField?.value) {
        showValidationFeedback(
          maritalAgreementDateField,
          validateMaritalAgreementDate(maritalAgreementDateField.value, deceasedDateField.value)
        );
      }
    };
    maritalAgreementDateField.addEventListener("blur", validate);
    maritalAgreementDateField.addEventListener("change", () => {
      const hasFeedback = maritalAgreementDateField.nextElementSibling?.classList.contains("validation-feedback");
      if (hasFeedback) validate();
    });
  }

  // * Real-time validatie voor alle andere velden.
  fieldValidations.forEach(({ field, validator }) => {
    if (field && field !== bsnField && field !== deceasedDateField) {
      setupRealTimeValidation(field, validator);
    }
  });

  // ! Submit validatie.
  if (form) {
    form.addEventListener("submit", (e) => {
      let hasError = false;

      // * Valideer alle geconfigureerde velden.
      fieldValidations.forEach(({ field, validator, required, emptyMessage }) => {
        if (!field) return;

        if (required && !field.value.trim()) {
          showValidationFeedback(field, { valid: false, message: emptyMessage });
          hasError = true;
        } else if (field.value.trim()) {
          const result = validator(field.value);
          if (!result.valid) {
            showValidationFeedback(field, result);
            hasError = true;
          }
        }
      });

      // * Speciale validatie voor huwelijksdatum.
      if (maritalAgreementDateField?.value && deceasedDateField?.value) {
        const result = validateMaritalAgreementDate(
          maritalAgreementDateField.value,
          deceasedDateField.value
        );
        if (!result.valid) {
          showValidationFeedback(maritalAgreementDateField, result);
          hasError = true;
        }
      }

      if (hasError) e.preventDefault();
    });
  }
});
