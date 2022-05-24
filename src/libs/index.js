import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
  jsx,
} from "./snabbdom.esm";
import { test } from "./utils";

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

export { patch, h, jsx, test };
