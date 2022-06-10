import cloneDeep from "lodash.clonedeep";
import mock from "./mock";
import { getScrollBarWidth } from "./utils";

const defaultOptions = {
  classPrefix: "table-selector",
  height: 504,
  width: 760,
  title: "流程选择",
  titlePosition: "left",
  searchPlaceholder: "请输入关键字",
  searchMethod: mock,
  tableRowHeight: 32,
  dataTableWidth: 480,
  columns: [
    {
      label: "序号",
      prop: "$index",
      width: 60,
      headerAlign: "center",
      align: "center",
      formatter: (row, column, cellValue, index) => {
        return index + 1;
      },
    },
    {
      label: "PDMC领域",
      prop: "domainInfo",
      width: 110,
    },
    {
      label: "电子流名称",
      prop: "electronFlowName",
    },
    {
      label: "电子流owner",
      prop: "ownerName",
      width: 100,
    },
  ],
  value: [],
  valueProp: "id",
  labelProp: "name",
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

function initColumns(columns = [], isScrollbar = false) {
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
  options = Object.assign(cloneDeep(defaultOptions), options);
  initColumns(options.columns);
  return options;
}

export {
  defaultOptions,
  defaultColumnOptions,
  formatSize,
  initColumns,
  initOptions,
};
