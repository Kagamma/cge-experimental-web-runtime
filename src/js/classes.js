export class Object {
  constructor() {
    this.view = null;
    this.moduleInstanceExports = null;
  }

  refreshMemory = () => {
    if (!this.view || this.view.buffer.byteLength === 0) {
      this.view = new DataView(this.moduleInstanceExports.memory.buffer);
    }
  }

  setModuleInstance = (instance) => {
    this.moduleInstanceExports = instance.exports;
  }
}
