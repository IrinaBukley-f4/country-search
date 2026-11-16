export declare function debounce<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  delay: number
): (...args: Args) => void;
