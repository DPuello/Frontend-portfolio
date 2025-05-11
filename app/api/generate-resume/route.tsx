import { NextRequest, NextResponse } from "next/server";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  Font,
  Link,
  renderToBuffer,
  Svg,
  Path,
  Circle,
  G
} from "@react-pdf/renderer";
import { resumeConfig } from "@/config/resume";
import fs from "fs/promises";
import path from "path";

// Register standard fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 700 },
  ],
});

// Background SVG Component
const BackgroundSVG = () => (
  <Svg width="100%" height="100%" viewBox="0 0 595 842" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
    {/* Corner decorations */}
    <Path d="M0,0 L150,0 L0,150 Z" fill={resumeConfig.pdfStyle.primaryColor} fillOpacity={0.07} />
    <Path d="M595,0 L595,150 L445,0 Z" fill={resumeConfig.pdfStyle.secondaryColor} fillOpacity={0.07} />
    <Path d="M0,842 L0,692 L150,842 Z" fill={resumeConfig.pdfStyle.secondaryColor} fillOpacity={0.07} />
    <Path d="M595,842 L445,842 L595,692 Z" fill={resumeConfig.pdfStyle.primaryColor} fillOpacity={0.07} />
    
    {/* Curved lines on sides */}
    <Path d="M-20,300 Q100,400 -20,500" stroke={resumeConfig.pdfStyle.primaryColor} strokeWidth={0.5} fill="none" strokeOpacity={0.2} />
    <Path d="M-15,280 Q120,400 -15,520" stroke={resumeConfig.pdfStyle.primaryColor} strokeWidth={0.5} fill="none" strokeOpacity={0.15} />
    <Path d="M-10,260 Q140,400 -10,540" stroke={resumeConfig.pdfStyle.primaryColor} strokeWidth={0.5} fill="none" strokeOpacity={0.1} />
    
    <Path d="M615,300 Q495,400 615,500" stroke={resumeConfig.pdfStyle.secondaryColor} strokeWidth={0.5} fill="none" strokeOpacity={0.2} />
    <Path d="M610,280 Q475,400 610,520" stroke={resumeConfig.pdfStyle.secondaryColor} strokeWidth={0.5} fill="none" strokeOpacity={0.15} />
    <Path d="M605,260 Q455,400 605,540" stroke={resumeConfig.pdfStyle.secondaryColor} strokeWidth={0.5} fill="none" strokeOpacity={0.1} />
    
    {/* Circle decorations */}
    <Circle cx={50} cy={250} r={70} fill={resumeConfig.pdfStyle.primaryColor} fillOpacity={0.03} />
    <Circle cx={545} cy={650} r={80} fill={resumeConfig.pdfStyle.secondaryColor} fillOpacity={0.03} />
    
    {/* Dotted grid pattern in center areas */}
    <G opacity={0.05}>
      {/* First dotted grid */}
      {[150, 170, 190, 210, 230].map(x => 
        [400, 420, 440].map(y => 
          <Circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill="#333333" />
        )
      )}
      
      {/* Second dotted grid */}
      {[380, 400, 420, 440, 460].map(x => 
        [600, 620, 640].map(y => 
          <Circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill="#333333" />
        )
      )}
    </G>
  </Svg>
);

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: resumeConfig.pdfStyle.primaryColor,
    paddingBottom: 15,
  },
  headerLeft: {
    flex: 2,
  },
  headerRight: {
    flex: 1,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 18,
    color: resumeConfig.pdfStyle.primaryColor,
    marginBottom: 15,
  },
  contactInfo: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333333',
  },
  contactLink: {
    color: 'blue',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: resumeConfig.pdfStyle.primaryColor,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 5,
  },
  columns: {
    flexDirection: 'row',
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
  skillCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: resumeConfig.pdfStyle.secondaryColor,
    marginBottom: 5,
    marginTop: 10,
  },
  skillRow: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333333',
  },
  experienceItem: {
    marginBottom: 15,
  },
  positionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: resumeConfig.pdfStyle.secondaryColor,
  },
  companyInfo: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
  },
  periodLocation: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
  },
  highlightItem: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 2,
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#555555',
  },
});

