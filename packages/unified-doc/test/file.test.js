import { mimeTypes } from '../lib/enums';
import { create, getContent } from '../lib/file';

describe('create', () => {
  it('should create an undefined file with no args', () => {
    const file = create();
    expect(file).toBeInstanceOf(File);
    expect(file.name).toEqual('undefined');
    expect(file.type).toEqual(mimeTypes.DEFAULT);
  });

  it('should create a file with the right name and mime types', () => {
    const textFile = create('file content', 'file.text');
    expect(textFile.name).toEqual('file.text');
    expect(textFile.type).toEqual('text/plain');

    const htmlFile = create('file content', 'file.html');
    expect(htmlFile.name).toEqual('file.html');
    expect(htmlFile.type).toEqual('text/html');

    const htmFile = create('file content', 'file.htm');
    expect(htmFile.name).toEqual('file.htm');
    expect(htmFile.type).toEqual('text/html');

    const jsonFile = create('{ "json": "data" }', 'file.json');
    expect(jsonFile.name).toEqual('file.json');
    expect(jsonFile.type).toEqual('application/json');

    const pdfFile = create(Buffer.from('pdf bytes'), 'file.pdf');
    expect(pdfFile.name).toEqual('file.pdf');
    expect(pdfFile.type).toEqual('application/pdf');

    const docxFile = create(Buffer.from('docx bytes'), 'file.docx');
    expect(docxFile.name).toEqual('file.docx');
    expect(docxFile.type).toEqual(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );

    const jpgFile = create(Buffer.from('image bytes'), 'file.jpg');
    expect(jpgFile.name).toEqual('file.jpg');
    expect(jpgFile.type).toEqual('image/jpeg');
  });
});

describe('getContent', () => {
  it('should return empty content for an empty file', async () => {
    const file = new File([], 'filename');
    expect(await getContent(file)).toEqual('');
  });

  it('should return the right content for string content', async () => {
    const file1 = new File(['content'], 'filename');
    expect(await getContent(file1)).toEqual('content');

    const file2 = new File(['content \nwith\nnewlines'], 'filename');
    expect(await getContent(file2)).toEqual('content \nwith\nnewlines');

    const file3 = new File([Buffer.from('bytes')], 'filename');
    expect(await getContent(file3)).toEqual('bytes');
  });

  it('should always return the string content as UTF-8', async () => {
    const file1 = new File([Buffer.from('hello', 'utf8')], 'filename');
    expect(await getContent(file1)).toEqual('hello');

    const file2 = new File([Buffer.from('hello', 'utf16le')], 'filename');
    expect(await getContent(file2)).not.toEqual('hello');
  });
});
