"use client";

import { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
  Link,
  Svg,
  Path,
  Circle,
  G,
} from "@react-pdf/renderer";
import { Button } from "@heroui/button";

import { getResumeConfig } from "@/config/resume";
import { useTranslation } from "@/hooks/useTranslation";

// Define types for resume data
export interface SkillGroup {
  title: string;
  category: string;
  items: string[];
}

export interface ExperienceItem {
  position: string;
  company: string;
  location: string;
  period: string;
  description?: string;
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface ResumeData {
  name: string;
  jobTitle: string;
  photo: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    gitlab: string;
  };
  showProjects: boolean;
  about: string;
  skills: SkillGroup[];
  experience: {
    title: string;
    items: ExperienceItem[];
  };
  education: {
    title: string;
    items: EducationItem[];
  };
  projects: {
    title: string;
    items: ProjectItem[];
  };
  pdfStyle: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamily: string;
    fontSize: {
      name: number;
      title: number;
      subtitle: number;
      normal: number;
      small: number;
    };
    sectionSpacing: number;
  };
}

// Register fonts - using only standard PDF fonts for better compatibility
Font.register({
  family: "Helvetica",
  fonts: [{ src: "Helvetica" }, { src: "Helvetica-Bold", fontWeight: 700 }],
});

// Default fallback font
Font.registerHyphenationCallback((word) => [word]);

// Background SVG Component
const BackgroundSVG = ({
  primaryColor,
  secondaryColor,
  accentColor,
}: {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}) => (
  <Svg height="100%" viewBox="0 0 595 842" width="100%">
    {/* Corner decorations */}
    <Path d="M0,0 L150,0 L0,150 Z" fill={primaryColor} fillOpacity={0.07} />
    <Path
      d="M595,0 L595,150 L445,0 Z"
      fill={secondaryColor}
      fillOpacity={0.07}
    />
    <Path
      d="M0,842 L0,692 L150,842 Z"
      fill={secondaryColor}
      fillOpacity={0.07}
    />
    <Path
      d="M595,842 L445,842 L595,692 Z"
      fill={primaryColor}
      fillOpacity={0.07}
    />

    {/* Curved lines on sides */}
    <Path
      d="M-20,300 Q100,400 -20,500"
      fill="none"
      stroke={primaryColor}
      strokeOpacity={0.2}
      strokeWidth={0.5}
    />
    <Path
      d="M-15,280 Q120,400 -15,520"
      fill="none"
      stroke={primaryColor}
      strokeOpacity={0.15}
      strokeWidth={0.5}
    />
    <Path
      d="M-10,260 Q140,400 -10,540"
      fill="none"
      stroke={primaryColor}
      strokeOpacity={0.1}
      strokeWidth={0.5}
    />

    <Path
      d="M615,300 Q495,400 615,500"
      fill="none"
      stroke={secondaryColor}
      strokeOpacity={0.2}
      strokeWidth={0.5}
    />
    <Path
      d="M610,280 Q475,400 610,520"
      fill="none"
      stroke={secondaryColor}
      strokeOpacity={0.15}
      strokeWidth={0.5}
    />
    <Path
      d="M605,260 Q455,400 605,540"
      fill="none"
      stroke={secondaryColor}
      strokeOpacity={0.1}
      strokeWidth={0.5}
    />

    {/* Circle decorations */}
    <Circle cx={50} cy={250} fill={primaryColor} fillOpacity={0.03} r={70} />
    <Circle cx={545} cy={650} fill={secondaryColor} fillOpacity={0.03} r={80} />

    {/* Dotted grid pattern in center areas */}
    <G opacity={0.05}>
      {/* First dotted grid */}
      {[150, 170, 190, 210, 230].map((x) =>
        [400, 420, 440].map((y) => (
          <Circle key={`${x}-${y}`} cx={x} cy={y} fill={accentColor} r={1} />
        )),
      )}

      {/* Second dotted grid */}
      {[380, 400, 420, 440, 460].map((x) =>
        [600, 620, 640].map((y) => (
          <Circle key={`${x}-${y}`} cx={x} cy={y} fill={accentColor} r={1} />
        )),
      )}
    </G>
  </Svg>
);

