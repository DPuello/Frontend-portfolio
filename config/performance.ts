/**
 * Performance configuration for the portfolio
 * These settings control how the 3D background behaves on different devices
 */

export type PerformanceLevel = 'high' | 'medium' | 'low' | 'gradient';

// FPS thresholds for performance levels
export const PERFORMANCE_CONFIG = {
  // Minimum acceptable FPS for each performance level
  FPS_THRESHOLD_HIGH: 22, 
  FPS_THRESHOLD_MEDIUM: 19,
  FPS_THRESHOLD_LOW: 16,
  
  // Main FPS threshold for determining if we need to downgrade
  MIN_ACCEPTABLE_FPS: 16,
  
  // How often to check performance (in milliseconds)
  PERFORMANCE_CHECK_INTERVAL: 3000,
  
  // How many frames to sample when measuring performance
  PERFORMANCE_SAMPLE_SIZE: 10,
  
  // How long to run the initial performance test (in milliseconds)
  MEASUREMENT_DURATION: 2000,
  
  // Max retry attempts before falling back to gradient
  MAX_DOWNGRADE_ATTEMPTS: 3,
  
  // Force gradient background below this FPS regardless of level
  FORCE_GRADIENT_FPS: 12,
  
  // Frame rate settings
  FRAME_RATE: {
    // Whether to enable frame rate limiting
    LIMIT_FRAME_RATE: true,
    
    // Target frame rate in frames per second
    TARGET_FPS: 24,
    
    // Only apply frame rate limit when not in high performance mode
    ONLY_LIMIT_ON_LOWER_PERFORMANCE: false,
    
    // Exclude limited FPS from performance measurement
    // Cuando está activo, no se penalizará el rendimiento por el limitador de FPS
    EXCLUDE_FROM_PERFORMANCE_MEASUREMENT: true
  },
  
  // Device detection settings
  DEVICE: {
    // Minimum number of CPU cores for high performance
    MIN_CORES_HIGH: 6,
    
    // Minimum number of CPU cores for medium performance
    MIN_CORES_MEDIUM: 4,
    
    // Force low or gradient on mobile with fewer cores than this
    MIN_CORES_MOBILE: 4,
    
    // Force gradient on mobile with fewer cores than this
    FORCE_GRADIENT_CORES_MOBILE: 2,
  },
  
  // Post-processing settings
  POST_PROCESSING: {
    // Whether to always enable post-processing regardless of performance level
    ALWAYS_ENABLE: true,
    
    // Bloom effect settings
    BLOOM: {
      INTENSITY: 15,
      THRESHOLD: 0.2,
      SMOOTHING: 0.9,
    }
  },
  
  // Mobile-specific adjustments
  MOBILE: {
    // Whether to enable special handling for mobile devices
    ENABLE_MOBILE_OPTIMIZATIONS: true,
    
    // Scale factor for shape positions on mobile (vertical adjustment)
    POSITION_SCALE_Y: 1.5,
    
    // Scale shapes on mobile to be more visible
    SIZE_MULTIPLIER: 1.2,
    
    // Interaction radius for touch (larger than mouse)
    TOUCH_INFLUENCE_RADIUS: 0.6,
  },
  
  // Transition settings
  TRANSITIONS: {
    // Tiempo de transición (en ms) entre fondos para evitar parpadeo
    BACKGROUND_TRANSITION_DURATION: 1000,
    
    // Tiempo de espera (en ms) antes de ocultar un fondo tras cambiar de nivel
    BACKGROUND_HIDE_DELAY: 500
  }
};

/**
 * Detect if the current device is a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get orientation of the device
 */
export const getDeviceOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'landscape';
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}; 