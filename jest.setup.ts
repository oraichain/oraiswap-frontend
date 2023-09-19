// @ts-nocheck
import { TextEncoder, TextDecoder } from 'util';
import { randomFillSync } from 'crypto';

window.crypto = {
  getRandomValues(buffer) {
    return randomFillSync(buffer);
  }
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
