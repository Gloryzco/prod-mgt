const sanitize = require('mongo-sanitize');

export function sanitizeInput<T>(input: T): T {
  return sanitize(input);
}
