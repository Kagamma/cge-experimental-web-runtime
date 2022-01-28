import { Object } from './classes';
import { pcharToJSString } from './utils';

export class OpenGLES extends Object {
  constructor(gl) {
    super();
    this.gl = gl;
    // Store opened file this.handles
    this.objHeap = new Array(65536);
    this.objHeap[0] = null; // Avoid using this slot
    this.uniformLocationHeap = new Array(65536);
    this.uniformLocationPtr = 0;
  }

  // Private Helpers
  getEmptyHandle = () => {
    for (let i = 1; i < this.objHeap.length; i++){
      if (this.objHeap[i] === undefined) {
        return i;
      }
    }
    return 0;
  }

  createHandle = (obj) => {
    const handle = this.getEmptyHandle();
    if (handle === 0) {
      return handle;
    }
    this.objHeap[handle] = obj;
    return handle;
  }

  releaseHandle = (handle) => {
    if (handle === 0) {
      return null;
    }
    const obj = this.objHeap[handle];
    this.objHeap[handle] = undefined;
    return obj;
  }

  findHandle = (obj) => {
    for (let i = 0; i < this.objHeap.length; i++) {
      if (this.objHeap[i] === obj) {
        return i;
      }
    }
    return 0;
  }

  getUniformLocationHandle = (obj) => {
    // FIXME: Seems like WebGL return different WebGLUniformLocation object everytime getUniformLocation is called
    /*for (let i = 1; i < this.uniformLocationPtr; i++) {
      if (this.uniformLocationHeap[i] === obj) {
        return i;
      }
    }*/
    this.uniformLocationPtr = this.uniformLocationPtr + 1;
    return this.uniformLocationPtr;
  }

  createUniformLocationHandle = (obj) => {
    const handle = this.getUniformLocationHandle(obj);
    this.uniformLocationHeap[handle] = obj;
    return handle;
  }

  // Public APIs
  // OpenGL ES 2.0
  glActiveTexture = (texture) => {
    this.gl.activeTexture(texture);
  }

  glAttachShader = (progHandle, shaderHandle) => {
    const shader = this.objHeap[shaderHandle];
    const prog = this.objHeap[progHandle];
    this.gl.attachShader(prog, shader);
  }

  glBindAttribLocation = (handle, indx, name) => {
    this.refreshMemory();
    const s = this.getJSString(name);
    this.gl.bindAttribLocation(this.objHeap[handle], indx, s);
  }

  glBindBuffer = (target, handle) => {
    this.gl.bindBuffer(target, this.objHeap[handle]);
  }

  glBindFramebuffer = (target, handle) => {
    this.gl.bindFramebuffer(target, this.objHeap[handle]);
  }

  glBindRenderbuffer = (target, handle) => {
    this.gl.bindRenderbuffer(target, this.objHeap[handle]);
  }

  glBindTexture = (target, handle) => {
    this.gl.bindTexture(target, this.objHeap[handle]);
  }

  glBlendColor = (red, green, blue, alpha) => {
    this.gl.blendColor(red, green, blue, alpha);
  }

  glBlendEquation = (mode) => {
    this.gl.blendEquation(mode);
  }

  glBlendEquationSeparate = (modeRGB, modeAlpha) => {
    this.gl.blendEquationSeparate(modeRGB, modeAlpha);
  }

  glBlendFunc = (sfactor, dfactor) => {
    this.gl.blendFunc(sfactor, dfactor);
  }

  glBlendFuncSeparate = (srcRGB, dstRGB, srcAlpha, dstAlpha) => {
    this.gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
  }

  glCheckFramebufferStatus = (target) => {
    return this.gl.checkFramebufferStatus(target);
  }

  glBufferData = (target, size, data, usage) => {
    this.refreshMemory();
    const buf = new Uint8Array(this.instance.memory.buffer, data, size);
    this.gl.bufferData(target, buf, usage);
  }

  glBufferSubData = (target, offset, size, data) => {
    this.refreshMemory();
    const buf = new Uint8Array(this.instance.memory.buffer, data, size);
    this.gl.bufferSubData(target, offset, buf);
  }

