"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { personalData } from "@/config/personal-data";
import { useTranslation } from "@/hooks/useTranslation";
import {
  GitlabIcon,
  LinkedinIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
} from "./icons";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export function ContactSection() {
  const { t } = useTranslation("contact");

  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [emailData, setEmailData] = useState(personalData.contact.hiddenEmail);
  const [phoneData, setPhoneData] = useState(personalData.contact.hiddenPhone);
  const handleOpenModal = () => {
    setIsModalOpen(true);
    resetForm();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormState({
      name: "",
      email: "",
      message: "",
    });
    setErrors({});
    setSubmitStatus("idle");
    setSubmitMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = t("required");
    } else if (formState.name.trim().length < 2) {
      newErrors.name = t("validation.nameLength");
    }

    if (!formState.email.trim()) {
      newErrors.email = t("required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = t("validation.emailValid");
    }

    if (!formState.message.trim()) {
      newErrors.message = t("required");
    } else if (formState.message.trim().length < 10) {
      newErrors.message = t("validation.messageLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Reset submission status when form changes
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setSubmitMessage(t("success"));
        // Keep modal open to show success message
      } else {
        setSubmitStatus("error");

        if (data.errors) {
          setErrors(data.errors);
          setSubmitMessage(t("validation.fixErrors"));
        } else {
          setSubmitMessage(
            data.error ||
              t(
                "error",
                "There was an error sending your message. Please try again."
              )
          );
        }
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(t("validation.networkError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar tooltip cuando cambia submitStatus a success
  useEffect(() => {
    if (submitStatus === "success" || submitStatus === "error") {
      setShowTooltip(true);
      // Ocultar tooltip después de 5 segundos
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <section id="contact" className="py-16 w-full">
      <div className="text-center mb-12">
        <h2 className={title({ size: "sm" })}>{t("title")}</h2>
        <p className={subtitle({ class: "mt-4" })}>{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2">{t("contactInfo")}</h3>
            <p className="text-default-600">{t("reachOut")}</p>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center gap-3"
              onClick={() => setEmailData(personalData.contact.email)}
              onFocus={() => setEmailData(personalData.contact.email)}
              onMouseEnter={() =>
                setEmailData(personalData.contact.email)
              }
            >
              <MailIcon />
              <span>{emailData}</span>
            </div>

            <div
              className="flex items-center gap-3"
              onClick={() => setPhoneData(personalData.contact.phone)}
              onFocus={() => setPhoneData(personalData.contact.phone)}
              onMouseEnter={() =>
                setPhoneData(personalData.contact.phone)
              }
            >
              <PhoneIcon />
              <span>{phoneData}</span>
            </div>

            <div className="flex items-center gap-3">
              <LocationIcon />
              <span>{personalData.location}</span>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-xl font-bold mb-3">{t("follow")}</h3>
            <div className="flex gap-4">
              <a
                href={personalData.contact.gitlab}
                target="_blank"
                rel="noopener noreferrer"
                className="text-default-600 hover:text-dark-primary transition-colors"
              >
                <GitlabIcon />
              </a>
              <a
                href={personalData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-default-600 hover:text-dark-primary transition-colors"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-default-50 dark:bg-dark-primary/5 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">{t("sendMessage")}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                label={t("name")}
                placeholder="John Doe"
                value={formState.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                isRequired
              />
            </div>
            <div>
              <Input
                type="email"
                name="email"
                label={t("email")}
                placeholder="johndoe@example.com"
                value={formState.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                isRequired
              />
            </div>
            <div>
              <Textarea
                name="message"
                label={t("message")}
                placeholder="Hello, I'd like to talk about..."
                value={formState.message}
                onChange={handleChange}
                isInvalid={!!errors.message}
                errorMessage={errors.message}
                isRequired
                minRows={4}
              />
            </div>

            <Tooltip
              content={submitMessage}
              isOpen={
                showTooltip &&
                (submitStatus === "success" || submitStatus === "error")
              }
              onOpenChange={(open) => setShowTooltip(open)}
              color={submitStatus === "success" ? "success" : "danger"}
              placement="bottom"
              showArrow={true}
              className="max-w-xs"
            >
              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                {t("send")}
              </Button>
            </Tooltip>
          </form>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("modal.title")}
              </ModalHeader>
              <ModalBody>
                <form className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      label={t("name")}
                      placeholder="John Doe"
                      value={formState.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      errorMessage={errors.name}
                      isRequired
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      label={t("email")}
                      placeholder="johndoe@example.com"
                      value={formState.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      errorMessage={errors.email}
                      isRequired
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      label={t("message")}
                      placeholder="Hello, I'd like to talk about..."
                      value={formState.message}
                      onChange={handleChange}
                      isInvalid={!!errors.message}
                      errorMessage={errors.message}
                      isRequired
                      minRows={4}
                    />
                  </div>

                  <Tooltip
                    content={submitMessage}
                    isOpen={
                      showTooltip &&
                      (submitStatus === "success" || submitStatus === "error")
                    }
                    onOpenChange={(open) => setShowTooltip(open)}
                    color={submitStatus === "success" ? "success" : "danger"}
                    placement="bottom"
                    showArrow={true}
                    className="max-w-xs"
                  >
                    <div className="w-full text-center">
                      {submitStatus === "success" || submitStatus === "error"
                        ? submitMessage
                        : ""}
                    </div>
                  </Tooltip>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  {t("modal.close")}
                </Button>
                <Tooltip
                  content={submitMessage}
                  isOpen={
                    showTooltip &&
                    (submitStatus === "success" || submitStatus === "error")
                  }
                  onOpenChange={(open) => setShowTooltip(open)}
                  color={submitStatus === "success" ? "success" : "danger"}
                  placement="top"
                >
                  <Button
                    color="primary"
                    onPress={() => {
                      handleSubmit(new Event("submit") as unknown as FormEvent);
                    }}
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting || submitStatus === "success"}
                  >
                    {t("send")}
                  </Button>
                </Tooltip>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
