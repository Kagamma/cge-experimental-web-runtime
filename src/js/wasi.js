import { fs } from 'memfs';
import { pcharToJSString } from './utils';

const WASI_ESUCCESS = 0;
const WASI_E2BIG = 1;
const WASI_EACCES = 2;
const WASI_EADDRINUSE = 3;
const WASI_EADDRNOTAVAIL = 4;
const WASI_EAFNOSUPPORT = 5;
const WASI_EAGAIN = 6;
const WASI_EALREADY = 7;
const WASI_EBADF = 8;
const WASI_EBADMSG = 9;
const WASI_EBUSY = 10;
const WASI_ECANCELED = 11;
const WASI_ECHILD = 12;
const WASI_ECONNABORTED = 13;
const WASI_ECONNREFUSED = 14;
const WASI_ECONNRESET = 15;
const WASI_EDEADLK = 16;
const WASI_EDESTADDRREQ = 17;
const WASI_EDOM = 18;
const WASI_EDQUOT = 19;
const WASI_EEXIST = 20;
const WASI_EFAULT = 21;
const WASI_EFBIG = 22;
const WASI_EHOSTUNREACH = 23;
const WASI_EIDRM = 24;
const WASI_EILSEQ = 25;
const WASI_EINPROGRESS = 26;
const WASI_EINTR = 27;
const WASI_EINVAL = 28;
const WASI_EIO = 29;
const WASI_EISCONN = 30;
const WASI_EISDIR = 31;
const WASI_ELOOP = 32;
const WASI_EMFILE = 33;
const WASI_EMLINK = 34;
const WASI_EMSGSIZE = 35;
const WASI_EMULTIHOP = 36;
const WASI_ENAMETOOLONG = 37;
const WASI_ENETDOWN = 38;
const WASI_ENETRESET = 39;
const WASI_ENETUNREACH = 40;
const WASI_ENFILE = 41;
const WASI_ENOBUFS = 42;
const WASI_ENODEV = 43;
const WASI_ENOENT = 44;
const WASI_ENOEXEC = 45;
const WASI_ENOLCK = 46;
const WASI_ENOLINK = 47;
const WASI_ENOMEM = 48;
const WASI_ENOMSG = 49;
const WASI_ENOPROTOOPT = 50;
const WASI_ENOSPC = 51;
const WASI_ENOSYS = 52;
const WASI_ENOTCONN = 53;
const WASI_ENOTDIR = 54;
const WASI_ENOTEMPTY = 55;
const WASI_ENOTRECOVERABLE = 56;
const WASI_ENOTSOCK = 57;
const WASI_ENOTSUP = 58;
const WASI_ENOTTY = 59;
const WASI_ENXIO = 60;
const WASI_EOVERFLOW = 61;
const WASI_EOWNERDEAD = 62;
const WASI_EPERM = 63;
const WASI_EPIPE = 64;
const WASI_EPROTO = 65;
const WASI_EPROTONOSUPPORT = 66;
const WASI_EPROTOTYPE = 67;
const WASI_ERANGE = 68;
const WASI_EROFS = 69;
const WASI_ESPIPE = 70;
const WASI_ESRCH = 71;
const WASI_ESTALE = 72;
const WASI_ETIMEDOUT = 73;
const WASI_ETXTBSY = 74;
const WASI_EXDEV = 75;
const WASI_ENOTCAPABLE = 76;

const WASI_SIGABRT = 0;
const WASI_SIGALRM = 1;
const WASI_SIGBUS = 2;
const WASI_SIGCHLD = 3;
const WASI_SIGCONT = 4;
const WASI_SIGFPE = 5;
const WASI_SIGHUP = 6;
const WASI_SIGILL = 7;
const WASI_SIGINT = 8;
const WASI_SIGKILL = 9;
const WASI_SIGPIPE = 10;
const WASI_SIGQUIT = 11;
const WASI_SIGSEGV = 12;
const WASI_SIGSTOP = 13;
const WASI_SIGTERM = 14;
const WASI_SIGTRAP = 15;
const WASI_SIGTSTP = 16;
const WASI_SIGTTIN = 17;
const WASI_SIGTTOU = 18;
const WASI_SIGURG = 19;
const WASI_SIGUSR1 = 20;
const WASI_SIGUSR2 = 21;
const WASI_SIGVTALRM = 22;
const WASI_SIGXCPU = 23;
const WASI_SIGXFSZ = 24;

