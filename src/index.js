import {
  patch,
  h,
  // eslint-disable-next-line no-unused-vars
  jsx,
  initOptions,
  destroy,
  getMountPoint,
  icon,
  formatSize,
  isFunction,
  isVnode,
} from "@/libs";
import "@/style/index.scss";

let wrapper;
let dialog;
let dataTable;
let selectedTable;
let pagination;
let tooltip;
let timer;

let sourceData = {
  rows: [],
  total: 0,
};

const params = {
  keyword: "",
  pageNumber: 1,
  pageSize: 10,
};

function initWrapper(options, status = "enter") {
  const vnode = (
    <div
      class={{
        [`${options.classPrefix}-wrapper`]: true,
        [`${options.classPrefix}-wrapper-enter`]: status == "enter",
        [`${options.classPrefix}-wrapper-leave`]: status == "leave",
      }}
      on={{ click: () => close(options) }}
    />
  );
  return vnode;
}

function initDialog(options, status = "enter") {
  const vnode = (
    <div class={{ [`${options.classPrefix}-dialog-wrapper`]: true }}>
      <div
        class={{
          [`${options.classPrefix}-dialog`]: true,
          [`${options.classPrefix}-dialog-enter`]: status == "enter",
          [`${options.classPrefix}-dialog-leave`]: status == "leave",
        }}
        style={{
          height: formatSize(options.height),
          width: formatSize(options.width),
        }}
      >
        {initHeader(options)}
        {initSearch(options)}
        <div class={{ [`${options.classPrefix}-body`]: true }}>
          {initDataTable(options)}
          {initSelectedTable(options)}
        </div>
        <div class={{ [`${options.classPrefix}-footer`]: true }}>
          {initPagination(options)}
          {initAction(options)}
        </div>
      </div>
    </div>
  );
  return vnode;
}

function initHeader(options) {
  const vnode = (
    <div
      class={{ [`${options.classPrefix}-header`]: true }}
      style={{ textAlign: options.titlePosition }}
    >
      <span class={{ [`${options.classPrefix}-header-title`]: true }}>
        {options.title}
      </span>
      <div
        class={{ [`${options.classPrefix}-header-close-btn`]: true }}
        on={{ click: () => close(options) }}
      >
        {icon("close")}
      </div>
    </div>
  );
  return vnode;
}

function initSearch(options) {
  const vnode = (
    <div class={{ [`${options.classPrefix}-search`]: true }}>
      <input
        class={{ [`${options.classPrefix}-search-keyword`]: true }}
        props={{ placeholder: options.searchPlaceholder }}
        on={{
          input: (e) => (params.keyword = e.target.value),
          keydown: (e) => {
            if (e.keyCode == 13) {
              params.pageNumber = 1;
              search(options);
            }
          },
        }}
      />
      <div
        class={{ [`${options.classPrefix}-search-btn`]: true }}
        on={{
          click: () => {
            params.pageNumber = 1;
            search(options);
          },
        }}
      >
        {icon("search")}
      </div>
    </div>
  );
  return vnode;
}

function initDataTable(options, rows = []) {
  const vnode = h(
    "div",
    {
      key: "data",
      class: { [`${options.classPrefix}-table`]: true },
      style: { width: formatSize(options.dataTableWidth) },
    },
    initTable(options, options.columns, rows, rowClick, "暂无数据")
  );
  if (!dataTable) {
    dataTable = vnode;
  }
  return vnode;
}

function initSelectedTable(options) {
  const vnode = h(
    "div",
    {
      key: "selected",
      class: { [`${options.classPrefix}-table`]: true },
      style: { flex: 1 },
    },
    initTable(
      options,
      [
        {
          label: initClearBtn(options),
          prop: options.labelProp,
          width: "100%",
          remove: true,
        },
      ],
      options.value
    )
  );
  if (!selectedTable) {
    selectedTable = vnode;
  }
  return vnode;
}

function initTable(options, columns, rows = [], rowClick, emptyText) {
  const table = [];
  table.push(
    h(
      "div",
      {
        key: rowClick ? "data-header" : "selected-header",
        class: { [`${options.classPrefix}-table-header`]: true },
        style: { height: formatSize(options.tableRowHeight) },
      },
      columns.map((e) => (
        <div
          class={{ [`${options.classPrefix}-table-cell`]: true }}
          style={{ justifyContent: e.headerAlign, width: e.width }}
        >
          {isVnode(e.label) ? e.label : <span>{e.label}</span>}
        </div>
      ))
    )
  );
  rows.forEach((row) => {
    table.push(initTableRow(options, columns, row, rowClick));
  });
  table.push(
    h(
      "div",
      {
        key: rowClick ? "data-empty" : "selected-empty",
        class: { [`${options.classPrefix}-table-empty`]: true },
      },
      [
        <span class={{ [`${options.classPrefix}-table-empty-text`]: true }}>
          {!rows.length && emptyText}
        </span>,
      ]
    )
  );
  return table;
}

