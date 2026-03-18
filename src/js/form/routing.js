import { sections, form } from "./elements.js";
import { getNextSectionForRule, syncVisibleRequiredFields } from "./helpers.js";

const visibilityUpdateDelay = 50;

const routingRules = [
  {
    selector: 'input[name="maritalStatus"]',
    targetSectionByValue: {
      ja: sections.maritalAgreementSection,
      nee: sections.childrenInfoSection,
    },
  },
  {
    selector: 'input[name="maritalAgreement"]',
    defaultTargetSection: sections.finalSettlementSection,
  },
  {
    selector: 'input[name="finalSettlement"]',
    defaultTargetSection: sections.childrenInfoSection,
  },
  {
    selector: 'input[name="children"]',
    targetSectionByValue: {
      ja: sections.deceasedChildInfoSection,
      nee: sections.testamentInfoSection,
    },
  },
  {
    selector: 'input[name="deceasedChild"]',
    targetSectionByValue: {
      ja: sections.grandchildrenInfoSection,
      nee: sections.testamentInfoSection,
    },
  },
  {
    selector: 'input[name="deceasedChildGrandchildren"]',
    defaultTargetSection: sections.testamentInfoSection,
  },
  {
    selector: 'input[name="testament"]',
    targetSectionByValue: {
      ja: sections.notaryInfoSection,
    },
  },
];

function scheduleSectionUpdate(targetSection) {
  window.setTimeout(function () {
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }, visibilityUpdateDelay);
}

export function bindVisibilityBasedRequiredFields() {
  if (!form) {
    return;
  }

  form.addEventListener("change", function () {
    syncVisibleRequiredFields();
  });
}

export function bindRoutingRules() {
  for (let ruleIndex = 0; ruleIndex < routingRules.length; ruleIndex += 1) {
    const rule = routingRules[ruleIndex];
    const inputs = document.querySelectorAll(rule.selector);

    for (let inputIndex = 0; inputIndex < inputs.length; inputIndex += 1) {
      const input = inputs[inputIndex];

      input.addEventListener("change", function (event) {
        const nextSection = getNextSectionForRule(rule, event.target.value);

        if (nextSection) {
          scheduleSectionUpdate(nextSection);
        }
      });
    }
  }
}