  glClear = (mask) => {
    this.gl.clear(mask);
  }

  glClearColor = (red, green, blue, alpha) => {
    this.gl.clearColor(red, green, blue, alpha);
  }

  glClearDepth = (depth) => {
    this.gl.clearDepth(depth);
  }

  glClearStencil = (s) => {
    this.gl.clearStencil(s);
  }

  glColorMask = (red, green, blue, alpha) => {
    this.gl.colorMask(red, green, blue, alpha);
  }

  glCompileShader = (handle) => {
    this.gl.compileShader(this.objHeap[handle]);
  }

  glCompressedTexImage2D = (target, level, internalformat, width, height, border, imageSize, data) => {
    this.refreshMemory();
    const buf = new Uint8Array(this.instance.memory.buffer, data, imageSize);
    this.gl.compressedTexImage2D(target, level, internalformat, width, height, border, buf);
  }

  glCompressedTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, imageSize, data) => {
    this.refreshMemory();
    const buf = new Uint8Array(this.instance.memory.buffer, data, imageSize);
    this.gl.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, buf);
  }

  glCopyTexImage2D = (target, level, internalformat, x, y, width, height, border) => {
    this.gl.copyTexImage2D(target, level, internalformat, x, y, width, height, border);
  }

  glCopyTexSubImage2D = (target, level, xoffset, yoffset, x, y, width, height) => {
    this.gl.copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height);
  }

  glCreateProgram = () => {
    return this.createHandle(this.gl.createProgram());
  }

  glCreateShader = (shaderType) => {
    return this.createHandle(this.gl.createShader(shaderType));
  }

  glCullFace = (mode) => {
    return this.gl.cullFace(mode);
  }

  glDeleteBuffers = (n, buffers) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      this.gl.deleteBuffer(this.releaseHandle(this.view.getUint32(buffers + i * 4)));
    }
  }

  glDeleteFramebuffers = (n, framebuffers) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      this.gl.deleteFramebuffer(this.releaseHandle(this.view.getUint32(framebuffers + i * 4)));
    }
  }

  glDeleteProgram = (handle) => {
    this.gl.deleteProgram(this.releaseHandle(handle));
  }

  glDeleteRenderbuffers = (n, renderbuffers) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      this.gl.deleteRenderbuffer(this.releaseHandle(this.view.getUint32(renderbuffers + i * 4)));
    }
  }

  glDeleteShader = (handle) => {
    this.gl.deleteShader(this.releaseHandle(handle));
  }

  glDeleteTextures = (n, textures) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      this.gl.deleteRenderbuffer(this.releaseHandle(this.view.getUint32(textures + i * 4)));
    }
  }

  glDepthFunc = (func) => {
    this.gl.depthFunc(func);
  }

  glDepthMask = (flag) => {
    this.gl.depthMask(flag);
  }

  glDepthRangef = (zNear, zFar) => {
    this.gl.depthRange(zNear, zFar);
  }

  glDetachShader = (handleProg, handleShader) => {
    this.gl.detachShader(this.objHeap[handleProg], this.objHeap[handleShader]);
  }

  glDisable = (cap) => {
    this.gl.disable(cap);
  }

  glDisableVertexAttribArray = (indx) => {
    this.gl.disableVertexAttribArray(indx);
  }

  glDrawArrays = (mode, first, count) => {
    this.gl.drawArrays(mode, first, count);
  }

  glDrawElements = (mode, count, _type, indices) => {
    this.gl.drawElements(mode, count, _type, indices);
  }

  glEnable = (cap) => {
    this.gl.enable(cap);
  }

  glEnableVertexAttribArray = (indx) => {
    this.gl.enableVertexAttribArray(indx);
  }

  glFinish = () => {
    this.gl.finish();
  }

  glFlush = () => {
    this.gl.flush();
  }

  glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, handleRenderbuffer) => {
    this.gl.framebufferRenderbuffer(target, attachment, renderbuffertarget, this.objHeap[handleRenderbuffer]);
  }

  glFramebufferTexture2D = (target, attachment, textarget, textureHandle, level) => {
    this.gl.framebufferTexture2D(target, attachment, textarget, this.objHeap[textureHandle], level);
  }

  glFrontFace = (mode) => {
    this.gl.frontFace(mode);
  }

  glGenerateMipmap = (target) => {
    this.gl.generateMipmap(mode);
  }

  glGenBuffers = (n, buffers) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = this.gl.createBuffer();
      this.view.setUint32(buffers + i * 4, this.createHandle(buf), true);
    }
  }

  glGenFramebuffers = (n, framebuffers) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = this.gl.createFramebuffer();
      this.view.setUint32(framebuffers + i * 4, this.createHandle(buf), true);
    }
  }

  glGenRenderbuffers = (n, renderbuffers) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = this.gl.createRenderbuffer();
      this.view.setUint32(renderbuffers + i * 4, this.createHandle(buf), true);
    }
  }

  glGenTextures = (n, textures) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = this.gl.createTexture();
      this.view.setUint32(textures + i * 4, this.createHandle(buf), true);
    }
  }

  glGetActiveAttrib = (handleProg, indx, bufsize, length, size, _type, name) => {
    this.refreshMemory();
    const info = this.gl.getActiveAttrib(this.objHeap[handleProg], indx);
    if (info) {
      const bytesArray = new TextEncoder().encode(info.name);
      const max = Math.min(bufsize, bytesArray.byteLength);
      for (let i = 0; i < max; i++) {
        this.view.setUint8(name + i, bytesArray[i]);
      }
      this.view.setUint32(length, max, true);
      this.view.setUint32(size, info.size, true);
      this.view.setUint32(_type, info.type, true);
    } else {
      this.view.setUint32(length, 0, true);
    }
  }

  glGetActiveUniform = (handleProg, indx, bufsize, length, size, _type, name) => {
    this.refreshMemory();
    const info = this.gl.getActiveUniform(this.objHeap[handleProg], indx);
    if (info) {
      const bytesArray = new TextEncoder().encode(info.name);
      const max = Math.min(bufsize, bytesArray.byteLength);
      for (let i = 0; i < max; i++) {
        this.view.setUint8(name + i, bytesArray[i]);
      }
      this.view.setUint32(length, max, true);
      this.view.setUint32(size, info.size, true);
      this.view.setUint32(_type, info.type, true);
    } else {
      this.view.setUint32(length, 0, true);
    }
  }

  glGetAttachedShaders = (handleProg, maxcount, count, shaders) => {
    this.refreshMemory();
    const shadersArray = this.gl.getAttachedShaders(this.objHeap[handleProg]);
    const max = Math.min(maxcount, shadersArray.length);
    for (let i = 0; i < max; i++) {
      const handle = this.findHandle(shadersArray[i]);
      this.view.setUint32(shaders + i * 4, handle, true);
    }
    this.view.setUint32(count, max, true);
  }

  glGetAttribLocation = (handle, name) => {
    this.refreshMemory();
    const s = this.getJSString(name);
    const prog = this.objHeap[handle];
    return this.gl.getAttribLocation(prog, s);
  }

  glGetBooleanv = (pname, params) => {
    this.refreshMemory();
    const result = this.gl.getParameter(pname);
    if (!result.length) {
      this.view.setUint32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setUint32(params + i * 4, result[i], true);
      }
    }
  }

  glGetBufferParameteriv = (handle, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getBufferParameter(this.objHeap[handle], pname);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetError = () => {
    return this.gl.getError();
  }

  glGetFloatv = (pname, params) => {
    this.refreshMemory();
    const result = this.gl.getParameter(pname);
    if (!result.length) {
      this.view.setFloat32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setFloat32(params + i * 4, result[i], true);
      }
    }
  }

  glGetFramebufferAttachmentParameteriv = (target, attachment, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getFramebufferAttachmentParameter(target, attachment, pname);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetIntegerv = (pname, params) => {
    this.refreshMemory();
    const result = this.gl.getParameter(pname);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetProgramiv = (handleProg, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getProgramParameter(this.objHeap[handleProg], pname);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetProgramInfoLog = (handle, maxLength, length, infoLog) => {
    this.refreshMemory();
    const s = this.gl.getProgramInfoLog(this.objHeap[handle]);
    const bytesArray = new TextEncoder().encode(s);
    const max = Math.min(maxLength, bytesArray.byteLength);
    for (let i = 0; i < max; i++) {
      this.view.setUint8(infoLog + i, bytesArray[i]);
    }
    this.view.setUint32(length, max, true);
  }

  glGetRenderbufferParameteriv = (target, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getRenderbufferParameter(target, pname);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetShaderiv = (handle, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getShaderParameter(this.objHeap[handle], pname);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetShaderPrecisionFormat = (shadertype, precisiontype, range, precision) => {
    this.refreshMemory();
    const info = this.gl.getShaderPrecisionFormat(shadertype, precisiontype);
    if (info) {
      this.view.setInt32(range, info.rangeMax, true);
      this.view.setInt32(precision, info.precision, true);
    }
  }

  glGetShaderInfoLog = (handle, maxLength, length, infoLog) => {
    this.refreshMemory();
    const s = this.gl.getShaderInfoLog(this.objHeap[handle]);
    const bytesArray = new TextEncoder().encode(s);
    const max = Math.min(maxLength, bytesArray.byteLength);
    for (let i = 0; i < max; i++) {
      this.view.setUint8(infoLog + i, bytesArray[i]);
    }
    this.view.setUint32(length, max, true);
  }

  glGetShaderSource = (handle, bufsize, length, source) => {
    this.refreshMemory();
    const s = this.gl.getShaderSource(this.objHeap[handle]);
    const bytesArray = new TextEncoder().encode(s);
    const max = Math.min(bufsize, bytesArray.byteLength);
    for (let i = 0; i < max; i++) {
      this.view.setUint8(source + i, bytesArray[i]);
    }
    this.view.setUint32(length, max, true);
  }

  glGetString = (name, buf) => {
    this.refreshMemory();
    const s = this.gl.getParameter(name);
    const bytesArray = new TextEncoder().encode(s);
    for (let i = 0; i < bytesArray.byteLength; i++) {
      this.view.setUint8(buf + i, bytesArray[i]);
    }
    this.view.setUint8(buf + bytesArray.byteLength, 0);
  }

  glGetTexParameterfv = (target, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getTexParameter(target, pname);
    if (!result.length) {
      this.view.setFloat32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setFloat32(params + i * 4, result[i], true);
      }
    }
  }

  glGetTexParameteriv = (target, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getTexParameter(target, pname);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetUniformfv = (handle, location, params) => {
    this.refreshMemory();
    const result = this.gl.getUniform(this.objHeap[handle], location);
    if (!result.length) {
      this.view.setFloat32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setFloat32(params + i * 4, result[i], true);
      }
    }
  }

  glGetUniformiv = (handle, location, params) => {
    this.refreshMemory();
    const result = this.gl.getUniform(this.objHeap[handle], location);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetUniformLocation = (handle, name) => {
    this.refreshMemory();
    const s = this.getJSString(name);
    return this.createUniformLocationHandle(this.gl.getUniformLocation(this.objHeap[handle], s));
  }

  glGetVertexAttribfv = (indx, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getVertexAttrib(indx, pname);
    if (!result.length) {
      this.view.setFloat32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setFloat32(params + i * 4, result[i], true);
      }
    }
  }

  glGetVertexAttribiv = (indx, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getVertexAttrib(indx, pname);
    if (!result.length) {
      this.view.setInt32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setInt32(params + i * 4, result[i], true);
      }
    }
  }

  glGetVertexAttribPointerv = (indx, pname, params) => {
    this.refreshMemory();
    const result = this.gl.getVertexAttrib(indx, pname);
    if (!result.length) {
      this.view.setUint32(params, result, true);
    } else {
      for (let i = 0; i < result.length; i++) {
        this.view.setUint32(params + i * 4, result[i], true);
      }
    }
  }

  glHint = (target, mode) => {
    this.gl.hint(target, mode);
  }

  glIsBuffer = (handle) => {
    return this.gl.isBuffer(this.objHeap[handle]);
  }

  glIsEnabled = (cap) => {
    return this.gl.isEnabled(cap);
  }

  glIsFramebuffer = (handle) => {
    return this.gl.isFramebuffer(this.objHeap[handle]);
  }

  glIsProgram = (handle) => {
    return this.gl.isProgram(this.objHeap[handle]);
  }

  glIsRenderbuffer = (handle) => {
    return this.gl.isRenderbuffer(this.objHeap[handle]);
  }

  glIsShader = (handle) => {
    return this.gl.isShader(this.objHeap[handle]);
  }

  glIsTexture = (handle) => {
    return this.gl.isTexture(this.objHeap[handle]);
  }

  glLineWidth = (width) => {
    this.gl.lineWidth(width);
  }

  glLinkProgram = (handle) => {
    this.gl.linkProgram(this.objHeap[handle]);
  }

  glPixelStorei = (pname, param) => {
    this.gl.pixelStorei(pname, param);
  }

  glPolygonOffset = (factor, units) => {
    this.gl.polygonOffset(factor, units);
  }

  glReadPixels = (x, y, width, height, format, type, pixels) => {
    this.refreshMemory();
    const buf = new Uint8Array(this.instance.memory.buffer, pixels, width * height * 4);
    this.gl.readPixels(x, y, width, height, format, type, buf);
  }

  glRenderbufferStorage = (target, internalformat, width, height) => {
    this.gl.renderbufferStorage(target, internalformat, width, height);
  }

  glSampleCoverage = (value, invert) => {
    this.gl.sampleCoverage(value, invert);
  }

  glScissor = (x, y, width, height) => {
    this.gl.scissor(x, y, width, height);
  }

  glShaderSource = (handle, count, sources, lengths) => {
    this.refreshMemory();
    for (let i = 0; i < count; i++) {
      const shader = this.objHeap[handle];
      const source = this.view.getUint32(sources + i * 4, true);
      const len = this.view.getUint32(lengths + i * 4, true);
      const s = this.getJSString(source, len);
      this.gl.shaderSource(shader, s);
    }
  }

  glStencilFunc = (func, ref, mask) => {
    this.gl.stencilFunc(func, ref, mask);
  }

  glStencilFuncSeparate = (face, func, ref, mask) => {
    this.gl.stencilFuncSeparate(face, func, ref, mask);
  }

  glStencilMask = (mask) => {
    this.gl.stencilMask(mask);
  }

  glStencilMaskSeparate = (face, mask) => {
    this.gl.stencilMaskSeparate(face, mask);
  }

  glStencilOp = (fail, zfail, zpass) => {
    this.gl.stencilOp(fail, zfail, zpass);
  }

  glStencilOpSeparate = (face, fail, zfail, zpass) => {
    this.gl.stencilOpSeparate(face, fail, zfail, zpass);
  }

  glTexImage2D = (target, level, internalformat, width, height, border, format, type, pixels) => {
    this.refreshMemory();
    let size = 4;
    switch (internalformat) {
      case this.gl.RGBA:
        size = 4; break;
      case this.gl.RGB:
        size = 3; break;
      case this.gl.LUMINANCE_ALPHA:
        size = 2; break;
      case this.gl.LUMINANCE:
      case this.gl.ALPHA:
        size = 1; break;
      default:
        size = 4;
    }
    const buf = new Uint8Array(this.instance.memory.buffer, pixels, width * height * size);
    this.gl.texImage2D(target, level, internalformat, width, height, border, format, type, buf);
  }

  glTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, type, pixels) => {
    this.refreshMemory();
    let size = 4;
    switch (format) {
      case this.gl.RGBA:
        size = 4; break;
      case this.gl.RGB:
        size = 3; break;
      case this.gl.LUMINANCE_ALPHA:
        size = 2; break;
      case this.gl.LUMINANCE:
      case this.gl.ALPHA:
        size = 1; break;
      default:
        size = 4;
    }
    const buf = new Uint8Array(this.instance.memory.buffer, pixels, width * height * size);
    this.gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, buf);
  }

  glTexParameterf = (target, pname, param) => {
    this.gl.texParameterf(target, pname, param);
  }

  glTexParameteri = (target, pname, param) => {
    this.gl.texParameteri(target, pname, param);
  }

  glUniform1f = (handle, x) => {
    this.gl.uniform1f(this.uniformLocationHeap[handle], x,);
  }

  glUniform2f = (handle, x, y) => {
    this.gl.uniform2f(this.uniformLocationHeap[handle], x, y);
  }

  glUniform3f = (handle, x, y, z) => {
    this.gl.uniform3f(this.uniformLocationHeap[handle], x, y, z);
  }

  glUniform4f = (handle, x, y, z, w) => {
    this.gl.uniform4f(this.uniformLocationHeap[handle], x, y, z, w);
  }

  glUniform1i = (handle, x) => {
    this.gl.uniform1i(this.uniformLocationHeap[handle], x,);
  }

  glUniform2i = (handle, x, y) => {
    this.gl.uniform2i(this.uniformLocationHeap[handle], x, y);
  }

  glUniform3i = (handle, x, y, z) => {
    this.gl.uniform3i(this.uniformLocationHeap[handle], x, y, z);
  }

  glUniform4i = (handle, x, y, z, w) => {
    this.gl.uniform4i(this.uniformLocationHeap[handle], x, y, z, w);
  }

  glUniform1fv = (handle, count, v) => {
    this.refreshMemory();
    const buf = new Float32Array(this.instance.memory.buffer, v, count);
    this.gl.uniform1fv(this.uniformLocationHeap[handle], buf);
  }

  glUniform2fv = (handle, count, v) => {
    this.refreshMemory();
    const buf = new Float32Array(this.instance.memory.buffer, v, count * 2);
    this.gl.uniform2fv(this.uniformLocationHeap[handle], buf);
  }

  glUniform3fv = (handle, count, v) => {
    this.refreshMemory();
    const buf = new Float32Array(this.instance.memory.buffer, v, count * 3);
    this.gl.uniform3fv(this.uniformLocationHeap[handle], buf);
  }

  glUniform4fv = (handle, count, v) => {
    this.refreshMemory();
    const buf = new Float32Array(this.instance.memory.buffer, v, count * 4);
    this.gl.uniform4fv(this.uniformLocationHeap[handle], buf);
  }

  glUniform1iv = (handle, count, v) => {
    this.refreshMemory();
    const buf = new Int32Array(this.instance.memory.buffer, v, count);
    this.gl.uniform1iv(this.uniformLocationHeap[handle], buf);
  }

  glUniform2iv = (handle, count, v) => {
    this.refreshMemory();
    const buf = new Int32Array(this.instance.memory.buffer, v, count * 2);
    this.gl.uniform2iv(this.uniformLocationHeap[handle], buf);
  }

  glUniform3iv = (handle, count, v) => {
    this.refreshMemory();
    const buf = new Int32Array(this.instance.memory.buffer, v, count * 3);
    this.gl.uniform3iv(this.uniformLocationHeap[handle], buf);
  }

  glUniform4iv = (handle, count, v) => {
    this.refreshMemory();
    const buf = new Int32Array(this.instance.memory.buffer, v, count * 4);
    this.gl.uniform4iv(this.uniformLocationHeap[handle], buf);
  }

  glUniformMatrix2fv = (handle, count, transpose, v) => {
    this.refreshMemory();
    for (let i = 0; i < count; i++) {
      const buf = new Float32Array(this.instance.memory.buffer, v + i * 8 * 8, 2 * 2);
      this.gl.uniformMatrix2fv(this.uniformLocationHeap[handle], transpose, buf);
    }
  }

  glUniformMatrix3fv = (handle, count, transpose, v) => {
    this.refreshMemory();
    for (let i = 0; i < count; i++) {
      const buf = new Float32Array(this.instance.memory.buffer, v + i * 12 * 12, 3 * 3);
      this.gl.uniformMatrix3fv(this.uniformLocationHeap[handle], transpose, buf);
    }
  }

  glUniformMatrix4fv = (handle, count, transpose, v) => {
    this.refreshMemory();
    for (let i = 0; i < count; i++) {
      const buf = new Float32Array(this.instance.memory.buffer, v + i * 16 * 16, 4 * 4);
      this.gl.uniformMatrix4fv(this.uniformLocationHeap[handle], transpose, buf);
    }
  }

  glUseProgram = (handle) => {
    this.gl.useProgram(this.objHeap[handle]);
  }

  glVertexAttrib1f = (index, x) => {
    this.gl.vertexAttrib1f(index, x);
  }

  glVertexAttrib2f = (index, x, y) => {
    this.gl.vertexAttrib2f(index, x, y);
  }

  glVertexAttrib3f = (index, x, y, z) => {
    this.gl.vertexAttrib3f(index, x, y, z);
  }

  glVertexAttrib4f = (index, x, y, z, w) => {
    this.gl.vertexAttrib4f(index, x, y, z, w);
  }

  glVertexAttrib1fv = (index, v) => {
    this.refreshMemory();
    const buf = new Float32Array(this.instance.memory.buffer, v, 1);
    this.gl.vertexAttrib1fv(index, buf);
  }

  glVertexAttrib2fv = (index, v) => {
    this.refreshMemory();
    const buf = new Float32Array(this.instance.memory.buffer, v, 2);
    this.gl.vertexAttrib2fv(index, buf);
  }

  glVertexAttrib3fv = (index, v) => {
    this.refreshMemory();
    const buf = new Float32Array(this.instance.memory.buffer, v, 3);
    this.gl.vertexAttrib3fv(index, buf);
  }

  glVertexAttrib4fv = (index, v) => {
    this.refreshMemory();
    const buf = new Float32Array(this.instance.memory.buffer, v, 4);
    this.gl.vertexAttrib4fv(index, buf);
  }

  glVertexAttribPointer = (indx, size, _type, normalized, stride, ptr) => {
    this.gl.vertexAttribPointer(indx, size, _type, normalized, stride, ptr);
  }

  glViewport = (x, y, width, height) => {
    this.gl.viewport(x, y, width, height);
  }

  // OpenGL ES 3.0
  glGenVertexArrays = (n, va) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      const buf = this.gl.createVertexArray();
      this.view.setUint32(va + i * 4, this.createHandle(buf), true);
    }
  }

  glDeleteVertexArrays = (n, va) => {
    this.refreshMemory();
    for (let i = 0; i < n; i++) {
      this.gl.deleteRenderbuffer(this.releaseHandle(this.view.getUint32(va + i * 4)));
    }
  }

  glBindVertexArray = (handle) => {
    this.gl.bindVertexArray(this.objHeap[handle]);
  }

  glBindBufferBase = (target, index, handle) => {
    this.gl.bindBufferBase(target, index, this.objHeap[handle]);
  }

  glBeginTransformFeedback = (mode) => {
    this.gl.beginTransformFeedback(mode);
  }

  glEndTransformFeedback = () => {
    this.gl.endTransformFeedback(mode);
  }

  glTransformFeedbackVaryings = (handle, count, varyings, mode) => {
    this.refreshMemory();
    const strings = new Array(count);
    for (let i = 0; i < count; i++) {
      const sptr = this.view.getUint32(varyings + i * 4, true);
      const s = this.getJSString(sptr);
      strings[i] = s;
    }
    this.gl.transformFeedbackVaryings(this.objHeap[handle], strings, mode);
  }

  glDrawArraysInstanced = (mode, first, count, instanceCount) => {
    this.gl.drawArraysInstanced(mode, first, count, instanceCount);
  }

  glDrawElementsInstanced = (mode, count, type, offset, instanceCount) => {
    this.gl.drawElementsInstanced(mode, count, type, offset, instanceCount);
  }
};