// Create styles
const createStyles = (config: ResumeData) =>
  StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: config.pdfStyle.backgroundColor,
      padding: 30,
      fontFamily: "Helvetica",
      position: "relative",
    },
    header: {
      flexDirection: "row",
      paddingBottom: 15,
    },
    headerLeft: {
      flex: 2,
    },
    headerRight: {
      flex: 1,
      alignItems: "center",
    },
    name: {
      fontSize: config.pdfStyle.fontSize.name,
      fontWeight: "bold",
      color: config.pdfStyle.accentColor,
      marginBottom: 5,
    },
    jobTitle: {
      fontSize: config.pdfStyle.fontSize.title,
      color: config.pdfStyle.primaryColor,
      marginBottom: 15,
    },
    contactInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    contactText: {
      fontSize: config.pdfStyle.fontSize.normal,
      color: config.pdfStyle.accentColor,
      marginLeft: 5,
    },
    contactLink: {
      color: config.pdfStyle.secondaryColor,
      textDecoration: "none",
    },
    photo: {
      width: 120,
      height: 120,
      border: `2px solid ${config.pdfStyle.primaryColor}`,
      backgroundColor: "#F0F0F0",
      borderRadius: 60,
      objectFit: "cover",
      objectPosition: "top",
    },
    section: {
      marginBottom: config.pdfStyle.sectionSpacing,
    },
    sectionTitle: {
      fontSize: config.pdfStyle.fontSize.title,
      fontWeight: "bold",
      color: config.pdfStyle.primaryColor,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
      paddingBottom: 5,
    },
    aboutText: {
      fontSize: config.pdfStyle.fontSize.normal,
      lineHeight: 1.5,
      color: config.pdfStyle.accentColor,
    },
    skillCategory: {
      fontSize: config.pdfStyle.fontSize.subtitle,
      fontWeight: "bold",
      color: config.pdfStyle.secondaryColor,
      marginBottom: 5,
      marginTop: 10,
    },
    skillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 5,
    },
    skillItem: {
      fontSize: config.pdfStyle.fontSize.normal,
      backgroundColor: config.pdfStyle.primaryColor + "20", // 20% opacity
      color: config.pdfStyle.accentColor,
      padding: "4 8",
      marginRight: 8,
      marginBottom: 8,
      borderRadius: 4,
    },
    experienceItem: {
      marginBottom: 15,
    },
    positionTitle: {
      fontSize: config.pdfStyle.fontSize.subtitle,
      fontWeight: "bold",
      color: config.pdfStyle.secondaryColor,
    },
    companyInfo: {
      fontSize: config.pdfStyle.fontSize.normal,
      color: config.pdfStyle.accentColor,
      marginBottom: 5,
    },
    periodLocation: {
      fontSize: config.pdfStyle.fontSize.small,
      color: config.pdfStyle.accentColor,
      marginBottom: 5,
      opacity: 0.8,
    },
    description: {
      fontSize: config.pdfStyle.fontSize.normal,
      color: config.pdfStyle.accentColor,
      marginBottom: 5,
    },
    highlightsList: {
      marginLeft: 10,
    },
    highlightItem: {
      fontSize: config.pdfStyle.fontSize.small,
      color: config.pdfStyle.accentColor,
      marginBottom: 2,
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: config.pdfStyle.fontSize.small,
      color: config.pdfStyle.accentColor,
    },
    columns: {
      flexDirection: "row",
      marginTop: 10,
    },
    leftColumn: {
      flex: 1,
      paddingRight: 10,
    },
    rightColumn: {
      flex: 1,
      paddingLeft: 10,
    },
    divider: {
      width: 1,
      backgroundColor: "#EEEEEE",
      marginVertical: 10,
    },
    projectTitle: {
      fontSize: config.pdfStyle.fontSize.subtitle,
      fontWeight: "bold",
      color: config.pdfStyle.secondaryColor,
      marginBottom: 3,
    },
    techList: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 3,
      marginBottom: 5,
    },
    techItem: {
      fontSize: config.pdfStyle.fontSize.small,
      color: config.pdfStyle.primaryColor,
      fontWeight: "bold",
      marginRight: 8,
    },
    pageBackground: {
      position: "absolute",
      minWidth: "100%",
      minHeight: "100%",
      height: "100%",
      width: "100%",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
  });

