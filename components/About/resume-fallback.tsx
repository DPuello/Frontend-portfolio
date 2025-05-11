"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import { useTranslation } from "@/hooks/useTranslation";

export const ResumeFallbackGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("about");

  const handleGenerateResume = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the server-side API endpoint to generate the PDF
      const response = await fetch("/api/generate-resume");

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Open the PDF in a new tab
        window.open(data.pdfUrl, "_blank");
      } else {
        setError(data.error || "Failed to generate PDF on the server");
      }
    } catch (error) {
      console.error("Error generating resume:", error);
      setError(
        `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        color="primary"
        disabled={isLoading}
        variant="shadow"
        onClick={handleGenerateResume}
      >
        {isLoading ? (
          <>
            <Spinner color="current" size="sm" />
            <span className="ml-2">Generating on server...</span>
          </>
        ) : (
          t("resume")
        )}
      </Button>

      {error && <p className="text-sm text-danger mt-2">{error}</p>}
    </div>
  );
};
