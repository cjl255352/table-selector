import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
  jsx,
} from "@/snabbdom.esm.js";

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

export { patch, h, jsx };
