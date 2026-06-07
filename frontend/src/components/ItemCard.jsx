import { useState } from 'react'
import { STATUSES } from '../data/mockData'

const WISHLIST_ICONS = {
  Discussing: '💬',
  Researching: '🔍',
  Approved: '✅',
  Looking: '🔍',
}

function progressColor(item) {
  if (item.status === STATUSES.PICKUP) return 'fill-red'
  if (item.progress >= 80) return 'fill-green'
  return 'fill-yellow'
}

function cardVariant(status) {
  const map = {
    [STATUSES.PICKUP]: 'urgent',
    [STATUSES.ORDERED]: 'arriving',
    [STATUSES.WISHLIST]: 'wishlist',
    [STATUSES.DELIVERED]: 'delivered',
  }
  return map[status] || ''
}

export default function ItemCard({ item, onDelete, onEdit }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className={`card ${cardVariant(item.status)}`}>
      <div className="card-header">
        <div className="card-title">{item.name}</div>
        <div className="card-header-right">
          <div className="card-price">
            {item.isEstimate ? '~' : ''}€{item.price.toFixed(2)}
          </div>
          <button className="btn-edit" onClick={() => onEdit(item)} title="Edit">✎</button>
          {!confirming ? (
            <button className="btn-delete" onClick={() => setConfirming(true)} title="Delete">✕</button>
          ) : (
            <div className="confirm-delete">
              <span className="confirm-text">Delete?</span>
              <button className="btn-confirm-yes" onClick={() => onDelete(item.id)}>Yes</button>
              <button className="btn-confirm-no" onClick={() => setConfirming(false)}>No</button>
            </div>
          )}
        </div>
      </div>

      <div className="card-meta">
        <span className="tag tag-supplier">
          {item.supplier.icon} {item.supplier.label}
        </span>

        {item.boughtDate && (
          <span className="tag tag-date">🛒 Bought {item.boughtDate}</span>
        )}

        {item.deliveryWindow && (
          <span className="tag tag-delivery">📅 Arriving {item.deliveryWindow}</span>
        )}

        {item.deliveredDate && (
          <span className="tag tag-date">✅ Delivered {item.deliveredDate}</span>
        )}

        {item.urgentDeadline && (
          <span className="tag tag-urgent">⏰ Pick up by {item.urgentDeadline}!</span>
        )}

        {item.wishlistStatus && (
          <span className="tag tag-status">
            {WISHLIST_ICONS[item.wishlistStatus] || '📌'} {item.wishlistStatus}
          </span>
        )}

        <span className="tag tag-person">👤 {item.person}</span>
      </div>

      {item.note && <div className="card-note">{item.note}</div>}

      {item.progress != null && (
        <div className="progress-bar">
          <div
            className={`fill ${progressColor(item)}`}
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
