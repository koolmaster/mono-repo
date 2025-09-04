// Security utilities for Payment SDK
export const security = {
  // Block F12 and developer tools
  blockF12: () => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        console.warn('Developer tools blocked');
      }
    });
  },

  // Initialize anti-debugging measures
  initAntiDebug: () => {
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200) {
        console.warn('Debug tools detected');
      }
    }, 1000);
  },

  // Setup payment-specific security measures
  setupPaymentSecurity: () => {
    // Prevent right-click on payment forms
    document.addEventListener('contextmenu', (e) => {
      const target = e.target as Element;
      if (target?.closest?.('.payment-form')) {
        e.preventDefault();
      }
    });

    // Prevent text selection on sensitive elements
    document.addEventListener('selectstart', (e) => {
      const target = e.target as Element;
      if (target?.closest?.('.payment-sensitive')) {
        e.preventDefault();
      }
    });
  },

  // Prevent copy/paste on sensitive fields
  preventCopyPaste: (selector: string) => {
    document.addEventListener('DOMContentLoaded', () => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.addEventListener('copy', (e) => e.preventDefault());
        element.addEventListener('paste', (e) => e.preventDefault());
        element.addEventListener('cut', (e) => e.preventDefault());
      });
    });
  },

  // Disable printing for sensitive content
  disablePrint: () => {
    window.addEventListener('beforeprint', (e) => {
      e.preventDefault();
      console.warn('Printing disabled for security');
    });

    // Block Ctrl+P
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        console.warn('Print shortcut blocked');
      }
    });
  },

  // Initialize all security measures
  initializeAll: () => {
    security.blockF12();
    security.initAntiDebug();
    security.setupPaymentSecurity();
    security.disablePrint();
    console.log('🔒 Payment SDK Security initialized');
  }
};
