import { getSample } from "./sample"
import { getTest } from "./test"
import { postHello } from "./postHello"

export const getMockResponse = (path: string, method: string = 'GET', body?: any) => {
  const key = `${method.toUpperCase()} ${path}`
  
  switch (key) {
    case 'GET /sample':
      return getSample()
    case 'GET /test':
      return getTest()
    case 'POST /hello':
      return postHello(body)
    default:
      throw new Error(`Mock not found for: ${method} ${path}`)
  }
}