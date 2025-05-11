/**
 * Utility to test device performance capabilities
 */
import { PERFORMANCE_CONFIG, isMobileDevice } from '@/config/performance';

/**
 * Tests the device's rendering performance
 * @returns {Promise<{fps: number, level: 'high' | 'medium' | 'low' | 'gradient'}>}
 */
export const testDevicePerformance = () => {
  return new Promise((resolve) => {
    // Don't run in SSR
    if (typeof window === 'undefined') {
      resolve({ fps: 0, level: 'gradient' });
      return;
    }

    // Skip full test for obviously low-end devices
    const isMobile = isMobileDevice();
    const cpuCores = navigator.hardwareConcurrency || 0;
    
    // Quick check for very low-end devices
    if (isMobile && cpuCores <= PERFORMANCE_CONFIG.DEVICE.FORCE_GRADIENT_CORES_MOBILE) {
      resolve({ fps: 0, level: 'gradient' });
      return;
    }

    // Check WebGL support
    let webGLSupport = false;
    try {
      const canvas = document.createElement('canvas');
      webGLSupport = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      webGLSupport = false;
    }

    if (!webGLSupport) {
      resolve({ fps: 0, level: 'gradient' });
      return;
    }

    // Run FPS test
    let frameCount = 0;
    const startTime = performance.now();
    let rafId;

    // Simple test animation function
    const testFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < PERFORMANCE_CONFIG.MEASUREMENT_DURATION) {
        rafId = requestAnimationFrame(testFrame);
      } else {
        // Calculate FPS
        const fps = Math.round((frameCount * 1000) / elapsed);
        
        // Determine performance level
        let level;
        if (fps >= PERFORMANCE_CONFIG.FPS_THRESHOLD_HIGH) {
          level = 'high';
        } else if (fps >= PERFORMANCE_CONFIG.FPS_THRESHOLD_MEDIUM) {
          level = 'medium';
        } else if (fps >= PERFORMANCE_CONFIG.FPS_THRESHOLD_LOW) {
          level = 'low';
        } else {
          level = 'gradient';
        }
        
        resolve({ fps, level });
      }
    };
    
    // Start the test
    rafId = requestAnimationFrame(testFrame);
  });
};

/**
 * Monitors ongoing performance and calls the callback when performance drops
 * @param {Function} onPerformanceDrop - Callback when performance drops below threshold
 * @param {number} threshold - FPS threshold below which to trigger callback
 * @returns {Function} - Function to stop monitoring
 */
export const monitorPerformance = (onPerformanceDrop, threshold = PERFORMANCE_CONFIG.MIN_ACCEPTABLE_FPS) => {
  if (typeof window === 'undefined') return () => {};
  
  let frameCount = 0;
  let lastTime = performance.now();
  let rafId;
  let isMonitoring = true;
  
  const checkFrame = () => {
    if (!isMonitoring) return;
    
    const now = performance.now();
    frameCount++;
    
    // Check every second
    if (now - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;
      
      if (fps < threshold) {
        onPerformanceDrop(fps);
      }
    }
    
    rafId = requestAnimationFrame(checkFrame);
  };
  
  rafId = requestAnimationFrame(checkFrame);
  
  // Return a function to stop monitoring
  return () => {
    isMonitoring = false;
    if (rafId) cancelAnimationFrame(rafId);
  };
}; 