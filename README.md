# Next.js & HeroUI Template

This is a template for creating applications using Next.js 14 (app directory) and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/heroui-inc/heroui/next-app-template)

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Nodemailer](https://nodemailer.com/) - For email functionality

## Features

- Responsive design
- Dark/Light mode
- Portfolio sections (About, Projects, Resume, Contact)
- Resume PDF generation
- **Contact form with email functionality**

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Configure environment variables

Copy the `.env.example` file to `.env.local` and update the values according to your needs:

```bash
cp .env.example .env.local
```

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed instructions on configuring the email functionality.

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## Email Functionality

The portfolio includes a working contact form that sends emails via SMTP. To use this feature:

1. Configure your email provider settings in `.env.local`
2. Test your configuration using the test endpoint
3. The contact form in the Contact section will now send emails

For detailed setup instructions, see [EMAIL_SETUP.md](./EMAIL_SETUP.md).

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
