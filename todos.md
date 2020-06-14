# todos

- Change `div` to `span` (bug with display block and newline)
- prevent click event propagations in `util-annotate`
- search regexp improvements:
  - support special characters e.g. ('\*') characters for regexp.
  - treat newlines/tabs as the same whitespace (inexact whitespace match).
  - trim whitespace/special-characters (multiple whitespaces) or specify whitespace sensitivity/behaviors.
- Address `TODO` comments.
- Packages
  - `unified-doc-cli`: CLI APIs (e.g. curls to fetch document and use unified-doc APIs)
  - `unified-doc-dom`: various useful DOM-related APIs (e.g. annotating/highlighting, selecting text, creating/saving files, reading from files).
- Update docs.
- Check with `unified` team about the `.uni` file extension and `text/uni` mime type.
