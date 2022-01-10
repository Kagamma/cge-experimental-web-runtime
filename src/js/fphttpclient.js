export function FPHTTPClient() {
  let view = null;
  let moduleInstanceExports = null;

  // Private Helpers
  function refreshMemory() {
    if (!view || view.buffer.byteLength === 0) {
      view = new DataView(moduleInstanceExports.memory.buffer);
    }
  }

  // Public APIs
  function setModuleInstance(instance) {
    moduleInstanceExports = instance.exports;
  }

  return {
    setModuleInstance,
  };
}