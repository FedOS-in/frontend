import EditUserFormPageClient from "./pageClient"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

async function loadFormById(formId) {
  const response = await fetch(`${backendUrl}/api/forms/${formId}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    const payloadError = await response.json().catch(() => null)
    throw new Error(payloadError?.message || "Unable to load form")
  }

  return response.json()
}

export default async function EditUserFormPage({ searchParams }) {
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const formId = resolvedSearchParams?.formId || ""

  if (!formId) {
    return (
      <EditUserFormPageClient
        errorMessage="Missing formId in URL"
        initialForm={null}
      />
    )
  }

  try {
    const initialForm = await loadFormById(formId)
    return <EditUserFormPageClient initialForm={initialForm} errorMessage="" />
  } catch (error) {
    return (
      <EditUserFormPageClient
        errorMessage={error.message || "Unable to load form"}
        initialForm={null}
      />
    )
  }
}
