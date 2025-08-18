import { MetadataRoute } from 'next';
import { allCalculators } from '@/lib/calculator-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calput.vercel.app';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
     {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const calculatorPages = allCalculators.map((calculator) => ({
    url: `${baseUrl}${calculator.path}?tab=${calculator.value}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  
  // Get unique parent paths for calculators e.g. /personal-health-calculators
  const categoryPages = [...new Set(allCalculators.map(c => c.path))]
    .map(path => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));


  return [...staticPages, ...categoryPages, ...calculatorPages];
}
