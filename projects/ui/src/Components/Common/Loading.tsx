export function Loading({ message }: { message?: string }) {
  return (
    <div className="loadingContainer" aria-hidden="true">
      <div className="loadingSpinner">
        <div className="chasePlate outer">
          <div className="circle"></div>
        </div>
        <div className="chasePlate inner">
          <div className="circle"></div>
        </div>
      </div>
      {!!message && <div className="loadingMessage">{message}</div>}
    </div>
  );
}
