import { bindRoutingRules, bindVisibilityBasedRequiredFields } from "./routing.js";
import { rememberOriginalRequiredFields, syncVisibleRequiredFields } from "./helpers.js";
import { bindStepValidation } from "./validation.js";
import { initMaritalAgreementFilePicker } from "./file-picker.js";

export function initStepOneFormPage() {
  rememberOriginalRequiredFields();
  syncVisibleRequiredFields();
  bindVisibilityBasedRequiredFields();
  bindRoutingRules();
  bindStepValidation();
  initMaritalAgreementFilePicker();
}