function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function search(content, sourceQuery, options = {}) {
  const {
    enableRegexp = false,
    isCaseSensitive = false,
    minMatchCharLength = 1,
  } = options;

  const query = enableRegexp ? sourceQuery : escapeRegExp(sourceQuery);
  const searchInputRegExp = new RegExp(query, isCaseSensitive ? 'g' : 'gi');

  const textOffsets = [];
  let match;
  if (query.length >= minMatchCharLength) {
    while ((match = searchInputRegExp.exec(content)) !== null) {
      const start = match.index;
      const end = searchInputRegExp.lastIndex;
      const value = content.slice(start, end);
      textOffsets.push({ start, end, value });
    }
  }
  return textOffsets;
}
