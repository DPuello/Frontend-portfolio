"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import illustrations from "./assets/owl.jpg";
import render3d from "./assets/eevee.jpg";
import animation2d from "./assets/animation.gif";
import motionGraphics from "./assets/badRobot.gif";
import loop from "./assets/loop.gif";
import { Button, Image, Link } from "@heroui/react";
import { personalData } from "@/config/personal-data";
import { useTranslation } from "@/hooks/useTranslation";

// Definir los iconos directamente en este componente para evitar problemas de importación
const CubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-dark-primary"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const LayersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-dark-primary"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const DisplayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-dark-primary"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-dark-primary"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

export const HobbiesSection = () => {
  const { t } = useTranslation("hobbies");

  const hobbies = [
    {
      id: "illustrations",
      background: illustrations.src,
      icon: <CubeIcon />,
      title: t("items.illustrations.title"),
      description: t(
        "items.illustrations.description"),
    },
    {
      id: "3dmodeling",
      background: render3d.src,
      icon: <LayersIcon />,
      title: t("items.3dmodeling.title"),
      description: t(
        "items.3dmodeling.description",
      ),
    },
    {
      id: "2danimation",
      background: animation2d.src,
      icon: <DisplayIcon />,
      title: t("items.2danimation.title"),
      description: t(
        "items.2danimation.description",
      ),
    },
    {
      id: "motiongraphics",
      background: motionGraphics.src,
      icon: <PlayIcon />,
      title: t("items.motiongraphics.title"),
      description: t(
        "items.motiongraphics.description",
      ),
    },
  ];

  return (
    <section id="hobbies" className="py-16">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <Image
          src={loop.src}
          alt="loop"
          height={150}
          className="mix-blend-multiply dark:invert dark:mix-blend-screen"
        />
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hobbies.map((hobby, index) => (
            <Card key={index} className="h-full relative overflow-hidden group">
              {hobby.background && (
                <Image
                  src={hobby.background}
                  alt={`${hobby.title} background`}
                  width={"100%"}
                  isBlurred
                  height={"100%"}
                  classNames={{
                    wrapper:
                      "z-0 opacity-20 group-hover:opacity-40 transition-opacity absolute top-0 left-0 w-full h-full",
                    img: "group-hover:scale-110 transition-transform duration-300 object-cover",
                  }}
                />
              )}
              <CardHeader className="flex flex-col items-center pb-2 relative z-10">
                <div className="p-3 rounded-full bg-dark-primary/10 mb-4">
                  {hobby.icon}
                </div>
                <h3 className="text-xl font-semibold">{hobby.title}</h3>
              </CardHeader>
              <CardBody className="text-center relative z-10">
                <p className="text-foreground/80">{hobby.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-foreground/80 mb-6">{t("description")}</p>
          <Button
            as={Link}
            href={personalData.creative_portfolio}
            target="_blank"
            color="primary"
            variant="shadow"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-colors"
          >
            {t("viewPortfolio")}
          </Button>
        </div>
      </div>
    </section>
  );
};
