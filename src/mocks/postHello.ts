export const postHello = (requestBody: { id: number }) => {
  return {
    message: `request id→ ${requestBody.id}`
  }
}
