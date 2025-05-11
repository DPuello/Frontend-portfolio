"use client";

import React from "react";

import MFEWrapper from "./MFEWrapper";

function Microfrontends() {
  const buttonConfig = {
    text: "Botón desde Next!",
    api: {
      endpoint: "https://jsonplaceholder.typicode.com/posts/1", // Endpoint específico del host
    },
    // Opcional: pasar clases (p.ej., si usas Tailwind en Next.js)
    classNames: {
      button: "bg-blue-600 hover:bg-blue-800 text-white rounded shadow-md",
    },
    onSuccess: (data: any) =>
      console.log("Callback de éxito del Botón en Next:", data),
    onError: (error: any) =>
      console.error("Callback de error del Botón en Next:", error),
  };

  const dropdownConfig = {
    label: "Selecciona usuario (desde Next):",
    api: {
      endpoint: "https://jsonplaceholder.typicode.com/users?_limit=5", // Otro endpoint desde el host
    },
    classNames: {
      label: "text-gray-700 font-semibold",
      select:
        "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
    },
    onSelect: (value: any) => alert(`Usuario seleccionado en Next: ${value}`),
  };

  const navbarConfig = {
    api: {
      // Podrías tener un endpoint de API en Next o usar el mock
      endpoint: "http://localhost:3003/mock-nav-links.json", // O una API real
    },
    classNames: {
      nav: "bg-gray-800 p-3 rounded-md mb-4",
      link: "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium",
    },
    onLinkClick: (href: any) =>
      console.log(`Navegación interceptada en Next hacia: ${href}`),
  };

  return (
    <div>
      <h1 className="text-4xl font-bold">
        Bienvenido a Next.js consumiendo Microfrontends!
      </h1>

      <div style={{ margin: "20px 0" }}>
        <h2>Navbar MFE:</h2>
        <MFEWrapper
          config={navbarConfig}
          exposedModule="mount"
          remoteName="navbar"
        />
      </div>

      <div style={{ margin: "20px 0" }}>
        <h2>Dropdown MFE:</h2>
        <MFEWrapper
          config={dropdownConfig}
          exposedModule="mount"
          remoteName="dropdown"
        />
      </div>

      <div style={{ margin: "20px 0" }}>
        <h2>Button MFE:</h2>
        <MFEWrapper
          config={buttonConfig}
          exposedModule="mount"
          remoteName="button"
        />
      </div>
    </div>
  );
}

export default Microfrontends;
