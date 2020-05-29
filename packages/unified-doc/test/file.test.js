import { fromContent, getContent, updateExtension } from '../lib/file';

describe('fromContent', () => {
  it('should create an undefined file with mimeType text/plain', () => {
    const file = fromContent();
    expect(file).toBeInstanceOf(File);
    expect(file.name).toEqual('undefined');
    expect(file.type).toEqual('text/plain');
  });

  it('should create a file with the right name and mime types', () => {
    const textFile = fromContent('file content', 'file.text');
    const htmlFile = fromContent('file content', 'file.html');
    const htmFile = fromContent('file content', 'file.htm');
    const jsonFile = fromContent('{ "json": "data" }', 'file.json');
    const pdfFile = fromContent(Buffer.from('pdf bytes'), 'file.pdf');
    const docxFile = fromContent(Buffer.from('docx bytes'), 'file.docx');
    const jpgFile = fromContent(Buffer.from('image bytes'), 'file.jpg');
    expect(textFile.name).toEqual('file.text');
    expect(textFile.type).toEqual('text/plain');
    expect(htmlFile.name).toEqual('file.html');
    expect(htmlFile.type).toEqual('text/html');
    expect(htmFile.name).toEqual('file.htm');
    expect(htmFile.type).toEqual('text/html');
    expect(jsonFile.name).toEqual('file.json');
    expect(jsonFile.type).toEqual('application/json');
    expect(pdfFile.name).toEqual('file.pdf');
    expect(pdfFile.type).toEqual('application/pdf');
    expect(docxFile.name).toEqual('file.docx');
    expect(docxFile.type).toEqual(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    expect(jpgFile.name).toEqual('file.jpg');
    expect(jpgFile.type).toEqual('image/jpeg');
  });
});

describe('getContent', () => {
  it('should return empty content for an empty file', async () => {
    expect(await getContent(new File([], 'filename'))).toEqual('');
  });

  it('should return the right content for string content', async () => {
    expect(await getContent(new File(['content'], 'filename'))).toEqual(
      'content',
    );
    expect(
      await getContent(new File(['content \nwith\nnewlines'], 'filename')),
    ).toEqual('content \nwith\nnewlines');
    expect(
      await getContent(new File([Buffer.from('bytes')], 'filename')),
    ).toEqual('bytes');
  });

  it('should always return the string content as UTF-8', async () => {
    expect(
      await getContent(new File([Buffer.from('hello', 'utf8')], 'filename')),
    ).toEqual('hello');
    expect(
      await getContent(new File([Buffer.from('hello', 'utf16le')], 'filename')),
    ).not.toEqual('hello');
  });
});

describe('updateExtension', () => {
  it('should return original filename if args are empty', () => {
    expect(updateExtension()).toEqual();
    expect(updateExtension(null, 'uni')).toEqual(null);
    expect(updateExtension('filename')).toEqual('filename');
    expect(updateExtension('filename.txt')).toEqual('filename.txt');
  });

  it('should rename the file extension', () => {
    expect(updateExtension('filename.txt', 'uni')).toEqual('filename.uni');
    expect(updateExtension('filename.a.b.c')).toEqual('filename.a.b.c');
  });

  it('should auto strip extension suffix dot', () => {
    expect(updateExtension('filename.txt', '.uni')).toEqual('filename.uni');
  });

  it('should rename only the "last" extension', () => {
    expect(updateExtension('filename.a.b.c', 'd')).toEqual('filename.a.b.d');
  });
});