function initTableRow(options, columns, row, rowClick) {
  const vnode = h(
    "div",
    {
      key: (rowClick ? "data" : "selected") + row[options.valueProp],
      class: {
        [`${options.classPrefix}-table-row`]: true,
        [`${options.classPrefix}-table-row-selected`]:
          rowClick && row.$selected,
      },
      style: { height: formatSize(options.tableRowHeight) },
      on: {
        click: () => {
          if (isFunction(rowClick)) {
            rowClick(row, vnode, options, columns);
          }
        },
      },
    },
    columns.map((column) => {
      const text = isFunction(column.formatter)
        ? column.formatter(row, column, row[column.prop], row.$index)
        : row[column.prop];
      if (column.remove) {
        return (
          <div
            class={{
              [`${options.classPrefix}-table-cell`]: true,
              [`${options.classPrefix}-table-cell-remove`]: true,
            }}
            style={{ width: column.width }}
          >
            <span
              style={{ flex: 1, textAlign: column.align }}
              props={{ title: text }}
            >
              {text}
            </span>
            <div
              class={{
                ["el-icon-"]: true,
                [`${options.classPrefix}-table-cell-remove-btn`]: true,
              }}
              style={{
                width: formatSize(options.tableRowHeight),
                height: formatSize(options.tableRowHeight - 1),
              }}
              props={{ title: "移除" }}
              on={{
                click: () => {
                  row.$selected = false;
                  const i = options.value.findIndex((e) => {
                    return e[options.valueProp] == row[options.valueProp];
                  });
                  options.value.splice(i, 1);
                  init2table(options);
                },
              }}
            />
          </div>
        );
      } else {
        return (
          <div
            class={{ [`${options.classPrefix}-table-cell`]: true }}
            style={{ justifyContent: column.align, width: column.width }}
            on={{
              mouseenter: (e) => showTooltip(e, options, text),
              mouseleave: closeTooltip,
            }}
          >
            <span>{text}</span>
          </div>
        );
      }
    })
  );
  return vnode;
}

function initClearBtn(options) {
  const vnode = (
    <div class={{ [`${options.classPrefix}-selected-label`]: true }}>
      <span>已选择{`（${options.value.length}）`}</span>
      <div
        class={{ [`${options.classPrefix}-selected-label-clear-btn`]: true }}
        on={{
          click: () => {
            options.value.forEach((e) => {
              e.$selected = false;
            });
            options.value = [];
            init2table(options);
          },
        }}
      >
        清空
      </div>
    </div>
  );
  return vnode;
}

function initPagination(options) {
  const vnode = (
    <div class={{ [`${options.classPrefix}-pagination`]: true }}>
      <span class={{ [`${options.classPrefix}-pagination-total`]: true }}>
        共{sourceData.total}条
      </span>
      <div
        class={{
          [`${options.classPrefix}-pagination-up-btn`]: true,
          [`${options.classPrefix}-pagination-btn-disabled`]:
            params.pageNumber == 1,
        }}
        on={{
          click: () => {
            params.pageNumber -= 1;
            search(options);
          },
        }}
      >
        {icon("left")}
      </div>
      {initPageNumber(options)}
      <div
        class={{
          [`${options.classPrefix}-pagination-down-btn`]: true,
          [`${options.classPrefix}-pagination-btn-disabled`]:
            params.pageNumber == Math.ceil(sourceData.total / params.pageSize),
        }}
        on={{
          click: () => {
            params.pageNumber += 1;
            search(options);
          },
        }}
      >
        {icon("right")}
      </div>
    </div>
  );
  if (!pagination) {
    pagination = vnode;
  }
  return vnode;
}

function initPageNumber(options) {
  const list = [];
  const arr = initPageArr(options);
  arr.forEach((i) => {
    list.push(
      h(
        "div",
        {
          key: i,
          class: {
            [`${options.classPrefix}-pagination-num`]: true,
            [`${options.classPrefix}-pagination-num-current`]:
              params.pageNumber == i,
            "el-icon-": i == "left" || i == "right",
            [`${options.classPrefix}-pagination-left`]: i == "left",
            [`${options.classPrefix}-pagination-right`]: i == "right",
          },
          on: {
            click: (e, v) => {
              if (v.key == "left") {
                params.pageNumber = Math.max(1, params.pageNumber - 5);
              } else if (v.key == "right") {
                const max = Math.ceil(sourceData.total / params.pageSize);
                params.pageNumber = Math.min(max, params.pageNumber + 5);
              } else {
                params.pageNumber = v.key;
              }
              search(options);
            },
          },
        },
        isNaN(i) ? "" : i
      )
    );
  });
  return list;
}

