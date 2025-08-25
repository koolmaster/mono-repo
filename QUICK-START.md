# 🚀 Izion SDK - Quick Start

## 📋 Các lệnh chính

```bash
# Xem hướng dẫn đầy đủ
pnpm dev-help

# Phát triển SDK hiện tại
pnpm dev:payment    # Payment SDK  → http://localhost:3001
pnpm dev:all-sdks   # Chạy tất cả SDKs cùng lúc

# Tạo SDK mới (với full UI + Router + Vite)
pnpm create-sdk auth        # Authentication SDK
pnpm create-sdk chat        # Chat SDK
pnpm create-sdk analytics   # Analytics SDK

# Build & Test
pnpm build          # Build shared packages
pnpm test           # Run tests
```

## 🏗️ Cấu trúc

```
izion-sdk/
├── packages/          # 📚 Shared libraries (chỉ source code)
│   ├── shared/       # Utilities, types, storage
│   ├── security/     # Anti-debugging features  
│   ├── api/          # HTTP client + interceptors
│   └── ui/           # React components
└── sdks/             # 🚀 SDK applications (Vite + React + Router)
    └── payment/      # Payment app với UI
```

## 💡 Workflow

1. **Tạo SDK mới** → `pnpm create-sdk <name>`
2. **Thêm dev script** → package.json
3. **Phát triển SDK** → `pnpm dev:<name>`
4. **Build packages** → `pnpm build` (khi cần)

## 🎯 Tạo SDK mới

```bash
pnpm create-sdk auth "Authentication SDK"
```

Script sẽ tự động tạo:
- ✅ **Vite config** với port riêng
- ✅ **React Router** với 3 pages
- ✅ **SCSS styling** 
- ✅ **TypeScript** setup
- ✅ **Package.json** đầy đủ
- ✅ **SDK class** template

## 🌐 SDK Development Features

- ✅ **Hot reload** development
- ✅ **Host info** rõ ràng (Local + Network)
- ✅ **Component library** integration
- ✅ **API client** ready
- ✅ **Security features** built-in

## ⚠️ Quan trọng

- **Packages** = Libraries (chỉ source code)
- **SDKs** = Applications (full development environment)
- Sau khi tạo SDK → thêm script vào package.json