const WASI_FILETYPE_UNKNOWN = 0;
const WASI_FILETYPE_BLOCK_DEVICE = 1;
const WASI_FILETYPE_CHARACTER_DEVICE = 2;
const WASI_FILETYPE_DIRECTORY = 3;
const WASI_FILETYPE_REGULAR_FILE = 4;
const WASI_FILETYPE_SOCKET_DGRAM = 5;
const WASI_FILETYPE_SOCKET_STREAM = 6;
const WASI_FILETYPE_SYMBOLIC_LINK = 7;

const WASI_FILETYPE =
  WASI_FILETYPE_UNKNOWN
  | WASI_FILETYPE_BLOCK_DEVICE
  | WASI_FILETYPE_CHARACTER_DEVICE
  | WASI_FILETYPE_DIRECTORY
  | WASI_FILETYPE_REGULAR_FILE
  | WASI_FILETYPE_SOCKET_DGRAM
  | WASI_FILETYPE_SOCKET_STREAM
  | WASI_FILETYPE_SYMBOLIC_LINK;

const WASI_FDFLAG_APPEND = 0x0001;
const WASI_FDFLAG_DSYNC = 0x0002;
const WASI_FDFLAG_NONBLOCK = 0x0004;
const WASI_FDFLAG_RSYNC = 0x0008;
const WASI_FDFLAG_SYNC = 0x0010;

const WASI_RIGHT_FD_DATASYNC = BigInt(0x0000000000000001);
const WASI_RIGHT_FD_READ = BigInt(0x0000000000000002);
const WASI_RIGHT_FD_SEEK = BigInt(0x0000000000000004);
const WASI_RIGHT_FD_FDSTAT_SET_FLAGS = BigInt(0x0000000000000008);
const WASI_RIGHT_FD_SYNC = BigInt(0x0000000000000010);
const WASI_RIGHT_FD_TELL = BigInt(0x0000000000000020);
const WASI_RIGHT_FD_WRITE = BigInt(0x0000000000000040);
const WASI_RIGHT_FD_ADVISE = BigInt(0x0000000000000080);
const WASI_RIGHT_FD_ALLOCATE = BigInt(0x0000000000000100);
const WASI_RIGHT_PATH_CREATE_DIRECTORY = BigInt(0x0000000000000200);
const WASI_RIGHT_PATH_CREATE_FILE = BigInt(0x0000000000000400);
const WASI_RIGHT_PATH_LINK_SOURCE = BigInt(0x0000000000000800);
const WASI_RIGHT_PATH_LINK_TARGET = BigInt(0x0000000000001000);
const WASI_RIGHT_PATH_OPEN = BigInt(0x0000000000002000);
const WASI_RIGHT_FD_READDIR = BigInt(0x0000000000004000);
const WASI_RIGHT_PATH_READLINK = BigInt(0x0000000000008000);
const WASI_RIGHT_PATH_RENAME_SOURCE = BigInt(0x0000000000010000);
const WASI_RIGHT_PATH_RENAME_TARGET = BigInt(0x0000000000020000);
const WASI_RIGHT_PATH_FILESTAT_GET = BigInt(0x0000000000040000);
const WASI_RIGHT_PATH_FILESTAT_SET_SIZE = BigInt(0x0000000000080000);
const WASI_RIGHT_PATH_FILESTAT_SET_TIMES = BigInt(0x0000000000100000);
const WASI_RIGHT_FD_FILESTAT_GET = BigInt(0x0000000000200000);
const WASI_RIGHT_FD_FILESTAT_SET_SIZE = BigInt(0x0000000000400000);
const WASI_RIGHT_FD_FILESTAT_SET_TIMES = BigInt(0x0000000000800000);
const WASI_RIGHT_PATH_SYMLINK = BigInt(0x0000000001000000);
const WASI_RIGHT_PATH_REMOVE_DIRECTORY = BigInt(0x0000000002000000);
const WASI_RIGHT_PATH_UNLINK_FILE = BigInt(0x0000000004000000);
const WASI_RIGHT_POLL_FD_READWRITE = BigInt(0x0000000008000000);
const WASI_RIGHT_SOCK_SHUTDOWN = BigInt(0x0000000010000000);
const WASI_PREOPENTYPE_DIR = 0;
const WASI_WHENCE_SET = 0;
const WASI_WHENCE_CUR = 1;
const WASI_WHENCE_END = 2;
const WASI_STDIN = 0;
const WASI_STDOUT = 1;
const WASI_STDERR = 2;

