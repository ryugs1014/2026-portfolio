// components/common/VisitTracker.tsx
'use client';
import { useEffect } from 'react';

export default function AccessLog() {
  useEffect(() => {
    if (sessionStorage.getItem('visited_tracked')) return;

    const trackVisit = async () => {
      try {
        await fetch('/api/access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentUrl: window.location.href,
            referrer: document.referrer,
          }),
        });
        sessionStorage.setItem('visited_tracked', 'true');
      } catch (error) {
        console.error('Tracking failed', error);
      }
    };

    trackVisit();
  }, []);

  return null;
}
