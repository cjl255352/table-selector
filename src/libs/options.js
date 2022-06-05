import cloneDeep from "lodash.clonedeep";
import mock from "./mock";
import { getScrollBarWidth } from "./utils";

const defaultOptions = {
  classPrefix: "table-selector",
  height: 300,
  width: 900,
  title: "流程选择",
  titlePosition: "left",
  searchPlaceholder: "请输入关键字",
  searchMethod: mock,
  tableRowHeight: 40,
  dataTableWidth: "66.6666%",
  columns: [],
  value: [],
  valueProp: "id",
  labelProp: "name",
  confirm: (value) => {
    console.log(value);
  },
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

function initColumns(columns, isScrollbar = false) {
  const alignMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };
  const hasWidth = [];
  for (let i = 0; i < columns.length; i++) {
    columns[i] = Object.assign(cloneDeep(defaultColumnOptions), columns[i]);
    const e = columns[i];
    e.headerAlign = alignMap[e.headerAlign];
    e.align = alignMap[e.align];
    if (e.width) {
      e.width = formatSize(e.width);
      hasWidth.push(e);
    }
  }
  if (hasWidth.length != columns.length) {
    let formula = isScrollbar ? ` - ${getScrollBarWidth()}` : "";
    hasWidth.forEach((e) => {
      formula += ` - ${e.width}`;
    });
    formula = `calc((100%${formula}) / ${columns.length - hasWidth.length})`;
    columns.forEach((e) => {
      !e.width && (e.width = formula);
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