function initPageArr(options) {
  let arr = [];
  if (!sourceData.total) return [1];
  let max = Math.ceil(sourceData.total / params.pageSize);
  if (max > options.pageCount) {
    let right = true;
    arr.push(params.pageNumber);
    let i = options.pageCount - 1;
    while (i-- > 0) {
      if (right) {
        arr.push(arr[arr.length - 1] + 1);
      } else {
        arr.unshift(arr[0] - 1);
      }
      right = !right;
    }
    let diff = 0;
    if (arr[0] < 1) {
      diff = 1 - arr[0];
    } else if (arr[arr.length - 1] > max) {
      diff = max - arr[arr.length - 1];
    }
    arr = arr.map((e) => e + diff);
    if (arr[0] != 1) {
      arr[0] = "left";
      arr.unshift(1);
    }
    if (arr[arr.length - 1] != max) {
      arr[arr.length - 1] = "right";
      arr.push(max);
    }
  } else {
    while (max > 0) {
      arr.unshift(max--);
    }
  }
  return arr;
}

function initAction(options) {
  const vnode = (
    <div class={{ [`${options.classPrefix}-action`]: true }}>
      <div
        class={{ [`${options.classPrefix}-action-confirm-btn`]: true }}
        on={{
          click: () => {
            if (isFunction(options.confirm)) {
              options.confirm(options.value, close);
            }
          },
        }}
      >
        确 定
      </div>
      <div
        class={{ [`${options.classPrefix}-action-cancel-btn`]: true }}
        on={{ click: () => close(options) }}
      >
        取 消
      </div>
    </div>
  );
  return vnode;
}

function init2table(options) {
  sourceData.rows.forEach((e) => {
    const row = options.value.find(
      (f) => f[options.valueProp] == e[options.valueProp]
    );
    e.$selected = !!row;
  });
  selectedTable = patch(selectedTable, initSelectedTable(options));
  dataTable = patch(dataTable, initDataTable(options, sourceData.rows));
  dataTable.children.slice(1, dataTable.children.length - 1).forEach((e, i) => {
    if (!sourceData.rows[i].$selected) {
      e.elm.className = e.elm.className.replace(
        `${options.classPrefix}-table-row-selected`,
        ""
      );
    }
  });
}

function showTooltip(e, options, text) {
  timer = setTimeout(() => {
    const { clientWidth, scrollWidth } = e.target.firstChild;
    if (clientWidth == scrollWidth) {
      closeTooltip();
      return;
    }
    const { top, left, width } = e.target.getBoundingClientRect();
    const vnode = (
      <div
        class={{ [`${options.classPrefix}-table-cell-tooltip`]: true }}
        style={{ top: `${top - 30 - 4}px`, left: `${left + width / 2}px` }}
      >
        {text}
      </div>
    );
    if (!tooltip) {
      patch(getMountPoint(1), vnode);
    } else {
      patch(tooltip, vnode);
    }
    tooltip = vnode;
  }, 500);
}

function closeTooltip() {
  clearTimeout(timer);
  if (tooltip) {
    tooltip = patch(tooltip, <div style={{ display: "none" }} />);
  }
}

function rowClick(row, rowVnode, options, columns) {
  row.$selected = !row.$selected;
  const i = options.value.findIndex((e) => {
    return e[options.valueProp] == row[options.valueProp];
  });
  if (row.$selected) {
    i < 0 && options.value.push(row);
  } else {
    i > -1 && options.value.splice(i, 1);
  }
  patch(rowVnode, initTableRow(options, columns, row, rowClick));
  selectedTable = patch(selectedTable, initSelectedTable(options));
}

function search(options) {
  if (isFunction(options.searchMethod)) {
    options.searchMethod(params, (data) => {
      sourceData = data;
      searchDone(options);
    });
  }
}

function searchDone(options) {
  const { rows } = sourceData;
  rows.forEach((e, i) => {
    e.$index = i;
    const isExist = options.value.find((f) => {
      return f[options.valueProp] == e[options.valueProp];
    });
    e.$selected = !!isExist;
  });
  dataTable = patch(dataTable, initDataTable(options, rows));
  pagination = patch(pagination, initPagination(options, rows));
}

function open(options) {
  options = initOptions(options);
  const [wrapperPoint, dialogPoint] = getMountPoint(2);
  wrapper = initWrapper(options);
  dialog = initDialog(options);
  patch(wrapperPoint, wrapper);
  patch(dialogPoint, dialog);
}

// eslint-disable-next-line no-unused-vars
function close(options) {
  // destroy(patch(wrapper, initWrapper(options, "leave")), 200);
  // destroy(patch(dialog, initDialog(options, "leave")), 300);
  destroy(wrapper);
  destroy(dialog);
  dataTable = undefined;
  selectedTable = undefined;
  pagination = undefined;
  params.keyword = "";
  params.pageNumber = 1;
  params.pageSize = 10;
  sourceData.total = 0;
  sourceData.rows = [];
}

export { open, close };
