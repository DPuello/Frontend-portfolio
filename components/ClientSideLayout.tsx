"use client"

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useThemeWithFallback } from './theme-provider';

// Import performance configuration
import { PERFORMANCE_CONFIG, PerformanceLevel, isMobileDevice } from '@/config/performance';

// Import the fallback gradient background directly to show it immediately during loading
import GradientBackground from './GradientBackground';
import { motion } from 'framer-motion';

// Dynamically import the 3D background with SSR disabled and improved settings
// Añadimos opciones específicas para manejar errores de carga
const Background3D = dynamic(() => import('@/components/Background3D'), {
  ssr: false,
  loading: () => null,
});


interface ClientSideLayoutProps {
  children: React.ReactNode;
  showPerformanceMonitor?: boolean;
}

const ClientSideLayout: React.FC<ClientSideLayoutProps> = ({ 
  children,
  showPerformanceMonitor = process.env.NODE_ENV === 'development'
}) => {
  // State to track if the browser is ready for client-side rendering
  const [isClient, setIsClient] = useState(false);
  // State to track performance issues for UI adjustments 
  const [performance, setPerformance] = useState<'detecting' | PerformanceLevel>('detecting');
  // State to track retries for 3D background
  const [retry3DCount, setRetry3DCount] = useState(0);
  // State for entry animation
  const [entryAnimation, setEntryAnimation] = useState<'initial' | 'entering' | 'complete'>('initial');
  // State to track if it's a mobile device
  const [isMobile, setIsMobile] = useState(false);
  // State to controlar la visibilidad de cada fondo durante las transiciones
  const [bg3dVisible, setBg3dVisible] = useState(true);
  const [gradientVisible, setGradientVisible] = useState(true);
  // State para rastrear si WebGL está soportado
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  // Ref para rastrear el último nivel de rendimiento para transiciones
  const lastPerformanceLevel = useRef<PerformanceLevel | null>(null);
  // Ref para rastrear los timers de transición
  const transitionTimers = useRef<NodeJS.Timeout[]>([]);
  
  // Get theme for the gradient background
  const { resolvedTheme } = useThemeWithFallback();
  const theme = (resolvedTheme || 'dark') as 'dark' | 'light';
  
  // Effect to check WebGL support early
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Verificación básica de WebGL
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        // Probar primero WebGL2
        const hasWebGL2 = !!(
          window.WebGL2RenderingContext && 
          canvas.getContext('webgl2')
        );
        
        // Si no hay WebGL2, probar WebGL1
        const hasWebGL1 = !!(
          window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
        
        // Devolver verdadero si cualquier versión está disponible
        return hasWebGL2 || hasWebGL1;
      } catch (e) {
        console.error("Error checking WebGL support:", e);
        return false;
      }
    };
    
    const isSupported = checkWebGLSupport();
    setWebGLSupported(isSupported);
    
    // Si no hay soporte de WebGL, inmediatamente establecer el nivel de rendimiento a 'gradient'
    if (!isSupported) {
      console.log("WebGL not supported, falling back to gradient background");
      setPerformance('gradient');
      setBg3dVisible(false);
    }
  }, []);
  
  // Effect to set client state and start entry animation
  useEffect(() => {
    // Set client state immediately
    setIsClient(true);
    
    // Detect if on mobile
    if (typeof window !== 'undefined') {
      setIsMobile(isMobileDevice());
    }
    
    // Start entry animation after a short delay
    const initialDelay = setTimeout(() => {
      setEntryAnimation('entering');
      
      // Mark entry animation as complete after 10 seconds
      const completeTimer = setTimeout(() => {
        setEntryAnimation('complete');
      }, 10000);
      
      transitionTimers.current.push(completeTimer);
      return () => clearTimeout(completeTimer);
    }, 200);
    
    transitionTimers.current.push(initialDelay);
    return () => {
      // Limpiar todos los timers al desmontar
      transitionTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Efecto para manejar las transiciones entre fondos cuando cambia el nivel de rendimiento
  useEffect(() => {
    if (performance === 'detecting') return;
    
    // Determinar qué fondos deberían estar visibles basado en el nivel de rendimiento
    // Si WebGL no está soportado, nunca mostrar el fondo 3D
    const shouldShow3D = webGLSupported !== false && performance !== 'gradient';
    const shouldShowGradient = true; // Siempre mostramos el gradiente, solo ajustamos su opacidad
    
    // Si hay un cambio en la visibilidad del fondo 3D, manejar la transición
    if (shouldShow3D !== bg3dVisible) {
      if (shouldShow3D) {
        // Mostrar el fondo 3D
        setBg3dVisible(true);
        
        // Retrasar la ocultación del gradiente para una transición suave
        const hideGradientTimer = setTimeout(() => {
          // No ocultamos el gradiente, solo reducimos su opacidad
        }, PERFORMANCE_CONFIG.TRANSITIONS.BACKGROUND_TRANSITION_DURATION);
        
        transitionTimers.current.push(hideGradientTimer);
      } else {
        // Cambio de 3D a gradiente - primero aseguramos que el gradiente está visible
        setGradientVisible(true);
        
        // Luego ocultamos el 3D después de un retraso para asegurar una transición suave
        const hide3DTimer = setTimeout(() => {
          setBg3dVisible(false);
        }, PERFORMANCE_CONFIG.TRANSITIONS.BACKGROUND_HIDE_DELAY);
        
        transitionTimers.current.push(hide3DTimer);
      }
    }
    
    // Actualizar el último nivel de rendimiento conocido
    lastPerformanceLevel.current = performance as PerformanceLevel;
  }, [performance, bg3dVisible, gradientVisible, webGLSupported]);
  
  // Separate effect for performance detection
  useEffect(() => {
    if (!isClient || webGLSupported === false) return;
    
    // Simple performance check based on user agent and hardware
    const checkInitialPerformance = () => {
      // Check for mobile devices
      const mobile = isMobileDevice();
      
      // Check for hardware concurrency (CPU cores)
      const cpuCores = navigator.hardwareConcurrency || 0;
      
      // Set expected performance level (try to use 3D first if possible)
      if (mobile && cpuCores < PERFORMANCE_CONFIG.DEVICE.MIN_CORES_MOBILE) {
        setPerformance('low');
      } else if (cpuCores >= PERFORMANCE_CONFIG.DEVICE.MIN_CORES_HIGH) {
        setPerformance('high');
      } else {
        setPerformance('medium');
      }
    };
    
    // Run initial performance check
    checkInitialPerformance();
    
    // Listen for messages from Background3D component about performance
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'performance-update') {
        console.log('Performance update received:', event.data.level);
        
        // Si el rendimiento cambia drásticamente, actualizar con transición suave
        if (event.data.level !== performance) {
          setPerformance(event.data.level);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isClient, performance, webGLSupported]);

  // Effect to force retry if 3D fails to render but shouldn't default to gradient
  useEffect(() => {
    // Only attempt retry when performance is set to gradient and WebGL is supported
    if (performance === 'gradient' && webGLSupported === true && retry3DCount < PERFORMANCE_CONFIG.MAX_DOWNGRADE_ATTEMPTS) {
      const timer = setTimeout(() => {
        console.log('Retrying 3D background with lower quality settings...');
        setPerformance('low');
        setRetry3DCount(prev => prev + 1);
      }, 1500);
      
      transitionTimers.current.push(timer);
      return () => clearTimeout(timer);
    }
  }, [performance, retry3DCount, webGLSupported]);


  // Calcular opacidad para el fondo de gradiente basado en el nivel de rendimiento
  // Si WebGL no está soportado, siempre mostrar el gradiente a opacidad completa
  const gradientOpacity = (performance === 'gradient' || webGLSupported === false) ? 1 : 0.2;
  const gradientTransitionTime = `${PERFORMANCE_CONFIG.TRANSITIONS.BACKGROUND_TRANSITION_DURATION}ms`;

  return (
    <>
      {/* Always show gradient background immediately, even during SSR */}
      {
        !(isClient && bg3dVisible && webGLSupported !== false) && (
          <GradientBackground 
            theme={theme} 
            isLoading={!isClient} 
            opacity={gradientOpacity} 
            showDots={performance === 'gradient' || webGLSupported === false || true}
            transitionDuration={gradientTransitionTime}
          />
        )
      }
      
      
      {/* Only load 3D background when WebGL is supported and client-side rendering is enabled */}
      {isClient && bg3dVisible && webGLSupported !== false && (
        <Background3D />
      )}
      
      {/* Apply different main content styling based on performance level and entry animation */}
      <motion.div 
        initial={{ opacity: 0, transform: 'translateY(20px)' }}
        animate={{ opacity: 1, transform: 'translateY(0)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`transition-all duration-[3000ms] ease-out`}
        style={{
          transition: 'opacity 3s ease-out, transform 3s ease-out',
        }}
      >
        {children}
      </motion.div>
      
      {/* Add CSS for when low performance is detected - reduce animations, etc. */}
      {performance === 'low' && (
        <style jsx global>{`
          /* Reduce animations for better performance */
          *, *::before, *::after {
            transition-duration: 0.1s !important;
            animation-duration: 0.2s !important;
          }
          
          /* Remove hover effects that might be expensive */
          .content-low-performance .hover-effect {
            transition: none !important;
          }
          
          /* Simplify shadows and effects */
          .content-low-performance .shadow-lg,
          .content-low-performance .shadow-xl {
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
          }
        `}</style>
      )}
    </>
  );
};

export default ClientSideLayout; 