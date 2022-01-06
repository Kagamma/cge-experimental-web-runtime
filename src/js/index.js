import { WASI } from './wasi';
import { OpenGLES } from './opengles';

function main() {
  const menu = document.createElement('div');
  menu.style.width = '100%';
  menu.style.display = 'flex';
  menu.style.flexDirection = 'row';
  menu.style.justifyContent = 'center';
  menu.style.margin = '8px';
  document.body.appendChild(menu);

  const main = document.createElement('div');
  main.style.width = '100%';
  main.style.display = 'flex';
  main.style.flexDirection = 'row';
  main.style.justifyContent = 'center';
  document.body.appendChild(main);

  const canvas = document.createElement('canvas');
  canvas.width = '640';
  canvas.height = '480';
  canvas.id = 'webgl-canvas';
  main.appendChild(canvas);

  let gl = null;
  try {
    gl = canvas.getContext('webgl2');
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

    const buttonTriangleTest = document.createElement('button');
    buttonTriangleTest.innerHTML = 'Render rotate triangle';
    buttonTriangleTest.style.margin = '0 4px 0 4px';
    buttonTriangleTest.onclick = () => {
      result.instance.exports.InitTestTriangle();
      const loop = () => {
        result.instance.exports.Run();
        window.requestAnimationFrame(loop);
      };
      window.requestAnimationFrame(loop);
    };
    menu.appendChild(buttonTriangleTest);

    const buttonFilesystemTest = document.createElement('button');
    buttonFilesystemTest.innerHTML = 'Filesystem';
    buttonFilesystemTest.style.margin = '0 4px 0 4px';
    buttonFilesystemTest.onclick = () => {
      result.instance.exports.InitTestFilesystem();
      const loop = () => {
        result.instance.exports.Run();
        window.requestAnimationFrame(loop);
      };
      window.requestAnimationFrame(loop);
    };
    menu.appendChild(buttonFilesystemTest);
  })();
}

window.onload = main;
