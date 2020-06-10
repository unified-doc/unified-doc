export interface Snippet {
  start: number;
  end: number;
  value: string;
}

export default function search(
  content: string,
  options?: Record<string, unknown>,
): Snippet[];
