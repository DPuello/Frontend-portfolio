"use client"

import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three'
import { useThemeWithFallback } from './theme-provider'
import { lightColors, darkColors } from '@/config/theme'
// Import the shape configuration
import { 
  backgroundShapes, 
  mediumPerformanceShapes, 
  lowPerformanceShapes,
  mobileShapes,
  mobileLowPerformanceShapes
} from '@/config/shapes';
// Import performance configuration
import { 
  PERFORMANCE_CONFIG,
  PerformanceLevel,
  isMobileDevice,
  getDeviceOrientation
} from '@/config/performance';
// Import postprocessing effects for bloom/glow
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing'

// Custom hook para limitar framerate
function useFrameLimit(targetFPS: number, enabled: boolean) {
  const lastFrameTime = useRef<number>(0);
  const frameInterval = 1000 / targetFPS; // intervalo en ms entre frames
  
  // Determina si un frame debe renderizarse basado en el tiempo transcurrido
  const shouldRenderFrame = useCallback((time: number) => {
    if (!enabled) return true; // Si no está habilitado, renderizar siempre
    
    // Si ha pasado suficiente tiempo desde el último frame
    if (time - lastFrameTime.current >= frameInterval) {
      lastFrameTime.current = time;
      return true;
    }
    
    return false;
  }, [enabled, frameInterval]);
  
  return shouldRenderFrame;
}

// Notify parent components of performance level change
const notifyPerformanceChange = (level: PerformanceLevel) => {
  if (typeof window === 'undefined') return;
  
  // Send message to parent component
  window.postMessage({
    type: 'performance-update',
    level
  }, '*');
  
  console.log(`Performance level set to: ${level}`);
};

// Define proper types for Shape props
interface ShapeProps {
  position: [number, number, number]
  color: string
  hoverColor: string
  size: number
  shape: 'box' | 'sphere' | 'torus'
  mousePos: React.MutableRefObject<{ x: number; y: number } | null>
  clicked: React.MutableRefObject<number>
  camera: THREE.Camera
  complexity: 'low' | 'medium' | 'high'
  performanceLevel: PerformanceLevel
  animationStage: 'initial' | 'entering' | 'complete'
  entryDelay?: number
  isMobile: boolean
}

