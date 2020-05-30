import vfile from 'vfile';

import { inferMimeType, toFile, toVfile } from '../lib/vfile';

// only test default mime type since other behaviors are implemented/tested in "mime" package.
describe('inferMimeType', () => {
  it('infers default mimetype for invalid types', () => {
    const vf1 = vfile({ basename: 'no-extension' });
    const vf2 = vfile({ basename: 'file-with.bad-extension' });
    expect(inferMimeType(vf1)).toEqual('text/plain');
    expect(inferMimeType(vf2)).toEqual('text/plain');
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
