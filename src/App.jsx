import { useMemo, useState } from 'react'
import Header from './components/Header'
import InventoryCard from './components/InventoryCard'
import RequestForm from './components/RequestForm'
import ApprovalList from './components/ApprovalList'
import ActivityLog from './components/ActivityLog'
import { defaultFormState, initialItems, initialRequests } from './data/initialData'
import './App.css'

function createActivityEntry(text, type = 'success') {
  return {
    id: `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    type,
  }
}

function cloneItems(items) {
  return items.map((item) => ({ ...item }))
}

function cloneRequests(requests) {
  return requests.map((request) => ({ ...request }))
}

function App() {
  const [items, setItems] = useState(() => cloneItems(initialItems))
  const [requests, setRequests] = useState(() => cloneRequests(initialRequests))
  const [activities, setActivities] = useState([
    createActivityEntry('✓ Welcome back. Fridge inventory is ready to review.'),
    createActivityEntry('✓ Pizza starts at 25% and is ready for the double-allocation test.'),
  ])
  const [form, setForm] = useState(defaultFormState)
  const [toast, setToast] = useState({ type: 'success', text: '✓ Portion successfully reserved.' })

  const availableItems = useMemo(() => items.filter((item) => item.status !== 'spoiled'), [items])

  const addActivity = (text, type = 'success') => {
    setActivities((current) => [createActivityEntry(text, type), ...current].slice(0, 12))
  }

  const showToast = (text, type = 'success') => {
    setToast({ type, text })
  }

  const resetDemoData = () => {
    setItems(cloneItems(initialItems))
    setRequests(cloneRequests(initialRequests))
    setForm(defaultFormState)
    setActivities([
      createActivityEntry('✓ Demo data reset. All scenarios are ready to test again.'),
      createActivityEntry('✓ Pizza is back to 25% and the approval list has been restored.'),
    ])
    showToast('✓ Demo data reset successfully.', 'success')
  }

  const reservePortion = (itemId, quantity, roommate) => {
    const item = items.find((entry) => entry.id === itemId)

    if (!item) {
      showToast('✗ Food item not found.', 'error')
      return
    }

    if (item.status === 'spoiled') {
      showToast('✗ This food item is spoiled and cannot be requested.', 'error')
      return
    }

    if (quantity <= 0) {
      showToast('✗ Request must be greater than zero.', 'error')
      return
    }

    let allowed = false

    setItems((currentItems) => {
      const targetItem = currentItems.find((entry) => entry.id === itemId)

      if (!targetItem || targetItem.status === 'spoiled' || targetItem.quantity < quantity) {
        return currentItems
      }

      allowed = true
      return currentItems.map((entry) =>
        entry.id === itemId
          ? { ...entry, quantity: targetItem.quantity - quantity }
          : entry,
      )
    })

    if (!allowed) {
      showToast('✗ Request rejected: insufficient available quantity.', 'error')
      addActivity(`✗ ${roommate} request rejected — insufficient quantity for ${item.name}.`, 'error')
      return
    }

    const newRequest = {
      id: `req-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      itemId,
      roommate,
      quantity,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    }

    setRequests((currentRequests) => [newRequest, ...currentRequests])
    showToast(`✓ ${roommate} successfully reserved ${quantity}% ${item.name}.`, 'success')
    addActivity(`✓ ${roommate} successfully reserved ${quantity}% of ${item.name}.`, 'success')
  }

  const handleRequestSubmit = (submission) => {
    const roommate = submission.roommate
    const itemId = submission.itemId
    const quantity = Number(submission.portion)

    if (!roommate) {
      showToast('✗ Please select a roommate.', 'error')
      return
    }

    if (!itemId) {
      showToast('✗ Please select a food item.', 'error')
      return
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      showToast('✗ Portion must be greater than zero.', 'error')
      return
    }

    reservePortion(itemId, quantity, roommate)
  }

  const handleQuickRequest = (itemId) => {
    const item = items.find((entry) => entry.id === itemId)
    if (!item) return

    reservePortion(itemId, 25, 'B')
    setForm((current) => ({ ...current, roommate: 'B', itemId }))
  }

  const handleConsume = (requestId) => {
    const request = requests.find((entry) => entry.id === requestId)
    if (!request) return

    if (request.status !== 'APPROVED') {
      showToast('✗ This approval cannot be consumed.', 'error')
      return
    }

    const item = items.find((entry) => entry.id === request.itemId)
    if (!item) return

    if (item.status === 'spoiled') {
      showToast('✗ This food is spoiled and cannot be consumed.', 'error')
      return
    }

    setRequests((currentRequests) =>
      currentRequests.map((entry) =>
        entry.id === requestId ? { ...entry, status: 'CONSUMED' } : entry,
      ),
    )

    setItems((currentItems) =>
      currentItems.map((entry) =>
        entry.id === request.itemId ? { ...entry, quantity: 0, status: 'available' } : entry,
      ),
    )

    showToast(`✓ ${request.roommate} consumed ${request.quantity}% ${item.name}.`, 'success')
    addActivity(`✓ ${item.id} was consumed.`, 'success')
  }

  const handleExpire = (requestId) => {
    const request = requests.find((entry) => entry.id === requestId)
    if (!request) return

    if (request.status !== 'APPROVED') {
      showToast('✗ This approval cannot be expired.', 'error')
      return
    }

    const item = items.find((entry) => entry.id === request.itemId)
    if (!item) return

    setRequests((currentRequests) =>
      currentRequests.map((entry) =>
        entry.id === requestId ? { ...entry, status: 'EXPIRED' } : entry,
      ),
    )

    if (item.status !== 'spoiled') {
      setItems((currentItems) =>
        currentItems.map((entry) =>
          entry.id === request.itemId
            ? { ...entry, quantity: entry.quantity + request.quantity }
            : entry,
        ),
      )
      showToast(`✓ Approval for ${request.roommate} expired and ${request.quantity}% was returned to ${item.name}.`, 'success')
      addActivity(`✓ Approval for ${request.roommate} expired.`, 'success')
    } else {
      showToast(`⚠ Approval expired but ${item.name} was already spoiled.`, 'error')
      addActivity(`⚠ ${item.name} was spoiled, so the reserved amount was not restored.`, 'error')
    }
  }

  const handleMarkSpoiled = (itemId) => {
    const item = items.find((entry) => entry.id === itemId)
    if (!item) return

    if (item.status === 'spoiled') {
      showToast('✗ This item is already spoiled.', 'error')
      return
    }

    setItems((currentItems) =>
      currentItems.map((entry) =>
        entry.id === itemId ? { ...entry, status: 'spoiled' } : entry,
      ),
    )

    setRequests((currentRequests) =>
      currentRequests.map((entry) =>
        entry.itemId === itemId && entry.status === 'APPROVED'
          ? { ...entry, status: 'SPOILED' }
          : entry,
      ),
    )

    showToast(`⚠ ${item.name} marked as spoiled.`, 'error')
    addActivity(`⚠ ${item.name} marked as spoiled.`, 'error')
  }

  const handleCorrectInventory = (itemId, actualQuantity) => {
    const item = items.find((entry) => entry.id === itemId)
    if (!item) return

    if (!Number.isFinite(actualQuantity) || actualQuantity < 0) {
      showToast('✗ Actual quantity cannot be negative.', 'error')
      return
    }

    if (item.unit === '%' && actualQuantity > 100) {
      showToast('✗ Percent values cannot exceed 100%.', 'error')
      return
    }

    const previous = item.quantity
    setItems((currentItems) =>
      currentItems.map((entry) =>
        entry.id === itemId ? { ...entry, quantity: actualQuantity } : entry,
      ),
    )

    showToast(`✓ Inventory corrected successfully.`, 'success')
    addActivity(`✓ Inventory corrected: ${item.name} ${previous}% → ${actualQuantity}%`, 'success')
  }

  return (
    <div className="app-shell">
      <Header onReset={resetDemoData} />

      <div className={`toast ${toast.type}`}>
        {toast.text}
      </div>

      <main className="dashboard">
        <section className="inventory-section">
          <div className="section-heading">
            <h2>Inventory</h2>
          </div>
          <div className="inventory-grid">
            {items.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onSelectItem={(selectedId) => setForm((current) => ({ ...current, itemId: selectedId }))}
                onCorrectInventory={handleCorrectInventory}
                onMarkSpoiled={handleMarkSpoiled}
                onQuickRequest={handleQuickRequest}
              />
            ))}
          </div>
        </section>

        <RequestForm items={availableItems} form={form} setForm={setForm} onSubmit={handleRequestSubmit} />

        <ApprovalList requests={requests} items={items} onConsume={handleConsume} onExpire={handleExpire} onMarkSpoiled={handleMarkSpoiled} />

        <ActivityLog activities={activities} />
      </main>
    </div>
  )
}

export default App
