function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function search(content, sourceQuery, options = {}) {
  const { enableRegexp = false, isCaseSensitive = false } = options;

  const query = enableRegexp ? sourceQuery : escapeRegExp(sourceQuery);
  const searchInputRegExp = new RegExp(query, isCaseSensitive ? 'g' : 'gi');

  const searchResults = [];
  let match;
  if (query.length >= 1) {
    while ((match = searchInputRegExp.exec(content)) !== null) {
      const start = match.index;
      const end = searchInputRegExp.lastIndex;
      const value = content.slice(start, end);
      searchResults.push({ start, end, value });
    }
  }
  return searchResults;
}
