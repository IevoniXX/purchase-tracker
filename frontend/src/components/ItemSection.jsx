import ItemCard from './ItemCard'

export default function ItemSection({ title, items, onDelete, onEdit }) {
  if (items.length === 0) return null

  return (
    <div className="section">
      <div className="section-title">{title}</div>
      <div className="card-grid">
        {items.map(item => (
          <ItemCard key={item.id} item={item} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  )
}
