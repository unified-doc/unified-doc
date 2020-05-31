import _vfile from 'vfile';

import { markdownContent as content } from './fixtures/content';
import { createVfile, inferMimeType, toFile } from '../lib/vfile';

describe('createVfile', () => {
  it('creates vfile if content and filename is provided', async () => {
    const vfile = await createVfile({
      content,
      filename: 'doc.md',
    });
    expect(vfile.basename).toEqual('doc.md');
    expect(vfile.extname).toEqual('.md');
    expect(vfile.stem).toEqual('doc');
    expect(vfile.contents).toEqual(content);
    expect(vfile.toString()).toEqual(content);
  });

  it('creates vfile if file is provided', async () => {
    // jest does not support File.arrayBuffer method.  Test this in cypress.
  });
});

// only test default and some mime types since other behaviors are implemented/tested in "mime" package.
describe('inferMimeType', () => {
  it('infers default mimetype for invalid types', () => {
    expect(inferMimeType('no-extension')).toEqual('text/plain');
    expect(inferMimeType('file-with.bad-extension')).toEqual('text/plain');
    expect(inferMimeType('file.text')).toEqual('text/plain');
    expect(inferMimeType('file.htm')).toEqual('text/html');
    expect(inferMimeType('file.html')).toEqual('text/html');
    expect(inferMimeType('file.md')).toEqual('text/markdown');
    expect(inferMimeType('file.json')).toEqual('application/json');
    expect(inferMimeType('file.pdf')).toEqual('application/pdf');
    expect(inferMimeType('file.docx')).toEqual(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });
});

describe('toFile', () => {
  it('creates file for a given vfile and infers mimetype', () => {
    const file1 = toFile(_vfile({ basename: 'doc.md' }));
    const file2 = toFile(_vfile({ basename: 'no-extension' }));
    const file3 = toFile(_vfile({ basename: 'file-with.bad-extension' }));
    expect(file1).toBeInstanceOf(File);
    expect(file1.name).toEqual('doc.md');
    expect(file1.type).toEqual('text/markdown');
    expect(file2).toBeInstanceOf(File);
    expect(file2.name).toEqual('no-extension');
    expect(file2.type).toEqual('text/plain');
    expect(file3).toBeInstanceOf(File);
    expect(file3.name).toEqual('file-with.bad-extension');
    expect(file3.type).toEqual('text/plain');
    // jest does not support File.text method.  Test this in cypress.
  });
});
