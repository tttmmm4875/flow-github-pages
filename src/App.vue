<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { getTest, getSample } from './api'
import type { operations } from './types/api'

// 型定義
type TestResponse = operations['getTestMessage']['responses'][200]['content']['application/json']
type SampleResponse = operations['getSampleData']['responses'][200]['content']['application/json']
type ErrorResponse = operations['getTestMessage']['responses'][500]['content']['application/json']

// レスポンス履歴を管理する配列
const responses = ref<((TestResponse | SampleResponse) & { timestamp: string; type: 'test' | 'sample' })[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// APIを呼び出す関数
const callTestApi = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // api.tsのgetTestメソッドを使用
    const apiResponse = await getTest()
    
    // 現在時刻を取得
    const now = new Date()
    
    // レスポンス履歴に追加
    responses.value.unshift({
      ...apiResponse,
      timestamp: now.toLocaleString(),
      type: 'test'
    })
    
    console.log('API called successfully:', apiResponse)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 500) {
        const errorData = err.response.data as ErrorResponse
        error.value = `サーバーエラー: ${errorData.error}`
      } else if (err.code === 'ECONNREFUSED') {
        error.value = 'APIサーバーに接続できません。サーバーが起動していることを確認してください。'
      } else {
        error.value = `API呼び出しエラー: ${err.message}`
      }
    } else {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
    console.error('API call failed:', err)
  } finally {
    isLoading.value = false
  }
}



// SampleAPIを呼び出す関数
const callSampleApi = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // api.tsのgetSampleメソッドを使用
    const apiResponse = await getSample()
    
    // 現在時刻を取得
    const now = new Date()
    
    // レスポンス履歴に追加
    responses.value.unshift({
      ...apiResponse,
      timestamp: now.toLocaleString(),
      type: 'sample'
    })
    
    console.log('Sample API called successfully:', apiResponse)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 500) {
        const errorData = err.response.data as ErrorResponse
        error.value = `サーバーエラー: ${errorData.error}`
      } else if (err.code === 'ECONNREFUSED') {
        error.value = 'APIサーバーに接続できません。サーバーが起動していることを確認してください。'
      } else {
        error.value = `API呼び出しエラー: ${err.message}`
      }
    } else {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    }
    console.error('Sample API call failed:', err)
  } finally {
    isLoading.value = false
  }
}


</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Vue3 + Swagger 検証用リポジトリ テスト</h1>
      <p>openapi-typescriptを用いた型安全なAPI呼び出しのデモ</p>
    </header>

    <main class="main">
      <section class="api-section">
        <h2>API テスト</h2>
        <div class="mock-status">
          <span class="mock-indicator">🎭 Mock Mode: ON</span>
          <span class="mock-note">※ モックデータが返されます</span>
        </div>
        <div class="button-group">
          <button 
            @click="callTestApi" 
            :disabled="isLoading"
            class="api-button api-button-primary"
          >
            {{ isLoading ? 'Loading...' : '🎭 Mock Test API を呼び出す' }}
          </button>
          <button 
            @click="callSampleApi" 
            :disabled="isLoading"
            class="api-button api-button-accent"
          >
            {{ isLoading ? 'Loading...' : '🎭 Mock Sample API を呼び出す' }}
          </button>
        </div>
        
        <div v-if="error" class="error">
          エラー: {{ error }}
        </div>
      </section>

      <section class="history-section">
        <h2>レスポンス履歴</h2>
        <div v-if="responses.length === 0" class="no-data">
          まだAPIが呼び出されていません
        </div>
        <div v-else class="response-list">
          <div 
            v-for="(response, index) in responses" 
            :key="index"
            :class="['response-item', `response-${response.type}`]"
          >
            <div class="response-timestamp">{{ response.timestamp }} ({{ response.type }})</div>
            <div v-if="response.type === 'test'" class="response-message">{{ response.message }}</div>
            <div v-else-if="response.type === 'sample'" class="response-content">
              <div class="response-value">Value: {{ (response as any).value }}</div>
              <div class="response-message">Message: {{ (response as any).message }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.header h1 {
  color: #1e293b;
  margin-bottom: 10px;
}

.header p {
  color: #64748b;
  font-size: 16px;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.api-section {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.api-button {
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
  min-width: 200px;
}

.api-button-primary {
  background: #3b82f6;
  color: white;
}

.api-button-primary:hover:not(:disabled) {
  background: #2563eb;
}

.api-button-accent {
  background: #f59e0b;
  color: white;
}

.api-button-accent:hover:not(:disabled) {
  background: #d97706;
}

.api-button-secondary {
  background: #10b981;
  color: white;
}

.api-button-secondary:hover:not(:disabled) {
  background: #059669;
}

.api-button-tertiary {
  background: #8b5cf6;
  color: white;
}

.api-button-tertiary:hover:not(:disabled) {
  background: #7c3aed;
}

.api-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.error {
  margin-top: 10px;
  padding: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 6px;
}

.mock-status {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mock-indicator {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #bbdefb;
}

.mock-note {
  color: #64748b;
  font-size: 12px;
  font-style: italic;
}

.history-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.history-section h2 {
  color: #1e293b;
  margin-bottom: 20px;
}

.no-data {
  color: #64748b;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

.response-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.response-item {
  padding: 16px;
  background: #f1f5f9;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.response-test {
  border-left-color: #3b82f6;
}

.response-sample {
  border-left-color: #f59e0b;
}

.response-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.response-value {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.response-timestamp {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 5px;
}

.response-message {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}
</style>
