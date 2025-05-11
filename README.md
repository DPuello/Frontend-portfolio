# Portfolio 2025

A modern, interactive portfolio website built with Next.js 14, Three.js and HeroUI.

## Features

- **Multi-language Support**: Full internationalization with English and Spanish, automatically detecting browser language
- **Interactive 3D Animations**: Engaging Three.js animations that respond to mouse position in the viewport
- **Dynamic Resume Generation**: PDF resume generated based on the selected language
- **Dark/Light Mode**: Elegant theme switching with persistent user preference
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI Components**: Built with HeroUI and TailwindCSS for a sleek design

## Technologies Used

- [Next.js 14](https://nextjs.org/docs) - React framework with App Router
- [Three.js](https://threejs.org/) - 3D graphics library for immersive animations
- [HeroUI](https://heroui.com/) - UI component library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [i18next](https://www.i18next.com/) - Internationalization framework

## Project Structure

```
├── app/               # Next.js app directory
│   ├── i18n/          # Internationalization configurations
│   ├── api/           # API routes
│   └── [sections]/    # Various section pages
├── components/        # React components
├── config/            # Configuration files
│   ├── i18n.ts        # i18n configuration
│   ├── resume.ts      # Resume data
│   ├── personal-data.ts # Personal information
│   └── theme.ts       # Theme configuration
└── public/            # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-2025.git
   cd portfolio-2025
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Configure environment variables:
   ```bash
   cp template.env .env.local
   ```
   Edit `.env.local` with your personal information.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Personal Information

Edit the `config/personal-data.ts` file to update your personal information.

### Resume Content

Modify the `config/resume.ts` file to update your resume information. The PDF generation will use this data.

### Theme Customization

Adjust the theme settings in `config/theme.ts` to customize colors and other theme-related properties.

## Deployment

This project can be deployed on [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or any other platform that supports Next.js.

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
