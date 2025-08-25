export class SecurityManager {
  private encryptionKey: string;

  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
  }

  encrypt(data: string): string {
    // Simple encryption for demo - in production use proper crypto
    return btoa(encodeURIComponent(data + this.encryptionKey));
  }

  decrypt(encryptedData: string): string {
    // Simple decryption for demo - in production use proper crypto
    const decoded = decodeURIComponent(atob(encryptedData));
    return decoded.replace(this.encryptionKey, '');
  }

  hash(data: string): string {
    // Simple hash for demo - in production use proper crypto
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  generateSalt(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Security features to prevent developer tools access
export const blockDevTools = (): void => {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'C') ||
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      return false;
    }
  });

  // Detect if developer tools are open
  let devtools = {
    open: false,
    orientation: null as string | null,
  };

  const threshold = 160;

  setInterval(() => {
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      if (!devtools.open) {
        devtools.open = true;
        // Redirect or show warning
        console.clear();
        alert('Developer tools detected! Redirecting...');
        window.location.href = 'about:blank';
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // Disable text selection
  document.onselectstart = () => false;
  document.ondragstart = () => false;
};

export const enableSecurityFeatures = (config: { 
  enableDevToolsBlocking: boolean;
  enableContextMenuBlocking: boolean;
}): void => {
  if (config.enableDevToolsBlocking || config.enableContextMenuBlocking) {
    blockDevTools();
  }
};
