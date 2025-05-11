import { personalData } from "./personal-data";
import { Locale } from "./i18n";

export type ResumeConfig = typeof resumeConfig;

export const getResumeConfig = (t: (key: string) => any) => {
  // Helper function to ensure we get an array or provide a default
  const getArrayData = (key: string, defaultValue: any[] = []) => {
    try {
      const data = t(key);
      return Array.isArray(data) ? data : defaultValue;
    } catch (e) {
      console.warn(`Failed to translate array for key: ${key}`, e);
      return defaultValue;
    }
  };

  // Helper to get a string value with fallback
  const getString = (key: string, defaultValue: string = "") => {
    try {
      const value = t(key);
      return typeof value === 'string' ? value : defaultValue;
    } catch (e) {
      console.warn(`Failed to translate string for key: ${key}`, e);
      return defaultValue;
    }
  };

  // Helper to get an object value with fallback
  const getObject = (key: string, defaultValue: any = {}) => {
    try {
      const value = t(key);
      return value && typeof value === 'object' ? value : defaultValue;
    } catch (e) {
      console.warn(`Failed to translate object for key: ${key}`, e);
      return defaultValue;
    }
  };

  // Detect current locale from translation function (if available)
  let currentLocale: Locale = "en";
  try {
    // Check if t has access to locale information
    const testLocale = t("currentLocale");
    if (testLocale && (testLocale === "en" || testLocale === "es")) {
      currentLocale = testLocale as Locale;
    }
  } catch (e) {
    // Ignore errors, use default
  }

  return {
    // Personal Information - consistent across languages
    name: personalData.name,
    jobTitle: getString("resumeContent.jobTitle", personalData.jobTitle),
    photo: personalData.photo,
    contact: {
      email: personalData.contact.email,
      phone: personalData.contact.phone,
      linkedin: personalData.contact.linkedin,
      gitlab: personalData.contact.gitlab,
    },
    showProjects: false,

    // About Me Section - direct translation
    about: getString("resumeContent.about", 
      currentLocale === "es" 
        ? "Desarrollador Front-End con experiencia en la creación de interfaces responsivas"
        : "Front-End Developer with experience in creating responsive interfaces"
    ),

    // Skills Section - direct translations
    skills: [
      {
        title: getString("resumeContent.skills.title", 
          currentLocale === "es" ? "Mis Habilidades" : "My Skills"
        ),
        category: getString("resumeContent.skills.frontend", 
          currentLocale === "es" ? "Frontend" : "Frontend"
        ),
        items: getArrayData("resumeContent.skills.items", [
          "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"
        ]),
      },
    ],

    // Experience Section - direct translation
    experience: {
      title: getString("resumeContent.experience.title", 
        currentLocale === "es" ? "Experiencia" : "Experience"
      ),
      items: getArrayData("resumeContent.experience.items", [])
    },

    // Education Section - direct translation
    education: {
      title: getString("resumeContent.education.title", 
        currentLocale === "es" ? "Educación" : "Education"
      ),
      items: getArrayData("resumeContent.education.items", [])
    },

    // Projects Section - direct translation
    projects: {
      title: getString("resumeContent.projects.title", 
        currentLocale === "es" ? "Proyectos" : "Projects"
      ),
      items: getArrayData("resumeContent.projects.items", [])
    },

    // PDF Styling Configuration - consistent across languages
    pdfStyle: {
      primaryColor: "#FFC000",
      secondaryColor: "#0087FF",
      accentColor: "#333333",
      backgroundColor: "#FFFFFF",
      fontFamily: "'Inter', sans-serif",
      fontSize: {
        name: 28,
        title: 18,
        subtitle: 16,
        normal: 12,
        small: 10,
      },
      sectionSpacing: 15,
    },
  };
};

// Default export for backward compatibility
export const resumeConfig = getResumeConfig(() => "");
