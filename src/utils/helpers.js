export function addActivity(activities, text, type = 'success') {
  return [{ id: crypto.randomUUID(), text, type }, ...activities].slice(0, 12)
}

export function getItemById(items, itemId) {
  return items.find((item) => item.id === itemId)
}

export function formatQuantity(item) {
  return `${item.quantity} ${item.unit}`
}
