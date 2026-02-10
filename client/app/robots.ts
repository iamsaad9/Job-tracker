import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/help-feedback', '/privacy-policy', '/help'],
      disallow: [
        '/dashboard/', 
        '/api/', 
        '/login', 
        '/signup', 
        '/reset-password',
        '/*?*', // Disallow URLs with query parameters (prevents duplicate content)
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  }
}