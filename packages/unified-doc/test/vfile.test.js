import vfile from 'vfile';

import { inferMimeType, toFile, toVfile } from '../lib/vfile';

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
    const file1 = toFile(vfile({ basename: 'doc.md' }));
    const file2 = toFile(vfile({ basename: 'no-extension' }));
    const file3 = toFile(vfile({ basename: 'file-with.bad-extension' }));
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

describe('toVfile', () => {
  it('creates vfile if content and filename is provided', async () => {
    const vf = await toVfile({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    expect(vf.basename).toEqual('doc.md');
    expect(vf.extname).toEqual('.md');
    expect(vf.stem).toEqual('doc');
    expect(vf.contents).toEqual('> **some** markdown content');
    expect(vf.toString()).toEqual('> **some** markdown content');
  });

  it('creates vfile if file is provided', async () => {
    // jest does not support File.arrayBuffer method.  Test this in cypress.
  });
});
