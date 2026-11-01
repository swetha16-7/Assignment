/** @type {import('next').NextConfig} */
function getBackendUrl() {
  let url = (process.env.NEXT_PUBLIC_API_URL || '').trim();

  // If set to literal variable placeholder or unset
  if (!url || url === 'NEXT_PUBLIC_API_URL' || url === 'undefined' || url === 'null') {
    return process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:8000';
  }

  // Ensure protocol if scheme is omitted
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
    url = `https://${url}`;
  }

  // Strip trailing slashes
  return url.replace(/\/+$/, '');
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'proposalcraft.onrender.com'],
    unoptimized: true,
  },
  async rewrites() {
    const backendUrl = getBackendUrl();

    // Guard: Only configure rewrites if destination begins with /, http://, or https://
    if (
      !backendUrl ||
      !(backendUrl.startsWith('http://') || backendUrl.startsWith('https://') || backendUrl.startsWith('/'))
    ) {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
    ];
  },
};

module.exports = nextConfig;
