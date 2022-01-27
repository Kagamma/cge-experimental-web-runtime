import decode from 'image-decode';
import { Object } from './classes';

export class Image extends Object {
  constructor() {
    super();
  }

  /**
   * Load an image file and return bitmap
   * @param {*} data Pointer to image file's data
   * @param {*} size image file's size
   * @param {*} width pointer to width
   * @param {*} height pointer to height
   * @returns Pointer to bitmap
   */
  load = (fileData, size, widthPtr, heightPtr, bppPtr) => {
    this.refreshMemory();
    const imgData = new Uint8Array(this.instance.memory.buffer, fileData, size);

    const image = decode(imgData);
    if (!image.data) {
      return 0; // Return nil if image cannot be decoded
    }
    const { data, width, height } = image;
    const bpp = data.byteLength / (width * height);
    const len = width * height * bpp;
    const result = this.allocMem(len);
    this.refreshMemory();
    const dataMap = new Uint8Array(this.instance.memory.buffer, result, len);
    dataMap.set(data);
    this.view.setUint32(widthPtr, width, true);
    this.view.setUint32(heightPtr, height, true);
    this.view.setUint32(bppPtr, bpp, true);

    return result;
  }
}