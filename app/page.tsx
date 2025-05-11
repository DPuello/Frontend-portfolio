import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/About/about-section";
import { HobbiesSection } from "@/components/Hobbies/hobbies-section";
import { ProjectsSection } from "@/components/Project/projects-section";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <HobbiesSection />
      <ContactSection />
    </>
  );
}
