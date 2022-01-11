import { Object } from './classes';

export class FPHTTPClient extends Object{
  constructor() {
    super();
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
    }).catch(error => {
      return { ok: false, statusText: error.message, status: 600 }
    });
    const isOk = response.ok && response.status < 400;
    let data;
    if (isOk) {
      data = new Uint8Array(await response.arrayBuffer());
    } else {
      data = new Uint8Array(new TextEncoder().encode(response.statusText));
    }
    const len = data.byteLength;
    const result = this.allocMem(len);
    const dataMap = new Uint8Array(this.instance.memory.buffer, result, len);
    dataMap.set(data);
    this.instance.ExecuteAsyncHttpResponse(callback, response.status, result, len);
  }
};
