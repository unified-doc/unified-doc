import validateMarks from '../lib/validate-marks';

describe(validateMarks, () => {
  it('should return empty array for empty marks', () => {
    expect(validateMarks([])).toEqual([]);
  });

  it('should validate with warnings', () => {
    console.warn = jest.fn();
    validateMarks([
      { id: 'a', start: 6, end: 4 },
      { start: 10, end: 15 },
    ]);
    expect(console.warn).toHaveBeenCalledWith(
      'Marks must contain unique "id" fields',
    );
    expect(console.warn).toHaveBeenCalledWith(
      'Marks should have "start" < "end"',
    );
  });

  it('should return same array for marks that are already sorted', () => {
    expect(validateMarks([{ id: 'a', start: 0, end: 40 }])).toEqual([
      { id: 'a', start: 0, end: 40 },
    ]);
    expect(
      validateMarks([
        { id: 'a', start: 0, end: 40 },
        { id: 'b', start: 20, end: 50 },
        { id: 'c', start: 40, end: 120 },
        { id: 'd', start: 40, end: 80 },
      ]),
    ).toEqual([
      { id: 'a', start: 0, end: 40 },
      { id: 'b', start: 20, end: 50 },
      { id: 'c', start: 40, end: 120 },
      { id: 'd', start: 40, end: 80 },
    ]);
  });

  it('should sort by start (asc) then end (desc)', () => {
    expect(
      validateMarks([
        { id: 'a', start: 60, end: 80 },
        { id: 'b', start: 40, end: 80 },
        { id: 'c', start: 120, end: 140 },
        { id: 'd', start: 0, end: 40 },
        { id: 'e', start: 20, end: 50 },
        { id: 'f', start: 40, end: 120 },
      ]),
    ).toEqual([
      { id: 'd', start: 0, end: 40 },
      { id: 'e', start: 20, end: 50 },
      { id: 'f', start: 40, end: 120 },
      { id: 'b', start: 40, end: 80 },
      { id: 'a', start: 60, end: 80 },
      { id: 'c', start: 120, end: 140 },
    ]);
  });
});
