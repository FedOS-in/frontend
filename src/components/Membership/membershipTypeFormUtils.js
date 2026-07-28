import {
  buildNodesById,
  getAncestorChain,
  mapApiSplitsToForm,
  toPayloadSplits,
  validateSplitRows,
} from "../../utils/membershipFeeSplitUtils"

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
  joiningSplits: [],
  renewalSplits: [],
  showJoiningSplits: false,
  showRenewalSplits: false,
}

export function buildFormFromMembershipType(membershipType, federationOptions) {
  if (!membershipType) return INITIAL_MEMBERSHIP_TYPE_FORM

  const federationNode =
    federationOptions.find(
      (node) => node.id === membershipType.federationNodeId,
    ) ||
    membershipType.federationNode ||
    null

  const joiningSplits = mapApiSplitsToForm(
    membershipType.feeSplits,
    "JOINING",
  )
  const renewalSplits = mapApiSplitsToForm(
    membershipType.feeSplits,
    "RENEWAL",
  )

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
    joiningSplits,
    renewalSplits,
    showJoiningSplits: joiningSplits.length > 0,
    showRenewalSplits: renewalSplits.length > 0,
  }
}

function splitValidationLabels(t, feeKey) {
  return {
    nodeRequired: t.validation[`${feeKey}SplitNodeRequired`],
    nodeInvalid: t.validation[`${feeKey}SplitNodeInvalid`],
    nodeUnique: t.validation[`${feeKey}SplitNodeUnique`],
    numberRequired: t.validation[`${feeKey}SplitNumberRequired`],
    percentTotal: t.validation[`${feeKey}SplitPercentTotal`],
    amountTotal: t.validation[`${feeKey}SplitAmountTotal`],
  }
}

export function validateMembershipTypeForm(form, t, federationOptions = []) {
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

  const nodesById = buildNodesById(federationOptions)
  const chain = getAncestorChain(form.federationNode, nodesById)
  const allowedIds = new Set(chain.map((node) => node.id))

  const joiningError = validateSplitRows(
    form.joiningSplits || [],
    form.joiningFee,
    splitValidationLabels(t, "joining"),
    allowedIds,
  )
  if (joiningError) return joiningError

  const renewalError = validateSplitRows(
    form.renewalSplits || [],
    form.renewalFee,
    splitValidationLabels(t, "renewal"),
    allowedIds,
  )
  if (renewalError) return renewalError

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
    joiningSplits: toPayloadSplits(form.joiningSplits || []),
    renewalSplits: toPayloadSplits(form.renewalSplits || []),
  }
}
