export const isDocumentDefined = () => typeof document !== 'undefined';
export const isWindowDefined = () => typeof window !== 'undefined';

export const warnNoWindowOrDocument = () => {
  console.warn(`WARNING:
    window or document is undefined.
    It may cause unexpected behavior.
    `);
};

export class Counter {
  value = 0;

  next() {
    this.value += 1;
    return this.value;
  }
}