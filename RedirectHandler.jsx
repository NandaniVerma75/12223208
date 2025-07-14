import { useParams } from 'react-router-dom';
import logMiddleware from '../utils/logger';

function RedirectHandler() {
  const { shortcode } = useParams();
  const data = JSON.parse(localStorage.getItem('shortenedUrls') || '{}');
  const entry = data[shortcode];

  if (!entry || new Date(entry.expiry) < new Date()) {
    return <div>Link expired or not found</div>;
  }

  // Log the click
  entry.clicks.push({
    timestamp: new Date().toISOString(),
    referrer: document.referrer || 'unknown',
    location: 'MockLocation' // or fetch with IP geolocation API
  });

  localStorage.setItem('shortenedUrls', JSON.stringify(data));
  logMiddleware('Redirecting', { shortcode });

  window.location.href = entry.originalUrl;
  return null;
}
