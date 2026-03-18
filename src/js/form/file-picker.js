import {
  maritalAgreementFileInput,
  maritalAgreementFileNameDisplay,
} from "./elements.js";

function clearFile() {
  maritalAgreementFileInput.value = "";
  displayFileInfo();
}

function displayFileInfo() {
  if (!maritalAgreementFileInput || !maritalAgreementFileNameDisplay) {
    return;
  }

  if (
    maritalAgreementFileInput.files &&
    maritalAgreementFileInput.files.length > 0
  ) {
    const file = maritalAgreementFileInput.files[0];
    const fileSizeInKB = (file.size / 1024).toFixed(2);

    maritalAgreementFileNameDisplay.innerHTML = `
      <div class="file-info" style="display: flex; align-items: center; gap: 8px;">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="margin-right: 4px;">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
        </svg>
        <span style="font-size: 1rem;"><strong>${file.name}</strong> (${fileSizeInKB} KB)</span>
        <button type="button" class="file-delete-btn" aria-label="Bestand verwijderen" style="background: none; border: none; cursor: pointer; padding: 4px;">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </button>
      </div>
    `;
    maritalAgreementFileNameDisplay.classList.add("has-file");

    const deleteButton = maritalAgreementFileNameDisplay.querySelector(
      ".file-delete-btn"
    );

    deleteButton?.addEventListener("click", clearFile);
    return;
  }

  maritalAgreementFileNameDisplay.innerHTML = "";
  maritalAgreementFileNameDisplay.classList.remove("has-file");
}

export function initMaritalAgreementFilePicker() {
  if (!maritalAgreementFileInput || !maritalAgreementFileNameDisplay) {
    return;
  }

  maritalAgreementFileInput.addEventListener("change", displayFileInfo);
  displayFileInfo();
}