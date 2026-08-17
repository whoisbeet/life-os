import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Terminal",
    short_name: "The Terminal",
    description: "An open-source, self-hostable personal operating system for tasks, notes, journals, habits, finances, calendar planning, and reflections.",
    id: "/",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#2D2D2D",
    theme_color: "#2D2D2D",
    orientation: "any",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
