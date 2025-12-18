import '@testing-library/jest-dom';

// Some deps (and jsdom) can require TextEncoder/TextDecoder in Node test envs.
import { TextDecoder, TextEncoder } from 'node:util';

if (!global.TextEncoder) {
  // @ts-expect-error - align global typing for Jest runtime
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  // @ts-expect-error - align global typing for Jest runtime
  global.TextDecoder = TextDecoder;
}
