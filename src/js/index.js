import { WASI } from './wasi';
import { OpenGLES } from './opengles';

function main() {
  const canvas = document.createElement('canvas');
  canvas.width = '640';
  canvas.height = '480';
  canvas.id = 'webgl-canvas';
  document.body.appendChild(canvas);

  let gl = null;
  try {
    gl = canvas.getContext('webgl');
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    console.log('WebGL context initialized.');
  } catch (e) {
    console.error('WebGL is not avaiable on your browser!');
  }

  const wasi = new WASI();
  const opengles = new OpenGLES(gl);
  const importModule = {
    wasi_snapshot_preview1: wasi,
    opengles: opengles,
  };

  (async () => {
    const result = await WebAssembly.instantiateStreaming(fetch('app.wasm'), importModule);
    wasi.setModuleInstance(result.instance);
    opengles.setModuleInstance(result.instance);
    result.instance.exports._start();
  })();
}

window.onload = main;
