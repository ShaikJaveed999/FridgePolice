import { useState } from 'react'

function InventoryCard({ item, onSelectItem, onCorrectInventory, onMarkSpoiled, onQuickRequest }) {
  const [showCorrector, setShowCorrector] = useState(false)
  const [actualQuantity, setActualQuantity] = useState(item.quantity)

  const itemStatus = item.status === 'spoiled' ? 'Spoiled' : item.quantity === 0 ? 'Empty' : 'Available'

  const handleCorrectionSubmit = (event) => {
    event.preventDefault()
    onCorrectInventory(item.id, Number(actualQuantity))
    setShowCorrector(false)
  }

  return (
    <article className="inventory-card">
      <div className="card-header">
        <div>
          <h3>{item.name}</h3>
          <p className="muted">ID: {item.id}</p>
        </div>
        <span className={`status-badge ${item.status === 'spoiled' ? 'status-spoiled' : 'status-available'}`}>
          {itemStatus}
        </span>
      </div>

      <dl className="meta-list">
        <div>
          <dt>Owner</dt>
          <dd>{item.owner}</dd>
        </div>
        <div>
          <dt>Quantity</dt>
          <dd>
            {item.quantity} {item.unit}
          </dd>
        </div>
      </dl>

      <div className="card-actions">
        <button type="button" className="primary-button" onClick={() => onSelectItem(item.id)} disabled={item.status === 'spoiled' || item.quantity <= 0}>
          Request Portion
        </button>
        <button type="button" className="secondary-button" onClick={() => onQuickRequest(item.id)} disabled={item.status === 'spoiled' || item.quantity <= 0}>
          Reserve 25%
        </button>
        <button type="button" className="secondary-button" onClick={() => setShowCorrector((value) => !value)}>
          Correct Inventory
        </button>
        <button type="button" className="danger-button" onClick={() => onMarkSpoiled(item.id)} disabled={item.status === 'spoiled'}>
          Mark Spoiled
        </button>
      </div>

      {showCorrector && (
        <form className="correction-form" onSubmit={handleCorrectionSubmit}>
          <label htmlFor={`actual-${item.id}`}>Actual quantity</label>
          <input
            id={`actual-${item.id}`}
            type="number"
            min="0"
            max={item.unit === '%' ? 100 : 9999}
            value={actualQuantity}
            onChange={(event) => setActualQuantity(event.target.value)}
          />
          <button type="submit" className="primary-button small-button">
            Update Inventory
          </button>
        </form>
      )}
    </article>
  )
}

export default InventoryCard
