"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  AnimatePresence,
  Variant,
  animate,
} from "framer-motion";
import { useThemeWithFallback } from "./theme-provider";
import { lightColors, darkColors } from "@/config/theme";
import { gradientBackgroundDots } from "@/config/shapes";

interface DotProps {
  position: number[];
  size: string | number;
  theme: "dark" | "light";
  primaryColor: string;
  secondaryColor: string;
  index: number;
}

// Animated dot component using Framer Motion
const AnimatedDot: React.FC<DotProps> = ({
  position,
  size,
  theme,
  primaryColor,
  secondaryColor,
  index,
}) => {
  const dotRef = useRef<HTMLDivElement>(null);
  // Store mouse distance in a ref to avoid triggering re-renders
  const mouseDistanceRef = useRef<number>(1);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Throttling for mouse movement
  const lastUpdateTimeRef = useRef<number>(0);
  const throttleDelay = 50; // ms between updates

  // Generate a unique animation delay based on index
  const delay = (index % 5) * 0.7;

  // Animation controls
  const controls = useAnimation();

  // Define motion values for the dot animations
  const scaleMotion = useMotionValue(1);
  const opacityMotion = useMotionValue(theme === "light" ? 0.5 : 0.3);
  const blurMotion = useMotionValue(10); // Starting blur amount
  const boxShadowMotion = useMotionValue("");

  // Animation variants for the dot
  const dotVariants = {
    initial: {
      scale: 1,
      x: 0,
      y: 0,
    },
    animate: {
      // scale: [0.95, 1.25],
      scale: scaleMotion.get(),
      opacity: opacityMotion.get(),
      x: [`-10vw`, `10vw`],
      y: [`-10vw`, `10vw`],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",

          duration: 30,
          delay: 30 - index * 2,
        },
        y: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
          duration: 30,


          delay: 30 - index * 2,
        },
        scale: {
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
          duration: 10,
        },
      },
    },
  };

  // Calculate shadow based on mouse distance - memoized to avoid recalculations
  const calculateShadow = useCallback(
    (distance: number) => {
      // Choose colors based on theme
      const baseColor = index % 2 === 0 ? primaryColor : secondaryColor;
      const hoverColor = index % 2 === 0 ? secondaryColor : primaryColor;

      // Dynamic color based on mouse proximity
      const mixFactor = Math.pow(1 - distance, 2); // Quadratic easing for more pronounced effect

      // Calculate shadow
      const shadowSize = 20 + (1 - distance) * 30;
      const shadowColor = `${hoverColor}${Math.round(mixFactor * 99).toString(16)}`;
      return `0 0 ${shadowSize}px ${shadowColor}`;
    },
    [index, primaryColor, secondaryColor]
  );

  // Calculate and update visual properties based on mouse distance
  const updateVisualProperties = useCallback(
    (distance: number) => {
      // Store the distance in a ref to avoid re-renders
      mouseDistanceRef.current = distance;

      // Update motion values based on mouse distance
      const scaleFactor = 1 + (1 - distance) * 0.8; // 1.0-1.4 range
      const blurAmount = 10 * distance + 2; // 2-12px range
      const baseOpacity = theme === "light" ? 0.5 : 0.3;
      const hoverOpacity = theme === "light" ? 0.7 : 0.5;
      const opacity =
        baseOpacity + (hoverOpacity - baseOpacity) * (1 - distance);

      // Calculate box shadow
      const boxShadow = calculateShadow(distance);

      // Set motion values with smooth transitions - using set() to avoid re-renders
      scaleMotion.set(scaleFactor);
      blurMotion.set(blurAmount);
      opacityMotion.set(opacity);
      boxShadowMotion.set(boxShadow);
    },
    [
      theme,
      calculateShadow,
      scaleMotion,
      blurMotion,
      opacityMotion,
      boxShadowMotion,
    ]
  );

  // Throttled mouse move handler
  const handleMouseMove = useCallback((clientX: number, clientY: number) => {
    // Throttle updates
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < throttleDelay) return;
    lastUpdateTimeRef.current = now;

    setMousePosition({
      x: clientX,
      y: clientY,
    });
  }, []);

  // Track mouse position for interactive effects
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mouseMoveListener = (e: MouseEvent) => {
      handleMouseMove(e.clientX, e.clientY);
    };

    // For touch devices, use touch events
    const touchMoveListener = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMouseMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", mouseMoveListener);
    window.addEventListener("touchmove", touchMoveListener, { passive: true });

    // Start the animation
    controls.start("animate");

    return () => {
      window.removeEventListener("mousemove", mouseMoveListener);
      window.removeEventListener("touchmove", touchMoveListener);
    };
  }, [controls, handleMouseMove]);

  // Calculate distance from mouse to dot
  useEffect(() => {
    if (!mousePosition || !dotRef.current) {
      return;
    }

    const dot = dotRef.current;
    const rect = dot.getBoundingClientRect();
    const dotCenterX = rect.left + rect.width / 2;
    const dotCenterY = rect.top + rect.height / 2;

    // Calculate distance between dot center and mouse position
    const dx = mousePosition.x - dotCenterX;
    const dy = mousePosition.y - dotCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize distance (1 = far away, 0 = directly over)
    // Use a maximum influence distance of 300px with a minimum of 0.2
    const normalizedDistance = Math.min(Math.max(distance / 300, 0.2), 1);

    // If the distance hasn't changed significantly, don't update
    if (Math.abs(normalizedDistance - mouseDistanceRef.current) < 0.02) return;

    // Update visual properties based on the new distance
    updateVisualProperties(normalizedDistance);
  }, [mousePosition, updateVisualProperties]);

  return (
    <motion.div
      ref={dotRef}
      className="absolute rounded-full"
      variants={dotVariants}
      initial="initial"
      animate="animate"
      style={{
        left: `${position[0]}%`,
        top: `${position[1]}%`,
        width: size,
        height: size,
        backgroundColor: index % 2 === 0 ? primaryColor : secondaryColor,
        filter: `blur(${blurMotion.get()}px) brightness(${10 / blurMotion.get()})`,
        boxShadow: boxShadowMotion,
        mixBlendMode: theme === "dark" ? "screen" : "multiply",
        zIndex: -5,
      }}
      transition={{
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
        filter: { duration: 0.3 },
        boxShadow: { duration: 0.3 },
      }}
    />
  );
};

