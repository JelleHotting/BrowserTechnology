// Alle fieldsets
const maritalAgreement = document.querySelector(".marital-agreement");
const maritalAgreementFiles = document.querySelector(
  ".marital-agreement-files",
);
const finalSettlement = document.querySelector(".final-settlement");
const childrenInfo = document.querySelector(".children-info");
const deceasedChildInfo = document.querySelector(".deceased-child-info");
const grandchildrenInfo = document.querySelector(".grandchildren-info");
const testamentInfo = document.querySelector(".testament-info");
const notaryInfo = document.querySelector(".notary-info");

// Helper functie om alle voorwaardelijke veldsets te verbergen
function hideAllConditionalFieldsets() {
  maritalAgreement.classList.add("hidden-fieldset");
  maritalAgreementFiles.classList.add("hidden-fieldset");
  finalSettlement.classList.add("hidden-fieldset");
  childrenInfo.classList.add("hidden-fieldset");
  deceasedChildInfo.classList.add("hidden-fieldset");
  grandchildrenInfo.classList.add("hidden-fieldset");
  testamentInfo.classList.add("hidden-fieldset");
  notaryInfo.classList.add("hidden-fieldset");
}

// Marital Status - CSS shows sections, JS adds smooth scroll and resets conflicts
const maritalStatusInputs = document.querySelectorAll(
  "input[name=maritalStatus]",
);
maritalStatusInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    hideAllConditionalFieldsets();

    if (event.target.value === "ja") {
      // CSS will show marital-agreement, just scroll to it
      setTimeout(
        () => maritalAgreement.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    } else if (event.target.value === "nee") {
      // CSS will show children-info, just scroll to it
      setTimeout(() => childrenInfo.scrollIntoView({ behavior: "smooth" }), 50);
    }
  });
});

// Marital Agreement - CSS shows sections, JS adds smooth scroll
const maritalAgreementInputs = document.querySelectorAll(
  "input[name=maritalAgreement]",
);
maritalAgreementInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.value === "ja") {
      // CSS will show both maritalAgreementFiles and finalSettlement
      setTimeout(
        () => maritalAgreementFiles.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    } else if (event.target.value === "nee") {
      // CSS will show only finalSettlement
      setTimeout(
        () => finalSettlement.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  });
});

// Final Settlement - CSS shows childrenInfo, JS adds smooth scroll
const finalSettlementInputs = document.querySelectorAll(
  "input[name=finalSettlement]",
);
finalSettlementInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    setTimeout(() => childrenInfo.scrollIntoView({ behavior: "smooth" }), 50);
  });
});

// Children - CSS shows sections, JS adds smooth scroll
const childrenInputs = document.querySelectorAll("input[name=children]");
childrenInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.value === "ja") {
      setTimeout(
        () => deceasedChildInfo.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    } else if (event.target.value === "nee") {
      setTimeout(
        () => testamentInfo.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  });
});

// Deceased Child - CSS shows sections, JS adds smooth scroll
const deceasedChildInputs = document.querySelectorAll(
  "input[name=deceasedChild]",
);
deceasedChildInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.value === "ja") {
      setTimeout(
        () => grandchildrenInfo.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    } else if (event.target.value === "nee") {
      setTimeout(
        () => testamentInfo.scrollIntoView({ behavior: "smooth" }),
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
    setTimeout(() => testamentInfo.scrollIntoView({ behavior: "smooth" }), 50);
  });
});

// Testament - CSS shows/hides notaryInfo, JS adds smooth scroll when shown
const testamentInputs = document.querySelectorAll("input[name=testament]");
testamentInputs.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.value === "ja") {
      setTimeout(() => notaryInfo.scrollIntoView({ behavior: "smooth" }), 50);
    } else if (event.target.value === "nee") {
      // CSS hides notaryInfo automatically, no need to add class
    }
  });
});

// File Picker - toont geselecteerde bestandsnaam
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

    // Formateer bestandsgrootte
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

    // Add event listener to delete button
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
