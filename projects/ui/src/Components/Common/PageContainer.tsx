export function PageContainer({ children }: { children: any }) {
  return (
    <div className="page-container-wrapper">
      <div className="page-container">{children}</div>
    </div>
  );
}
