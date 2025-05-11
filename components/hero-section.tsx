"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

import { title, subtitle } from "@/components/primitives";
import { personalData } from "@/config/personal-data";
import { useTranslation } from "@/hooks/useTranslation";

export function HeroSection() {
  const { t } = useTranslation("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickEffect, setClickEffect] = useState(false);

  // Add a throttling mechanism with refs to avoid dependency array issues
  const lastMouseUpdateTimeRef = useRef(0);
  const mouseThrottleDelay = 16; // Approx. 60fps

  // Use useCallback to ensure the handler doesn't change on re-renders
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = Date.now();

    if (now - lastMouseUpdateTimeRef.current < mouseThrottleDelay) return;

    lastMouseUpdateTimeRef.current = now;

    setMousePosition({
      x: (event.clientX / window.innerWidth - 0.5) * 20,
      y: (event.clientY / window.innerHeight - 0.5) * 20,
    });
  }, []);

  // Use useCallback for click handler too
  const handleClick = useCallback(() => {
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 500);
  }, []);

  // Set up event listeners once and clean them up properly
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [handleMouseMove, handleClick]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-24 md:py-32">
      <div
        className="inline-block max-w-3xl text-center justify-center"
        style={{
          transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px) scale(${clickEffect ? 1.02 : 1})`,
          transition: "transform 0.2s ease-out",
        }}
      >
        <h1 className={title({ size: "lg" })}>{t("title")}</h1>{" "}
        <h2 className={"text-secondary font-bold text-4xl"}>{t("subtitle")}</h2>
        <p className={subtitle({ class: "mt-6 max-w-lg mx-auto" })}>
          {t("description")}
        </p>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          as={Link}
          color="primary"
          href="#projects"
          radius="full"
          size="lg"
          variant="shadow"
        >
          {t("cta", "View Projects")}
        </Button>
      </div>

      <div className="flex gap-4 mt-12">
        <Link
          isExternal
          aria-label="GitLab"
          className="text-default-600 hover:text-dark-primary transition-colors"
          href={personalData.contact.gitlab}
        >
          <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
          </svg>
        </Link>
        <Link
          isExternal
          aria-label="LinkedIn"
          className="text-default-600 hover:text-dark-primary transition-colors"
          href={personalData.contact.linkedin}
        >
          <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
