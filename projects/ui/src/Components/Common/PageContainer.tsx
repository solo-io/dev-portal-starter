function PageContainer({ children }: { children: any }) {
  //
  // Render
  //
  return (
    <div className="page-container-wrapper">
      <div className="page-container">{children}</div>
    </div>
  );
}

export default PageContainer;
