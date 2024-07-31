/*
  For generating the robots.txt file for SEO optimization
  Refer to https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots for more info
*/
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
    let baseUrl = '';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

// You can add or remove any of your routes, this is just an example of the pages you might not want indexed
const disallow = [
    '/forgot', '/login', '/reset', '/welcome', '/register',
    '/checkout', '/order/', '/orders', '/profile', '/settings', 
]