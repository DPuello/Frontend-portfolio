"use client";

import Image from "next/image";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Tooltip } from "@heroui/tooltip";
import { title, subtitle } from "@/components/primitives";
import Juan from "@/public/images/juan.jpg";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { lightColors, darkColors } from "@/config/theme";
import { useTheme } from "next-themes";
import { Chip } from "@heroui/react";
import { CodeIcon, RocketIcon, ScrumIcon, UXDesignIcon } from "../icons";
import { useTranslation } from "@/hooks/useTranslation";
// import Microfrontends from "../Microfrontends";

// Dynamically import the button component
const ResumeDownloadButton = dynamic(
  () =>
    import("@/components/About/resume-download-button").then(
      (mod) => mod.ResumeDownloadButton
    ),
  { ssr: false, loading: () => <Button disabled>Loading...</Button> }
);

// Define our skills data structure with descriptions
const skills = [
  {
    name: "React",
    description:
      "Building interactive UI components and managing application state",
  },
  {
    name: "Next.js",
    description:
      "Server-side rendering and static site generation for React applications",
  },
  {
    name: "TypeScript",
    description:
      "Type safety and enhanced developer experience for JavaScript projects",
  },
  {
    name: "JavaScript",
    description:
      "Core web programming language for interactive web experiences",
  },
  {
    name: "HTML",
    description: "Semantic markup for structuring web content",
  },
  {
    name: "CSS",
    description: "Styling and layout for visually appealing web interfaces",
  },
  {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework for rapid UI development",
  },
  {
    name: "UI/UX Design",
    description:
      "Creating intuitive, accessible, and aesthetically pleasing user experiences",
  },
  {
    name: "Responsive Design",
    description:
      "Ensuring websites work beautifully across all devices and screen sizes",
  },
];

// Add this component for skill items with hover effects
const SkillItem = ({
  skill,
}: {
  skill: { name: string; description: string };
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const themeColors = isDark ? darkColors : lightColors;

  return (
    <Tooltip
      content={skill.description}
      placement="top"
      delay={200}
      closeDelay={100}
    >
      <Chip
        className="bg-transparent"
        classNames={{
          base: "bg-gradient-to-br from-secondary/20 to-transparent hover:to-secondary/50 transition-all duration-300 border-small border-white/50 shadow-primary/10 dark:shadow-primary/10",
          content: "drop-shadow shadow-black dark:text-white",
        }}
        variant="shadow"
      >
        {skill.name}
      </Chip>
    </Tooltip>
  );
};

export function AboutSection() {
  const { t } = useTranslation("about");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  return (
    <section id="about" className="py-16 w-full">
      {/* <Microfrontends /> */}
      <div className="text-center mb-12">
        <h2 className={title({ size: "sm" })}>{t("title")}</h2>
        <p className={subtitle({ class: "mt-4" })}>
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <Image
            src={Juan}
            alt="Juan Daniel Castañeda"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <h3 className="text-2xl font-bold">{t("greeting")}</h3>

          <div className="space-y-4 text-default-600">
            <p className="leading-relaxed flex items-center gap-2">
              <RocketIcon className={`w-5 h-5 flex-shrink-0 mr-2 ${isDark ? 'text-white' : 'text-primary'}`} />
              <span>
                {t("description")}
              </span>
            </p>

            <p className="leading-relaxed mt-3 flex items-center gap-2">
              <CodeIcon className={`w-5 h-5 flex-shrink-0 mr-2 ${isDark ? 'text-white' : 'text-primary'}`} />
              <span>
                {t("experienceReactNative")}
              </span>
            </p>

            <p className="leading-relaxed mt-3 flex items-center gap-2">
              <ScrumIcon className={`w-5 h-5 flex-shrink-0 mr-2 ${isDark ? 'text-white' : 'text-primary'}`} />
              <span>
                {t("experienceAgile")}
              </span>
            </p>

            <p className="leading-relaxed mt-3 flex items-center gap-2">
              <UXDesignIcon className={`w-5 h-5 flex-shrink-0 mr-2 ${isDark ? 'text-white' : 'text-primary'}`} />
              <span>
                {t("experienceLearning")}
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold">{t("skills", "My Skills")}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <SkillItem key={skill.name} skill={skill} />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <ResumeDownloadButton />
            <Button as={Link} href="#hobbies" variant="bordered">
              {t("seeHobbies")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
