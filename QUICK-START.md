# 🚀 Izion SDK - Quick Start

## 📋 Các lệnh chính

```bash
# Xem hướng dẫn đầy đủ
pnpm dev-help

# Phát triển SDK (với UI + Router + Host info)
pnpm dev:payment    # Payment SDK  → http://localhost:3001
pnpm dev:bank       # Bank SDK     → http://localhost:3002
pnpm dev:game       # Game SDK     → http://localhost:3003
pnpm dev:social     # Social SDK   → http://localhost:3004
pnpm dev:all-sdks   # Tất cả SDK

# Build (khi thay đổi shared packages)
pnpm build

# Tạo SDK mới
pnpm create-sdk

# Test
pnpm test
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
    ├── payment/      # Payment app với UI
    ├── bank/         # Banking app với UI
    ├── game/         # Gaming app với UI
    └── social/       # Social app với UI
```

## 💡 Workflow

1. **Thay đổi shared packages** → `pnpm build`
2. **Phát triển SDK** → `pnpm dev:payment` (hiển thị host + port)  
3. **Test** → `pnpm test`
4. **Tạo SDK mới** → `pnpm create-sdk`

## 🌐 SDK Development Features

- ✅ **React Router** cho mỗi SDK
- ✅ **Vite dev server** với hot reload
- ✅ **Host info** rõ ràng (Local + Network)
- ✅ **SCSS styling** support
- ✅ **Component library** từ @izion/ui
- ✅ **API integration** từ @izion/api
- ✅ **Security features** từ @izion/security

## ⚠️ Quan trọng

- **Packages** = Libraries (chỉ source code, không dev server)
- **SDKs** = Applications (có UI, router, dev server với port riêng)
- Chỉ chạy `dev` cho SDKs, không phải packages!
