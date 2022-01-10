import { WASI } from './wasi';
import { OpenGLES } from './opengles';
import { FPHTTPClient } from './fphttpclient';

function main() {
  const menu = document.createElement('div');
  menu.style.width = '100vw';
  menu.style.display = 'flex';
  menu.style.flexDirection = 'row';
  menu.style.justifyContent = 'center';
  menu.style.margin = '8px';
  document.body.appendChild(menu);

  const main = document.createElement('div');
  main.style.width = '100vw';
  main.style.height = 'calc(100vh - 64px)';
  main.style.display = 'flex';
  main.style.flexDirection = 'row';
  main.style.justifyContent = 'center';
  document.body.appendChild(main);

  const canvas = document.createElement('canvas');
  canvas.width = main.offsetHeight;
  canvas.height = main.offsetHeight;
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
  const fphttpclient = new FPHTTPClient();
  const importModule = {
    wasi_snapshot_preview1: wasi,
    opengles,
    fphttpclient,
  };

  (async () => {
    const result = await WebAssembly.instantiateStreaming(fetch('app.wasm'), importModule);
    wasi.setModuleInstance(result.instance);
    opengles.setModuleInstance(result.instance);
    fphttpclient.setModuleInstance(result.instance);
    result.instance.exports._start();

    function button(name, func) {
      const btn = document.createElement('button');
      btn.innerHTML = name;
      btn.style.margin = '0 4px 0 4px';
      btn.onclick = () => {
        result.instance.exports[func]();
        result.instance.exports.EventResize(canvas.offsetWidth, canvas.offsetHeight);
        const loop = () => {
          result.instance.exports.Run();
          window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
      };
      menu.appendChild(btn);
    }
    button('Rotate triangle', 'InitTestTriangle');
    button('Texture quad', 'InitTestTextureQuad');
    button('Filesystem', 'InitTestFilesystem');
    button('FPHTTPClient', 'InitFPHTTPClient');
  })();
}

window.onload = main;
