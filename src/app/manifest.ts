import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChatFlowAI',
    short_name: 'ChatFlowAI',
    description: 'ChatFlowAI - CRM para WhatsApp',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [
      {
        src: '/window.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
