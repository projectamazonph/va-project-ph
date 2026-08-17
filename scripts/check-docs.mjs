import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const docsRoot = path.resolve("docs");
const markdownFiles = [];

function collectMarkdownFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(entryPath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      markdownFiles.push(entryPath);
    }
  }
}

collectMarkdownFiles(docsRoot);

const missingLinks = [];
const localLinkPattern = /\]\(\.\/([^)#]+)(?:#[^)]+)?\)/g;

for (const filePath of markdownFiles) {
  const source = readFileSync(filePath, "utf8");
  for (const match of source.matchAll(localLinkPattern)) {
    const target = path.resolve(path.dirname(filePath), match[1]);
    if (!target.startsWith(`${docsRoot}${path.sep}`) && target !== docsRoot) {
      missingLinks.push(`${path.relative(process.cwd(), filePath)} -> ${match[1]}`);
    } else if (!existsSync(target)) {
      missingLinks.push(`${path.relative(process.cwd(), filePath)} -> ${match[1]}`);
    }
  }
}

if (missingLinks.length > 0) {
  console.error("Broken local documentation links:");
  for (const link of missingLinks) {
    console.error(`- ${link}`);
  }
  process.exitCode = 1;
} else {
  process.stdout.write(`Checked ${markdownFiles.length} Markdown files; all local links resolve.\n`);
}
