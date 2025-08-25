export class AntiDebugger {
  private static instance: AntiDebugger;
  private debuggerDetected = false;
  private intervals: NodeJS.Timeout[] = [];

  static getInstance(): AntiDebugger {
    if (!AntiDebugger.instance) {
      AntiDebugger.instance = new AntiDebugger();
    }
    return AntiDebugger.instance;
  }

  private constructor() {
    this.init();
  }

  private init(): void {
    this.detectDevTools();
    this.blockKeyboardShortcuts();
    this.detectDebugging();
    this.obfuscateConsole();
  }

  private detectDevTools(): void {
    const threshold = 160;
    
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        this.onDebuggerDetected();
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    this.intervals.push(interval);
  }

  private blockKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      // Block F12
      if (event.key === 'F12') {
        event.preventDefault();
        this.onDebuggerDetected();
        return false;
      }

      // Block Ctrl+Shift+I (Developer Tools)
      if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        this.onDebuggerDetected();
        return false;
      }

      // Block Ctrl+Shift+J (Console)
      if (event.ctrlKey && event.shiftKey && event.key === 'J') {
        event.preventDefault();
        this.onDebuggerDetected();
        return false;
      }

      // Block Ctrl+U (View Source)
      if (event.ctrlKey && event.key === 'U') {
        event.preventDefault();
        this.onDebuggerDetected();
        return false;
      }

      // Block Ctrl+Shift+C (Element Inspector)
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        this.onDebuggerDetected();
        return false;
      }
    });

    // Block right-click context menu
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      return false;
    });
  }

  private detectDebugging(): void {
    // Anti-debugging technique using timing
    const start = performance.now();
    
    const checkTiming = () => {
      const time = performance.now() - start;
      if (time > 100) { // If execution takes too long, debugger might be attached
        this.onDebuggerDetected();
      }
    };

    const interval = setInterval(checkTiming, 1000);
    this.intervals.push(interval);

    // Another anti-debugging technique
    let devtools = false;
    const detector = () => {
      if (devtools) {
        this.onDebuggerDetected();
      } else {
        devtools = true;
        console.clear();
        devtools = false;
      }
    };

    const detectorInterval = setInterval(detector, 100);
    this.intervals.push(detectorInterval);
  }

  private obfuscateConsole(): void {
    // Override console methods
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};

    // Clear console periodically
    const clearInterval = setInterval(() => {
      console.clear();
    }, 1000);
    this.intervals.push(clearInterval);
  }

  private onDebuggerDetected(): void {
    if (this.debuggerDetected) return;
    
    this.debuggerDetected = true;
    
    // Clear all content
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Show warning message
    document.body.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        font-size: 24px;
        z-index: 999999;
      ">
        <div style="text-align: center;">
          <h1>Access Denied</h1>
          <p>Developer tools detected. This application is protected.</p>
        </div>
      </div>
    `;

    // Redirect after delay
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 3000);
  }

  destroy(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    AntiDebugger.instance = null as any;
  }
}
