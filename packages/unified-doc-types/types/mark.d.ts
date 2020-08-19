export interface Mark {
  id: string;
  start: number;
  end: number;
  classNames?: string[];
  dataset?: Record<string, any>;
  data?: Record<string, any>;
  style?: Record<string, any>;
}
