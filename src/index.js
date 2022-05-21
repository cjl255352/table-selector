import "@/style.scss";

var utils = {
  formatClass: function (value) {
    if (typeof value == "string") {
      return value.split(" ").filter(function (e) {
        return e;
      });
    } else if (value instanceof Array) {
      return value.filter(function (e) {
        return typeof e == "string" ? e.trim() : false;
      });
    }
    return [];
  },
};

function Node(tagName, attrs, text) {
  var self = this;
  this.el = document.createElement(tagName || "div");
  Object.keys(attrs || {}).forEach(function (key) {
    self.el.setAttribute(key, attrs[key]);
  });
  if (text !== undefined && text !== null && text !== "") {
    this.el.innerText = text;
  }
  this.events = [];
  this.children = [];
}

Node.prototype.appendChild = function (node) {
  this.children.push(node);
  this.el.appendChild(node.el);
};

Node.prototype.addEvents = function (events) {
  var self = this;
  events.forEach(function (e) {
    self.events.push(e);
    self.el.addEventListener(
      e.name,
      function () {
        e.fn.apply(self, arguments);
      },
      e.options
    );
  });
};

Node.prototype.getClass = function () {
  return this.el.className.split(" ").filter(function (e) {
    return e;
  });
};

Node.prototype.addClass = function (className) {
  var classList = this.getClass();
  utils.formatClass(className).forEach(function (e) {
    if (classList.indexOf(e) == -1) {
      classList.push(e);
    }
  });
  this.el.className = classList.join(" ");
};

Node.prototype.delClass = function (className) {
  var classList = this.getClass();
  utils.formatClass(className).forEach(function (e) {
    var i = classList.indexOf(e);
    if (i > -1) {
      classList.splice(i, 1);
    }
  });
  this.el.className = classList.join(" ");
};

var instance;
var table;
var defaultOptions = {};

function Table(attrs, columns) {
  var self = this;
  Node.call(this, "table", attrs);
  this.columns = columns || [];
  this.header = new Node("tr", { class: "flow-select-table-header" });
  this.columns.forEach(function (column) {
    var th = new Node("th", column.headerAttrs, column.label);
    th.addEvents([
      {
        name: "click",
        fn: function (e) {
          if (column.headerClick && typeof column.headerClick == "function") {
            column.headerClick.call(this, column, e);
          }
        },
      },
    ]);
    self.header.appendChild(th);
  });
  this.el.appendChild(this.header.el);
  this.data = [];
}

Table.prototype.setData = function (data) {
  var self = this;
  data.forEach(function (row, i) {
    var tr = new Node("tr", { class: "flow-select-table-row" });
    // tr.addEvents([
    //   {
    //     name: "click",
    //     fn: function (e) {
    //       if (column.rowClick && typeof column.rowClick == "function") {
    //         column.rowClick.call(this, row, i, e);
    //       }
    //     },
    //   },
    // ]);
    self.columns.forEach(function (column) {
      var td = new Node("td", column.cellAttrs, row[column.prop]);
      td.addEvents([
        {
          name: "click",
          fn: function (e) {
            if (column.cellClick && typeof column.cellClick == "function") {
              column.cellClick.call(this, row, i, column, row[column.prop], e);
            }
          },
        },
      ]);
      tr.appendChild(td);
    });
    self.data.push(tr);
    self.el.appendChild(tr.el);
  });
};

/**
 * 初始化弹窗头部
 * @returns {Node}
 */
function initHeader() {
  var header = new Node("div", { class: "flow-select-header" });
  var title = new Node("span", { class: "flow-select-title" }, "流程选择");
  var close = new Node("div", { class: "flow-select-close" });
  close.addEvents([
    {
      name: "click",
      fn: function () {
        this.delClass("is-hover");
        document.body.removeChild(instance.el);
      },
    },
    {
      name: "mouseover",
      fn: function () {
        this.addClass("is-hover");
      },
    },
    {
      name: "mouseleave",
      fn: function () {
        this.delClass("is-hover");
      },
    },
  ]);
  header.appendChild(title);
  header.appendChild(close);
  return header;
}

/**
 * 搜索数据
 * @param {String} keyword
 */
function queryData(keyword) {
  if (!keyword) {
    return;
  }
  table.setData([{ name: "1" }, { name: "2" }, { name: "3" }]);
}

/**
 * 初始化过滤
 * @returns {Node}
 */
function initFilter() {
  var filter = new Node("div", { class: "flow-select-filter" });
  var keyword = new Node("input", {
    class: "flow-select-keyword",
    placeholder: "请输入关键字",
  });
  var search = new Node("div", { class: "flow-select-search" });
  search.addEvents([
    {
      name: "click",
      fn: function () {
        queryData(keyword.el.value);
      },
    },
  ]);
  filter.appendChild(keyword);
  filter.appendChild(search);
  return filter;
}

/**
 * 初始化表格和已选框
 * @returns {Node}
 */
function initTransfer() {
  var transfer = new Node("div", { class: "flow-select-transfer" });
  var columns = [
    {
      label: "昵称",
      prop: "name",
      cellClick: function () {
        console.log(this, arguments);
      },
    },
  ];
  table = new Table({ class: "flow-select-table" }, columns);
  transfer.appendChild(table);
  return transfer;
}

/**
 * 初始化dom实例
 */
function init() {
  instance = new Node("div", {
    id: "flow-select",
    class: "flow-select-wrapper",
  });
  var dialog = new Node("div", { class: "flow-select-dialog" });
  dialog.appendChild(initHeader());
  dialog.appendChild(initFilter());
  dialog.appendChild(initTransfer());
  instance.appendChild(dialog);
}

init();

/**
 * 打开流程选择框
 * @param {Object} options
 */
function open(options) {
  console.log(options, defaultOptions);
  document.body.appendChild(instance.el);
}

export { open };
