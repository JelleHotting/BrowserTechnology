// * Hier halen we de belangrijkste stukken van het formulier op.
// * Dit is nodig zodat we straks de flow kunnen sturen zonder overal opnieuw te zoeken.
const form = document.querySelector("form");
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
    const isHidden = element.offsetParent === null;
    element.disabled = isHidden;

    if (isHidden) {
      element.required = false;
    }
  }
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
  maritalAgreementFileInput.value = "";
  displayFileInfo();
}

maritalAgreementFileInput.addEventListener("change", displayFileInfo);

// * BSN checken we in een paar stappen zodat de gebruiker snelle feedback krijgt.
// * We geven steeds hetzelfde type resultaat terug, dan blijft de UI simpel.
function validateBSN(bsn) {
  const cleanBSN = bsn.replace(/\D/g, "");

  // * Eerst de snelle basischeck, anders heeft verdere controle weinig zin.
  if (cleanBSN.length !== 9) {
    return {
      valid: false,
      message: "❌ BSN moet uit 9 cijfers bestaan",
    };
  }

  // * Daarna de echte controle om random nummers eruit te filteren.
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanBSN[i]) * (9 - i);
  }

  if (sum % 11 !== 0) {
    return {
      valid: false,
      message: "❌ BSN is ongeldig (BSN bestaat niet)",
    };
  }

  return {
    valid: true,
    message: "✅ BSN is geldig!",
  };
}

// * Hier tonen we feedback direct onder het veld, da's duidelijker voor de user.
// * Oude melding eerst weg, zodat je niet meerdere berichten onder elkaar krijgt.
// * Extra class erbij voor snelle visuele check (groen/rood).
function showValidationFeedback(inputElement, validation) {
  let feedbackElement = inputElement.nextElementSibling;

  // * Even oude feedback weggooien voor een nette UI.
  if (
    feedbackElement &&
    feedbackElement.classList.contains("validation-feedback")
  ) {
    feedbackElement.remove();
  }

  // * Nieuwe feedback opbouwen met status.
  const feedback = document.createElement("div");
  feedback.className = `validation-feedback ${validation.valid ? "valid" : "invalid"}`;
  feedback.textContent = validation.message;
  feedback.setAttribute("role", "alert");

  inputElement.parentElement.insertBefore(
    feedback,
    inputElement.nextElementSibling,
  );

  // * Input ook visueel markeren, dan zie je meteen waar het fout gaat.
  inputElement.classList.toggle("input-valid", validation.valid);
  inputElement.classList.toggle("input-invalid", !validation.valid);
}

// * Algemene datumcheck die we op meerdere plekken kunnen hergebruiken.
// * Zo houden we de regels overal hetzelfde.
function validateDate(dateValue, fieldName = "Datum") {
  if (!dateValue) {
    return {
      valid: false,
      message: `❌ ${fieldName} is verplicht`,
    };
  }

  const selectedDate = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // * Even checken: datum in de toekomst is hier niet logisch.
  if (selectedDate > today) {
    return {
      valid: false,
      message: `❌ ${fieldName} kan niet in de toekomst liggen`,
    };
  }

  // * Ondergrens om typefouten of onrealistische invoer te vangen.
  const minYear = new Date("1900-01-01");
  if (selectedDate < minYear) {
    return {
      valid: false,
      message: `❌ ${fieldName} moet na 1900 liggen`,
    };
  }

  return {
    valid: true,
    message: `✅ ${fieldName} is geldig!`,
  };
}

// * Extra regel tussen 2 datums: de volgorde moet logisch zijn.
// * Deze check voorkomt tegenstrijdige data in het formulier.function validateMaritalAgreementDate(maritalDate, deceasedDate) {
if (!maritalDate || !deceasedDate) {
  return {
    valid: false,
    message: "❌ Beide datums zijn verplicht",
  };
}

const maritalDateObj = new Date(maritalDate);
const deceasedDateObj = new Date(deceasedDate);

// ! Deze check is belangrijk, anders klopt de tijdlijn niet.
if (maritalDateObj >= deceasedDateObj) {
  return {
    valid: false,
    message: "❌ Huwelijksdatum moet vóór overlijdensdatum liggen",
  };
}

