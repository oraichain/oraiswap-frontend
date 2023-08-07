// @ts-nocheck
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// polyfill for testing
import './src/polyfill';
