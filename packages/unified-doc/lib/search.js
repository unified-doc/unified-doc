export function getSnippets(textContent, searchResults, options = {}) {
  const { snippetOffsetPadding = 0 } = options;

  if (snippetOffsetPadding === 0) {
    return searchResults;
  }

  return searchResults.map((searchResult) => {
    const { start, end } = searchResult;
    return {
      ...searchResult,
      snippet: [
        textContent.slice(Math.max(0, start - snippetOffsetPadding), start),
        textContent.slice(start, end),
        textContent.slice(
          end,
          Math.min(textContent.length, end + snippetOffsetPadding),
        ),
      ],
    };
  });
}
