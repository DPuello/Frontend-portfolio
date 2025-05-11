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
import { useState, FormEvent, ChangeEvent, useEffect } from "react";

import {
  GitlabIcon,
  LinkedinIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
} from "./icons";

import { title, subtitle } from "@/components/primitives";
import { personalData } from "@/config/personal-data";
import { useTranslation } from "@/hooks/useTranslation";

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
                "There was an error sending your message. Please try again.",
              ),
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
    <section className="py-16 w-full" id="contact">
      <div className="text-center mb-12">
        <h2 className={title({ size: "sm" })}>{t("title")}</h2>
        <p className={subtitle({ class: "mt-4" })}>{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="space-y-6 bg-primary-100/80 dark:bg-black/40 shadow-md rounded-xl p-6 backdrop-blur-sm">
          <div>
            <h3 className="text-xl font-bold mb-2">{t("contactInfo")}</h3>
            <p className="text-default-600">{t("reachOut")}</p>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center gap-3"
              onClick={() => setEmailData(personalData.contact.email)}
              onFocus={() => setEmailData(personalData.contact.email)}
              onMouseEnter={() => setEmailData(personalData.contact.email)}
            >
              <MailIcon />
              <span>{emailData}</span>
            </div>

            <div
              className="flex items-center gap-3"
              onClick={() => setPhoneData(personalData.contact.phone)}
              onFocus={() => setPhoneData(personalData.contact.phone)}
              onMouseEnter={() => setPhoneData(personalData.contact.phone)}
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
                className="text-default-600 hover:text-dark-primary transition-colors"
                href={personalData.contact.gitlab}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitlabIcon />
              </a>
              <a
                className="text-default-600 hover:text-dark-primary transition-colors"
                href={personalData.contact.linkedin}
                rel="noopener noreferrer"
                target="_blank"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-primary-100/80 dark:bg-black/40 shadow-md rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4">{t("sendMessage")}</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Input
                isRequired
                errorMessage={errors.name}
                isInvalid={!!errors.name}
                label={t("name")}
                name="name"
                placeholder="John Doe"
                type="text"
                value={formState.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Input
                isRequired
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label={t("email")}
                name="email"
                placeholder="johndoe@example.com"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Textarea
                isRequired
                errorMessage={errors.message}
                isInvalid={!!errors.message}
                label={t("message")}
                minRows={4}
                name="message"
                placeholder="Hello, I'd like to talk about..."
                value={formState.message}
                onChange={handleChange}
              />
            </div>

            <Tooltip
              className="max-w-xs"
              color={submitStatus === "success" ? "success" : "danger"}
              content={submitMessage}
              isOpen={
                showTooltip &&
                (submitStatus === "success" || submitStatus === "error")
              }
              placement="bottom"
              showArrow={true}
              onOpenChange={(open) => setShowTooltip(open)}
            >
              <Button
                className="w-full"
                color="primary"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                type="submit"
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
                      isRequired
                      errorMessage={errors.name}
                      isInvalid={!!errors.name}
                      label={t("name")}
                      name="name"
                      placeholder="John Doe"
                      type="text"
                      value={formState.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Input
                      isRequired
                      errorMessage={errors.email}
                      isInvalid={!!errors.email}
                      label={t("email")}
                      name="email"
                      placeholder="johndoe@example.com"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Textarea
                      isRequired
                      errorMessage={errors.message}
                      isInvalid={!!errors.message}
                      label={t("message")}
                      minRows={4}
                      name="message"
                      placeholder="Hello, I'd like to talk about..."
                      value={formState.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Tooltip
                    className="max-w-xs"
                    color={submitStatus === "success" ? "success" : "danger"}
                    content={submitMessage}
                    isOpen={
                      showTooltip &&
                      (submitStatus === "success" || submitStatus === "error")
                    }
                    placement="bottom"
                    showArrow={true}
                    onOpenChange={(open) => setShowTooltip(open)}
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
                  color={submitStatus === "success" ? "success" : "danger"}
                  content={submitMessage}
                  isOpen={
                    showTooltip &&
                    (submitStatus === "success" || submitStatus === "error")
                  }
                  placement="top"
                  onOpenChange={(open) => setShowTooltip(open)}
                >
                  <Button
                    color="primary"
                    isDisabled={isSubmitting || submitStatus === "success"}
                    isLoading={isSubmitting}
                    onPress={() => {
                      handleSubmit(new Event("submit") as unknown as FormEvent);
                    }}
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
