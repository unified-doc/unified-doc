export default function searchRegexp(content, options = {}) {
  const {
    isCaseSensitive = false,
    minMatchCharLength = 1,
    pattern = '',
  } = options;
  const searchInputRegExp = new RegExp(pattern, isCaseSensitive ? 'g' : 'gi');

  const textOffsets = [];
  let match;
  if (pattern.length >= minMatchCharLength) {
    while ((match = searchInputRegExp.exec(content)) !== null) {
      const start = match.index;
      const end = searchInputRegExp.lastIndex;
      const value = content.slice(start, end);
      textOffsets.push({ start, end, value });
    }
  }
  return textOffsets;
}
