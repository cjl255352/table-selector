import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
  jsx,
} from "./snabbdom.esm";
import { initOptions, getMountPoint } from "./utils";

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

function destroy(vnode, delay = 0) {
  setTimeout(() => {
    patch(vnode, h("!"));
  }, delay);
}

export { patch, h, jsx, initOptions, destroy, getMountPoint };
