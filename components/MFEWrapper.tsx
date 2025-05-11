"use client";

import React, { useRef, useEffect, useState } from 'react';
import { init, loadRemote } from '@module-federation/runtime';

// Interface for the MFE module
interface MFEModule {
  mount: (container: HTMLElement, options?: { config?: any }) => void;
  unmount: (container: HTMLElement) => void;
}

interface MFEWrapperProps {
  remoteName: string;
  exposedModule: string;
  config?: Record<string, any>;
}

// Type definitions for Module Federation runtime
interface SharedConfig {
  singleton?: boolean;
  requiredVersion?: string | boolean;
  eager?: boolean;
}

interface RemoteConfig {
  name: string;
  alias: string;
  entry: string;
}

interface RuntimeConfig {
  name: string;
  remotes: RemoteConfig[];
  shared: Record<string, SharedConfig>;
}

// Initialize Module Federation runtime once
// Using type assertion to bypass strict type checking for the runtime configuration
// @ts-ignore - Module Federation types are not fully compatible with TypeScript
const runtimeInitialized = init({
  name: 'portafolio',
  remotes: [
    {
      name: 'button',
      alias: 'button',
      entry: 'http://localhost:3001/remoteEntry.js'
    },
    {
      name: 'dropdown',
      alias: 'dropdown',
      entry: 'http://localhost:3002/remoteEntry.js'
    },
    {
      name: 'navbar',
      alias: 'navbar',
      entry: 'http://localhost:3003/remoteEntry.js'
    }
  ],
  shared: {
    react: {
      singleton: true,
      requiredVersion: false,
      eager: true
    },
    'react-dom': {
      singleton: true,
      requiredVersion: false,
      eager: true
    },
    'react/jsx-runtime': {
      singleton: true,
      requiredVersion: false,
      eager: true
    }
  }
} as any);

const MFEWrapper: React.FC<MFEWrapperProps> = ({ remoteName, exposedModule, config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Store the current instance of the unmount function
  const unmountFnRef = useRef<MFEModule['unmount'] | null>(null);
  
  // Create a stable container element that persists across renders
  const [containerElement] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.createElement('div');
    }
    return null;
  });

  useEffect(() => {
    // Safety check for SSR
    if (!containerElement || !containerRef.current) {
      return;
    }
    
    // Append our stable container to the ref element
    containerRef.current.innerHTML = ''; // Clear any existing content
    containerRef.current.appendChild(containerElement);
    
    let isComponentMounted = false;

    const mountMFE = async () => {
      try {
        console.log(`Loading remote module ${remoteName}/${exposedModule}...`);
        
        // Load the remote module using @module-federation/runtime
        const module = await loadRemote(`${remoteName}/${exposedModule}`);
        
        if (!module) {
          throw new Error(`Module ${remoteName}/${exposedModule} not found`);
        }

        // Extract mount and unmount functions with type assertion
        const federatedModule = module as unknown as MFEModule;
        const mountFn = federatedModule.mount;
        unmountFnRef.current = federatedModule.unmount;

        if (containerElement && typeof mountFn === 'function' && !isComponentMounted) {
          console.log(`Mounting ${remoteName}...`);
          
          // Use the stable container element for mounting
          mountFn(containerElement, { config });
          isComponentMounted = true;
          setIsMounted(true);
          setHasError(false);
        } else if (!mountFn) {
          console.error(`Mount function not found in ${remoteName}/${exposedModule}`);
          setHasError(true);
        }
      } catch (error) {
        console.error(`Error loading or mounting ${remoteName}:`, error);
        setHasError(true);
      }
    };

    // Initialize once then mount the MFE
    Promise.resolve(runtimeInitialized)
      .then(() => mountMFE())
      .catch((error: unknown) => {
        console.error('Failed to initialize Module Federation runtime:', error);
        setHasError(true);
      });

    // Cleanup function - ensure unmounting before removing DOM elements
    return () => {
      const unmount = unmountFnRef.current;
      
      if (containerElement && typeof unmount === 'function' && isComponentMounted) {
        try {
          console.log(`Unmounting ${remoteName}...`);
          
          // First, unmount the federated module
          unmount(containerElement);
          
          // Then, safely remove from DOM if parent still contains child
          if (containerRef.current?.contains(containerElement)) {
            containerRef.current.removeChild(containerElement);
          }
          
          isComponentMounted = false;
          setIsMounted(false);
        } catch (error) {
          console.error(`Error unmounting ${remoteName}:`, error);
        } finally {
          // Always clean up references
          unmountFnRef.current = null;
        }
      }
    };
  }, [remoteName, exposedModule, config, containerElement]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Loader while the MFE loads */}
      {!isMounted && !hasError && (
        <div className="py-4 text-center">
          Loading {remoteName}...
        </div>
      )}
      {/* Error message if loading failed */}
      {hasError && (
        <div className="py-4 text-center text-red-500">
          Could not load remote component {remoteName}/{exposedModule}
        </div>
      )}
    </div>
  );
};

export default MFEWrapper;