import * as fetch from 'sync-fetch';
import { Object } from './classes';

export class FPHTTPClient extends Object{
  constructor() {
    super();
  }

  get = (url, size) => {
    this.refreshMemory();
    const jsurl = this.getJSString(url);
    const response = fetch(jsurl, {
      method: 'GET',
    });
    const data = new Uint8Array(response.arrayBuffer());
    const result = this.allocMem(data.byteLength);
    const dataMap = new Uint8Array(this.instance.memory.buffer, result, data.byteLength);
    this.view.setUint32(size, data.byteLength, true);
    dataMap.set(data);
    return result;
  }
};
