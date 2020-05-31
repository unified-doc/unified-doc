import _vfile from 'vfile';

import {
  createVfile,
  inferMimeType,
  toFile,
} from '../../../../packages/unified-doc/lib/vfile';

import { getNamespace } from '../../../utils';
import { markdownContent as content } from '../../../fixtures/content';

describe(getNamespace(__filename), () => {
  describe(createVfile.name, () => {
    it('creates vfile if content and filename is provided', async () => {
      const vfile = await createVfile({
        content,
        filename: 'doc.md',
      });
      expect(vfile.basename).to.equal('doc.md');
      expect(vfile.extname).to.equal('.md');
      expect(vfile.stem).to.equal('doc');
      expect(vfile.contents).to.equal(content);
      expect(vfile.toString()).to.equal(content);
    });

    it('creates vfile if file is provided', async () => {
      const vfile = await createVfile({
        file: new File([content], 'doc.md'),
      });
      expect(vfile.basename).to.equal('doc.md');
      expect(vfile.extname).to.equal('.md');
      expect(vfile.stem).to.equal('doc');
      expect(vfile.contents).to.be.an.instanceOf(Uint8Array);
      expect(vfile.toString()).to.equal(content);
    });
  });

  // only test default and some mime types since other behaviors are implemented/tested in "mime" package.
  describe(inferMimeType.name, () => {
    it('infers default mimetype for invalid types', () => {
      expect(inferMimeType('no-extension')).to.equal('text/plain');
      expect(inferMimeType('file-with.bad-extension')).to.equal('text/plain');
      expect(inferMimeType('file.text')).to.equal('text/plain');
      expect(inferMimeType('file.htm')).to.equal('text/html');
      expect(inferMimeType('file.html')).to.equal('text/html');
      expect(inferMimeType('file.md')).to.equal('text/markdown');
      expect(inferMimeType('file.json')).to.equal('application/json');
      expect(inferMimeType('file.pdf')).to.equal('application/pdf');
      expect(inferMimeType('file.docx')).to.equal(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
    });
  });

  describe(toFile.name, () => {
    it('creates file for a given vfile and infers mimetype', async () => {
      const file1 = toFile(_vfile({ contents: content, basename: 'doc.md' }));
      const file2 = toFile(
        _vfile({ contents: content, basename: 'no-extension' }),
      );
      const file3 = toFile(
        _vfile({ contents: content, basename: 'file-with.bad-extension' }),
      );
      expect(file1).to.be.an.instanceOf(File);
      expect(file1.name).to.equal('doc.md');
      expect(file1.type).to.equal('text/markdown');
      expect(await file1.text()).to.equal(content);
      expect(file2).to.be.an.instanceOf(File);
      expect(file2.name).to.equal('no-extension');
      expect(file2.type).to.equal('text/plain');
      expect(await file2.text()).to.equal(content);
      expect(file3).to.be.an.instanceOf(File);
      expect(file3.name).to.equal('file-with.bad-extension');
      expect(file3.type).to.equal('text/plain');
      expect(await file3.text()).to.equal(content);
    });
  });
});
