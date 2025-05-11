const personalEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;
const personalPhone = process.env.NEXT_PUBLIC_PERSONAL_PHONE;
const personalHiddenEmail = process.env.NEXT_PUBLIC_PERSONAL_HIDDEN_EMAIL;
const personalHiddenPhone = process.env.NEXT_PUBLIC_PERSONAL_HIDDEN_PHONE;

export const personalData = {
  name: "Juan Daniel Castañeda",
  jobTitle: "Front-end Developer",
  photo: "/images/juan.jpg",
  contact: {
    email: personalEmail,
    phone: personalPhone,
    hiddenEmail: personalHiddenEmail,
    hiddenPhone: personalHiddenPhone,
    linkedin: "https://www.linkedin.com/in/juandcpuello/",
    gitlab: "https://gitlab.com/_JuanDaniel",
    github: "https://github.com/DPuello",
  },
  portfolio: "https://github.com/DPuello/Frontend-portfolio/",
  creative_portfolio: "https://dpuello.github.io/Juan-Daniel-Castaneda/",
  location: "Bogotá, Colombia",
};
