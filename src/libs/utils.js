import cloneDeep from "lodash.clonedeep";
import defaultOptions from "./options";

export function initOptions(options = {}) {
  return Object.assign(cloneDeep(defaultOptions), options);
}
