import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
  jsx,
} from "./snabbdom.esm";
import { initOptions, getMountPoint, getSize } from "./utils";

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

function icon(name) {
  return (
    <i
      class={{
        "table-selector-iconfont": true,
        [`table-selector-icon-${name}`]: true,
      }}
    />
  );
}

export { patch, h, jsx, initOptions, destroy, getMountPoint, icon, getSize };
