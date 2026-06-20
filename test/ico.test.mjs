import test from 'node:test';
import assert from 'node:assert/strict';
import { buildIco } from '../src/ico.mjs';

const pngHeader = Buffer.from('89504e470d0a1a0a', 'hex');

test('buildIco writes a multi-entry ICO directory', () => {
  const ico = buildIco([
    { size: 32, buffer: Buffer.concat([pngHeader, Buffer.from([32])]) },
    { size: 16, buffer: Buffer.concat([pngHeader, Buffer.from([16])]) }
  ]);

  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 2);
  assert.equal(ico.readUInt8(6), 16);
  assert.equal(ico.readUInt8(22), 32);
});
