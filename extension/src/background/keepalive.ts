let heartbeatInterval: any = null;

export function startKeepalive(): void {
  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.getPlatformInfo) {
      chrome.runtime.getPlatformInfo(() => {
        // Access lastError to ensure no unchecked runtime errors during teardown
        const _ = chrome.runtime?.lastError;
      });
    }
  }, 20000);
}

export function stopKeepalive(): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