export const WASI = function() {
  let view = null;
  let moduleInstanceExports = null;
  let preOpenDirs = false;
  let availFD = -1;
  // Store opened file handles
  const handles = new Array(65536);

  function getEmptyHandle() {
    for (let i = 3; i < handles.length; i++){
      if (handles[i] === undefined) {
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
    handles[handle] = obj;
    return handle;
  }

  function releaseHandle(handle) {
    if (handle === 0) {
      return null;
    }
    const obj = handles[handle];
    handles[handle] = undefined;
    return obj;
  }

  // Private Helpers
  function refreshMemory() {
    if (!view || view.buffer.byteLength === 0) {
      view = new DataView(moduleInstanceExports.memory.buffer);
    }
  }

  function checkExists(path) {
    try {
      if (fs.existsSync(path)) {
        return fs.lstatSync(path);
      }
    } catch(err) {
    }
    return false;
  }

  // Public APIs
  function setModuleInstance(instance) {
    moduleInstanceExports = instance.exports;
  }

  function fnfixme(name, result = WASI_ESUCCESS) {
    return () => {
      console.log('FIXME', name);
      return result;
    };
  }

  function environ_sizes_get(environCount, environBufSize) {
    refreshMemory();
    view.setUint32(environCount, 0, true);
    view.setUint32(environBufSize, 0, true);
    return WASI_ESUCCESS;
  }

  function environ_get(environ, environBuf) {
    return WASI_ESUCCESS;
  }

  function fd_fdstat_get(fd, result) {
    refreshMemory();

    view.setUint8(result, fd);
    view.setUint16(result + 2, 0, true);
    view.setUint16(result + 4, 0, true);

    view.setBigUint64(result + 8, BigInt(0), true);
    view.setBigUint64(result + 8 + 8, BigInt(0), true);
    return WASI_ESUCCESS;
  }

  function fd_prestat_get(fd, result) {
    refreshMemory();
    // Simulate preopen dir
    if (!preOpenDirs) {
      preOpenDirs = true;
      availFD = fd;
      view.setUint8(result, WASI_PREOPENTYPE_DIR); // tag
      view.setUint32(result + 4, 1, true); // Name len, '/'
      return WASI_ESUCCESS;
    }
    return WASI_EBADF;
  }

  function fd_prestat_dir_name(fd, pathPtr, pathLen) {
    if (fd !== availFD) return WASI_EINVAL;
    refreshMemory();
    view.setUint8(pathPtr, '/'.charCodeAt(0)); // Name, '/'
    return WASI_ESUCCESS;
  }

  function fd_write(fd, iovs, iovsLen, nwritten) {
    refreshMemory();
    let bytesWritten = 0;
    if (fd < 3) {
      // Write to console
      let s = '';
      for (let i = 0; i < iovsLen; i++) {
        const ptr = iovs + i * 8;
        const buf = view.getUint32(ptr, true);
        const bufLen = view.getUint32(ptr + 4, true);
        bytesWritten += bufLen;
        s += pcharToJSString(view, moduleInstanceExports.memory.buffer, buf, bufLen);
      };
      if (fd === WASI_STDOUT) {
        console.log(s);
      } else
      if (fd === WASI_STDERR) {
        console.error(s);
      }
    } else {
      // Write to file
      const stats = handles[fd];
      if (!stats) {
        return WASI_EINVAL;
      }
      for (let i = 0; i < iovsLen; i++) {
        const ptr = iovs + i * 8;
        const buf = view.getUint32(ptr, true);
        const bufLen = view.getUint32(ptr + 4, true);
        bytesWritten += bufLen;
        const data = new Uint8Array(moduleInstanceExports.memory.buffer, buf, bufLen);
        fs.writeSync(stats.real, data);
      };
    }
    view.setUint32(nwritten, bytesWritten, true);
    return WASI_ESUCCESS;
  }

  function fd_read(fd, iovs, iovsLen, nread) {
    refreshMemory();
    let bytesRead = 0;
    if (fd >= 3) {
      // Read from file
      const stats = handles[fd];
      if (!stats) {
        return WASI_EINVAL;
      }
      let offset = BigInt(stats.offset);
      for (let i = 0; i < iovsLen; i++) {
        const ptr = iovs + i * 8;
        const buf = view.getUint32(ptr, true);
        const bufLen = view.getUint32(ptr + 4, true);
        const data = new Uint8Array(moduleInstanceExports.memory.buffer, buf, bufLen);
        data._isBuffer = true; // Workaround "not a buffer" issue
        const rr = fs.readSync(stats.real, data, 0, bufLen, Number(offset));
        bytesRead += rr;
        offset += BigInt(rr);
        // Break when EOF
        if (rr < bufLen) {
          break;
        }
      };
    }
    view.setUint32(nread, bytesRead, true);
    return WASI_ESUCCESS;
  }

  function fd_seek(fd, offset, whence, result) {
    refreshMemory();
    if (fd >= 3) {
      // Seek from file
      const stats = handles[fd];
      if (!stats) {
        return WASI_EINVAL;
      }
      switch (whence) {
        case WASI_WHENCE_SET:
          stats.offset = BigInt(offset);
          break;
        case WASI_WHENCE_CUR:
          stats.offset = stats.offset ? stats.offset : BigInt(0) + BigInt(offset);
          break;
        case WASI_WHENCE_END:
          const { size } = fs.fstatSync(stats.real);
          stats.offset = BigInt(size) + BigInt(offset);
          break;
      }
      view.setBigUint64(result, stats.offset, true);
    }
    return WASI_ESUCCESS;
  }

  function fd_close(fd) {
    const stats = releaseHandle(fd);
    if (!stats) {
      return WASI_EINVAL;
    }
    fs.closeSync(stats.real);
    return WASI_ESUCCESS;
  }

  function path_filestat_get(fd, flags, path, result) {
    if (fd !== availFD) return WASI_EINVAL;
    refreshMemory();
    const jspath = pcharToJSString(view, moduleInstanceExports.memory.buffer, path);
    const stats = checkExists(jspath);
    if (stats && stats.isFile()) {
      // FIXME: Pass file attributes to result
      return WASI_ESUCCESS;
    }
    return WASI_EINVAL;
  }

  function path_open(fd, dirflags, path, oflags, fs_rights_base, fs_rights_inheriting, fdflags, empty, resultfs) {
    if (fd !== availFD) return WASI_EINVAL;
    refreshMemory();
    fs_rights_base = BigInt(fs_rights_base);
    const read = (fs_rights_base & (WASI_RIGHT_FD_READ | WASI_RIGHT_FD_READDIR)) !== BigInt(0);
    const write = (fs_rights_base & (WASI_RIGHT_FD_DATASYNC | WASI_RIGHT_FD_WRITE | WASI_RIGHT_FD_ALLOCATE | WASI_RIGHT_FD_FILESTAT_SET_SIZE)) !== BigInt(0);
    let flags = 'r';
    if (read && write) {
      flags = 'a';
    } else if (write) {
      flags = 'w';
    }
    const jspath = pcharToJSString(view, moduleInstanceExports.memory.buffer, path);
    const stats = checkExists(jspath);
    if (!stats || stats.isFile()) {
      // Create new file if it's not exists
      if (!stats) fs.appendFileSync(jspath, '');
      // Prepare handle
      const handle = createHandle({
        real: fs.openSync(jspath, flags),
        path: jspath,
        read,
        write,
        offset: BigInt(0),
      });
      // Write handle to result
      view.setUint32(resultfs, handle, true);
      return WASI_ESUCCESS;
    }
    return WASI_EINVAL;
  }

  function path_unlink_file(fd, pathPtr, pathLen) {
    if (fd !== availFD) return WASI_EINVAL;
    refreshMemory();
    const jspath = pcharToJSString(view, moduleInstanceExports.memory.buffer, pathPtr, pathLen);
    fs.unlinkSync(jspath);
    return WASI_ESUCCESS;
  }

  function proc_exit(rval) {
    if (rval !== 0) {
      throw new Error('Program exit with error code ' + rval);
    }
    return WASI_ENOSYS;
  }

  function clock_time_get(id, precision, result) {
    refreshMemory();
    // We ignore the id & precision of the clock for now
    const date = new Date();
    view.setBigUint64(result, BigInt(date.getTime()) * BigInt(1000000), true);
    return WASI_ESUCCESS;
  }

  return {
    setModuleInstance: setModuleInstance,
    fd_fdstat_get: fd_fdstat_get,
    fd_prestat_get: fd_prestat_get,
    fd_prestat_dir_name: fd_prestat_dir_name,
    environ_sizes_get: environ_sizes_get,
    environ_get: environ_get,
    fd_open: fnfixme('fd_open'),
    fd_close: fd_close,
    fd_seek: fd_seek,
    fd_read: fd_read,
    fd_write: fd_write,
    fd_tell: fnfixme('fd_tell'),
    fd_filestat_get: fnfixme('fd_filestat_get'),
    path_readlink: fnfixme('path_readlink'),
    path_open: path_open,
    path_filestat_get: path_filestat_get,
    path_unlink_file: path_unlink_file,
    proc_exit: proc_exit,
    clock_time_get: clock_time_get,
  };
};
