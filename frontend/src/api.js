const BASE = '/api/items'

export async function fetchItems() {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch items')
  return res.json()
}

export async function createItem(item) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error('Failed to create item')
  return res.json()
}

export async function updateItem(id, item) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error('Failed to update item')
  return res.json()
}

export async function deleteItem(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete item')
}