return {
  valid: true,
  message: "✅ Datums kloppen!",
};

// * Alles pas koppelen als de pagina klaar is.
// * Scheelt null-errors omdat de velden dan sowieso bestaan.
document.addEventListener("DOMContentLoaded", () => {
  const bsnField = document.getElementById("bsn-field");
  const deceasedDateField = document.querySelector('input[type="date"]');
  const maritalAgreementDateField = document.getElementById(
    "maritalAgreementDate",
  );
  const notaryDateField = document.getElementById("notaryDate");
  const notaryProtocolField = document.getElementById("notaryProtocol");

  // * BSN direct begeleiden tijdens invullen + checken bij verlaten van het veld.
  // * Zo corrigeren we input vroeg en voorkomen we gedoe bij submit.
  if (bsnField) {
    bsnField.addEventListener("input", () => {
      // * Hier houden we de invoer alvast schoon.
      bsnField.value = bsnField.value.replace(/\D/g, "");
    });
    bsnField.addEventListener("blur", () => {
      if (bsnField.value.trim()) {
        const result = validateBSN(bsnField.value);
        showValidationFeedback(bsnField, result);
      }
    });
  }

  // * Overlijdensdatum pas checken als de gebruiker klaar is met typen.
  if (deceasedDateField) {
    deceasedDateField.addEventListener("blur", () => {
      if (deceasedDateField.value) {
        const result = validateDate(
          deceasedDateField.value,
          "Overlijdensdatum",
        );
        showValidationFeedback(deceasedDateField, result);
      }
    });
  }

  // * Deze vergelijking heeft alleen zin als beide datums er zijn.
  if (maritalAgreementDateField) {
    maritalAgreementDateField.addEventListener("blur", () => {
      if (maritalAgreementDateField.value && deceasedDateField?.value) {
        const result = validateMaritalAgreementDate(
          maritalAgreementDateField.value,
          deceasedDateField.value,
        );
        showValidationFeedback(maritalAgreementDateField, result);
      }
    });
  }

  // * Zelfde datumregels hergebruiken voor consistente feedback.
  if (notaryDateField) {
    notaryDateField.addEventListener("blur", () => {
      if (notaryDateField.value) {
        const result = validateDate(notaryDateField.value, "Datum testament");
        showValidationFeedback(notaryDateField, result);
      }
    });
  }

  // * Protocolnummer pas valideren als het veld klaar is.
  if (notaryProtocolField) {
    notaryProtocolField.addEventListener("blur", () => {
      if (notaryProtocolField.value.trim()) {
        const result = validateNumberField(
          notaryProtocolField.value,
          "Protocolnummer",
        );
        showValidationFeedback(notaryProtocolField, result);
      }
    });
  }

  // ! Laatste safety-check bij submit.
  // * Alles nog 1x nalopen voor het formulier echt weggaat.
  // ! Bij fouten blokkeren we submit, anders gaat er rommel door.
  if (form) {
    form.addEventListener("submit", (e) => {
      let hasError = false;

      if (bsnField?.value) {
        const check = validateBSN(bsnField.value);
        if (!check.valid) {
          showValidationFeedback(bsnField, check);
          hasError = true;
        }
      }

      if (deceasedDateField?.value) {
        const check = validateDate(deceasedDateField.value, "Overlijdensdatum");
        if (!check.valid) {
          showValidationFeedback(deceasedDateField, check);
          hasError = true;
        }
      }

      if (maritalAgreementDateField?.value && deceasedDateField?.value) {
        const check = validateMaritalAgreementDate(
          maritalAgreementDateField.value,
          deceasedDateField.value,
        );
        if (!check.valid) {
          showValidationFeedback(maritalAgreementDateField, check);
          hasError = true;
        }
      }

      if (notaryDateField?.value) {
        const check = validateDate(notaryDateField.value, "Datum testament");
        if (!check.valid) {
          showValidationFeedback(notaryDateField, check);
          hasError = true;
        }
      }

      if (hasError) {
        e.preventDefault();
      } else {
      }
    });
  }
});
