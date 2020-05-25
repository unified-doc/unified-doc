import Doc from '../../../packages/unified-doc';

describe('initialize', () => {
  it('initializes succesfully', async () => {
    const file = new File(['adfadf'], 'adfadf.html');
    const doc = new Doc(file);
    await doc.initialize();
  });
});
