export function Loading({ message }: { message?: string }) {
  return (
    <div className="loadingContainer" aria-hidden="true">
      <div className="loadingSpinner">
        <div class="chasePlate outer">
          <div class="circle"></div>
        </div>
        <div class="chasePlate inner">
          <div class="circle"></div>
        </div>
      </div>
      {!!message && <div className="loadingMessage">{message}</div>}
    </div>
  );
}
