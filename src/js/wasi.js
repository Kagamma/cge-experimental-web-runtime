import { fs } from 'memfs';
import { Object } from './classes';
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

export class WASI extends Object {
  constructor() {
    super();
    this.preOpenDirs = null;
    this.availFD = -1;
    // Store opened file this.handles
    this.handles = new Array(65536);
  }

  // Private Helpers
  getEmptyHandle = () => {
    for (let i = 3; i < this.handles.length; i++){
      if (this.handles[i] === undefined) {
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
    this.handles[handle] = obj;
    return handle;
  }

  releaseHandle = (handle) => {
    if (handle === 0) {
      return null;
    }
    const obj = this.handles[handle];
    this.handles[handle] = undefined;
    return obj;
  }

  checkExists = (path) => {
    try {
      if (fs.existsSync(path)) {
        return fs.lstatSync(path);
      }
    } catch(err) {
    }
    return false;
  }

  // Public APIs
  environ_sizes_get = (environCount, environBufSize) => {
    this.refreshMemory();
    this.view.setUint32(environCount, 0, true);
    this.view.setUint32(environBufSize, 0, true);
    return WASI_ESUCCESS;
  }

  environ_get = (environ, environBuf) => {
    return WASI_ESUCCESS;
  }

  fd_fdstat_get = (fd, result) => {
    this.refreshMemory();

    this.view.setUint8(result, fd);
    this.view.setUint16(result + 2, 0, true);
    this.view.setUint16(result + 4, 0, true);

    this.view.setBigUint64(result + 8, BigInt(0), true);
    this.view.setBigUint64(result + 8 + 8, BigInt(0), true);
    return WASI_ESUCCESS;
  }

  fd_prestat_get = (fd, result) => {
    this.refreshMemory();
    // Simulate preopen dir
    if (!this.preOpenDirs) {
      this.preOpenDirs = true;
      this.availFD = fd;
      this.view.setUint8(result, WASI_PREOPENTYPE_DIR); // tag
      this.view.setUint32(result + 4, 1, true); // Name len, '/'
      return WASI_ESUCCESS;
    }
    return WASI_EBADF;
  }

  fd_prestat_dir_name = (fd, pathPtr, pathLen) => {
    if (fd !== this.availFD) return WASI_EINVAL;
    this.refreshMemory();
    this.view.setUint8(pathPtr, '/'.charCodeAt(0)); // Name, '/'
    return WASI_ESUCCESS;
  }

  fd_filestat_get = (fd, result) => {
    if (fd !== this.availFD) return WASI_EINVAL;
    this.refreshMemory();
    const stats = this.handles[fd];
    if (!stats) {
      return WASI_EINVAL;
    }
    // Pass file attributes to result
    const rstats = fs.fstatSync(stats.real);
    this.view.setUint8(result + 16, rstats.filetype);
    this.view.setBigUint64(result + 32, BigInt(rstats.size), true);
    return WASI_ESUCCESS;
  }

  fd_filestat_set_size = (fd, size) => {
    if (fd !== this.availFD) return WASI_EINVAL;
    const stats = this.handles[fd];
    if (!stats) {
      return WASI_EINVAL;
    }
    fs.ftruncateSync(stats.real, Number(size));
    return WASI_ESUCCESS;
  }

  fd_write = (fd, iovs, iovsLen, nwritten) => {
    this.refreshMemory();
    let bytesWritten = 0;
    if (fd < 3) {
      // Write to console
      let s = '';
      for (let i = 0; i < iovsLen; i++) {
        const ptr = iovs + i * 8;
        const buf = this.view.getUint32(ptr, true);
        const bufLen = this.view.getUint32(ptr + 4, true);
        bytesWritten += bufLen;
        s += pcharToJSString(this.view, this.moduleInstanceExports.memory.buffer, buf, bufLen);
      };
      if (fd === WASI_STDOUT) {
        console.log(s);
      } else
      if (fd === WASI_STDERR) {
        console.error(s);
      }
    } else {
      // Write to file
      const stats = this.handles[fd];
      if (!stats) {
        return WASI_EINVAL;
      }
      let offset = BigInt(stats.offset);
      for (let i = 0; i < iovsLen; i++) {
        const ptr = iovs + i * 8;
        const buf = this.view.getUint32(ptr, true);
        const bufLen = this.view.getUint32(ptr + 4, true);
        const data = new Uint8Array(this.moduleInstanceExports.memory.buffer, buf, bufLen);
        const rr = fs.writeSync(stats.real, data, 0, bufLen, Number(offset));
        bytesWritten += rr;
        offset += BigInt(rr);
      };
      stats.offset += BigInt(bytesWritten);
    }
    this.view.setUint32(nwritten, bytesWritten, true);
    return WASI_ESUCCESS;
  }

  fd_read = (fd, iovs, iovsLen, nread) => {
    this.refreshMemory();
    let bytesRead = 0;
    if (fd >= 3) {
      // Read from file
      const stats = this.handles[fd];
      if (!stats) {
        return WASI_EINVAL;
      }
      let offset = BigInt(stats.offset);
      for (let i = 0; i < iovsLen; i++) {
        const ptr = iovs + i * 8;
        const buf = this.view.getUint32(ptr, true);
        const bufLen = this.view.getUint32(ptr + 4, true);
        const data = new Uint8Array(this.moduleInstanceExports.memory.buffer, buf, bufLen);
        data._isBuffer = true; // Workaround "not a buffer" issue
        const rr = fs.readSync(stats.real, data, 0, bufLen, Number(offset));
        bytesRead += rr;
        offset += BigInt(rr);
        // Break when EOF
        if (rr < bufLen) {
          break;
        }
      };
      stats.offset += BigInt(bytesRead);
    }
    this.view.setUint32(nread, bytesRead, true);
    return WASI_ESUCCESS;
  }

  fd_seek = (fd, offset, whence, result) => {
    this.refreshMemory();
    if (fd >= 3) {
      // Seek from file
      const stats = this.handles[fd];
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
          const rstats = fs.fstatSync(stats.real);
          stats.offset = BigInt(rstats.size) + BigInt(offset);
          break;
      }
      this.view.setBigUint64(result, stats.offset, true);
    }
    return WASI_ESUCCESS;
  }

  fd_tell = (fd, result) => {
    this.refreshMemory();
    const stats = this.handles[fd];
    if (!stats) {
      return WASI_EINVAL;
    }
    this.view.setBigUint64(result, stats.offset, true);
    return WASI_ESUCCESS;
  }

  fd_close = (fd) => {
    const stats = this.releaseHandle(fd);
    if (!stats) {
      return WASI_EINVAL;
    }
    fs.closeSync(stats.real);
    return WASI_ESUCCESS;
  }

  path_filestat_get = (fd, flags, pathPtr, pathLen, result) => {
    if (fd !== this.availFD) return WASI_EINVAL;
    this.refreshMemory();
    const jspath = pcharToJSString(this.view, this.moduleInstanceExports.memory.buffer, pathPtr, pathLen);
    const stats = this.checkExists(jspath);
    if (stats && (stats.isFile() || stats.isDirectory())) {
      let filetype = WASI_FILETYPE_UNKNOWN;
      switch (true) {
        case stats.isFile():
          filetype = WASI_FILETYPE_REGULAR_FILE;
          break;
        case stats.isDirectory():
          filetype = WASI_FILETYPE_DIRECTORY;
          break;
      }
      this.view.setUint8(result + 16, filetype);
      this.view.setBigUint64(result + 32, BigInt(stats.size), true);
      return WASI_ESUCCESS;
    }
    return WASI_EINVAL;
  }

  path_open = (fd, dirflags, path, oflags, fs_rights_base, fs_rights_inheriting, fdflags, empty, resultfs) => {
    if (fd !== this.availFD) return WASI_EINVAL;
    this.refreshMemory();
    fs_rights_base = BigInt(fs_rights_base);
    const read = (fs_rights_base & (WASI_RIGHT_FD_READ | WASI_RIGHT_FD_READDIR)) !== BigInt(0);
    const write = (fs_rights_base & (WASI_RIGHT_FD_DATASYNC | WASI_RIGHT_FD_WRITE | WASI_RIGHT_FD_ALLOCATE | WASI_RIGHT_FD_FILESTAT_SET_SIZE)) !== BigInt(0);
    let flags = 'r';
    if (read && write) {
      flags = 'a';
    } else if (write) {
      flags = 'w';
    }
    const jspath = pcharToJSString(this.view, this.moduleInstanceExports.memory.buffer, path);
    const stats = this.checkExists(jspath);
    if (!stats || stats.isFile()) {
      // Create new file if it's not exists
      if (!stats) fs.appendFileSync(jspath, '');
      // Prepare handle
      const handle = this.createHandle({
        real: fs.openSync(jspath, flags),
        path: jspath,
        read,
        write,
        offset: BigInt(0),
      });
      // Write handle to result
      this.view.setUint32(resultfs, handle, true);
      return WASI_ESUCCESS;
    }
    return WASI_EINVAL;
  }

  path_unlink_file = (fd, pathPtr, pathLen) => {
    if (fd !== this.availFD) return WASI_EINVAL;
    this.refreshMemory();
    const jspath = pcharToJSString(this.view, this.moduleInstanceExports.memory.buffer, pathPtr, pathLen);
    fs.unlinkSync(jspath);
    return WASI_ESUCCESS;
  }

  path_create_directory = (fd, pathStr, pathLen) => {
    if (fd !== this.availFD) return WASI_EINVAL;
    this.refreshMemory();
    const jspath = pcharToJSString(this.view, this.moduleInstanceExports.memory.buffer, pathStr, pathLen);
    fs.mkdirSync(jspath);
    return WASI_ESUCCESS;
  }

  path_remove_directory = (fd, pathStr, pathLen) => {
    if (fd !== this.availFD) return WASI_EINVAL;
    this.refreshMemory();
    const jspath = pcharToJSString(this.view, this.moduleInstanceExports.memory.buffer, pathStr, pathLen);
    fs.rmdirSync(jspath);
    return WASI_ESUCCESS;
  }

  path_readlink = () => {
    console.log('FIXME', 'path_readlink');
    return WASI_ESUCCESS;
  }

  proc_exit = (rval) => {
    if (rval !== 0) {
      throw new Error('Program exit with error code ' + rval);
    }
    return WASI_ENOSYS;
  }

  clock_time_get = (id, precision, result) => {
    this.refreshMemory();
    // We ignore the id & precision of the clock for now
    const date = new Date();
    this.view.setBigUint64(result, BigInt(date.getTime()) * BigInt(1000000), true);
    return WASI_ESUCCESS;
  }
};
