export function buildIco(pngEntries) {
  if (!Array.isArray(pngEntries) || pngEntries.length === 0) {
    throw new Error('buildIco requires at least one PNG entry.');
  }

  const sortedEntries = [...pngEntries].sort((a, b) => a.size - b.size);
  const headerSize = 6;
  const directoryEntrySize = 16;
  let imageOffset = headerSize + directoryEntrySize * sortedEntries.length;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sortedEntries.length, 4);

  const directory = Buffer.alloc(directoryEntrySize * sortedEntries.length);
  const images = [];

  sortedEntries.forEach((entry, index) => {
    if (!Number.isInteger(entry.size) || entry.size <= 0 || entry.size > 256) {
      throw new Error(`Invalid ICO size: ${entry.size}`);
    }
    if (!Buffer.isBuffer(entry.buffer) || entry.buffer.length === 0) {
      throw new Error(`ICO entry ${entry.size} is missing PNG data.`);
    }

    const offset = index * directoryEntrySize;
    const sizeByte = entry.size === 256 ? 0 : entry.size;

    directory.writeUInt8(sizeByte, offset);
    directory.writeUInt8(sizeByte, offset + 1);
    directory.writeUInt8(0, offset + 2);
    directory.writeUInt8(0, offset + 3);
    directory.writeUInt16LE(1, offset + 4);
    directory.writeUInt16LE(32, offset + 6);
    directory.writeUInt32LE(entry.buffer.length, offset + 8);
    directory.writeUInt32LE(imageOffset, offset + 12);

    images.push(entry.buffer);
    imageOffset += entry.buffer.length;
  });

  return Buffer.concat([header, directory, ...images]);
}
