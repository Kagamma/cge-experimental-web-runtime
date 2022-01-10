import * as fetchSync from 'sync-fetch';
import { Object } from './classes';

export class FPHTTPClient extends Object{
  constructor() {
    super();
  }

  get = (url, headersJson, size) => {
    this.refreshMemory();
    const jsurl = this.getJSString(url);
    const jsHeadersJson = this.getJSString(headersJson);
    const headers = {};
    try {
      headers = JSON.parse(jsHeadersJson);
    } catch (error) {
    }
    const response = fetchSync(jsurl, {
      method: 'GET',
      headers,
    });
    const data = new Uint8Array(response.arrayBuffer());
    const len = data.byteLength;
    const result = this.allocMem(len);
    const dataMap = new Uint8Array(this.instance.memory.buffer, result, len);
    this.view.setUint32(size, len, true);
    dataMap.set(data);
    return result;
  }

  getAsync = async (url, headersJson, callback) => {
    this.refreshMemory();
    const jsurl = this.getJSString(url);
    const jsHeadersJson = this.getJSString(headersJson);
    const headers = {};
    try {
      headers = JSON.parse(jsHeadersJson);
    } catch (error) {
    }
    const response = await fetch(jsurl, {
      method: 'GET',
      headers,
    });
    const data = new Uint8Array(await response.arrayBuffer());
    const len = data.byteLength;
    const result = this.allocMem(len);
    const dataMap = new Uint8Array(this.instance.memory.buffer, result, len);
    dataMap.set(data);
    this.instance.ExecuteAsyncResponse(callback, result, len);
  }
};
