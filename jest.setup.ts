// @ts-nocheck
import { TextEncoder, TextDecoder } from 'util';
import { randomFillSync } from 'crypto';

// polyfill for jest crypto function (because of Injective ts sdk)
window.crypto = {
  getRandomValues(buffer) {
    return randomFillSync(buffer);
  }
};

// polyfill for jest formatToJson function
Intl.DateTimeFormat.prototype.formatToJson = function (date: Date) {
  const _this = this as Intl.DateTimeFormat;
  return Object.fromEntries(
    _this
      .formatToParts(date)
      .filter((item) => item.type !== 'literal')
      .map((item) => [item.type, item.value])
  ) as Record<Intl.DateTimeFormatPartTypes, string>;
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
