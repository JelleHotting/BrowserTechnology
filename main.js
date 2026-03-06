// Fieldset references for smooth scrolling
const maritalAgreement = document.querySelector(".marital-agreement");
const finalSettlement = document.querySelector(".final-settlement");
const childrenInfo = document.querySelector(".children-info");
const deceasedChildInfo = document.querySelector(".deceased-child-info");
const grandchildrenInfo = document.querySelector(".grandchildren-info");
const testamentInfo = document.querySelector(".testament-info");
const notaryInfo = document.querySelector(".notary-info");

// Marital Status - CSS shows/hides sections, JS adds smooth scroll
const maritalStatusInputs = document.querySelectorAll(
  "input[name=maritalStatus]",
);
maritalStatusInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.value === "ja") {
      setTimeout(
        () => {
          maritalAgreement.scrollIntoView({ behavior: "smooth" });
          if (form) disableHiddenFields(form);
        },
        50,
      );
    } else if (event.target.value === "nee") {
      setTimeout(() => {
        childrenInfo.scrollIntoView({ behavior: "smooth" });
        if (form) disableHiddenFields(form);
      }, 50);
    }
  });
});

const maritalAgreementInputs = document.querySelectorAll(
  "input[name=maritalAgreement]",
);
maritalAgreementInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    setTimeout(
      () => {
        finalSettlement.scrollIntoView({ behavior: "smooth" });
        if (form) disableHiddenFields(form);
      },
      50,
    );
  });
});

// Final Settlement - CSS shows childrenInfo, JS adds smooth scroll
const finalSettlementInputs = document.querySelectorAll(
  "input[name=finalSettlement]",
);
finalSettlementInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    setTimeout(() => {
      childrenInfo.scrollIntoView({ behavior: "smooth" });
      if (form) disableHiddenFields(form);
    }, 50);
  });
});

// Children - CSS shows/hides sections, JS adds smooth scroll
const childrenInputs = document.querySelectorAll("input[name=children]");
childrenInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.value === "ja") {
      setTimeout(
        () => {
          deceasedChildInfo.scrollIntoView({ behavior: "smooth" });
          if (form) disableHiddenFields(form);
        },
        50,
      );
    } else if (event.target.value === "nee") {
      setTimeout(
        () => {
          testamentInfo.scrollIntoView({ behavior: "smooth" });
          if (form) disableHiddenFields(form);
        },
        50,
      );
    }
  });
});

// Deceased Child - CSS shows/hides sections, JS adds smooth scroll
const deceasedChildInputs = document.querySelectorAll(
  "input[name=deceasedChild]",
);
deceasedChildInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.value === "ja") {
      setTimeout(
        () => {
          grandchildrenInfo.scrollIntoView({ behavior: "smooth" });
          if (form) disableHiddenFields(form);
        },
        50,
      );
    } else if (event.target.value === "nee") {
      setTimeout(
        () => {
          testamentInfo.scrollIntoView({ behavior: "smooth" });
          if (form) disableHiddenFields(form);
        },
        50,
      );
    }
  });
});

// Grandchildren - CSS shows testamentInfo, JS adds smooth scroll
const grandchildrenInputs = document.querySelectorAll(
  "input[name=deceasedChildGrandchildren]",
);
grandchildrenInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    setTimeout(() => {
      testamentInfo.scrollIntoView({ behavior: "smooth" });
      if (form) disableHiddenFields(form);
    }, 50);
  });
});

// Testament - CSS shows/hides notaryInfo, JS adds smooth scroll
const testamentInputs = document.querySelectorAll("input[name=testament]");
testamentInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.value === "ja") {
      setTimeout(() => {
        notaryInfo.scrollIntoView({ behavior: "smooth" });
        if (form) disableHiddenFields(form);
      }, 50);
    }
  });
});

// helper to disable hidden inputs and clear required
function disableHiddenFields(form) {
  Array.from(form.elements).forEach(el => {
    const hidden = el.offsetParent === null;
    el.disabled = hidden;
    if (hidden) {
      el.required = false;
    }
  });
}

// File Picker - display selected filename
const maritalAgreementFileInput = document.getElementById(
  "maritalAgreementFile",
);
const maritalAgreementFileNameDisplay = document.getElementById(
  "maritalAgreementFileName",
);

function displayFileInfo() {
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
    maritalAgreementFileNameDisplay.innerHTML = "";
    maritalAgreementFileNameDisplay.classList.remove("has-file");
  }
}

function clearFile() {
  maritalAgreementFileInput.value = "";
  displayFileInfo();
}

maritalAgreementFileInput.addEventListener("change", displayFileInfo);

// BSN validatie met elfproef
function validateBSN(bsn) {
  const cleanBSN = bsn.replace(/\D/g, '');
  
  // Check op 9 cijfers
  if (cleanBSN.length !== 9) {
    return { 
      valid: false, 
      message: '❌ BSN moet uit 9 cijfers bestaan' 
    };
  }
  
  // Elfproef check
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanBSN[i]) * (9 - i);
  }
  
  if (sum % 11 !== 0) {
    return { 
      valid: false, 
      message: '❌ BSN is ongeldig (BSN bestaat niet)' 
    };
  }
  
  return { 
    valid: true, 
    message: '✅ BSN is geldig!' 
  };
}

