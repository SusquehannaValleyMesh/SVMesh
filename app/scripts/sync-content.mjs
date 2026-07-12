import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(clientRoot, "..");

const sourcePagesDir = path.join(repoRoot, "content", "pages");
const sourceUpdatesDir = path.join(repoRoot, "content", "updates");

const contentRoot = path.join(clientRoot, "public", "content");
const targetPagesDir = path.join(contentRoot, "pages");
const targetUpdatesDir = path.join(contentRoot, "updates");
const targetIndexDir = path.join(contentRoot, "index");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function clearDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

function copyTree(sourceDir, destinationDir) {
  if (!fs.existsSync(sourceDir)) return;

  ensureDir(destinationDir);
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      copyTree(sourcePath, destinationPath);
      continue;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }
}

function listMarkdownFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name);
}

function parseKnowledgebaseArticle(filePath) {
  const fileName = path.basename(filePath);
  const slug = fileName.replace(/\.md$/i, "");
  const raw = fs.readFileSync(filePath, "utf8");

  const lines = raw.split(/\r?\n/);
  let title = slug.replace(/[-_]/g, " ");
  let description = "";
  const authors = [];
  const tags = [];

  let bodyStart = 0;
  if (lines[0]?.trim() === "---") {
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (line === "---") {
        bodyStart = i + 1;
        break;
      }

      if (line.startsWith("title:")) {
        title = line.slice(6).trim().replace(/^"|"$/g, "");
      } else if (line.startsWith("description:")) {
        description = line.slice(12).trim().replace(/^"|"$/g, "");
      } else if (line.startsWith("author:") || line.startsWith("authors:")) {
        const value = line.slice(line.indexOf(":") + 1).trim();
        if (value) {
          const parsed = value
            .replace(/^\[/, "")
            .replace(/\]$/, "")
            .split(",")
            .map((author) => author.trim().replace(/^"|"$/g, ""))
            .filter(Boolean);
          authors.push(...parsed);
        }
      } else if (line.startsWith("tags:")) {
        const value = line.slice(5).trim();
        if (value) {
          const parsed = value
            .replace(/^\[/, "")
            .replace(/\]$/, "")
            .split(",")
            .map((tag) => tag.trim().replace(/^"|"$/g, ""))
            .filter(Boolean);
          tags.push(...parsed);
        }
      }
    }
  }

  if (!description) {
    for (let i = bodyStart; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;
      if (line.startsWith("#") || line.startsWith("::") || line.endsWith("::warning")) continue;
      if (line.endsWith("::critical") || line.endsWith("::info")) continue;

      description = line.length > 150 ? `${line.slice(0, 150)}...` : line;
      break;
    }
  }

  return {
    slug,
    title,
    description,
    authors: [...new Set(authors.map((author) => author.toLowerCase()))].map((lower) => {
      return authors.find((author) => author.toLowerCase() === lower) || lower;
    }),
    tags: [...new Set(tags.map((tag) => tag.toLowerCase()))].map((lower) => {
      return tags.find((tag) => tag.toLowerCase() === lower) || lower;
    }),
  };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function syncContent() {
  ensureDir(contentRoot);
  ensureDir(targetIndexDir);
  ensureDir(targetPagesDir);
  ensureDir(targetUpdatesDir);

  clearDir(targetPagesDir);
  clearDir(targetUpdatesDir);
  clearDir(targetIndexDir);

  copyTree(sourcePagesDir, targetPagesDir);
  copyTree(sourceUpdatesDir, targetUpdatesDir);

  const pageFiles = listMarkdownFiles(sourcePagesDir).sort((a, b) => a.localeCompare(b));
  const updateFiles = listMarkdownFiles(sourceUpdatesDir).sort((a, b) => b.localeCompare(a));

  const knowledgebaseSourceDir = path.join(sourcePagesDir, "knowledgebase");
  const knowledgebaseFiles = listMarkdownFiles(knowledgebaseSourceDir)
    .map((fileName) => parseKnowledgebaseArticle(path.join(knowledgebaseSourceDir, fileName)))
    .sort((a, b) => a.title.localeCompare(b.title));

  writeJson(path.join(targetIndexDir, "pages.json"), { files: pageFiles });
  writeJson(path.join(targetIndexDir, "updates.json"), { files: updateFiles });
  writeJson(path.join(targetIndexDir, "knowledgebase.json"), { files: knowledgebaseFiles });

  console.log(
    `Synced content. pages=${pageFiles.length}, updates=${updateFiles.length}, kb=${knowledgebaseFiles.length}`
  );
}

syncContent();