interface GradientBackgroundProps {
  theme?: "dark" | "light";
  isLoading?: boolean;
  opacity?: number;
  showDots?: boolean;
  transitionDuration?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  theme: propTheme,
  isLoading = false,
  opacity = 1,
  showDots = true,
  transitionDuration = "10s",
}) => {
  // Fall back to theme provider if theme not provided
  let theme: "dark" | "light";
  try {
    const { resolvedTheme } = useThemeWithFallback();
    theme = propTheme || (resolvedTheme as "dark" | "light") || "dark";
  } catch (e) {
    theme = propTheme || "dark";
  }

  // State to track if animation should be fast (during loading) or slow (when visible)
  const [animationSpeed, setAnimationSpeed] = useState(
    isLoading ? "fast" : "normal"
  );
  // State to track the entry animation
  const [entryStage, setEntryStage] = useState<
    "initial" | "entering" | "complete"
  >("initial");
  // State to track animation progress
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animation controls
  const backgroundControls = useAnimation();

  // Entry animation variants
  const entryVariants = {
    initial: {
      opacity: 0,
      scale: 1.1,
    },
    entering: {
      opacity: opacity,
      scale: 1,
      transition: {
        duration: 10,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    complete: {
      opacity: opacity,
      scale: 1,
    },
  };

  // Background animation variants
  const backgroundAnimations = {
    fast: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 5,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
    normal: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop" as const,
      },
    },
  };

  // Effect to control animation speed
  useEffect(() => {
    if (!isLoading && animationSpeed === "fast") {
      // Switch to slower animation after loading
      const timer = setTimeout(() => {
        setAnimationSpeed("normal");
        backgroundControls.start("normal");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      backgroundControls.start(animationSpeed);
    }
  }, [isLoading, animationSpeed, backgroundControls]);

  // Effect to control entry animation
  useEffect(() => {
    // Small delay before starting the animation
    const initialDelay = setTimeout(() => {
      setEntryStage("entering");

      // Start the animation progress
      let start: number | null = null;
      const duration = 10000; // 10 seconds in ms

      // Animation function using requestAnimationFrame
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        setAnimationProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setEntryStage("complete");
        }
      };

      // Start the animation
      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(initialDelay);
  }, []);

  // Get colors from theme
  const themeColors = theme === "dark" ? darkColors : lightColors;

  // Extract primary and secondary color variations
  const primaryColors = [
    themeColors.primary[100],
    themeColors.primary[300],
    themeColors.primary.DEFAULT,
    themeColors.primary[700],
    themeColors.primary[900],
  ];

  const secondaryColors = [
    themeColors.secondary[100],
    themeColors.secondary[300],
    themeColors.secondary.DEFAULT,
    themeColors.secondary[700],
    themeColors.secondary[900],
  ];

  // Create a rich gradient with alternating primary and secondary colors
  // For dark theme, use darker colors; for light theme, use lighter colors
  const gradientColors =
    theme === "dark"
      ? [
          primaryColors[4] + "30", // primary-900
          secondaryColors[3] + "30", // secondary-700
          primaryColors[2] + "30", // primary-DEFAULT
          secondaryColors[2] + "30", // secondary-DEFAULT
          primaryColors[3] + "30", // primary-700
          secondaryColors[4] + "30", // secondary-900
        ]
      : [
          primaryColors[0] + "30", // primary-100
          secondaryColors[0] + "30", // secondary-100
          primaryColors[1] + "30", // primary-300
          secondaryColors[1] + "30", // secondary-300
          primaryColors[2] + "30", // primary-DEFAULT
          secondaryColors[2] + "30", // secondary-DEFAULT
        ];

  // Create the gradient background string
  const gradient = `linear-gradient(135deg, ${gradientColors.join(", ")})`;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 bottom-0 -z-10 w-full h-full"
      variants={{
        ...entryVariants,
        ...backgroundAnimations,
      }}
      style={{
        background: gradient,
        backgroundSize: "400% 400%",
      }}
    >
      {/* Animated dots */}
      <AnimatePresence>
        {showDots && entryStage !== "initial" && (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {gradientBackgroundDots.map((dot, index) => (
              <AnimatedDot
                key={dot.id}
                position={dot.position}
                size={dot.size}
                theme={theme}
                primaryColor={primaryColors[2] + "90"}
                secondaryColor={secondaryColors[2] + "90"}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GradientBackground;
