import { form } from "./elements.js";

export function isVisible(element) {
  return Boolean(element && element.getClientRects().length);
}

export function rememberOriginalRequiredFields() {
  if (!form) {
    return;
  }

  const requiredFields = form.querySelectorAll("[required]");

  for (let index = 0; index < requiredFields.length; index += 1) {
    requiredFields[index].dataset.originalRequired = "true";
  }
}

export function syncVisibleRequiredFields() {
  if (!form) {
    return;
  }

  const originalRequiredFields = form.querySelectorAll(
    '[data-original-required="true"]'
  );

  for (let index = 0; index < originalRequiredFields.length; index += 1) {
    const field = originalRequiredFields[index];
    field.required = isVisible(field);
  }
}

export function isValidBsnElfproef(bsn) {
  if (!/^\d{9}$/.test(bsn)) {
    return false;
  }

  let checksum = 0;

  for (let index = 0; index < 8; index += 1) {
    checksum += Number(bsn[index]) * (9 - index);
  }

  checksum -= Number(bsn[8]);

  return checksum % 11 === 0;
}

export function getNextSectionForRule(rule, selectedValue) {
  if (rule.targetSectionByValue && rule.targetSectionByValue[selectedValue]) {
    return rule.targetSectionByValue[selectedValue];
  }

  if (rule.defaultTargetSection) {
    return rule.defaultTargetSection;
  }

  return null;
}