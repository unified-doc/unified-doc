import unifiedDoc from '../../../packages/unified-doc';

describe('exportFile', () => {
  it('exports the current file as is', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    const exportedFile = doc.exportFile();
    expect(exportedFile).to.be.an.instanceof(File);
    expect(exportedFile.name).to.equal('doc.md');
    expect(exportedFile.type).to.equal('text/markdown');
    expect(await exportedFile.text()).to.equal('> **some** markdown content');
  });

  // TODO: confirm remark-rehype behaviors and add test back
  it.skip('exports the current file as .html', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    const exportedFile = doc.exportFile('html');
    expect(exportedFile).to.be.an.instanceof(File);
    expect(exportedFile.name).to.equal('doc.html');
    expect(exportedFile.type).to.equal('text/html');
    expect(await exportedFile.text()).to.equal('adf');
  });

  it('exports the current file as .uni', async () => {
    const doc = await unifiedDoc({
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    const exportedFile = doc.exportFile('uni');
    expect(exportedFile).to.be.an.instanceof(File);
    expect(exportedFile.name).to.equal('doc.uni');
    expect(exportedFile.type).to.equal('text/uni');
    expect(await exportedFile.text()).to.equal(
      JSON.stringify(
        {
          hast: {
            type: 'root',
            children: [
              {
                type: 'blockquote',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'strong',
                        children: [
                          {
                            type: 'text',
                            value: 'some',
                            position: {
                              start: {
                                line: 1,
                                column: 5,
                                offset: 4,
                              },
                              end: {
                                line: 1,
                                column: 9,
                                offset: 8,
                              },
                              indent: [],
                            },
                          },
                        ],
                        position: {
                          start: {
                            line: 1,
                            column: 3,
                            offset: 2,
                          },
                          end: {
                            line: 1,
                            column: 11,
                            offset: 10,
                          },
                          indent: [],
                        },
                      },
                      {
                        type: 'text',
                        value: ' markdown content',
                        position: {
                          start: {
                            line: 1,
                            column: 11,
                            offset: 10,
                          },
                          end: {
                            line: 1,
                            column: 28,
                            offset: 27,
                          },
                          indent: [],
                        },
                      },
                    ],
                    position: {
                      start: {
                        line: 1,
                        column: 3,
                        offset: 2,
                      },
                      end: {
                        line: 1,
                        column: 28,
                        offset: 27,
                      },
                      indent: [],
                    },
                  },
                ],
                position: {
                  start: {
                    line: 1,
                    column: 1,
                    offset: 0,
                  },
                  end: {
                    line: 1,
                    column: 28,
                    offset: 27,
                  },
                  indent: [],
                },
              },
            ],
            position: {
              start: {
                line: 1,
                column: 1,
                offset: 0,
              },
              end: {
                line: 1,
                column: 28,
                offset: 27,
              },
            },
          },
        },
        null,
        2,
      ),
    );
  });
});
