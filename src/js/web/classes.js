import { pcharToJSString } from './utils';

export class Object {
  constructor() {
    this.view = null;
    this.instance = null;
  }

  refreshMemory = () => {
    if (!this.view || this.view.buffer.byteLength === 0) {
      this.view = new DataView(this.instance.memory.buffer);
    }
  }

  setModuleInstance = (inst) => {
    this.instance = inst.exports;
  }

  getJSString = (s, len = -1) => {
    return pcharToJSString(this.view, this.instance.memory.buffer, s, len);
  }

  allocMem = size => {
    const result = this.instance.AllocMem(size);
    this.refreshMemory();
    return result;
  }
}
