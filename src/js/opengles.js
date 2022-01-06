import {
  pcharToJSString,
} from './utils';

export function OpenGLES(gl) {
  let view = null;
  let moduleInstanceExports = null;
  const objHeap = new Array(1024 * 64);
  objHeap[0] = null; // Avoid using this slot
  const uniformLocationHeap = new Array(1024 * 64);
  let uniformLocationPtr = 0;

  function getEmptyHandle() {
    for (let i = 1; i < objHeap.length; i++){
      if (objHeap[i] === undefined) {
        return i;
      }
    }
    return 0;
  }

  function createHandle(obj) {
    const handle = getEmptyHandle();
    if (handle === 0) {
      return handle;
    }
    objHeap[handle] = obj;
    return handle;
  }

  function releaseHandle(handle) {
    if (handle === 0) {
      return null;
    }
    const obj = objHeap[handle];
    objHeap[handle] = undefined;
    return obj;
  }

  function findHandle(obj) {
    for (let i = 0; i < objHeap.length; i++) {
      if (objHeap[i] === obj) {
        return i;
      }
    }
    return 0;
  }

  function getUniformLocationHandle(obj) {
    // FIXME: Seems like WebGL return different WebGLUniformLocation object everytime getUniformLocation is called
    /*for (let i = 1; i < uniformLocationPtr; i++) {
      if (uniformLocationHeap[i] === obj) {
        return i;
      }
    }*/
    uniformLocationPtr = uniformLocationPtr + 1;
    return uniformLocationPtr;
  }

  function createUniformLocationHandle(obj) {
    const handle = getUniformLocationHandle(obj);
    uniformLocationHeap[handle] = obj;
    return handle;
  }

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

  // OpenGL ES 2.0
  function glActiveTexture(texture) {
    gl.activeTexture(texture);
  }

  function glAttachShader(progHandle, shaderHandle) {
    const shader = objHeap[shaderHandle];
    const prog = objHeap[progHandle];
    gl.attachShader(prog, shader);
  }

  function glBindAttribLocation(handle, indx, name) {
    refreshMemory();
    const s = pcharToJSString(view, moduleInstanceExports.memory.buffer, name);
    gl.bindAttribLocation(objHeap[handle], indx, s);
  }

  function glBindBuffer(target, handle) {
    gl.bindBuffer(target, objHeap[handle]);
  }

  function glBindFramebuffer(target, handle) {
    gl.bindFramebuffer(target, objHeap[handle]);
  }

  function glBindRenderbuffer(target, handle) {
    gl.bindRenderbuffer(target, objHeap[handle]);
  }

  function glBindTexture(target, handle) {
    gl.bindTexture(target, objHeap[handle]);
  }

  function glBlendColor(red, green, blue, alpha) {
    gl.blendColor(red, green, blue, alpha);
  }

  function glBlendEquation(mode) {
    gl.blendEquation(mode);
  }

  function glBlendEquationSeparate(modeRGB, modeAlpha) {
    gl.blendEquationSeparate(modeRGB, modeAlpha);
  }

  function glBlendFunc(sfactor, dfactor) {
    gl.blendFunc(sfactor, dfactor);
  }

  function glBlendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
  }

  function glCheckFramebufferStatus(target) {
    return gl.checkFramebufferStatus(target);
  }

  function glBufferData(target, size, data, usage) {
    refreshMemory();
    const buf = new Uint8Array(moduleInstanceExports.memory.buffer, data, size);
    gl.bufferData(target, buf, usage);
  }

  function glBufferSubData(target, offset, size, data) {
    refreshMemory();
    const buf = new Uint8Array(moduleInstanceExports.memory.buffer, data, size);
    gl.bufferSubData(target, offset, buf);
  }

  function glClear(mask) {
    gl.clear(mask);
  }

  function glClearColor(red, green, blue, alpha) {
    gl.clearColor(red, green, blue, alpha);
  }

  function glClearDepth(depth) {
    gl.clearDepth(depth);
  }

  function glClearStencil(s) {
    gl.clearStencil(s);
  }

  function glColorMask(red, green, blue, alpha) {
    gl.colorMask(red, green, blue, alpha);
  }

  function glCompileShader(handle) {
    gl.compileShader(objHeap[handle]);
  }

  function glCompressedTexImage2D(target, level, internalformat, x, y, width, height, border, imageSize, data) {
    refreshMemory();
    const buf = new Uint8Array(moduleInstanceExports.memory.buffer, data, imageSize);
    gl.compressedTexImage2D(target, level, internalformat, x, y, width, height, border, buf);
  }

  function glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
    refreshMemory();
    const buf = new Uint8Array(moduleInstanceExports.memory.buffer, data, imageSize);
    gl.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, buf);
  }

  function glCopyTexImage2D(target, level, internalformat, x, y, width, height, border) {
    gl.copyTexImage2D(target, level, internalformat, x, y, width, height, border);
  }

  function glCopyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height) {
    gl.copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height);
  }

  function glCreateProgram() {
    return createHandle(gl.createProgram());
  }

  function glCreateShader(shaderType) {
    return createHandle(gl.createShader(shaderType));
  }

  function glCullFace(mode) {
    return gl.cullFace(mode);
  }

  function glDeleteBuffers(n, buffers) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      gl.deleteBuffer(releaseHandle(view.getUint32(buffers + i * 4)));
    }
  }

  function glDeleteFramebuffers(n, framebuffers) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      gl.deleteFramebuffer(releaseHandle(view.getUint32(framebuffers + i * 4)));
    }
  }

  function glDeleteProgram(handle) {
    gl.deleteProgram(releaseHandle(handle));
  }

  function glDeleteRenderbuffers(n, renderbuffers) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      gl.deleteRenderbuffer(releaseHandle(view.getUint32(renderbuffers + i * 4)));
    }
  }

  function glDeleteShader(handle) {
    gl.deleteShader(releaseHandle(handle));
  }

  function glDeleteTextures(n, textures) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      gl.deleteRenderbuffer(releaseHandle(view.getUint32(textures + i * 4)));
    }
  }

  function glDepthFunc(func) {
    gl.depthFunc(func);
  }

  function glDepthMask(flag) {
    gl.depthMask(flag);
  }

  function glDepthRangef(zNear, zFar) {
    gl.depthRange(zNear, zFar);
  }

  function glDetachShader(handleProg, handleShader) {
    gl.detachShader(objHeap[handleProg], objHeap[handleShader]);
  }

  function glDisable(cap) {
    gl.disable(cap);
  }

  function glDisableVertexAttribArray(indx) {
    gl.disableVertexAttribArray(indx);
  }

  function glDrawArrays(mode, first, count) {
    gl.drawArrays(mode, first, count);
  }

  function glDrawElements(mode, count, _type, indices) {
    gl.drawElements(mode, count, _type, indices);
  }

  function glEnable(cap) {
    gl.enable(cap);
  }

  function glEnableVertexAttribArray(indx) {
    gl.enableVertexAttribArray(indx);
  }

  function glFinish() {
    gl.finish();
  }

  function glFlush() {
    gl.flush();
  }

  function glFramebufferRenderbuffer(target, attachment, renderbuffertarget, handleRenderbuffer) {
    gl.framebufferRenderbuffer(target, attachment, renderbuffertarget, objHeap[handleRenderbuffer]);
  }

  function glFramebufferTexture2D(target, attachment, textarget, textureHandle, level) {
    gl.framebufferTexture2D(target, attachment, textarget, objHeap[textureHandle], level);
  }

  function glFrontFace(mode) {
    gl.frontFace(mode);
  }

  function glGenerateMipmap(target) {
    gl.generateMipmap(mode);
  }

  function glGenBuffers(n, buffers) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = gl.createBuffer();
      view.setUint32(buffers + i * 4, createHandle(buf), true);
    }
  }

  function glGenFramebuffers(n, framebuffers) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = gl.createFramebuffer();
      view.setUint32(framebuffers + i * 4, createHandle(buf), true);
    }
  }

  function glGenRenderbuffers(n, renderbuffers) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = gl.createRenderbuffer();
      view.setUint32(renderbuffers + i * 4, createHandle(buf), true);
    }
  }

  function glGenTextures(n, textures) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = gl.createTexture();
      view.setUint32(textures + i * 4, createHandle(buf), true);
    }
  }

  function glGetActiveAttrib(handleProg, indx, bufsize, length, size, _type, name) {
    refreshMemory();
    const info = gl.getActiveAttrib(objHeap[handleProg], indx);
    if (info) {
      const bytesArray = new TextEncoder().encode(info.name);
      const max = Math.min(bufsize, bytesArray.byteLength);
      for (let i = 0; i < max; i++) {
        view.setUint8(name + i, bytesArray[i]);
      }
      view.setUint32(length, max, true);
      view.setUint32(size, info.size, true);
      view.setUint32(_type, info.type, true);
    } else {
      view.setUint32(length, 0, true);
    }
  }

  function glGetActiveUniform(handleProg, indx, bufsize, length, size, _type, name) {
    refreshMemory();
    const info = gl.getActiveUniform(objHeap[handleProg], indx);
    if (info) {
      const bytesArray = new TextEncoder().encode(info.name);
      const max = Math.min(bufsize, bytesArray.byteLength);
      for (let i = 0; i < max; i++) {
        view.setUint8(name + i, bytesArray[i]);
      }
      view.setUint32(length, max, true);
      view.setUint32(size, info.size, true);
      view.setUint32(_type, info.type, true);
    } else {
      view.setUint32(length, 0, true);
    }
  }

  function glGetAttachedShaders(handleProg, maxcount, count, shaders) {
    refreshMemory();
    const shadersArray = gl.getAttachedShaders(objHeap[handleProg]);
    const max = Math.min(maxcount, shadersArray.length);
    for (let i = 0; i < max; i++) {
      const handle = findHandle(shadersArray[i]);
      view.setUint32(shaders + i * 4, handle, true);
    }
    view.setUint32(count, max, true);
  }

  function glGetAttribLocation(handle, name) {
    refreshMemory();
    const s = pcharToJSString(view, moduleInstanceExports.memory.buffer, name);
    const prog = objHeap[handle];
    return gl.getAttribLocation(prog, s);
  }

  function glGetBooleanv(pname, params) {
    refreshMemory();
    const result = gl.getParameter(pname);
    if (!result.length) {
      view.setUint32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setUint32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetBufferParameteriv(handle, pname, params) {
    refreshMemory();
    const result = gl.getBufferParameter(objHeap[handle], pname);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetError() {
    return gl.getError();
  }

  function glGetFloatv(pname, params) {
    refreshMemory();
    const result = gl.getParameter(pname);
    if (!result.length) {
      view.setFloat32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setFloat32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
    refreshMemory();
    const result = gl.getFramebufferAttachmentParameter(target, attachment, pname);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetIntegerv(pname, params) {
    refreshMemory();
    const result = gl.getParameter(pname);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetProgramiv(handleProg, pname, params) {
    refreshMemory();
    const result = gl.getProgramParameter(objHeap[handleProg], pname);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetProgramInfoLog(handle, maxLength, length, infoLog) {
    refreshMemory();
    const s = gl.getProgramInfoLog(objHeap[handle]);
    const bytesArray = new TextEncoder().encode(s);
    const max = Math.min(maxLength, bytesArray.byteLength);
    for (let i = 0; i < max; i++) {
      view.setUint8(infoLog + i, bytesArray[i]);
    }
    view.setUint32(length, max, true);
  }

  function glGetRenderbufferParameteriv(target, pname, params) {
    refreshMemory();
    const result = gl.getRenderbufferParameter(target, pname);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetShaderiv(handle, pname, params) {
    refreshMemory();
    const result = gl.getShaderParameter(objHeap[handle], pname);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetShaderPrecisionFormat(shadertype, precisiontype, range, precision) {
    refreshMemory();
    const info = gl.getShaderPrecisionFormat(shadertype, precisiontype);
    if (info) {
      view.setInt32(range, info.rangeMax, true);
      view.setInt32(precision, info.precision, true);
    }
  }

  function glGetShaderInfoLog(handle, maxLength, length, infoLog) {
    refreshMemory();
    const s = gl.getShaderInfoLog(objHeap[handle]);
    const bytesArray = new TextEncoder().encode(s);
    const max = Math.min(maxLength, bytesArray.byteLength);
    for (let i = 0; i < max; i++) {
      view.setUint8(infoLog + i, bytesArray[i]);
    }
    view.setUint32(length, max, true);
  }

  function glGetShaderSource(handle, bufsize, length, source) {
    refreshMemory();
    const s = gl.getShaderSource(objHeap[handle]);
    const bytesArray = new TextEncoder().encode(s);
    const max = Math.min(bufsize, bytesArray.byteLength);
    for (let i = 0; i < max; i++) {
      view.setUint8(source + i, bytesArray[i]);
    }
    view.setUint32(length, max, true);
  }

  function glGetString(name, buf) {
    refreshMemory();
    const s = gl.getParameter(name);
    const bytesArray = new TextEncoder().encode(s);
    for (let i = 0; i < bytesArray.byteLength; i++) {
      view.setUint8(buf + i, bytesArray[i]);
    }
    view.setUint8(buf + bytesArray.byteLength, 0);
  }

  function glGetTexParameterfv(target, pname, params) {
    refreshMemory();
    const result = gl.getTexParameter(target, pname);
    if (!result.length) {
      view.setFloat32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setFloat32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetTexParameteriv(target, pname, params) {
    refreshMemory();
    const result = gl.getTexParameter(target, pname);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetUniformfv(handle, location, params) {
    refreshMemory();
    const result = gl.getUniform(objHeap[handle], location);
    if (!result.length) {
      view.setFloat32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setFloat32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetUniformiv(handle, location, params) {
    refreshMemory();
    const result = gl.getUniform(objHeap[handle], location);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetUniformLocation(handle, name) {
    refreshMemory();
    const s = pcharToJSString(view, moduleInstanceExports.memory.buffer, name);
    return createUniformLocationHandle(gl.getUniformLocation(objHeap[handle], s));
  }

  function glGetVertexAttribfv(indx, pname, params) {
    refreshMemory();
    const result = gl.getVertexAttrib(indx, pname);
    if (!result.length) {
      view.setFloat32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setFloat32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetVertexAttribiv(indx, pname, params) {
    refreshMemory();
    const result = gl.getVertexAttrib(indx, pname);
    if (!result.length) {
      view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  function glGetVertexAttribPointerv(indx, pname, params) {
    refreshMemory();
    const result = gl.getVertexAttrib(indx, pname);
    if (!result.length) {
      view.setUint32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        view.setUint32(params + i * 4, result[i], true);
      }
    }
  }

  function glHint(target, mode) {
    gl.hint(target, mode);
  }

  function glIsBuffer(handle) {
    return gl.isBuffer(objHeap[handle]);
  }

  function glIsEnabled(cap) {
    return gl.isEnabled(cap);
  }

  function glIsFramebuffer(handle) {
    return gl.isFramebuffer(objHeap[handle]);
  }

  function glIsProgram(handle) {
    return gl.isProgram(objHeap[handle]);
  }

  function glIsRenderbuffer(handle) {
    return gl.isRenderbuffer(objHeap[handle]);
  }

  function glIsShader(handle) {
    return gl.isShader(objHeap[handle]);
  }

  function glIsTexture(handle) {
    return gl.isTexture(objHeap[handle]);
  }

  function glLineWidth(width) {
    gl.lineWidth(width);
  }

  function glLinkProgram(handle) {
    gl.linkProgram(objHeap[handle]);
  }

  function glPixelStorei(pname, param) {
    gl.pixelStorei(pname, param);
  }

  function glPolygonOffset(factor, units) {
    gl.polygonOffset(factor, units);
  }

  function glReadPixels(x, y, width, height, format, type, pixels) {
    refreshMemory();
    const buf = new Uint8Array(moduleInstanceExports.memory.buffer, pixels, width * height * 4);
    gl.readPixels(x, y, width, height, format, type, buf);
  }

  function glRenderbufferStorage(target, internalformat, width, height) {
    gl.renderbufferStorage(target, internalformat, width, height);
  }

  function glSampleCoverage(value, invert) {
    gl.sampleCoverage(value, invert);
  }

  function glScissor(x, y, width, height) {
    gl.scissor(x, y, width, height);
  }

  function glShaderSource(handle, count, sources, lengths) {
    refreshMemory();
    for (let i = 0; i < count; i++) {
      const shader = objHeap[handle];
      const source = view.getUint32(sources + i * 4, true);
      const len = view.getUint32(lengths + i * 4, true);
      const s = pcharToJSString(view, moduleInstanceExports.memory.buffer, source, len);
      gl.shaderSource(shader, s);
    }
  }

  function glStencilFunc(func, ref, mask) {
    gl.stencilFunc(func, ref, mask);
  }

  function glStencilFuncSeparate(face, func, ref, mask) {
    gl.stencilFuncSeparate(face, func, ref, mask);
  }

  function glStencilMask(mask) {
    gl.stencilMask(mask);
  }

  function glStencilMaskSeparate(face, mask) {
    gl.stencilMaskSeparate(face, mask);
  }

  function glStencilOp(fail, zfail, zpass) {
    gl.stencilOp(fail, zfail, zpass);
  }

  function glStencilOpSeparate(face, fail, zfail, zpass) {
    gl.stencilOpSeparate(face, fail, zfail, zpass);
  }

  function glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels) {
    refreshMemory();
    let size = 4;
    switch (internalFormat) {
      case gl.RGBA:
        size = 4; break;
      case gl.RGB:
        size = 3; break;
      case gl.LUMINANCE_ALPHA:
        size = 2; break;
      case gl.LUMINANCE:
      case gl.ALPHA:
        size = 1; break;
      default:
        size = 4;
    }
    const buf = new Uint8Array(moduleInstanceExports.memory.buffer, pixels, width * height * size);
    gl.texImage2D(target, level, internalformat, width, height, border, format, type, buf);
  }

  function glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    refreshMemory();
    let size = 4;
    switch (internalFormat) {
      case gl.RGBA:
        size = 4; break;
      case gl.RGB:
        size = 3; break;
      case gl.LUMINANCE_ALPHA:
        size = 2; break;
      case gl.LUMINANCE:
      case gl.ALPHA:
        size = 1; break;
      default:
        size = 4;
    }
    const buf = new Uint8Array(moduleInstanceExports.memory.buffer, pixels, width * height * size);
    gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, buf);
  }

  function glTexParameterf(target, pname, param) {
    gl.texParameterf(target, pname, param);
  }

  function glTexParameteri(target, pname, param) {
    gl.texParameteri(target, pname, param);
  }

  function glUniform1f(handle, x) {
    gl.uniform1f(uniformLocationHeap[handle], x,);
  }

  function glUniform2f(handle, x, y) {
    gl.uniform2f(uniformLocationHeap[handle], x, y);
  }

  function glUniform3f(handle, x, y, z) {
    gl.uniform3f(uniformLocationHeap[handle], x, y, z);
  }

  function glUniform4f(handle, x, y, z, w) {
    gl.uniform4f(uniformLocationHeap[handle], x, y, z, w);
  }

  function glUniform1i(handle, x) {
    gl.uniform1i(uniformLocationHeap[handle], x,);
  }

  function glUniform2i(handle, x, y) {
    gl.uniform2i(uniformLocationHeap[handle], x, y);
  }

  function glUniform3i(handle, x, y, z) {
    gl.uniform3i(uniformLocationHeap[handle], x, y, z);
  }

  function glUniform4i(handle, x, y, z, w) {
    gl.uniform4i(uniformLocationHeap[handle], x, y, z, w);
  }

  function glUniform1fv(handle, count, v) {
    refreshMemory();
    const buf = new Float32Array(moduleInstanceExports.memory.buffer, v, count);
    gl.uniform1fv(uniformLocationHeap[handle], buf);
  }

  function glUniform2fv(handle, count, v) {
    refreshMemory();
    const buf = new Float32Array(moduleInstanceExports.memory.buffer, v, count * 2);
    gl.uniform2fv(uniformLocationHeap[handle], buf);
  }

  function glUniform3fv(handle, count, v) {
    refreshMemory();
    const buf = new Float32Array(moduleInstanceExports.memory.buffer, v, count * 3);
    gl.uniform3fv(uniformLocationHeap[handle], buf);
  }

  function glUniform4fv(handle, count, v) {
    refreshMemory();
    const buf = new Float32Array(moduleInstanceExports.memory.buffer, v, count * 4);
    gl.uniform4fv(uniformLocationHeap[handle], buf);
  }

  function glUniform1iv(handle, count, v) {
    refreshMemory();
    const buf = new Int32Array(moduleInstanceExports.memory.buffer, v, count);
    gl.uniform1iv(uniformLocationHeap[handle], buf);
  }

  function glUniform2iv(handle, count, v) {
    refreshMemory();
    const buf = new Int32Array(moduleInstanceExports.memory.buffer, v, count * 2);
    gl.uniform2iv(uniformLocationHeap[handle], buf);
  }

  function glUniform3iv(handle, count, v) {
    refreshMemory();
    const buf = new Int32Array(moduleInstanceExports.memory.buffer, v, count * 3);
    gl.uniform3iv(uniformLocationHeap[handle], buf);
  }

  function glUniform4iv(handle, count, v) {
    refreshMemory();
    const buf = new Int32Array(moduleInstanceExports.memory.buffer, v, count * 4);
    gl.uniform4iv(uniformLocationHeap[handle], buf);
  }

  function glUniformMatrix2fv(handle, count, transpose, v) {
    refreshMemory();
    for (let i = 0; i < count; i++) {
      const buf = new Float32Array(moduleInstanceExports.memory.buffer, v + i * 8 * 8, 2 * 2);
      gl.uniformMatrix2fv(uniformLocationHeap[handle], transpose, buf);
    }
  }

  function glUniformMatrix3fv(handle, count, transpose, v) {
    refreshMemory();
    for (let i = 0; i < count; i++) {
      const buf = new Float32Array(moduleInstanceExports.memory.buffer, v + i * 12 * 12, 3 * 3);
      gl.uniformMatrix3fv(uniformLocationHeap[handle], transpose, buf);
    }
  }

  function glUniformMatrix4fv(handle, count, transpose, v) {
    refreshMemory();
    for (let i = 0; i < count; i++) {
      const buf = new Float32Array(moduleInstanceExports.memory.buffer, v + i * 16 * 16, 4 * 4);
      gl.uniformMatrix4fv(uniformLocationHeap[handle], transpose, buf);
    }
  }

  function glUseProgram(handle) {
    gl.useProgram(objHeap[handle]);
  }

  function glVertexAttrib1f(index, x) {
    gl.vertexAttrib1f(index, x);
  }

  function glVertexAttrib2f(index, x, y) {
    gl.vertexAttrib2f(index, x, y);
  }

  function glVertexAttrib3f(index, x, y, z) {
    gl.vertexAttrib3f(index, x, y, z);
  }

  function glVertexAttrib4f(index, x, y, z, w) {
    gl.vertexAttrib4f(index, x, y, z, w);
  }

  function glVertexAttrib1fv(index, v) {
    refreshMemory();
    const buf = new Float32Array(moduleInstanceExports.memory.buffer, v, 1);
    gl.vertexAttrib1fv(index, buf);
  }

  function glVertexAttrib2fv(index, v) {
    refreshMemory();
    const buf = new Float32Array(moduleInstanceExports.memory.buffer, v, 2);
    gl.vertexAttrib2fv(index, buf);
  }

  function glVertexAttrib3fv(index, v) {
    refreshMemory();
    const buf = new Float32Array(moduleInstanceExports.memory.buffer, v, 3);
    gl.vertexAttrib3fv(index, buf);
  }

  function glVertexAttrib4fv(index, v) {
    refreshMemory();
    const buf = new Float32Array(moduleInstanceExports.memory.buffer, v, 4);
    gl.vertexAttrib4fv(index, buf);
  }

  function glVertexAttribPointer(indx, size, _type, normalized, stride, ptr) {
    gl.vertexAttribPointer(indx, size, _type, normalized, stride, ptr);
  }

  function glViewport(x, y, width, height) {
    gl.viewport(x, y, width, height);
  }

  // OpenGL ES 3.0
  function glGenVertexArrays(n, va) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = gl.createVertexArray();
      view.setUint32(va + i * 4, createHandle(buf), true);
    }
  }

  function glDeleteVertexArrays(n, va) {
    refreshMemory();
    for (let i = 0; i < n; i++) {
      gl.deleteRenderbuffer(releaseHandle(view.getUint32(va + i * 4)));
    }
  }

  function glBindVertexArray(handle) {
    gl.bindVertexArray(objHeap[handle]);
  }

  function glBindBufferBase(target, index, handle) {
    gl.bindBufferBase(target, index, objHeap[handle]);
  }

  function glBeginTransformFeedback(mode) {
    gl.beginTransformFeedback(mode);
  }

  function glEndTransformFeedback() {
    gl.endTransformFeedback(mode);
  }

  function glTransformFeedbackVaryings(handle, count, varyings, mode) {
    refreshMemory();
    const strings = new Array(count);
    for (let i = 0; i < count; i++) {
      const sptr = view.getUint32(varyings + i * 4, true);
      const s = pcharToJSString(view, moduleInstanceExports.memory.buffer, sptr);
      strings[i] = s;
    }
    gl.transformFeedbackVaryings(objHeap[handle], strings, mode);
  }

  function glDrawArraysInstanced(mode, first, count, instanceCount) {
    gl.drawArraysInstanced(mode, first, count, instanceCount);
  }

  function glDrawElementsInstanced(mode, count, type, offset, instanceCount) {
    gl.drawElementsInstanced(mode, count, type, offset, instanceCount);
  }

  return {
    setModuleInstance: setModuleInstance,
    //
    glActiveTexture: glActiveTexture,
    glAttachShader: glAttachShader,
    glBindAttribLocation: glBindAttribLocation,
    glBindBuffer: glBindBuffer,
    glBindFramebuffer: glBindFramebuffer,
    glBindRenderbuffer: glBindRenderbuffer,
    glBindTexture: glBindTexture,
    glBlendColor: glBlendColor,
    glBlendEquation: glBlendEquation,
    glBlendEquationSeparate: glBlendEquationSeparate,
    glBlendFunc: glBlendFunc,
    glBlendFuncSeparate: glBlendFuncSeparate,
    glBufferData: glBufferData,
    glBufferSubData: glBufferSubData,
    glCheckFramebufferStatus: glCheckFramebufferStatus,
    glClear: glClear,
    glClearColor: glClearColor,
    glClearDepth: glClearDepth,
    glClearStencil: glClearStencil,
    glColorMask: glColorMask,
    glCompileShader: glCompileShader,
    glCompressedTexImage2D: glCompressedTexImage2D,
    glCompressedTexSubImage2D: glCompressedTexSubImage2D,
    glCopyTexImage2D: glCopyTexImage2D,
    glCopyTexSubImage2D: glCopyTexSubImage2D,
    glCreateProgram: glCreateProgram,
    glCreateShader: glCreateShader,
    glCullFace: glCullFace,
    glDeleteBuffers: glDeleteBuffers,
    glDeleteFramebuffers: glDeleteFramebuffers,
    glDeleteProgram: glDeleteProgram,
    glDeleteRenderbuffers: glDeleteRenderbuffers,
    glDeleteShader: glDeleteShader,
    glDeleteTextures: glDeleteTextures,
    glDepthFunc: glDepthFunc,
    glDepthMask: glDepthMask,
    glDepthRangef: glDepthRangef,
    glDetachShader: glDetachShader,
    glDisable: glDisable,
    glDisableVertexAttribArray: glDisableVertexAttribArray,
    glDrawArrays: glDrawArrays,
    glDrawElements: glDrawElements,
    glEnable: glEnable,
    glEnableVertexAttribArray: glEnableVertexAttribArray,
    glFinish: glFinish,
    glFlush: glFlush,
    glFramebufferRenderbuffer: glFramebufferRenderbuffer,
    glFramebufferTexture2D: glFramebufferTexture2D,
    glFrontFace: glFrontFace,
    glGenerateMipmap: glGenerateMipmap,
    glGenBuffers: glGenBuffers,
    glGenFramebuffers: glGenFramebuffers,
    glGenRenderbuffers: glGenRenderbuffers,
    glGenTextures: glGenTextures,
    glGetActiveAttrib: glGetActiveAttrib,
    glGetActiveUniform: glGetActiveUniform,
    glGetAttachedShaders: glGetAttachedShaders,
    glGetAttribLocation: glGetAttribLocation,
    glGetBooleanv: glGetBooleanv,
    glGetBufferParameteriv: glGetBufferParameteriv,
    glGetError: glGetError,
    glGetFloatv: glGetFloatv,
    glGetFramebufferAttachmentParameteriv: glGetFramebufferAttachmentParameteriv,
    glGetIntegerv: glGetIntegerv,
    glGetProgramiv: glGetProgramiv,
    glGetProgramInfoLog: glGetProgramInfoLog,
    glGetRenderbufferParameteriv: glGetRenderbufferParameteriv,
    glGetShaderiv: glGetShaderiv,
    glGetShaderPrecisionFormat: glGetShaderPrecisionFormat,
    glGetShaderInfoLog: glGetShaderInfoLog,
    glGetShaderSource: glGetShaderSource,
    glGetString: glGetString,
    glGetTexParameterfv: glGetTexParameterfv,
    glGetTexParameteriv: glGetTexParameteriv,
    glGetUniformfv: glGetUniformfv,
    glGetUniformiv: glGetUniformiv,
    glGetUniformLocation: glGetUniformLocation,
    glGetVertexAttribfv: glGetVertexAttribfv,
    glGetVertexAttribiv: glGetVertexAttribiv,
    glGetVertexAttribPointerv: glGetVertexAttribPointerv,
    glHint: glHint,
    glIsBuffer: glIsBuffer,
    glIsEnabled: glIsEnabled,
    glIsFramebuffer: glIsFramebuffer,
    glIsProgram: glIsProgram,
    glIsRenderbuffer: glIsRenderbuffer,
    glIsShader: glIsShader,
    glIsTexture: glIsTexture,
    glLineWidth: glLineWidth,
    glLinkProgram: glLinkProgram,
    glPixelStorei: glPixelStorei,
    glPolygonOffset: glPolygonOffset,
    glReadPixels: glReadPixels,
    glRenderbufferStorage: glRenderbufferStorage,
    glSampleCoverage: glSampleCoverage,
    glScissor: glScissor,
    glShaderSource: glShaderSource,
    glStencilFunc: glStencilFunc,
    glStencilFuncSeparate: glStencilFuncSeparate,
    glStencilMask: glStencilMask,
    glStencilMaskSeparate: glStencilMaskSeparate,
    glStencilOp: glStencilOp,
    glStencilOpSeparate: glStencilOpSeparate,
    glTexImage2D: glTexImage2D,
    glTexSubImage2D: glTexSubImage2D,
    glTexParameterf: glTexParameterf,
    glTexParameteri: glTexParameteri,
    glUniform1f: glUniform1f,
    glUniform2f: glUniform2f,
    glUniform3f: glUniform3f,
    glUniform4f: glUniform4f,
    glUniform1i: glUniform1i,
    glUniform2i: glUniform2i,
    glUniform3i: glUniform3i,
    glUniform4i: glUniform4i,
    glUniform1fv: glUniform1fv,
    glUniform2fv: glUniform2fv,
    glUniform3fv: glUniform3fv,
    glUniform4fv: glUniform4fv,
    glUniform1iv: glUniform1iv,
    glUniform2iv: glUniform2iv,
    glUniform3iv: glUniform3iv,
    glUniform4iv: glUniform4iv,
    glUniformMatrix2fv: glUniformMatrix2fv,
    glUniformMatrix3fv: glUniformMatrix3fv,
    glUniformMatrix4fv: glUniformMatrix4fv,
    glUseProgram: glUseProgram,
    glVertexAttrib1f: glVertexAttrib1f,
    glVertexAttrib2f: glVertexAttrib2f,
    glVertexAttrib3f: glVertexAttrib3f,
    glVertexAttrib4f: glVertexAttrib4f,
    glVertexAttrib1fv: glVertexAttrib1fv,
    glVertexAttrib2fv: glVertexAttrib2fv,
    glVertexAttrib3fv: glVertexAttrib3fv,
    glVertexAttrib4fv: glVertexAttrib4fv,
    glVertexAttribPointer: glVertexAttribPointer,
    glViewport: glViewport,
    //
    glGenVertexArrays: glGenVertexArrays,
    glDeleteVertexArrays: glDeleteVertexArrays,
    glBindVertexArray: glBindVertexArray,
    glBindBufferBase: glBindBufferBase,
    glBeginTransformFeedback: glBeginTransformFeedback,
    glEndTransformFeedback: glEndTransformFeedback,
    glTransformFeedbackVaryings: glTransformFeedbackVaryings,
    glDrawArraysInstanced: glDrawArraysInstanced,
    glDrawElementsInstanced: glDrawElementsInstanced,
  };
};
