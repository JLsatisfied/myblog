interface FrontmatterResult {
  frontmatter: Record<string, string | string[]>;
  content: string;
}

/**
 * Parse YAML-like frontmatter from Markdown content.
 * Expects format:
 * ---
 * key: value
 * key2:
 *   - item1
 *   - item2
 * ---
 * Markdown content here...
 */
export function parseFrontmatter(raw: string): FrontmatterResult {
  const frontmatter: Record<string, string | string[]> = {};
  let content = raw;

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (match) {
    const fmBlock = match[1];
    content = match[2] ?? '';

    const lines = fmBlock.split('\n');
    let currentKey = '';
    let currentArray: string[] = [];

    for (const line of lines) {
      const arrayItemMatch = line.match(/^\s*-\s+(.+)/);
      if (arrayItemMatch && currentKey) {
        currentArray.push(arrayItemMatch[1].trim());
        frontmatter[currentKey] = currentArray;
        continue;
      }

      // Flush previous array
      if (currentKey && currentArray.length > 0) {
        frontmatter[currentKey] = currentArray;
        currentArray = [];
      }

      const kvMatch = line.match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        currentKey = kvMatch[1];
        const value = kvMatch[2].trim();
        if (value === '') {
          currentArray = [];
          frontmatter[currentKey] = [];
        } else if (value === 'true' || value === 'false') {
          frontmatter[currentKey] = value;
        } else {
          frontmatter[currentKey] = value;
        }
      }
    }

    // Flush final array
    if (currentKey && currentArray.length > 0) {
      frontmatter[currentKey] = currentArray;
    }
  }

  return { frontmatter, content };
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  // Chinese characters count differently - roughly 1 char ≈ 1 word
  const chineseChars = (content.match(/[一-鿿]/g) || []).length;
  const englishWords = content
    .replace(/[一-鿿]/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  const totalWords = chineseChars + englishWords;
  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}