// Create simpler, more compatible PDF Document
const SimpleResumePDF = ({
  config,
  locale,
}: {
  config: ResumeData;
  locale: string;
}) => {
  const styles = createStyles(config);

  // Ensure all arrays are properly defined
  const safeSkills = Array.isArray(config.skills) ? config.skills : [];
  const safeExperience = Array.isArray(config.experience?.items)
    ? config.experience.items
    : [];
  const safeEducation = Array.isArray(config.education?.items)
    ? config.education.items
    : [];
  const safeProjects = Array.isArray(config.projects?.items)
    ? config.projects.items
    : [];

  // Section title translations
  const getSectionTitle = (section: string, defaultTitle: string) => {
    if (section === "about") {
      return locale === "es" ? "Sobre Mí" : "About Me";
    } else if (section === "skills") {
      return config.skills?.length > 0 && safeSkills[0]?.title
        ? safeSkills[0].title
        : locale === "es"
          ? "Mis Habilidades"
          : "Skills";
    } else if (section === "experience") {
      return (
        config.experience?.title ||
        (locale === "es" ? "Experiencia" : "Experience")
      );
    } else if (section === "education") {
      return (
        config.education?.title || (locale === "es" ? "Educación" : "Education")
      );
    } else if (section === "projects") {
      return (
        config.projects?.title || (locale === "es" ? "Proyectos" : "Projects")
      );
    }

    return defaultTitle;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View fixed style={styles.pageBackground}>
          <BackgroundSVG
            accentColor={config.pdfStyle.accentColor}
            primaryColor={config.pdfStyle.primaryColor}
            secondaryColor={config.pdfStyle.secondaryColor}
          />
        </View>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{config.name}</Text>
            <Text style={styles.jobTitle}>{config.jobTitle}</Text>

            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>{config.contact.email}</Text>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>{config.contact.phone}</Text>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>
                <Link src={config.contact.linkedin} style={styles.contactLink}>
                  {config.contact.linkedin}
                </Link>
              </Text>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>
                <Link src={config.contact.gitlab} style={styles.contactLink}>
                  {config.contact.gitlab}
                </Link>
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Image src={config.photo} style={styles.photo} />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getSectionTitle("about", "About Me")}
          </Text>
          <Text style={styles.aboutText}>{config.about}</Text>
        </View>

        {/* Two Column Layout for Skills and Experience */}
        <View style={styles.columns}>
          {/* Left Column - Skills and Education */}
          <View style={styles.leftColumn}>
            {/* Skills Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {getSectionTitle("skills", "Skills")}
              </Text>
              {safeSkills.map((skillGroup, index) => {
                // Ensure items is an array
                const items = Array.isArray(skillGroup.items)
                  ? skillGroup.items
                  : typeof skillGroup.items === "string"
                    ? [skillGroup.items]
                    : [];

                return (
                  <View key={index}>
                    {safeSkills.length > 1 && (
                      <Text style={styles.skillCategory}>
                        {skillGroup.category}
                      </Text>
                    )}
                    <View style={styles.skillRow}>
                      {items.map((skill: string, skillIndex: number) => (
                        <Text key={skillIndex} style={styles.skillItem}>
                          {skill}
                        </Text>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Education Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {getSectionTitle("education", "Education")}
              </Text>
              {safeEducation.map((edu: EducationItem, index: number) => {
                const highlights = Array.isArray(edu.highlights)
                  ? edu.highlights
                  : [];

                return (
                  <View key={index} style={styles.experienceItem}>
                    <Text style={styles.positionTitle}>{edu.degree}</Text>
                    <Text style={styles.companyInfo}>{edu.institution}</Text>
                    <Text style={styles.periodLocation}>
                      {edu.period} | {edu.location}
                    </Text>

                    <View style={styles.highlightsList}>
                      {highlights.map((highlight: string, hIndex: number) => (
                        <Text key={hIndex} style={styles.highlightItem}>
                          • {highlight}
                        </Text>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Right Column - Experience and Projects */}
          <View style={styles.rightColumn}>
            {/* Experience Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {getSectionTitle("experience", "Experience")}
              </Text>
              {safeExperience.map((exp: ExperienceItem, index: number) => {
                const highlights = Array.isArray(exp.highlights)
                  ? exp.highlights
                  : [];

                return (
                  <View key={index} style={styles.experienceItem}>
                    <Text style={styles.positionTitle}>{exp.position}</Text>
                    <Text style={styles.companyInfo}>{exp.company}</Text>
                    <Text style={styles.periodLocation}>
                      {exp.period} | {exp.location}
                    </Text>
                    {exp?.description && (
                      <Text style={styles.description}>{exp.description}</Text>
                    )}

                    <View style={styles.highlightsList}>
                      {highlights.map((highlight: string, hIndex: number) => (
                        <Text key={hIndex} style={styles.highlightItem}>
                          • {highlight}
                        </Text>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>

            {config.showProjects && safeProjects.length > 0 && (
              <>
                {/* Projects Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {getSectionTitle("projects", "Projects")}
                  </Text>
                  {safeProjects.map((project: ProjectItem, index: number) => {
                    const technologies = Array.isArray(project.technologies)
                      ? project.technologies
                      : [];
                    const highlights = Array.isArray(project.highlights)
                      ? project.highlights
                      : [];

                    return (
                      <View key={index} style={styles.experienceItem}>
                        <Text style={styles.projectTitle}>{project.title}</Text>
                        <Text style={styles.description}>
                          {project.description}
                        </Text>

                        <View style={styles.techList}>
                          {technologies.map(
                            (tech: string, techIndex: number) => (
                              <Text key={techIndex} style={styles.techItem}>
                                {tech}
                              </Text>
                            ),
                          )}
                        </View>

                        <View style={styles.highlightsList}>
                          {highlights.map(
                            (highlight: string, hIndex: number) => (
                              <Text key={hIndex} style={styles.highlightItem}>
                                • {highlight}
                              </Text>
                            ),
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Resume Generator component with download button
export const ResumeGenerator = ({
  onError,
  resumeContent,
  downloadText = "Download Resume",
}: {
  onError?: () => void;
  resumeContent: any;
  downloadText?: string;
}) => {
  const { locale } = useTranslation("about");
  const config = getResumeConfig(resumeContent);

  // Get the filename with locale suffix
  const getLocalizedFilename = () => {
    const baseName = "Juan_Daniel_Castaneda_Resume";

    return locale === "es" ? `${baseName}_ES.pdf` : `${baseName}_EN.pdf`;
  };

  const [documentState, setDocumentState] = useState({
    document: <SimpleResumePDF config={config} locale={locale} />,
    error: false,
  });

  // Handle errors outside of render
  useEffect(() => {
    if (documentState.error && onError) {
      onError();
    }
  }, [documentState.error, onError]);

  // Render the document element as a memoized value to prevent re-rendering issues
  const documentElement = documentState.document;

  return (
    <PDFDownloadLink
      document={documentElement}
      fileName={getLocalizedFilename()}
    >
      {({ loading, error }) => {
        // Effects need to be outside the render function
        // If we detect an error, we'll handle it in a useEffect
        if (error && !documentState.error) {
          console.error("PDF generation error:", error);
          // Using setTimeout to avoid state updates during render
          setTimeout(() => {
            setDocumentState({
              document: <SimpleResumePDF config={config} locale={locale} />,
              error: true,
            });
          }, 0);
        }

        return (
          <Button
            className="font-bold"
            color="primary"
            disabled={loading}
            variant="shadow"
          >
            {loading ? "Generating Resume..." : downloadText}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default SimpleResumePDF;
