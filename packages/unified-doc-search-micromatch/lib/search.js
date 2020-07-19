import micromatch from 'micromatch';

const defaultOptions = { nocase: true };
const requiredOptions = { contains: true };

export default function search(content, query, options = {}) {
  const searchResults = [];

  if (content && query.length >= 1) {
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      ...requiredOptions,
    };
    const micromatchRe = micromatch.makeRe(query, mergedOptions);
    const micromatchMatch = micromatchRe.exec(content);

    if (micromatchMatch && micromatchMatch[0]) {
      let match;
      const searchRe = new RegExp(micromatchMatch[0], 'gi');
      while ((match = searchRe.exec(content)) !== null) {
        const start = match.index;
        const end = searchRe.lastIndex;
        const value = content.slice(start, end);
        searchResults.push({ start, end, value });
      }
    }
  }

  return searchResults;
}
