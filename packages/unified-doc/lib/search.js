export function getSnippets({ content, searchResults, snippetOffsetPadding }) {
  return searchResults.map((searchResult) => {
    const { start, end, value } = searchResult;
    return {
      ...searchResult,
      snippet: [
        content.slice(Math.max(0, start - snippetOffsetPadding), start),
        value,
        content.slice(
          end,
          Math.min(content.length, end + snippetOffsetPadding),
        ),
      ],
    };
  });
}