// Shape that reacts to mouse position and clicks
function Shape({ position, color, hoverColor, size, shape, mousePos, clicked, camera, complexity, performanceLevel, animationStage, entryDelay = 0, isMobile }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [active, setActive] = useState(false)
  // Track animation progress
  const [opacity, setOpacity] = useState(0);
  
  // Adjust initial and target positions for mobile devices
  const mobilePositionY = isMobile ? position[1] * PERFORMANCE_CONFIG.MOBILE.POSITION_SCALE_Y : position[1];
  const mobileSize = isMobile ? size * PERFORMANCE_CONFIG.MOBILE.SIZE_MULTIPLIER : size;
  
  const initialPosition = useRef<[number, number, number]>([
    position[0] * 1.5, 
    mobilePositionY * 1.5, 
    position[2] - 10
  ]).current;
  
  const targetPosition = useRef<[number, number, number]>([
    position[0], 
    mobilePositionY, 
    position[2]
  ]).current;
  
  const baseSpeed = useRef(Math.random() * 0.15 + 0.008) 
  // Pre-create THREE.Color instances for lerping
  const baseColor = useRef(new THREE.Color(color)).current;
  const targetHoverColor = useRef(new THREE.Color(hoverColor)).current;
  const currentMaterialColor = useRef(new THREE.Color(color)).current;
  // Temporary vector for calculations
  const worldPosition = useRef(new THREE.Vector3()).current;
  const projectedPosition = useRef(new THREE.Vector3()).current;

  // Configurar limitador de framerate
  const shouldLimitFramerate = PERFORMANCE_CONFIG.FRAME_RATE.LIMIT_FRAME_RATE && 
    (!PERFORMANCE_CONFIG.FRAME_RATE.ONLY_LIMIT_ON_LOWER_PERFORMANCE || performanceLevel !== 'high');
  const shouldRenderFrame = useFrameLimit(PERFORMANCE_CONFIG.FRAME_RATE.TARGET_FPS, shouldLimitFramerate);

  // Handle entry animation
  useEffect(() => {
    if (animationStage === 'entering') {
      // Stagger the appearance of shapes
      const timer = setTimeout(() => {
        setOpacity(1);
      }, entryDelay * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [animationStage, entryDelay]);

  useFrame((state, delta) => {
    // Si no debemos renderizar este frame, retornar temprano
    if (!shouldRenderFrame(state.clock.elapsedTime * 1000)) return;

    if (!meshRef.current || !materialRef.current) return

    // Entry animation for shapes
    if (animationStage === 'entering' && meshRef.current) {
      // Calculate animation progress - slower at start, faster toward end
      const animationSpeed = delta * 0.2;
      
      // Smoothly move from initial to target position
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x, 
        targetPosition[0], 
        animationSpeed
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y, 
        targetPosition[1], 
        animationSpeed
      );
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z, 
        targetPosition[2], 
        animationSpeed
      );
      
      // Update material opacity
      if (materialRef.current.opacity < 1) {
        materialRef.current.opacity = THREE.MathUtils.lerp(
          materialRef.current.opacity,
          opacity,
          animationSpeed * 2
        );
      }
    }

    let influenceFactor = 0;
    // Use larger influence radius for mobile devices to make touch interaction easier
    const maxInfluenceRadius = isMobile ? 
      PERFORMANCE_CONFIG.MOBILE.TOUCH_INFLUENCE_RADIUS : 0.4; // Radius in NDC space (-1 to 1)

    // Skip complex calculations based on performance level
    const skipComplexEffects = performanceLevel === 'low';

    // Simplified calculation for low performance mode
    if (!skipComplexEffects && mousePos.current) {
      // Get world position of the mesh
      meshRef.current.getWorldPosition(worldPosition);
      // Project world position to Normalized Device Coordinates (NDC)
      projectedPosition.copy(worldPosition).project(camera);
      
      // Calculate distance in NDC space (simple 2D distance)
      const dx = projectedPosition.x - mousePos.current.x;
      const dy = projectedPosition.y - mousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate influence factor (1 = close, 0 = far)
      influenceFactor = Math.max(0, 1.0 - distance / maxInfluenceRadius);
      // Optional: Add easing (e.g., easeOutQuad)
      influenceFactor = influenceFactor * (2 - influenceFactor);
    }

    // Adjust animation speeds based on performance level
    const speedMultiplier = performanceLevel === 'high' ? 1 : 
                           performanceLevel === 'medium' ? 0.7 : 0.4;
    
    // Determine current speed based on influence factor
    const currentSpeed = baseSpeed.current * THREE.MathUtils.lerp(1, skipComplexEffects ? 2 : 10.5, influenceFactor) * speedMultiplier; 
    
    // --- Rotation --- (Apply influence to speed)
    meshRef.current.rotation.x += delta * currentSpeed * 1.2;
    meshRef.current.rotation.y += delta * currentSpeed * 1.8;
    meshRef.current.rotation.z += delta * currentSpeed * 0.8; 
    
    if (active && !skipComplexEffects) {
      meshRef.current.rotation.x += delta * 0.6 * speedMultiplier;
      meshRef.current.rotation.y += delta * 0.6 * speedMultiplier;
      meshRef.current.rotation.z += delta * 0.8 * speedMultiplier;
    }
    
    // --- Positional Movement --- (Apply influence - simplified for low performance)
    if (!skipComplexEffects) {
      const time = state.clock.elapsedTime;
      const movementAmplitude = THREE.MathUtils.lerp(0.05, 0.25, influenceFactor) * speedMultiplier; 
      const movementFrequency = 1.5 * speedMultiplier;
      // Calculate target position offset based on sine waves
      const targetX = targetPosition[0] + Math.sin(time * movementFrequency + targetPosition[0]) * movementAmplitude;
      const targetY = targetPosition[1] + Math.cos(time * movementFrequency * 0.8 + targetPosition[1]) * movementAmplitude;
      const targetZ = targetPosition[2] + Math.sin(time * movementFrequency * 0.6 + targetPosition[2]) * movementAmplitude * 0.5;

      // Smoothly move towards the target position (using lerp on individual components)
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.05);
    } else {
      // Simplified motion for low performance mode
      const time = state.clock.elapsedTime;
      meshRef.current.position.x = targetPosition[0] + Math.sin(time * 0.5) * 0.05;
      meshRef.current.position.y = targetPosition[1] + Math.cos(time * 0.4) * 0.05;
    }
    
    // --- Scale --- (Simplified for low performance)
    if (!skipComplexEffects) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05; 
      const hoverScaleMultiplier = THREE.MathUtils.lerp(1, 1.4, influenceFactor); 
      const targetScaleValue = mobileSize * hoverScaleMultiplier * (active ? 1.5 : 1) * pulseScale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScaleValue, targetScaleValue, targetScaleValue), 0.1);
    }

    // --- Color --- (Apply influence - simplified for low performance)
    if (!skipComplexEffects) {
      currentMaterialColor.lerpColors(baseColor, targetHoverColor, influenceFactor);
      materialRef.current.color.set(currentMaterialColor);

      // --- Emissive intensity for glow --- (Apply based on influence)
      // Increase the emissive intensity for light theme to make it more visible
      const themeEmissiveBoost = state.scene.userData.theme === 'light' ? 2.0 : 1.2;
      const emissiveIntensity = THREE.MathUtils.lerp(0, themeEmissiveBoost, influenceFactor * influenceFactor);
      materialRef.current.emissive.set(currentMaterialColor);
      materialRef.current.emissiveIntensity = emissiveIntensity;
    }
  })
  
  // Render shape based on the shape prop - simplify geometry for low performance
  const ShapeComponent = () => {
    switch(shape) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />
      case 'sphere':
        // Further simplify spheres based on complexity and performance level
        const sphereDetail = 
          complexity === 'low' || performanceLevel === 'low' ? 8 :
          complexity === 'medium' || performanceLevel === 'medium' ? 12 : 24;
        return <sphereGeometry args={[1, sphereDetail, sphereDetail]} />
      case 'torus':
        // Further simplify torus based on complexity and performance level
        const torusRadialSegments = 
          complexity === 'low' || performanceLevel === 'low' ? 6 :
          complexity === 'medium' || performanceLevel === 'medium' ? 12 : 24;
        const torusTubularSegments = 
          complexity === 'low' || performanceLevel === 'low' ? 16 :
          complexity === 'medium' || performanceLevel === 'medium' ? 24 : 48;
        return <torusGeometry args={[0.7, 0.3, torusRadialSegments, torusTubularSegments]} />
      default:
        return <sphereGeometry args={[1, 8, 8]} />
    }
  }

  
  
  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      onClick={() => {
        setActive(!active)
        clicked.current += 1
      }}
    >
      <ShapeComponent />
      <meshStandardMaterial 
        ref={materialRef} 
        roughness={0.7}       
        metalness={0.1}
        emissive={new THREE.Color(color)}
        emissiveIntensity={0} 
        toneMapped={false}   
        transparent={true}
        opacity={0.5}
      />
      
    </mesh>
  )
}

