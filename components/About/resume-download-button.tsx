'use client';

import { useState } from 'react';
import { ResumeGenerator } from './resume-pdf';
import { ResumeFallbackGenerator } from './resume-fallback';
import { useTranslation } from '@/hooks/useTranslation';

export const ResumeDownloadButton = () => {
  const [clientSideFailed, setClientSideFailed] = useState(false);
  const { t, locale } = useTranslation("about");
  
  // Define error handler function
  const handleClientSideError = () => {
    console.error('PDF generation failed in client, switching to server-side generation');
    setClientSideFailed(true);
  };
  
  // Create a translation function that handles the resume content properly
  const translationFunc = (key: string) => {
    try {
      // Special case to help the resume config detect the current locale
      if (key === "currentLocale") {
        return locale;
      }
      
      // Process key to match our JSON structure
      let actualKey = key;
      
      // Handle prefix variations
      if (key.startsWith("about.resumeContent.")) {
        actualKey = key.substring("about.resumeContent.".length);
      }
      
      if (!key.includes("resumeContent") && !actualKey.includes("resumeContent")) {
        actualKey = `resumeContent.${actualKey}`;
      }
      
      // Handle nested structure differences between es.json and en.json
      if (actualKey === "resumeContent.education.title") {
        // Try direct path first
        const directResult = t("resumeContent.education.title", undefined, true);
        if (directResult && typeof directResult === 'string') return directResult;
        
        // Try nested path as fallback
        const nestedResult = t("resumeContent.experience.education.title", undefined, true);
        if (nestedResult && typeof nestedResult === 'string') return nestedResult;
        
        // Ultimate fallback
        return locale === "es" ? "Educación" : "Education";
      }
      
      if (actualKey === "resumeContent.education.items") {
        // Try direct path first
        const directResult = t("resumeContent.education.items", undefined, true);
        if (directResult && Array.isArray(directResult)) return directResult;
        
        // Try nested path as fallback
        const nestedResult = t("resumeContent.experience.education.items", undefined, true);
        if (nestedResult && Array.isArray(nestedResult)) return nestedResult;
        
        return [];
      }
      
      if (actualKey === "resumeContent.projects.title") {
        // Try direct path first
        const directResult = t("resumeContent.projects.title", undefined, true);
        if (directResult && typeof directResult === 'string') return directResult;
        
        // Try nested path as fallback
        const nestedResult = t("resumeContent.experience.education.projects.title", undefined, true);
        if (nestedResult && typeof nestedResult === 'string') return nestedResult;
        
        // Ultimate fallback
        return locale === "es" ? "Proyectos" : "Projects";
      }
      
      if (actualKey === "resumeContent.projects.items") {
        // Try direct path first
        const directResult = t("resumeContent.projects.items", undefined, true);
        if (directResult && Array.isArray(directResult)) return directResult;
        
        // Try nested path as fallback
        const nestedResult = t("resumeContent.experience.education.projects.items", undefined, true);
        if (nestedResult && Array.isArray(nestedResult)) return nestedResult;
        
        return [];
      }
      
      // Special cases for specific keys
      if (actualKey === "resumeContent.aboutTitle") {
        return locale === "es" ? "Sobre Mí" : "About Me";
      }
      
      if (actualKey === "resumeContent.skills.title") {
        const result = t("resumeContent.skills.title", undefined, true);
        if (result && typeof result === 'string') return result;
        return locale === "es" ? "Mis Habilidades" : "My Skills";
      }
      
      if (actualKey === "resumeContent.experience.title") {
        const result = t("resumeContent.experience.title", undefined, true);
        if (result && typeof result === 'string') return result;
        return locale === "es" ? "Experiencia" : "Experience";
      }
      
      if (actualKey === "resumeContent.jobTitle") {
        return locale === "es" ? "Desarrollador Frontend" : "Frontend Developer";
      }
      
      // For any other key, get the translation with returnObject=true to get the full object/array
      const result = t(actualKey, undefined, true);
      
      // Only return if we have a valid result
      if (result !== undefined && result !== null && result !== actualKey) {
        return result;
      }
      
      // Log warning and return a reasonable default
      console.warn(`Translation not found for: ${actualKey}`);
      return undefined;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return undefined;
    }
  };
  
  // Get appropriate download text based on locale
  const downloadText = t('resume', locale === "es" ? "Descargar Currículum" : "Download Resume");
  
  // Render appropriate component based on state
  return clientSideFailed ? (
    <ResumeFallbackGenerator />
  ) : (
    <ResumeGenerator 
      onError={handleClientSideError} 
      resumeContent={translationFunc}
      downloadText={downloadText}
    />
  );
}; 