import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import cors from 'cors';

// CORS設定
const corsHandler = cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// レスポンス型定義
interface TestResponse {
  message: string;
}

interface SampleResponse {
  value: number;
  message: string;
}

interface ErrorResponse {
  error: string;
}

// 現在時刻をyyyymmdd-hhmmss形式でフォーマットする関数
function formatTimestamp(date: Date): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

// 1〜100のランダムな整数を生成する関数
function generateRandomValue(): number {
  return Math.floor(Math.random() * 100) + 1;
}

// 5文字のランダムな英数字を生成する関数
function generateRandomMessage(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// JSONレスポンスを送信するヘルパー関数
function sendJson(res: ServerResponse, statusCode: number, data: any): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// /test エンドポイントのハンドラー
function handleTestEndpoint(req: IncomingMessage, res: ServerResponse): void {
  if (req.method !== 'GET') {
    const errorResponse: ErrorResponse = { error: 'Method not allowed' };
    sendJson(res, 405, errorResponse);
    return;
  }

  try {
    const now = new Date();
    const timestamp = formatTimestamp(now);
    const response: TestResponse = {
      message: `hello world ${timestamp}`
    };
    
    console.log(`[${new Date().toISOString()}] GET /test - Response: ${response.message}`);
    sendJson(res, 200, response);
  } catch (error) {
    console.error('Error in /test:', error);
    const errorResponse: ErrorResponse = { error: 'Internal server error' };
    sendJson(res, 500, errorResponse);
  }
}

// /sample エンドポイントのハンドラー
function handleSampleEndpoint(req: IncomingMessage, res: ServerResponse): void {
  if (req.method !== 'GET') {
    const errorResponse: ErrorResponse = { error: 'Method not allowed' };
    sendJson(res, 405, errorResponse);
    return;
  }

  try {
    const randomValue = generateRandomValue();
    const randomMessage = generateRandomMessage();
    const response: SampleResponse = {
      value: randomValue,
      message: randomMessage
    };
    
    console.log(`[${new Date().toISOString()}] GET /sample - Response: value=${response.value}, message=${response.message}`);
    sendJson(res, 200, response);
  } catch (error) {
    console.error('Error in /sample:', error);
    const errorResponse: ErrorResponse = { error: 'Internal server error' };
    sendJson(res, 500, errorResponse);
  }
}

// ルーティングハンドラー
function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const urlParts = parse(req.url || '', true);
  const pathname = urlParts.pathname;

  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

  // CORS処理
  corsHandler(req as any, res as any, () => {
    // ルーティング
    if (pathname === '/test') {
      handleTestEndpoint(req, res);
    } else if (pathname === '/sample') {
      handleSampleEndpoint(req, res);
    } else if (pathname === '/') {
      // ルートパスにアクセスした場合の簡単な情報
      const info = {
        name: 'Vue3 Swagger Verification API',
        version: '1.0.0',
        endpoints: ['/test', '/sample'],
        timestamp: new Date().toISOString()
      };
      sendJson(res, 200, info);
    } else {
      // 404 Not Found
      const errorResponse: ErrorResponse = { error: 'Not found' };
      sendJson(res, 404, errorResponse);
    }
  });
}

// サーバーの作成と起動
const PORT = process.env.PORT || 3001;
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`🚀 API Server is running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation: Available endpoints (add /api prefix when using from frontend):`);
  console.log(`   GET /test   - Returns greeting message with timestamp`);
  console.log(`   GET /sample - Returns random value (1-100) and 5-char random string`);
  console.log(`   GET /       - Returns server information`);
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