// Performance monitoring component
function PerformanceMonitor({ onPerformanceChange }: { onPerformanceChange: (fps: number) => void }) {
  // Get state from R3F
  const { gl } = useThree();
  
  // Configurar limitador de framerate
  const shouldLimitFramerate = PERFORMANCE_CONFIG.FRAME_RATE.LIMIT_FRAME_RATE;
  const shouldRenderFrame = useFrameLimit(PERFORMANCE_CONFIG.FRAME_RATE.TARGET_FPS, shouldLimitFramerate);
  
  // Reference to store timestamps for FPS calculation
  const frameTimes = useRef<number[]>([]);
  const lastPerformanceCheck = useRef<number>(0);
  const frameCount = useRef<number>(0);
  // Guardar información del limitador para el cálculo de rendimiento real
  const isFramerateLimited = useRef<boolean>(PERFORMANCE_CONFIG.FRAME_RATE.LIMIT_FRAME_RATE);
  const targetFPS = useRef<number>(PERFORMANCE_CONFIG.FRAME_RATE.TARGET_FPS);
  
  // Monitor frame rate
  useFrame((state) => {
    // Si no debemos renderizar este frame, retornar temprano
    if (!shouldRenderFrame(state.clock.elapsedTime * 1000)) return;
    
    const currentTime = state.clock.elapsedTime * 1000;
    frameCount.current += 1;
    
    // Add current frame time
    frameTimes.current.push(currentTime);
    
    // Keep only the last PERFORMANCE_SAMPLE_SIZE frames
    if (frameTimes.current.length > PERFORMANCE_CONFIG.PERFORMANCE_SAMPLE_SIZE) {
      frameTimes.current.shift();
    }
    
    // Only check performance periodically to avoid unnecessary calculations
    if (currentTime - lastPerformanceCheck.current > PERFORMANCE_CONFIG.PERFORMANCE_CHECK_INTERVAL) {
      lastPerformanceCheck.current = currentTime;
      
      // Calculate FPS if we have enough samples
      if (frameTimes.current.length >= PERFORMANCE_CONFIG.PERFORMANCE_SAMPLE_SIZE) {
        const elapsed = frameTimes.current[frameTimes.current.length - 1] - frameTimes.current[0];
        const frames = frameTimes.current.length - 1;
        
        if (elapsed > 0) {
          let fps = (frames * 1000) / elapsed;
          
          // Si estamos limitando el framerate y queremos excluir ese factor de la medición de rendimiento,
          // ajustamos el FPS para representar la capacidad real del dispositivo
          if (PERFORMANCE_CONFIG.FRAME_RATE.EXCLUDE_FROM_PERFORMANCE_MEASUREMENT && 
              isFramerateLimited.current && 
              fps < targetFPS.current * 1.1) {
            // Si el FPS está cerca del límite, asumimos que es por el limitador, no por rendimiento real
            // Ajustamos el valor para reflejar la capacidad real del dispositivo
            console.log(`FPS ajustado: ${fps.toFixed(1)} → considerado alto debido al limitador de FPS`);
            
            // Reportar un valor ajustado que represente la capacidad real (no la limitada)
            onPerformanceChange(PERFORMANCE_CONFIG.FPS_THRESHOLD_HIGH + 1);
          } else {
            // Reportar el valor medido normalmente
            onPerformanceChange(fps);
          }
          
          // Log performance data
          console.log(`Performance: ${fps.toFixed(1)} FPS, ${frameCount.current} frames rendered`);
          frameCount.current = 0;
        }
      }
    }
  });
  
  return null;
}