// Controleer alleen cijfervelden
function validateNumberField(value, fieldName = 'Dit veld') {
  if (value.trim() === '') {
    return { valid: false, message: `❌ ${fieldName} is verplicht` };
  }
  if (!/^\d+$/.test(value.trim())) {
    return { valid: false, message: `❌ ${fieldName} mag alleen cijfers bevatten` };
  }
  return { valid: true, message: `✅ ${fieldName} is correct ingevuld!` };
}

// Feedback element aanmaken/updaten
function showValidationFeedback(inputElement, validation) {
  let feedbackElement = inputElement.nextElementSibling;
  
  // Verwijder oude feedback als die er is
  if (feedbackElement && feedbackElement.classList.contains('validation-feedback')) {
    feedbackElement.remove();
  }
  
  // Maak nieuwe feedback element
  const feedback = document.createElement('div');
  feedback.className = `validation-feedback ${validation.valid ? 'valid' : 'invalid'}`;
  feedback.textContent = validation.message;
  feedback.setAttribute('role', 'alert');
  
  inputElement.parentElement.insertBefore(feedback, inputElement.nextElementSibling);
  
  // Voeg klasse toe aan input
  inputElement.classList.toggle('input-valid', validation.valid);
  inputElement.classList.toggle('input-invalid', !validation.valid);
}

// Datum validatie
function validateDate(dateValue, fieldName = 'Datum') {
  if (!dateValue) {
    return { 
      valid: false, 
      message: `❌ ${fieldName} is verplicht` 
    };
  }
  
  const selectedDate = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check of datum in toekomst ligt
  if (selectedDate > today) {
    return { 
      valid: false, 
      message: `❌ ${fieldName} kan niet in de toekomst liggen` 
    };
  }
  
  // Check of datum redelijk is (niet voor 1900)
  const minYear = new Date('1900-01-01');
  if (selectedDate < minYear) {
    return { 
      valid: false, 
      message: `❌ ${fieldName} moet na 1900 liggen` 
    };
  }
  
  return { 
    valid: true, 
    message: `✅ ${fieldName} is geldig!` 
  };
}

// Validatie voor marital agreement date vs overlijdensdatum
function validateMaritalAgreementDate(maritalDate, deceasedDate) {
  if (!maritalDate || !deceasedDate) {
    return { 
      valid: false, 
      message: '❌ Beide datums zijn verplicht' 
    };
  }
  
  const maritalDateObj = new Date(maritalDate);
  const deceasedDateObj = new Date(deceasedDate);
  
  // Huwelijksdatum moet vóór overlijdensdatum liggen
  if (maritalDateObj >= deceasedDateObj) {
    return { 
      valid: false, 
      message: '❌ Huwelijksdatum moet vóór overlijdensdatum liggen' 
    };
  }
  
  return { 
    valid: true, 
    message: '✅ Datums kloppen!' 
  };
}

// DOM events and wiring for validation
document.addEventListener('DOMContentLoaded', () => {
  const bsnField = document.getElementById('bsn-field');
  const deceasedDateField = document.querySelector('input[type="date"]');
  const maritalAgreementDateField = document.getElementById('maritalAgreementDate');
  const notaryDateField = document.getElementById('notaryDate');
  const notaryProtocolField = document.getElementById('notaryProtocol');

  // BSN field listeners
  if (bsnField) {
    bsnField.addEventListener('input', () => {
      // only numbers
      bsnField.value = bsnField.value.replace(/\D/g, '');
    });
    bsnField.addEventListener('blur', () => {
      if (bsnField.value.trim()) {
        const result = validateBSN(bsnField.value);
        showValidationFeedback(bsnField, result);
      }
    });
  }

  // deceased date
  if (deceasedDateField) {
    deceasedDateField.addEventListener('blur', () => {
      if (deceasedDateField.value) {
        const result = validateDate(deceasedDateField.value, 'Overlijdensdatum');
        showValidationFeedback(deceasedDateField, result);
      }
    });
  }

  // marital agreement date
  if (maritalAgreementDateField) {
    maritalAgreementDateField.addEventListener('blur', () => {
      if (maritalAgreementDateField.value && deceasedDateField?.value) {
        const result = validateMaritalAgreementDate(
          maritalAgreementDateField.value,
          deceasedDateField.value,
        );
        showValidationFeedback(maritalAgreementDateField, result);
      }
    });
  }

  // notary date
  if (notaryDateField) {
    notaryDateField.addEventListener('blur', () => {
      if (notaryDateField.value) {
        const result = validateDate(notaryDateField.value, 'Datum testament');
        showValidationFeedback(notaryDateField, result);
      }
    });
  }

  // protocol number
  if (notaryProtocolField) {
    notaryProtocolField.addEventListener('blur', () => {
      if (notaryProtocolField.value.trim()) {
        const result = validateNumberField(notaryProtocolField.value, 'Protocolnummer');
        showValidationFeedback(notaryProtocolField, result);
      }
    });
  }

  // form submit
  if (form) {
    form.addEventListener('submit', (e) => {
      let hasError = false;

      if (bsnField?.value) {
        const check = validateBSN(bsnField.value);
        if (!check.valid) {
          showValidationFeedback(bsnField, check);
          hasError = true;
        }
      }

      if (deceasedDateField?.value) {
        const check = validateDate(deceasedDateField.value, 'Overlijdensdatum');
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
        const check = validateDate(notaryDateField.value, 'Datum testament');
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
