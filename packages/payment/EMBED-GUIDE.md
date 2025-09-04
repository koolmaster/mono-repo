# 💳 Payment SDK - Embed Integration Guide

## 🚀 Overview

Payment SDK là một giải pháp thanh toán hoàn chỉnh có thể được nhúng vào website hoặc ứng dụng mobile của khách hàng thông qua URL. SDK hỗ trợ đầy đủ UI, tích hợp API, bảo mật cao và có thể tùy chỉnh qua URL parameters.

## 🔗 Live Demo URLs

### Standalone Mode
- **Demo**: http://localhost:3001/
- **With API Key**: http://localhost:3001/?apiKey=demo-api-key-12345&customerId=customer_123

### Embed Mode  
- **Basic Embed**: http://localhost:3001/?embed=true&apiKey=demo-api-key&customerId=customer_123
- **Custom Theme**: http://localhost:3001/?embed=true&theme=dark&hideHeader=true&hideFooter=true
- **Full Config**: http://localhost:3001/?embed=true&apiKey=your-api-key&customerId=cust_123&currency=USD&theme=light&security=true

## 📋 URL Parameters

| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `apiKey` | string | API key để xác thực (required) | - | `demo-api-key-12345` |
| `customerId` | string | ID khách hàng | - | `customer_123` |
| `embed` | boolean | Bật chế độ embed | `false` | `true` |
| `theme` | string | Theme UI (`light`, `dark`) | `light` | `dark` |
| `hideHeader` | boolean | Ẩn header | `false` | `true` |
| `hideFooter` | boolean | Ẩn footer | `false` | `true` |
| `currency` | string | Tiền tệ mặc định | `USD` | `VND`, `EUR` |
| `lang` | string | Ngôn ngữ | `en` | `vi`, `es` |
| `security` | boolean | Bật tính năng bảo mật | `true` | `false` |
| `baseURL` | string | API endpoint | `https://api.example.com` | Custom API URL |

## 🖥️ Embedding Options

### 1. Iframe Embed (Recommended)

```html
<iframe 
  src="http://localhost:3001/?embed=true&apiKey=YOUR_API_KEY&customerId=CUSTOMER_123"
  width="100%" 
  height="600" 
  frameborder="0"
  allow="payment"
  style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
></iframe>
```

### 2. Popup Window

```javascript
function openPaymentPortal() {
  const params = new URLSearchParams({
    embed: 'true',
    apiKey: 'YOUR_API_KEY',
    customerId: 'CUSTOMER_123',
    theme: 'light'
  });
  
  window.open(
    `http://localhost:3001/?${params}`,
    'payment',
    'width=800,height=600,scrollbars=yes,resizable=yes'
  );
}
```

### 3. Full Page Redirect

```javascript
function redirectToPayment() {
  const paymentUrl = new URL('http://localhost:3001/');
  paymentUrl.searchParams.set('apiKey', 'YOUR_API_KEY');
  paymentUrl.searchParams.set('customerId', 'CUSTOMER_123');
  paymentUrl.searchParams.set('amount', '99.99');
  paymentUrl.searchParams.set('currency', 'USD');
  
  window.location.href = paymentUrl.toString();
}
```

## 📨 PostMessage Events

Khi ở chế độ embed, Payment SDK sẽ gửi events đến parent window:

### Payment Success
```javascript
// Listen for payment success
window.addEventListener('message', (event) => {
  if (event.data.type === 'PAYMENT_SUCCESS') {
    console.log('Payment completed:', event.data.data);
    // Handle success: hide iframe, show confirmation, etc.
  }
});
```

### Payment Error
```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'PAYMENT_ERROR') {
    console.log('Payment failed:', event.data.error);
    // Handle error: show error message, retry, etc.
  }
});
```

### Configuration Update
```javascript
// Send config updates to embedded SDK
document.querySelector('iframe').contentWindow.postMessage({
  type: 'PAYMENT_CONFIG_UPDATE',
  config: {
    theme: 'dark',
    currency: 'EUR'
  }
}, '*');
```

## 🔒 Security Features

### Authentication
- API key validation
- Origin checking
- Token expiration
- Customer ID verification

### Anti-Debugging
- F12 key blocking
- Developer tools detection  
- Right-click prevention on forms
- Text selection prevention on sensitive fields

### Secure Communication
- HTTPS only in production
- PostMessage origin validation
- Iframe sandbox attributes

## 🎨 Theming & Customization

### Dark Theme
```
?theme=dark&embed=true
```

### Minimal UI
```
?embed=true&hideHeader=true&hideFooter=true
```

### Custom Colors (CSS Variables)
```css
:root {
  --primary-color: #your-brand-color;
  --primary-gradient: linear-gradient(135deg, #color1, #color2);
}
```

## 💻 Integration Examples

### React Component
```jsx
import React, { useRef, useEffect } from 'react';

function PaymentEmbed({ customerId, onSuccess }) {
  const iframeRef = useRef();
  
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'PAYMENT_SUCCESS') {
        onSuccess(event.data.data);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess]);
  
  const src = `http://localhost:3001/?embed=true&apiKey=${process.env.REACT_APP_PAYMENT_API_KEY}&customerId=${customerId}`;
  
  return (
    <iframe
      ref={iframeRef}
      src={src}
      width="100%"
      height="600"
      frameBorder="0"
      allow="payment"
    />
  );
}
```

### Vue.js Component
```vue
<template>
  <iframe
    :src="paymentUrl"
    width="100%"
    height="600"
    frameborder="0"
    allow="payment"
    @load="onIframeLoad"
  />
