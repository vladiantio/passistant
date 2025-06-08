// Add WebGPU type definitions
declare global {
  interface Navigator {
    gpu?: {
      requestAdapter(): Promise<GPUAdapter | null>;
    };
  }
  
  interface GPUAdapter {
    // We don't need the full interface definition for this check
    readonly __brand: 'GPUAdapter';
  }
}

/**
 * Check if GPU is available
 * @returns {Promise<boolean>}
 */
export async function checkGPUAvailability() {
  if (!("gpu" in navigator)) {
    return false;
  }
  const adapter = await navigator.gpu?.requestAdapter();
  if (!adapter) {
    return false;
  }
  return true;
}
