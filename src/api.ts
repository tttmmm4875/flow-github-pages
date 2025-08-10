import axios from "axios";
import type { operations } from './types/api'
import { getMockResponse } from './mocks/mock'

// 型定義
type TestResponse = operations['getTestMessage']['responses'][200]['content']['application/json']
type SampleResponse = operations['getSampleData']['responses'][200]['content']['application/json']

// 環境変数でモック切り替え（デフォルトはtrue）
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

const axiosClient = axios.create({
  baseURL: useMock ? '/mock' : '/api'
})

// 🎭 シンプルなモックインターセプター
if (useMock) {
  console.log('🎭 Mock interceptor enabled - always success')
  
  // レスポンスインターセプター
  axiosClient.interceptors.response.use(
    (response) => {
      // 成功レスポンスでもHTMLの場合はモック処理（Viteサーバーがindex.htmlを返す場合）
      if (response.config.baseURL === '/mock') {
        const path = response.config.url || ''
        const contentType = response.headers['content-type'] || ''
        
        // HTMLレスポンスの場合はモックデータに変換
        if (contentType.includes('text/html') || typeof response.data === 'string') {
          console.log(`🎭 Processing mock request (HTML detected): /mock${path}`)
          
          try {
            const mockData = getMockResponse(path)
            console.log(`🎭 Mock success response for /mock${path}:`, mockData)
            
            // モックレスポンスに変換
            return Promise.resolve({
              ...response,
              data: mockData,
              headers: {
                ...response.headers,
                'content-type': 'application/json',
                'x-mock-response': 'true'
              }
            })
          } catch (mockError) {
            console.error(`🚨 Mock endpoint not found: /mock${path}`)
            // モックが見つからない場合はエラーとして処理
            return Promise.reject({
              response: {
                status: 404,
                statusText: 'Not Found',
                data: { error: `Mock endpoint not found: ${path}` },
                headers: { 'content-type': 'application/json' },
                config: response.config
              }
            })
          }
        }
      }
      
      // 通常の成功レスポンスはそのまま返す
      return response
    },
    (error) => {
      const config = error.config
      const path = config.url || ''
      
      // モックエンドポイントの場合のみ処理
      if (config.baseURL === '/mock') {
        console.log(`🎭 Processing mock request (error): /mock${path}`)
        
        try {
          // モックデータを取得
          const mockData = getMockResponse(path)
          
          console.log(`🎭 Mock success response for /mock${path}:`, mockData)
          
          // 成功レスポンスを作成
          const mockResponse = {
            data: mockData,
            status: 200,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json',
              'x-mock-response': 'true'
            },
            config: config,
            request: {}
          }
          
          return Promise.resolve(mockResponse)
          
        } catch (mockError) {
          // 未定義エンドポイントの場合
          console.error(`🚨 Mock endpoint not found: /mock${path}`)
          
          const notFoundError = {
            ...error,
            response: {
              status: 404,
              statusText: 'Not Found',
              data: { error: `Mock endpoint not found: ${path}` },
              headers: { 'content-type': 'application/json' },
              config: config
            }
          }
          return Promise.reject(notFoundError)
        }
      }
      
      // 非モックエラーはそのまま返す
      return Promise.reject(error)
    }
  )
}

export const getSample = (): Promise<SampleResponse> => {
  return axiosClient.get<SampleResponse>('/sample').then((res) => res.data)
}

export const getTest = (): Promise<TestResponse> => {
  return axiosClient.get<TestResponse>('/test').then((res) => res.data)
}

// デバッグ情報
console.log(`🔧 API Client initialized:`)
console.log(`   Base URL: ${axiosClient.defaults.baseURL}`)
console.log(`   Mock Mode: ${useMock ? 'ON (Always Success)' : 'OFF'}`)