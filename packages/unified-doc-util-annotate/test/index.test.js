import { hast } from './fixtures';
import annotate from '..';

describe('annotate', () => {
  it('returns the original tree if nothing to annotate', () => {
    expect(annotate(hast, { annotations: [] })).toBe(hast);
  });

  it('returns a mapped tree if no matching annotations', () => {
    const annotated = annotate(hast, {
      annotations: [{ id: 'a', start: 1000, end: 4000 }],
    });
    expect(annotated).toEqual(hast);
    expect(annotated).not.toBe(hast);
  });

  it('annotates text nodes with simple non-overlapping annotations', () => {
    const annotated = annotate(hast, {
      annotations: [{ id: 'a', start: 7, end: 15 }],
    });
    expect(annotated).not.toEqual(hast);

    // not annotated
    expect(annotated).toHaveProperty('children.0.children.0.type', 'text');
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.0.children.0.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.0.children.0.value',
      'some',
    );
    expect(hast).toHaveProperty(
      'children.0.children.1.children.1.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.type',
      'element',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.tagName',
      'div',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.0.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.0.value',
      ' m',
    );

    // annotated
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.type',
      'element',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.tagName',
      'mark',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.properties.dataAnnotationId',
      'a',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.children.0.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.children.0.value',
      'arkdown ',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.value',
      'content',
    );
  });

  it('annotates text nodes with overlapping annotations', () => {
    const annotated = annotate(hast, {
      annotations: [
        { id: 'a', start: 7, end: 15 },
        { id: 'b', start: 10, end: 20 },
      ],
    });
    // not annotated
    expect(annotated).toHaveProperty('children.0.children.0.type', 'text');
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.0.children.0.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.0.children.0.value',
      'some',
    );
    expect(hast).toHaveProperty(
      'children.0.children.1.children.1.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.type',
      'element',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.tagName',
      'div',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.0.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.0.value',
      ' m',
    );

    // non-overlapping annotations ("a")
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.type',
      'element',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.tagName',
      'mark',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.properties.dataAnnotationId',
      'a',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.children.0.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.1.children.0.value',
      'ark',
    );

    // overlapping annotations ("a" and "b")
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.type',
      'element',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.tagName',
      'mark',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.properties.dataAnnotationId',
      'a',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.children.0.type',
      'element',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.children.0.tagName',
      'mark',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.children.0.properties.dataAnnotationId',
      'b',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.children.0.children.0.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.2.children.0.children.0.value',
      'down ',
    );

    // non-overlapping annotations ("b")
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.3.type',
      'element',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.3.tagName',
      'mark',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.3.properties.dataAnnotationId',
      'b',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.3.children.0.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.3.children.0.value',
      'conte',
    );

    // no annotations
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.4.type',
      'text',
    );
    expect(annotated).toHaveProperty(
      'children.0.children.1.children.1.children.4.value',
      'nt',
    );
  });

  it('applies annotation callbacks', () => {
    console.log = jest.fn();
    const annotated = annotate(hast, {
      annotations: [{ id: 'a', start: 7, end: 15 }],
      annotationCallbacks: {
        onClick: console.log,
        onMouseEnter: console.log,
      },
    });

    const annotatedNode =
      annotated.children[0].children[1].children[1].children[1];
    expect(annotatedNode.properties.onClick).toBeInstanceOf(Function);
    expect(annotatedNode.properties.onMouseEnter).toBeInstanceOf(Function);
    expect(annotatedNode.properties.onMouseOut).toEqual(undefined);

    annotatedNode.properties.onClick();
    expect(console.log).toBeCalledWith(
      { id: 'a', start: 7, end: 15 },
      undefined,
    );
    annotatedNode.properties.onMouseEnter();
    expect(console.log).toBeCalledWith(
      { id: 'a', start: 7, end: 15 },
      undefined,
    );
  });
});