// Scene that contains all the shapes
interface SceneProps {
  themeColors: typeof lightColors | typeof darkColors;
  theme: 'dark' | 'light';
  performanceLevel: PerformanceLevel;
  onPerformanceChange: (fps: number) => void;
  animationStage: 'initial' | 'entering' | 'complete';
  isMobile: boolean;
}

function Scene({ themeColors, theme, performanceLevel, onPerformanceChange, animationStage, isMobile }: SceneProps) {
  const { viewport, camera, scene, clock } = useThree();
  
  // Configurar limitador de framerate
  const shouldLimitFramerate = PERFORMANCE_CONFIG.FRAME_RATE.LIMIT_FRAME_RATE && 
    (!PERFORMANCE_CONFIG.FRAME_RATE.ONLY_LIMIT_ON_LOWER_PERFORMANCE || performanceLevel !== 'high');
  const shouldRenderFrame = useFrameLimit(PERFORMANCE_CONFIG.FRAME_RATE.TARGET_FPS, shouldLimitFramerate);
  
  // Set theme in scene userData for material effects
  scene.userData.theme = theme;
  
  // References for interactivity
  const mousePos = useRef<{ x: number; y: number } | null>(null)
  const clicked = useRef<number>(0)
  const scrollY = useRef<number>(0)
  
  // Primary and secondary colors from theme (passed as props)
  const primaryColor = themeColors.primary.DEFAULT
  const secondaryColor = themeColors.secondary.DEFAULT
  
  // Always enable post-processing if configured to do so, otherwise based on performance
  const enablePostProcessing = PERFORMANCE_CONFIG.POST_PROCESSING.ALWAYS_ENABLE || performanceLevel === 'high';
  const enableBloom = enablePostProcessing;
  
  // Entry animation for camera and scene
  useEffect(() => {
    if (animationStage === 'initial') {
      // Initial camera position (zoomed out)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.position.z = 20;
        
        // Adjust camera field of view for mobile devices in portrait mode
        if (isMobile && getDeviceOrientation() === 'portrait') {
          camera.fov = 85; // Wider FOV for portrait mode to show more content
        }
        
        camera.updateProjectionMatrix();
      }
    }
  }, [camera, animationStage, isMobile]);
  
  // Animate camera on entry
  useFrame((state, delta) => {
    // Si no debemos renderizar este frame, retornar temprano
    if (!shouldRenderFrame(state.clock.elapsedTime * 1000)) return;
    
    if (animationStage === 'entering' && camera instanceof THREE.PerspectiveCamera) {
      // Smoothly move camera to final position over 10 seconds
      // Adjust target Z position based on device
      const targetZ = isMobile ? 8 : 10; // Closer for mobile devices
      const speed = delta * 0.3; // Adjust speed to complete in ~10s
      
      // Fix the abrupt jump - ensure smooth transition all the way
      if (Math.abs(camera.position.z - targetZ) > 0.01) {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, speed);
        camera.updateProjectionMatrix();
      } else if (animationStage === 'entering') {
        // Ensure we set the final position exactly to avoid floating point issues
        camera.position.z = targetZ;
        camera.updateProjectionMatrix();
      }
    }
    
    // Adjust rotation speed based on performance level
    const rotationSpeed = 
      performanceLevel === 'high' ? 0.01 :
      performanceLevel === 'medium' ? 0.005 : 0.002;
    
    // Scene rotation based on mouse - simplified for lower performance
    if (state.scene.rotation) {
      // During entry animation, rotate more dramatically
      if (animationStage === 'entering') {
        state.scene.rotation.y += delta * rotationSpeed * 2;
        state.scene.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      } else {
        state.scene.rotation.y += delta * rotationSpeed;
      }
      
      if (mousePos.current && performanceLevel !== 'low') {
        const mouseFactor = performanceLevel === 'high' ? 0.003 : 0.002;
        const lerpFactor = performanceLevel === 'high' ? 0.03 : 0.02;
        
        // Different rotation behavior for mobile - more responsive
        if (isMobile) {
          // Mobile devices need stronger rotation effect to feel responsive on touch
          const mobileFactor = 0.005;
          state.scene.rotation.x += (mousePos.current.y * mobileFactor - state.scene.rotation.x) * 0.05;
          state.scene.rotation.y += (mousePos.current.x * mobileFactor - state.scene.rotation.y) * 0.05;
        } else {
          state.scene.rotation.x += (mousePos.current.y * mouseFactor - state.scene.rotation.x) * lerpFactor;
          state.scene.rotation.y += (mousePos.current.x * mouseFactor - state.scene.rotation.y) * lerpFactor;
        }
      }
    }

    // Click effect - disabled for low performance
    if (clicked.current > 0 && state.scene.rotation && performanceLevel !== 'low') {
      const clickEffect = performanceLevel === 'high' ? 0.05 : 0.03;
      state.scene.rotation.z += delta * (clickEffect * clicked.current);
      clicked.current = Math.max(0, clicked.current - delta * 2);
    }

    // Camera zoom - disabled for low performance
    if (performanceLevel !== 'low' && scrollY.current) {
      const zoomFactor = performanceLevel === 'high' ? 0.0005 : 0.0003;
      const lerpFactor = performanceLevel === 'high' ? 0.03 : 0.02;
      
      const targetY = scrollY.current * zoomFactor;
      state.camera.position.y += (targetY - state.camera.position.y) * lerpFactor;
    }
  })
  
  // Track mouse movement and touch events for mobile
  useEffect(() => {
    if (typeof window === 'undefined' || performanceLevel === 'low') return;
    
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to be between -1 and 1
      mousePos.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      }
    }
    
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        // Normalize touch position to be between -1 and 1 (same as mouse)
        mousePos.current = {
          x: (event.touches[0].clientX / window.innerWidth) * 2 - 1,
          y: -(event.touches[0].clientY / window.innerHeight) * 2 + 1
        }
      }
    }
    
    if (isMobile) {
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchstart', handleTouchMove, { passive: true });
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    }
  }, [performanceLevel, isMobile]);

  // Track scroll position - simplified for low performance
  useEffect(() => {
    if (typeof window === 'undefined' || performanceLevel === 'low') return;

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [performanceLevel]);
  
  // Choose shapes based on performance level and device type
  const shapesConfig = isMobile
    ? (performanceLevel === 'low' ? mobileLowPerformanceShapes : mobileShapes)
    : (performanceLevel === 'high' ? backgroundShapes :
       performanceLevel === 'medium' ? mediumPerformanceShapes :
       lowPerformanceShapes);
  
  // Generate shapes with entry animation properties
  const shapes = shapesConfig.map((config, index) => {
    const color = index % 2 === 0 ? primaryColor : secondaryColor
    const hoverColor = index % 2 === 0 ? secondaryColor : primaryColor
    
    // Add delay to each shape based on its index for staggered animation
    const delay = (index % 5) * 0.5;
    
    return (
      <Shape 
        key={config.id} 
        position={config.position}
        color={color}
        hoverColor={hoverColor}
        size={config.size}
        shape={config.type}
        mousePos={mousePos}
        clicked={clicked}
        camera={camera}
        complexity={config.complexity || 'medium'}
        performanceLevel={performanceLevel}
        animationStage={animationStage}
        entryDelay={delay}
        isMobile={isMobile}
      />
    )
  });
  
  return (
    <>
      {/* Performance monitoring */}
      <PerformanceMonitor onPerformanceChange={onPerformanceChange} />
      
      {/* Lighting setup - simplified for lower performance */}
      <ambientLight intensity={performanceLevel === 'low' ? 0.3 : 0.2} />
      <pointLight position={[0, 50, 0]} color={primaryColor} intensity={performanceLevel === 'low' ? 1.2 : 1.0} decay={0}/> 
      
      {/* Entry animation ambience */}
      {animationStage === 'entering' && (
        <pointLight position={[0, 0, 30]} color={secondaryColor} intensity={3} decay={2} />
      )}
      
      {shapes}
      
      {/* Post-processing - enabled based on configuration */}
      {enablePostProcessing && (
        <EffectComposer enabled={enableBloom}>
          <Bloom 
            luminanceThreshold={PERFORMANCE_CONFIG.POST_PROCESSING.BLOOM.THRESHOLD} 
            luminanceSmoothing={PERFORMANCE_CONFIG.POST_PROCESSING.BLOOM.SMOOTHING}
            intensity={PERFORMANCE_CONFIG.POST_PROCESSING.BLOOM.INTENSITY}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  )
}

// Better device capability detection 
const detectPerformanceLevel = (): PerformanceLevel => {
  if (typeof window === 'undefined') return 'gradient';
  
  // Check for mobile devices - they typically have weaker GPUs
  const isMobile = isMobileDevice();
  
  // Check memory if available (most browsers don't expose this)
  // @ts-ignore - deviceMemory is not in standard navigator type
  const deviceMemory = navigator.deviceMemory || 4;
  const lowMemory = deviceMemory < 2;
  
  // Check CPU cores
  const cpuCores = navigator.hardwareConcurrency || 4;
  const veryLowConcurrency = cpuCores < PERFORMANCE_CONFIG.DEVICE.FORCE_GRADIENT_CORES_MOBILE;
  const lowConcurrency = cpuCores < PERFORMANCE_CONFIG.DEVICE.MIN_CORES_MOBILE;
  const highConcurrency = cpuCores >= PERFORMANCE_CONFIG.DEVICE.MIN_CORES_HIGH;
  
  // Check if WebGL2 is supported (better than just WebGL1)
  let webGL2Support = false;
  try {
    const canvas = document.createElement('canvas');
    webGL2Support = !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch (e) {
    webGL2Support = false;
  }
  
  // Fall back to WebGL1 check if WebGL2 is not available
  let webGLSupport = false;
  if (!webGL2Support) {
    try {
      const canvas = document.createElement('canvas');
      webGLSupport = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      webGLSupport = false;
    }
  }
  
  // Only use gradient if WebGL is completely unavailable
  if (!webGLSupport && !webGL2Support) return 'gradient';
  
  // Determine if this might be a very low-end device
  // Stricter criteria - only go to gradient if really necessary
  const isVeryLowEnd = (isMobile && veryLowConcurrency && lowMemory && !webGL2Support);
  if (isVeryLowEnd) return 'gradient';
  
  // Even older mobile devices can typically handle low settings
  const isLowEnd = (lowConcurrency || (isMobile && !webGL2Support));
  if (isLowEnd) return 'low';
  
  // High-end detection
  const isHighEnd = (highConcurrency && webGL2Support && !isMobile) || 
                   (isMobile && highConcurrency && webGL2Support);
  if (isHighEnd) return 'high';
  
  // Default to medium for everything else
  return 'medium';
};

// Error boundary para capturar errores de WebGL
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("WebGL Error:", error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null; // No renderizar nada, el componente padre se encargará del fallback
    }

    return this.props.children;
  }
}

// Main component
const Background3DComponent = () => {
  // Initial performance level based on device capabilities
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>('medium');
  // State to track if initial detection has happened
  const [detectionComplete, setDetectionComplete] = useState(false);
  // State to track if content is loaded and ready to show
  const [isLoaded, setIsLoaded] = useState(false);
  // State to track the entry animation progress
  const [entryAnimationStage, setEntryAnimationStage] = useState<'initial' | 'entering' | 'complete'>('initial');
  // State to track if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  // Reference to track performance downgrade attempts
  const downgradeAttempts = useRef<number>(0);
  // Track last performance level to notify of changes
  const lastNotifiedLevel = useRef<PerformanceLevel>('medium');
  // Track time of last performance change to avoid rapid switching
  const lastPerformanceChange = useRef<number>(0);
  // Agregar un estado para rastrear errores de WebGL
  const [webGLError, setWebGLError] = useState(false);
  
  // Get theme safely at the top level
  let theme: 'dark' | 'light' = 'dark';
  let themeColors = darkColors;
  try {
    const { resolvedTheme } = useThemeWithFallback();
    theme = (resolvedTheme || 'dark') as 'dark' | 'light';
    themeColors = theme === 'dark' ? darkColors : lightColors;
  } catch (error) {
    console.error('Failed to get theme, falling back to dark theme', error);
  }
  
  // Función para manejar errores de WebGL
  const handleWebGLError = useCallback(() => {
    console.log("WebGL Error detectado, cambiando a fondo de gradiente");
    setWebGLError(true);
    setPerformanceLevel('gradient');
    notifyPerformanceChange('gradient');
    lastNotifiedLevel.current = 'gradient';
  }, []);
  
  // Verificar soporte de WebGL al inicio
  useEffect(() => {
    // Don't run in SSR
    if (typeof window === 'undefined') return;
    
    // Verificar soporte básico de WebGL
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const webgl1 = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
        const webgl2 = !!(
          window.WebGL2RenderingContext &&
          canvas.getContext('webgl2')
        );
        
        if (!webgl1 && !webgl2) {
          console.log("WebGL no soportado en este dispositivo");
          handleWebGLError();
          return false;
        }
        
        // Intentar crear un renderizador Three.js para comprobar el soporte completo
        try {
          const testRenderer = new THREE.WebGLRenderer({
            canvas: document.createElement('canvas'),
            antialias: false,
            alpha: true,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: true // Fallar si hay problemas graves de rendimiento
          });
          testRenderer.dispose();
          return true;
        } catch (e) {
          console.log("Error al crear un renderizador Three.js", e);
          handleWebGLError();
          return false;
        }
      } catch (e) {
        console.log("Error al verificar soporte de WebGL", e);
        handleWebGLError();
        return false;
      }
    };
    
    // Ejecutar verificación y combinar con la detección existente
    const webGLSupported = checkWebGLSupport();
    
    if (webGLSupported) {
      // Continuar con la detección normal de capacidades
      const initialLevel = detectPerformanceLevel();
      console.log('Initial performance level detected:', initialLevel, isMobile ? '(mobile device)' : '');
      setPerformanceLevel(initialLevel);
      setDetectionComplete(true);
      
      // Notificar al componente padre del nivel inicial
      notifyPerformanceChange(initialLevel);
      lastNotifiedLevel.current = initialLevel;
    }
    
    // Set up entry animation sequence
    // First - small delay to ensure everything is ready
    const initialDelay = setTimeout(() => {
      // Start entry animation
      setEntryAnimationStage('entering');
      
      // After 500ms, start loading the actual scene
      const loadDelay = setTimeout(() => {
        setIsLoaded(true);
        
        // After the full 10s animation completes
        const completeDelay = setTimeout(() => {
          setEntryAnimationStage('complete');
        }, 9500); // 10s total minus the 500ms we already waited
        
        return () => clearTimeout(completeDelay);
      }, 500);
      
      return () => clearTimeout(loadDelay);
    });
    
    return () => clearTimeout(initialDelay);
  }, [handleWebGLError]);
  
  // Handler for when performance metrics are reported
  const handlePerformanceChange = (fps: number) => {
    // Avoid rapid changes - enforce a 5 second cooldown
    const now = Date.now();
    if (now - lastPerformanceChange.current < 5000) {
      return;
    }
    
    // Si el limitador de FPS está activo y queremos excluir su efecto,
    // ajustamos la lógica para evitar degradaciones por el limitador
    const usingFrameLimiter = PERFORMANCE_CONFIG.FRAME_RATE.LIMIT_FRAME_RATE &&
                             PERFORMANCE_CONFIG.FRAME_RATE.EXCLUDE_FROM_PERFORMANCE_MEASUREMENT;
    
    // Si el limitador está activo y el FPS está muy cerca del límite, ignoramos la degradación
    if (usingFrameLimiter && fps >= PERFORMANCE_CONFIG.FRAME_RATE.TARGET_FPS * 0.9) {
      console.log(`Ignorando posible degradación debido al limitador de FPS (${fps.toFixed(1)} FPS)`);
      return;
    }
    
    // Force gradient background below a certain FPS threshold
    if (fps < PERFORMANCE_CONFIG.FORCE_GRADIENT_FPS) {
      if (performanceLevel !== 'gradient') {
        console.log(`Performance critically low (${fps.toFixed(1)} FPS). Switching to gradient background.`);
        setPerformanceLevel('gradient');
        lastPerformanceChange.current = now;
        notifyPerformanceChange('gradient');
        lastNotifiedLevel.current = 'gradient';
      }
      return;
    }
    
    // Si FPS está por debajo del umbral, intentar degradar el rendimiento progresivamente
    if (fps < PERFORMANCE_CONFIG.MIN_ACCEPTABLE_FPS) {
      let newLevel: PerformanceLevel = performanceLevel;
      
      // Primera prueba: Si estamos en alto, cambiar a medio
      if (performanceLevel === 'high' && downgradeAttempts.current === 0) {
        newLevel = 'medium';
      } 
      // Segunda prueba: Si estamos en medio o ya intentamos una vez desde alto, cambiar a bajo
      else if ((performanceLevel === 'medium' || downgradeAttempts.current === 1) && downgradeAttempts.current < 2) {
        newLevel = 'low';
      }
      // Último recurso: Si todo lo demás falló y hemos intentado el máximo de veces, usar gradiente
      else if (downgradeAttempts.current >= PERFORMANCE_CONFIG.MAX_DOWNGRADE_ATTEMPTS) {
        newLevel = 'gradient';
      }
      
      // Sólo hacemos cambios si vamos a un nuevo nivel
      if (newLevel !== performanceLevel) {
        console.log(`Performance too low (${fps.toFixed(1)} FPS). Downgrading from ${performanceLevel} to ${newLevel}`);
        setPerformanceLevel(newLevel);
        
        // Registrar el momento del cambio
        lastPerformanceChange.current = now;
        
        // Incrementar el contador de intentos de degradación
        downgradeAttempts.current += 1;
        
        // Notificar al componente padre si cambió el nivel
        if (lastNotifiedLevel.current !== newLevel) {
          notifyPerformanceChange(newLevel);
          lastNotifiedLevel.current = newLevel;
        }
      }
    }
  };
  
  // Determinar si mostrar el fondo 3D basado en nivel de rendimiento y errores WebGL
  const shouldShowBackground3D = isLoaded && performanceLevel !== 'gradient' && !webGLError;
  
  // Render 3D background with performance monitoring and appropriate level
  return (
    <div 
      className={`fixed top-0 left-0 right-0 bottom-0 -z-10 transition-all duration-[10000ms] ease-out ${
        entryAnimationStage === 'initial' ? 'opacity-0' : 
        entryAnimationStage === 'entering' ? 'opacity-50 scale-100' : 
        'opacity-50 scale-100'
      }`}
      style={{ 
        width: "100vw", 
        height: "100vh",
        position: "fixed",
        transform: entryAnimationStage === 'initial' ? 'translateZ(0) scale(1.1)' : 'translateZ(0) scale(1)',
        willChange: "transform, opacity",
        transition: "opacity 10s cubic-bezier(0.22, 1, 0.36, 1), transform 10s cubic-bezier(0.22, 1, 0.36, 1)"
      }}
    >
      <Suspense>
        {shouldShowBackground3D && (
          <WebGLErrorBoundary onError={handleWebGLError}>
            <Canvas 
              dpr={
                performanceLevel === 'high' ? [1, 1.5] : 
                performanceLevel === 'medium' ? [1, 1] : [0.7, 1]
              }
              // Mejorar la configuración para mayor compatibilidad
              gl={{ 
                powerPreference: 'default', // Cambiar a default para mayor compatibilidad
                antialias: performanceLevel !== 'low', 
                alpha: true,
                depth: true,
                stencil: false,
                precision: performanceLevel === 'low' ? 'lowp' : 'mediump',
                // Agregar opciones para manejo de errores
                failIfMajorPerformanceCaveat: false, // No fallar si hay problemas de rendimiento
                preserveDrawingBuffer: false, // Reducir el uso de memoria
              }}
              // Performance optimizations
              frameloop={performanceLevel === 'low' ? 'demand' : 'always'}
              performance={{ min: 0.5 }}
              className="bg-transparent"
              // Agregar handler de errores
              onCreated={(state) => {
                // Verificar si el renderer se creó correctamente
                if (!state.gl) {
                  handleWebGLError();
                }
              }}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={isMobile ? 85 : 75} />
              <Scene 
                themeColors={themeColors}
                theme={theme}
                performanceLevel={performanceLevel}
                onPerformanceChange={handlePerformanceChange}
                animationStage={entryAnimationStage}
                isMobile={isMobile}
              />
              <Environment preset="sunset" />
            </Canvas>
          </WebGLErrorBoundary>
        )}
      </Suspense>
    </div>
  );
};

export default Background3DComponent; 