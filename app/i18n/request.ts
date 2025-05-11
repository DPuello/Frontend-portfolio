import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@/config/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  const validLocale = (locales.includes(locale as any) ? locale : defaultLocale) as string;

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default
  };
}); 