</template>

<script>
export default {
  props: ['customerId'],
  computed: {
    paymentUrl() {
      const params = new URLSearchParams({
        embed: 'true',
        apiKey: process.env.VUE_APP_PAYMENT_API_KEY,
        customerId: this.customerId,
        theme: 'light'
      });
      return `http://localhost:3001/?${params}`;
    }
  },
  mounted() {
    window.addEventListener('message', this.handlePaymentEvent);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handlePaymentEvent);
  },
  methods: {
    handlePaymentEvent(event) {
      if (event.data.type === 'PAYMENT_SUCCESS') {
        this.$emit('payment-success', event.data.data);
      }
    }
  }
}
</script>
```

### Angular Component
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-embed',
  template: `
    <iframe 
      [src]="paymentUrl" 
      width="100%" 
      height="600" 
      frameborder="0"
      allow="payment">
    </iframe>
  `
})
export class PaymentEmbedComponent {
  @Input() customerId: string;
  @Output() paymentSuccess = new EventEmitter();
  
  get paymentUrl() {
    const params = new URLSearchParams({
      embed: 'true',
      apiKey: environment.paymentApiKey,
      customerId: this.customerId
    });
    return `http://localhost:3001/?${params}`;
  }
  
  ngOnInit() {
    window.addEventListener('message', this.handleMessage);
  }
  
  ngOnDestroy() {
    window.removeEventListener('message', this.handleMessage);
  }
  
  handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'PAYMENT_SUCCESS') {
      this.paymentSuccess.emit(event.data.data);
    }
  }
}
```

## 🔧 Development & Testing

### Local Development
```bash
# Start Payment SDK
pnpm dev:payment

# Access URLs:
# - Standalone: http://localhost:3001/
# - Embed: http://localhost:3001/?embed=true&apiKey=demo-api-key
```

### Production URLs
```bash
# Replace localhost with your domain
https://your-domain.com/payment-sdk/?embed=true&apiKey=YOUR_API_KEY
```

## 📊 Analytics & Monitoring

### Track Events
```javascript
// Listen for all payment events
window.addEventListener('message', (event) => {
  switch(event.data.type) {
    case 'PAYMENT_START':
      analytics.track('Payment Started', event.data);
      break;
    case 'PAYMENT_SUCCESS':
      analytics.track('Payment Completed', event.data);
      break;
    case 'PAYMENT_ERROR':
      analytics.track('Payment Failed', event.data);
      break;
  }
});
```

## 🚀 Deployment

### Build for Production
```bash
# Build Payment SDK
pnpm build

# Deploy to your hosting service
# Files will be in packages/payment/dist/
```

### Environment Variables
```env
VITE_API_BASE_URL=https://api.your-domain.com
VITE_PAYMENT_API_KEY=your-production-api-key
VITE_ALLOWED_ORIGINS=your-domain.com,partner-domain.com
```

## 📞 Support

Để được hỗ trợ hoặc báo cáo lỗi, vui lòng liên hệ:
- Email: support@izion.dev
- Docs: https://docs.izion.dev/payment-sdk
- GitHub: https://github.com/izion/payment-sdk

---

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Full UI với React Router
- ✅ URL parameter configuration  
- ✅ Embed mode support
- ✅ PostMessage communication
- ✅ Security features
- ✅ Theme customization
- ✅ Multi-currency support
- ✅ Validation & error handling
