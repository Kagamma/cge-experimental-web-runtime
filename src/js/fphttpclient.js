import syncFetch from 'sync-fetch';
import { Object } from './classes';

export class FPHTTPClient extends Object{
  constructor() {
    super();
  }

  /**
   * Sync get
   * @param {*} url PChar, contain URL
   * @param {*} headersJson PChar, contain JSON string describe HTTP headers
   * @param {*} statusPtr PCardinal, return status
   * @param {*} dataPtr Pointer, return response data
   * @param {*} sizePtr PCardinal, return size of data
   */
  get = async (url, headersJson, statusPtr, dataPtr, sizePtr) => {
    this.refreshMemory();
    const jsurl = this.getJSString(url);
    const jsHeadersJson = this.getJSString(headersJson);
    const headers = {};
    try {
      headers = JSON.parse(jsHeadersJson);
    } catch (e) {
    }
    let response;
    try {
      response = syncFetch(jsurl, {
        method: 'GET',
        headers,
      });
    } catch (e) {
      response = { ok: false, statusText: e.message, status: 600 }
    }
    const isOk = response.ok && response.status < 400;
    let data;
    if (isOk) {
      data = new Uint8Array(response.arrayBuffer());
    } else {
      data = new Uint8Array(new TextEncoder().encode(response.statusText));
    }
    const len = data.byteLength;
    const result = this.allocMem(len);
    const dataMap = new Uint8Array(this.instance.memory.buffer, result, len);
    dataMap.set(data);
    this.view.setUint32(statusPtr, response.status, true);
    this.view.setUint32(dataPtr, result, true);
    this.view.setUint32(sizePtr, len, true);
  }

  /**
   * Async get
   * @param {*} url PChar, contain URL
   * @param {*} headersJson PChar, contain JSON string describe HTTP headers
   * @param {*} callback Uint64, pointer to a TAsyncHttpResponse
   */
  getAsync = async (url, headersJson, callback) => {
    this.refreshMemory();
    const jsurl = this.getJSString(url);
    const jsHeadersJson = this.getJSString(headersJson);
    const headers = {};
    try {
      headers = JSON.parse(jsHeadersJson);
    } catch (e) {
    }
    const response = await fetch(jsurl, {
      method: 'GET',
      headers,
    }).catch(e => {
      return { ok: false, statusText: e.message, status: 600 }
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
