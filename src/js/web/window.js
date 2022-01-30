import { Object } from './classes';
import { pcharToJSString } from './utils';

export class Window extends Object {
  constructor() {
    super();
  }

  setCaption = s => {
    this.refreshMemory();
    document.title = pcharToJSString(this.view, this.instance.memory.buffer, s);
  }
}
