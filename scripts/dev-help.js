#!/usr/bin/env node

console.log(`
🚀 IZION SDK - Development Workflow Guide

📦 PACKAGES vs SDKs:
• packages/     → Shared libraries (chỉ source code, không chạy dev)
• sdks/         → Applications (có UI, router, chạy dev server)

🔧 DEVELOPMENT COMMANDS:

📝 Phát triển SDK (chạy dev server với UI):
• pnpm dev:payment    → http://localhost:3001/ (Payment SDK)
• pnpm dev:all-sdks   → Chạy tất cả SDKs cùng lúc
• pnpm create-sdk     → Tạo SDK mới với UI + Router

🏗️ Build & Test:
• pnpm build          → Build tất cả packages
• pnpm test           → Run tests

📁 STRUCTURE:
packages/shared/      → Utilities, types, storage
packages/security/    → Anti-debugging features  
packages/api/         → HTTP client + interceptors
packages/ui/          → React components
sdks/payment/         → Payment app với router + UI

⚠️  LƯU Ý:
• Packages = Libraries (chỉ source code)
• SDKs = Applications (có dev server, UI, router)
• Khi thay đổi packages → chạy 'pnpm build'
• Khi develop SDK → chạy 'pnpm dev:sdk-name'

🌐 SDK DEVELOPMENT:
• Mỗi SDK có React Router riêng
• UI components từ @izion/ui
• API client từ @izion/api  
• Security từ @izion/security
• Utils từ @izion/shared

🎯 TẠO SDK MỚI:
• pnpm create-sdk auth → Tạo Authentication SDK
• pnpm create-sdk chat → Tạo Chat SDK
• Script sẽ tự động tạo full UI + Router + Vite config
`);
