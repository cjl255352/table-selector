// eslint-disable-next-line no-unused-vars
import { patch, h, jsx } from "@/patch";
import defaultOptions from "@/defaultOptions";
import cloneDeep from "lodash.clonedeep";

let instance = [];

function getMountPoint(count = 1) {
  const fragment = document.createDocumentFragment();
  const list = [];
  for (let i = 0; i < count; i++) {
    const point = document.createElement("div");
    fragment.appendChild(point);
    list.push(point);
  }
  document.body.appendChild(fragment);
  return count === 1 ? list[0] : list;
}

function initWrapper() {
  return (
    <div class={{ foo: true, bar: true }} />
  )
}

function initDialog() {

}

function open(options = {}) {
  options = Object.assign(cloneDeep(defaultOptions), options);
  console.log(options);
  const [wrapperPoint, dialogPoint] = getMountPoint(2);
  patch(wrapperPoint, initWrapper(options.wrapper));
  patch(dialogPoint, initDialog());
}

export { open, instance };
