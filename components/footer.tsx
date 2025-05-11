"use client";

import { Link } from "@heroui/link";
import { siteConfig } from "@/config/site";
import { personalData } from "@/config/personal-data";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
export function Footer() {
  const { t } = useTranslation("footer");
  const currentYear = new Date().getFullYear();
  const [emailData, setEmailData] = useState(personalData.contact.hiddenEmail);
  const [phoneData, setPhoneData] = useState(personalData.contact.hiddenPhone);

  return (
    <footer className="w-full bg-default-50 dark:bg-dark-primary-900/50 py-12 mt-12">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About column */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-dark-primary">
              {personalData.name}
            </h3>
            <p className="text-default-600 mb-4 max-w-md">
              {t("about.description")}
            </p>
            <div className="flex gap-4">
              <Link
                href={personalData.contact.gitlab}
                isExternal
                aria-label="GitLab"
                className="text-default-600 hover:text-dark-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
                </svg>
              </Link>
              <Link
                href={personalData.contact.linkedin}
                isExternal
                aria-label="LinkedIn"
                className="text-default-600 hover:text-dark-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick links column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-default-800 dark:text-default-400">
              {t("quickLinks.title")}
            </h3>
            <ul className="space-y-2">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-default-600 hover:text-dark-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-default-800 dark:text-default-400">
              {t("contact.title")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-default-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-dark-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <Link
                  href={`mailto:${personalData.contact.email}`}
                  className="text-default-600 dark:text-primary hover:text-dark-primary transition-colors"
                  onMouseEnter={() => setEmailData(personalData.contact.email)}
                  onFocus={() => setEmailData(personalData.contact.email)}
                  onPress={() => setEmailData(personalData.contact.email)}
                >     
                  {emailData}
                </Link>
              </li>
              <li className="flex items-center gap-2 text-default-600" 
                onMouseEnter={() => setPhoneData(personalData.contact.phone)}
                onFocus={() => setPhoneData(personalData.contact.phone)}
                onClick={() => setPhoneData(personalData.contact.phone)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-dark-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{phoneData}</span>
              </li>
              <li className="flex items-center gap-2 text-default-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-dark-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{personalData.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-default-200 dark:border-default-700 my-8"></div>

        {/* Copyright and powered by section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-default-600 text-sm">
            &copy; {currentYear} {personalData.name}. {t("rights")}
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="text-default-600 text-sm">{t("builtWith.text")}</span>
            <Link
              href="https://nextjs.org"
              isExternal
              className="text-dark-primary text-sm hover:underline"
            >
              Next.js
            </Link>
            <span className="text-default-600 text-sm">{t("builtWith.and")}</span>
            <Link
              href="https://heroui.com?utm_source=portfolio"
              isExternal
              className="text-dark-primary text-sm hover:underline"
            >
              HeroUI
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
