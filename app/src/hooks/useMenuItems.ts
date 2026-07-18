import { useEffect, useState } from "react";

export interface MenuItem {
  name: string;
  href: string;
}

const STATIC_PAGES = [
  "getting-started",
  "recommended-settings",
  "dashboards",
  "knowledgebase",
  "socials",
  "home",
];
const STATIC_MENU_ITEMS: MenuItem[] = [
  { name: "Dashboards", href: "/dashboards" },
  { name: "Getting Started", href: "/getting-started" },
  { name: "Recommended Settings", href: "/recommended-settings" },
  { name: "Knowledgebase", href: "/knowledgebase" },
  { name: "Socials", href: "/socials" },
];

/**
 * Hook to load menu items from the generated static page index
 * and combine them with static pages like Home and Dashboards.
 */
export function useMenuItems(): MenuItem[] {
  const [indexedItems, setIndexedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/content/index/pages.json", {
          cache: "no-store",
        });
        if (!response.ok) {
          console.warn("Failed to fetch page list for menu");
          return;
        }

        const { files }: { files: string[] } = await response.json();

        const items = files
          .map((fileName) => fileName.replace(/\.md$/, ""))
          .filter((slug) => !STATIC_PAGES.some((sp) => sp.toLowerCase() === slug.toLowerCase()))
          .map((slug) => ({
            name: formatMenuName(slug),
            href: `/${slug}`,
          }))
          .sort((a, b) => {
            // Sort by name alphabetically
            return a.name.localeCompare(b.name);
          });

        setIndexedItems(items);
      } catch (error) {
        console.error("Error loading menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  return [...STATIC_MENU_ITEMS, ...indexedItems];
}

function formatMenuName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
