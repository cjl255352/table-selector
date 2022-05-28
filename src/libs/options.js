import mock from "./mock";

export default {
  classPrefix: "table-selector",
  height: "600px",
  width: "900px",
  title: "流程选择",
  titlePosition: "left",
  searchPlaceholder: "请输入关键字",
  columns: [
    {
      label: "序号",
      prop: "$index",
      headerAlign: "center",
      align: "center",
      width: 80,
    },
    {
      label: "PDMC领域",
      prop: "domain",
      width: "150px",
    },
    {
      label: "电子流名称",
      prop: "name",
    },
    {
      label: "电子流owner",
      prop: "owner",
      width: "130px",
    },
  ],
  searchMethod: mock,
};
