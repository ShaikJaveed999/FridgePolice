function ApprovalList({ requests, items, onConsume, onExpire, onMarkSpoiled }) {
  const getItemName = (itemId) => items.find((item) => item.id === itemId)?.name || 'Unknown item'
  const getItemStatus = (itemId) => items.find((item) => item.id === itemId)?.status || 'available'

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Active / Recent Approvals</h2>
      </div>

      <div className="approval-list">
        {requests.length === 0 ? (
          <p className="empty-state">No approvals yet.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="approval-item">
              <div>
                <strong>{request.roommate}</strong>
                <p>
                  {getItemName(request.itemId)} · {request.quantity}{' '}
                  {items.find((item) => item.id === request.itemId)?.unit || '%'}
                </p>
              </div>

              <div className="approval-status-row">
                <span className={`status-badge ${request.status.toLowerCase()}`}>{request.status}</span>
                <div className="mini-actions">
                  {request.status === 'APPROVED' && getItemStatus(request.itemId) !== 'spoiled' && (
                    <>
                      <button type="button" className="primary-button small-button" onClick={() => onConsume(request.id)}>
                        Consume
                      </button>
                      <button type="button" className="secondary-button small-button" onClick={() => onExpire(request.id)}>
                        Expire
                      </button>
                    </>
                  )}
                  {request.status === 'APPROVED' && getItemStatus(request.itemId) === 'spoiled' && (
                    <button type="button" className="danger-button small-button" onClick={() => onMarkSpoiled(request.itemId)}>
                      Mark Spoiled
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default ApprovalList
