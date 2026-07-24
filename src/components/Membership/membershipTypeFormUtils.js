export const INITIAL_MEMBERSHIP_TYPE_FORM = {
  federationNode: null,
  title: "",
  description: "",
  code: "",
  validityId: "",
  currencyId: "",
  joiningFee: "",
  renewalFee: "",
  status: "1",
}

export function buildFormFromMembershipType(membershipType, federationOptions) {
  if (!membershipType) return INITIAL_MEMBERSHIP_TYPE_FORM

  const federationNode =
    federationOptions.find(
      (node) => node.id === membershipType.federationNodeId,
    ) ||
    membershipType.federationNode ||
    null

  return {
    federationNode,
    title: membershipType.label || "",
    description: membershipType.description || "",
    code: membershipType.code || "",
    validityId:
      membershipType.validityId != null
        ? String(membershipType.validityId)
        : "",
    currencyId:
      membershipType.currencyId != null
        ? String(membershipType.currencyId)
        : "",
    joiningFee:
      membershipType.joiningFee != null
        ? String(membershipType.joiningFee)
        : "",
    renewalFee:
      membershipType.renewalFee != null
        ? String(membershipType.renewalFee)
        : "",
    status:
      membershipType.status != null ? String(membershipType.status) : "1",
  }
}

export function validateMembershipTypeForm(form, t) {
  if (!form.federationNode?.id) return t.validation.federationRequired
  if (!form.title.trim()) return t.validation.titleRequired
  if (!form.code.trim()) return t.validation.codeRequired
  if (!/^[A-Z0-9_]+$/.test(form.code.trim())) {
    return t.validation.codeUppercase
  }
  if (!form.validityId) return t.validation.validityRequired
  if (!form.currencyId) return t.validation.currencyRequired
  if (form.joiningFee === "" || Number.isNaN(Number(form.joiningFee))) {
    return t.validation.joiningFeeRequired
  }
  if (form.renewalFee === "" || Number.isNaN(Number(form.renewalFee))) {
    return t.validation.renewalFeeRequired
  }
  return ""
}

export function buildMembershipTypePayload(form) {
  return {
    label: form.title.trim(),
    description: form.description.trim(),
    code: form.code.trim().toUpperCase(),
    federationNodeId: form.federationNode.id,
    validityId: Number(form.validityId),
    currencyId: Number(form.currencyId),
    joiningFee: Number(form.joiningFee),
    renewalFee: Number(form.renewalFee),
    status: Number(form.status),
  }
}
