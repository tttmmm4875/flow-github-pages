import { getSample } from "./sample"
import { getTest } from "./test"

export const getMockResponse = (path: string) => {
  switch (path) {
    case '/sample':
      return getSample()
    case '/test':
      return getTest()
    default:
      throw new Error(`Mock not found for path: ${path}`)
  }
}