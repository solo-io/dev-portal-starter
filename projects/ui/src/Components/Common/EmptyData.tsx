export function EmptyData({
  topic,
  message,
}: {
  topic: string;
  message?: string;
}) {
  return (
    <div className="loadingContainer" aria-hidden="true">
      <div className="emptyCircle">
        <div className="chasePlate outer">
          <div className="circle"></div>
        </div>
        <div className="chasePlate inner">
          <div className="circle"></div>
        </div>
      </div>
      <div className="emptyMainMessage">No {topic} results were found</div>
      {!!message && <div className="emptyDetailsMessage">{message}</div>}
    </div>
  );
}
