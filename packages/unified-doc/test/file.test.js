import { DEFAULT_MIME_TYPE } from '../lib/enums';
import { createFile, readFileContent } from '../lib/file';

describe('createFile', () => {
  it('should create an undefined file with no args', () => {
    const file = createFile();
    expect(file).toBeInstanceOf(File);
    expect(file.name).toEqual('undefined');
    expect(file.type).toEqual(DEFAULT_MIME_TYPE);
  });

  it('should create a file with the right name and mime types', () => {
    const textFile = createFile('file content', 'file.text');
    expect(textFile.name).toEqual('file.text');
    expect(textFile.type).toEqual('text/plain');

    const htmlFile = createFile('file content', 'file.html');
    expect(htmlFile.name).toEqual('file.html');
    expect(htmlFile.type).toEqual('text/html');

    const htmFile = createFile('file content', 'file.htm');
    expect(htmFile.name).toEqual('file.htm');
    expect(htmFile.type).toEqual('text/html');

    const jsonFile = createFile('{ "json": "data" }', 'file.json');
    expect(jsonFile.name).toEqual('file.json');
    expect(jsonFile.type).toEqual('application/json');

    const pdfFile = createFile(Buffer.from('pdf bytes'), 'file.pdf');
    expect(pdfFile.name).toEqual('file.pdf');
    expect(pdfFile.type).toEqual('application/pdf');

    const docxFile = createFile(Buffer.from('docx bytes'), 'file.docx');
    expect(docxFile.name).toEqual('file.docx');
    expect(docxFile.type).toEqual(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );

    const jpgFile = createFile(Buffer.from('image bytes'), 'file.jpg');
    expect(jpgFile.name).toEqual('file.jpg');
    expect(jpgFile.type).toEqual('image/jpeg');
  });
});

describe('readFileContent', () => {
  it('should return empty content for an empty file', async () => {
    const file = new File([], 'filename');
    expect(await readFileContent(file)).toEqual('');
  });

  it('should return the right content for string content', async () => {
    const file1 = new File(['content'], 'filename');
    expect(await readFileContent(file1)).toEqual('content');

    const file2 = new File(['content \nwith\nnewlines'], 'filename');
    expect(await readFileContent(file2)).toEqual('content \nwith\nnewlines');

    const file3 = new File([Buffer.from('bytes')], 'filename');
    expect(await readFileContent(file3)).toEqual('bytes');
  });

  it('should always return the string content as UTF-8', async () => {
    const file1 = new File([Buffer.from('hello', 'utf8')], 'filename');
    expect(await readFileContent(file1)).toEqual('hello');

    const file2 = new File([Buffer.from('hello', 'utf16le')], 'filename');
    expect(await readFileContent(file2)).not.toEqual('hello');
  });
});
