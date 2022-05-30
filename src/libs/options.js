import cloneDeep from "lodash.clonedeep";
import mock from "./mock";

const defaultOptions = {
  classPrefix: "table-selector",
  height: "300px",
  width: "900px",
  title: "流程选择",
  titlePosition: "left",
  searchPlaceholder: "请输入关键字",
  columns: [],
  searchMethod: mock,
  tableWidth: "66.6666%",
};

const defaultColumnOptions = {
  headerAlign: "left",
  align: "left",
};

function formatSize(value) {
  if (
    typeof value == "number" ||
    (typeof value == "string" && !isNaN(Number(value)))
  ) {
    return `${value}px`;
  }
  return value;
}

function initColumns(columns) {
  const hasWidth = [];
  columns.forEach((e) => {
    Object.assign(cloneDeep(defaultColumnOptions), e);
    if (e.width) {
      e.width = formatSize(e.width);
      hasWidth.push(e);
    }
  });
  if (hasWidth.length != columns.length) {
    let formula = "";
    hasWidth.forEach((e) => {
      formula += ` - ${e.width}`;
    });
    formula = `calc((100%${formula}) / ${columns.length - hasWidth.length})`;
    columns.forEach((e) => {
      if (!e.width) {
        e.width = formula;
      }
    });
  }
}

function initOptions(options = {}) {
  initColumns(options.columns);
  return Object.assign(cloneDeep(defaultOptions), options);
}

export {
  defaultOptions,
  defaultColumnOptions,
  formatSize,
  initColumns,
  initOptions,
};
