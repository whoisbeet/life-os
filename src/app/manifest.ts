import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Terminal",
    short_name: "The Terminal",
    description: "An open-source, self-hostable personal operating system for tasks, notes, journals, habits, finances, calendar planning, and reflections.",
    start_url: "/app",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
