import Mock from "mockjs";

function mock(params, done) {
  const { pageNumber, pageSize } = params;
  const data = Mock.mock({
    [`list|${pageSize}`]: [
      {
        "id|+1": pageSize * (pageNumber - 1),
        domainInfo: "@ctitle(3, 10)",
        electronFlowName: "@ctitle(3, 20)",
        ownerName: "@cname",
      },
    ],
  });
  done({
    rows: data.list,
    total: 666,
  });
}

export default mock;
