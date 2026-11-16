"use client";

import { useEffect } from "react";

// The Announcements page is now called News. Old links forward to /news/.
export default function AnnouncementsRedirect() {
  useEffect(() => {
    window.location.replace("/news/");
  }, []);

  return (
    <div className="min-h-screen bg-wiair-darkest text-white flex items-center justify-center p-8">
      <meta httpEquiv="refresh" content="0; url=/news/" />
      <p>
        This page has moved to <a href="/news/" className="text-wiair-light underline">News</a>.
      </p>
    </div>
  );
}