// Create a simple PDF document
const ServerResumePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <BackgroundSVG />
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{resumeConfig.name}</Text>
          <Text style={styles.jobTitle}>{resumeConfig.jobTitle}</Text>
          
          <Text style={styles.contactInfo}>
            {resumeConfig.contact.email}
          </Text>
          <Text style={styles.contactInfo}>
            {resumeConfig.contact.phone}
          </Text>
          <Text style={styles.contactInfo}>
            <Link src={resumeConfig.contact.linkedin} style={styles.contactLink}>
              LinkedIn: linkedin.com/in/juandcpuello
            </Link>
          </Text>
          <Text style={styles.contactInfo}>
            <Link src={resumeConfig.contact.gitlab} style={styles.contactLink}>
              GitLab: gitlab.com/_JuanDaniel
            </Link>
          </Text>
        </View>
      </View>
      
      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.description}>{resumeConfig.about}</Text>
      </View>
      
      {/* Two Column Layout for Skills and Experience */}
      <View style={styles.columns}>
        {/* Left Column - Skills and Education */}
        <View style={styles.leftColumn}>
          {/* Skills Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {resumeConfig.skills.map((skillGroup, index) => (
              <View key={index}>
                <Text style={styles.skillCategory}>{skillGroup.category}</Text>
                <Text style={styles.skillRow}>
                  {skillGroup.items.join(', ')}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Education Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resumeConfig.education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.positionTitle}>{edu.degree}</Text>
                <Text style={styles.companyInfo}>{edu.institution}</Text>
                <Text style={styles.periodLocation}>
                  {edu.period} | {edu.location}
                </Text>
                
                {edu.highlights.map((highlight, hIndex) => (
                  <Text key={hIndex} style={styles.highlightItem}>• {highlight}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>
        
        {/* Right Column - Experience and Projects */}
        <View style={styles.rightColumn}>
          {/* Experience Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resumeConfig.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.positionTitle}>{exp.position}</Text>
                <Text style={styles.companyInfo}>{exp.company}</Text>
                <Text style={styles.periodLocation}>
                  {exp.period} | {exp.location}
                </Text>
                <Text style={styles.description}>{exp.description}</Text>
                
                {exp.highlights.map((highlight, hIndex) => (
                  <Text key={hIndex} style={styles.highlightItem}>• {highlight}</Text>
                ))}
              </View>
            ))}
          </View>
          
          {/* Projects Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resumeConfig.projects.map((project, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.positionTitle}>{project.title}</Text>
                <Text style={styles.description}>{project.description}</Text>
                
                <Text style={styles.periodLocation}>
                  Technologies: {project.technologies.join(', ')}
                </Text>
                
                {project.highlights.map((highlight, hIndex) => (
                  <Text key={hIndex} style={styles.highlightItem}>• {highlight}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {/* Footer */}
      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} | {resumeConfig.name} - {resumeConfig.jobTitle}
      </Text>
    </Page>
  </Document>
);

// This is the server-side API endpoint for generating the PDF
export async function GET(request: NextRequest) {
  try {
    // Define the path where we'll save the PDF
    const pdfPath = path.join(process.cwd(), "public", "resume", "juan-daniel-castaneda-resume.pdf");
    
    // Generate the PDF using a direct rendering approach
    const pdfBuffer = await renderToBuffer(<ServerResumePDF />);
    
    // Save the PDF to the public directory using the async fs API
    await fs.writeFile(pdfPath, new Uint8Array(pdfBuffer));
    
    // Return the URL to the generated PDF
    return NextResponse.json({
      success: true,
      pdfUrl: "/resume/juan-daniel-castaneda-resume.pdf"
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 