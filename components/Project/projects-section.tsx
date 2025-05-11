"use client";

import { ProjectCard, ProjectProps, ImageItem } from "@/components/Project/project-card";
import { title, subtitle } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { siteConfig } from "@/config/site";
import { useTranslation } from "@/hooks/useTranslation";
import { projectImages } from "@/components/Project/project-images";
import { personalData } from "@/config/personal-data";

// Sample projects data - replace with your actual projects
const projects: ProjectProps[] = [
  {
    id: "evoluxion",
    titleKey: "evoluxion.title",
    descriptionKey: "evoluxion.description",
    images: [
      {
        url: projectImages.p0.home,
        descriptionKey: "evoluxion.images.home.description",
        altKey: "evoluxion.images.home.alt"
      },
      {
        url: projectImages.p0.login,
        descriptionKey: "evoluxion.images.login.description",
        altKey: "evoluxion.images.login.alt"
      },
      {
        url: projectImages.p0.course,
        descriptionKey: "evoluxion.images.course.description",
        altKey: "evoluxion.images.course.alt"
      },
      {
        url: projectImages.p0.lesson,
        descriptionKey: "evoluxion.images.lesson.description",
        altKey: "evoluxion.images.lesson.alt"
      }
    ],
    link: "https://evoluxion.com",
    tags: ["Next.js", "React", "TypeScript", "TailwindCSS"],
  },
  {
    id: "superchachos",
    titleKey: "superChachos.title",
    descriptionKey: "superChachos.description",
    images: [
      { 
        url: projectImages.p1.login,
        descriptionKey: "superChachos.images.login.description",
        altKey: "superChachos.images.login.alt"
      },
      {
        url: projectImages.p1.home,
        descriptionKey: "superChachos.images.home.description",
        altKey: "superChachos.images.home.alt"
      },
      {
        url: projectImages.p1.courses,
        descriptionKey: "superChachos.images.catalog.description",
        altKey: "superChachos.images.catalog.alt"
      },
      {
        url: projectImages.p1.progress,
        descriptionKey: "superChachos.images.progress.description",
        altKey: "superChachos.images.progress.alt"
      }
    ],
    link: "https://superchachos.com",
    tags: ["React", "TypeScript", "SCORM", "LMS"],
  },
  {
    id: "cintia",
    titleKey: "cintia.title",
    descriptionKey: "cintia.description",
    images: [
      {
        url: projectImages.p2.restricted,
        descriptionKey: "cintia.images.access.description",
        altKey: "cintia.images.access.alt"
      },
      {
        url: projectImages.p2.startChat,
        descriptionKey: "cintia.images.chat.description",
        altKey: "cintia.images.chat.alt"
      },
      {
        url: projectImages.p2.startedChat,
        descriptionKey: "cintia.images.active.description",
        altKey: "cintia.images.active.alt"
      },
      {
        url: projectImages.p2.search,
        descriptionKey: "cintia.images.search.description",
        altKey: "cintia.images.search.alt"
      }
    ],
    link: "https://cintia.com",
    tags: ["FastAPI", "WebSockets", "AI", "Chatbot"],
  },
  {
    id: "bavaria",
    titleKey: "emprendedores.title",
    descriptionKey: "emprendedores.description",
    images: [
      {
        url: projectImages.p3.login,
        descriptionKey: "emprendedores.images.login.description",
        altKey: "emprendedores.images.login.alt"
      },
      {
        url: projectImages.p3.home,
        descriptionKey: "emprendedores.images.home.description",
        altKey: "emprendedores.images.home.alt"
      },
      {
        url: projectImages.p3.courses,
        descriptionKey: "emprendedores.images.catalog.description",
        altKey: "emprendedores.images.catalog.alt"
      },
      {
        url: projectImages.p3.profile,
        descriptionKey: "emprendedores.images.profile.description",
        altKey: "emprendedores.images.profile.alt"
      },
      {
        url: projectImages.p3.progress,
        descriptionKey: "emprendedores.images.analysis.description",
        altKey: "emprendedores.images.analysis.alt"
      }
    ],
    link: "https://emprendedores.com",
    tags: ["React", "TypeScript", "Business", "Education"],
  },
  {
    id: "uxplora",
    titleKey: "uxplora.title",
    descriptionKey: "uxplora.description",
    images: [
      {
        url: projectImages.p4.home,
        descriptionKey: "uxplora.images.home.description",
        altKey: "uxplora.images.home.alt"
      },
      {
        url: projectImages.p4.plans,
        descriptionKey: "uxplora.images.study.description",
        altKey: "uxplora.images.study.alt"
      },
      {
        url: projectImages.p4.store,
        descriptionKey: "uxplora.images.marketplace.description",
        altKey: "uxplora.images.marketplace.alt"
      }
    ],
    link: "https://uxplora.com",
    tags: ["React", "Vite", "UX", "Design"],
  },
];

export function ProjectsSection() {
  const { t } = useTranslation("projects");
  
  return (
    <section id="projects" className="py-16 w-full">
      <div className="text-center mb-12">
        <h2 className={title({ size: "sm" })}>{t("title")}</h2>
        <p className={subtitle({ class: "mt-4" })}>
          {t("subtitle")}
        </p>
      </div>
      
      <div className="flex flex-col gap-12 max-w-7xl mx-auto px-4">
        {projects.map((project, index) => {
          // Asegurar que estamos pasando strings a t()
          const mappedImages = project.images?.map(img => ({
            ...img,
            description: img.descriptionKey ? t(img.descriptionKey, "") : undefined,
            alt: img.altKey ? t(img.altKey, "") : undefined
          })) || [];
          
          return (
            <ProjectCard 
              key={index} 
              {...project}
              title={t(project.titleKey, "")}
              description={t(project.descriptionKey, "")}
              images={mappedImages}
              imagePosition={index % 2 === 0 ? 'left' : 'right'}
            />
          );
        })}
      </div>
      
      <div className="flex gap-4 justify-center mt-12">
        <Button 
          as={Link} 
          href={personalData.contact.gitlab} 
          color="default" 
          variant="bordered"
          className="px-8"
          isExternal
        >
          {t("viewMore")}
        </Button>
        <Button 
          as={Link} 
          href={personalData.contact.github} 
          color="default" 
          variant="bordered"
          className="px-8"
          isExternal
        >
          {t("viewThisProject")}
        </Button>
      </div>
    </section>
  );
} 