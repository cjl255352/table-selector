function initWrapper() {
  return (
    <div class={{ "table-selector-wrapper": true }} on={{ click: close }} />
  );
}

export default initWrapper