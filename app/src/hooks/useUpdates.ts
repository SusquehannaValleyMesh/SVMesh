import { useState, useEffect } from "react";
import type { UpdatePost } from "../utils/markdown";
import { parseMarkdownPost, sortPostsByDate } from "../utils/markdown";

// Fetch update markdown files listed in the generated static index.
const fetchUpdateFiles = async () => {
  const updateFileContents: Record<string, string> = {};

  try {
    const listResponse = await fetch("/content/index/updates.json");
    if (!listResponse.ok) {
      throw new Error(`Failed to get file list: ${listResponse.status}`);
    }

    const { files } = await listResponse.json();

    // Then fetch each file's content
    for (const fileName of files) {
      try {
        const response = await fetch(`/content/updates/${fileName}`);
        if (response.ok) {
          updateFileContents[`/updates/${fileName}`] = await response.text();
        } else {
          console.warn(`Failed to fetch ${fileName}: ${response.status}`);
        }
      } catch (error) {
        console.warn(`Failed to fetch ${fileName}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to load update files:", error);
  }

  return updateFileContents;
};

export function useUpdates() {
  const [posts, setPosts] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      try {
        const updateFileContents = await fetchUpdateFiles();
        const parsedPosts: UpdatePost[] = [];

        for (const [path, content] of Object.entries(updateFileContents)) {
          // Extract filename without extension as slug
          const slug = path.split("/").pop()?.replace(".md", "") || "";
          const post = parseMarkdownPost(content, slug);
          parsedPosts.push(post);
        }

        // Sort posts by date (newest first)
        const sortedPosts = sortPostsByDate(parsedPosts);
        if (!cancelled) {
          setPosts(sortedPosts);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load updates");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
}
