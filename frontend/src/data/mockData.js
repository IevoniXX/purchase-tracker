export const STATUSES = {
  PICKUP: 'pickup',
  ORDERED: 'ordered',
  WISHLIST: 'wishlist',
  DELIVERED: 'delivered',
}

export const SUPPLIER_MAP = {
  'Amazon': { label: 'Amazon', icon: '📦' },
  'eBay': { label: 'eBay', icon: '🛒' },
  'IKEA Online': { label: 'IKEA Online', icon: '🏪' },
  'WhatsApp 2nd hand': { label: 'WhatsApp 2nd hand', icon: '💬' },
}

export const TABS = [
  { key: 'all', label: 'All' },
  { key: STATUSES.WISHLIST, label: 'Wish List' },
  { key: STATUSES.ORDERED, label: 'Ordered' },
  { key: STATUSES.PICKUP, label: 'Pick Up' },
  { key: STATUSES.DELIVERED, label: 'Delivered' },
]

export const SECTIONS = [
  { key: STATUSES.PICKUP, title: '🚨 Pick up from post office' },
  { key: STATUSES.ORDERED, title: '🚚 Ordered — in transit' },
  { key: STATUSES.WISHLIST, title: '⭐ Wish list' },
  { key: STATUSES.DELIVERED, title: '✅ Recently delivered' },
]

export function getStats(itemsList) {
  const wishlist = itemsList.filter(i => i.status === STATUSES.WISHLIST).length
  const ordered = itemsList.filter(i => i.status === STATUSES.ORDERED).length
  const pickup = itemsList.filter(i => i.status === STATUSES.PICKUP).length
  const delivered = itemsList.filter(i => i.status === STATUSES.DELIVERED).length
  const spentThisMonth = itemsList
    .filter(i => i.status === STATUSES.DELIVERED || i.status === STATUSES.ORDERED || i.status === STATUSES.PICKUP)
    .reduce((sum, i) => sum + i.price, 0)

  return { wishlist, ordered, pickup, delivered, spentThisMonth }
}
