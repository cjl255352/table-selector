import cloneDeep from "lodash.clonedeep";
import defaultOptions from "./options";

export function initOptions(options = {}) {
  return Object.assign(cloneDeep(defaultOptions), options);
}

export function getMountPoint(count = 1) {
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

export function getSize(value) {
  if (
    typeof value == "number" ||
    (typeof value == "string" && !isNaN(Number(value)))
  ) {
    return `${value}px`;
  }
  return value;
}
