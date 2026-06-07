import { useState } from 'react'

const EMPTY = {
  name: '',
  price: '',
  is_estimate: false,
  status: 'wishlist',
  supplier: 'Amazon',
  person: 'Both',
  bought_date: '',
  delivery_window: '',
  delivered_date: '',
  urgent_deadline: '',
  wishlist_status: '',
  note: '',
  progress: '',
}

const SUPPLIERS = ['Amazon', 'eBay', 'IKEA Online', 'WhatsApp 2nd hand']
const STATUSES = ['wishlist', 'ordered', 'pickup', 'delivered']
const PERSONS = ['Ieva', 'Cesar', 'Both']
const WISHLIST_STATUSES = ['', 'Discussing', 'Researching', 'Approved', 'Looking']

function toFormData(item) {
  if (!item) return EMPTY
  return {
    name: item.name || '',
    price: item.price != null ? String(item.price) : '',
    is_estimate: item.is_estimate || false,
    status: item.status || 'wishlist',
    supplier: item.supplier || 'Amazon',
    person: item.person || 'Both',
    bought_date: item.bought_date || '',
    delivery_window: item.delivery_window || '',
    delivered_date: item.delivered_date || '',
    urgent_deadline: item.urgent_deadline || '',
    wishlist_status: item.wishlist_status || '',
    note: item.note || '',
    progress: item.progress != null ? String(item.progress) : '',
  }
}

export default function AddItemForm({ onSubmit, onCancel, knownSuppliers, editItem }) {
  const isEditing = !!editItem
  const [form, setForm] = useState(() => toFormData(editItem))
  const [customSupplier, setCustomSupplier] = useState(() => {
    if (!editItem) return false
    return !SUPPLIERS.includes(editItem.supplier)
  })

  const allSuppliers = [...new Set([...SUPPLIERS, ...knownSuppliers])]

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      progress: form.progress ? parseInt(form.progress, 10) : null,
      bought_date: form.bought_date || null,
      delivery_window: form.delivery_window || null,
      delivered_date: form.delivered_date || null,
      urgent_deadline: form.urgent_deadline || null,
      wishlist_status: form.wishlist_status || null,
      note: form.note || null,
    }
    onSubmit(payload)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-row">
            <label>
              Name *
              <input required value={form.name} onChange={e => set('name', e.target.value)} />
            </label>
            <label>
              Price
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
            </label>
          </div>

          <div className="form-row">
            <label>
              Status *
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label>
              Supplier *
              {customSupplier ? (
                <div className="supplier-custom">
                  <input
                    required
                    placeholder="Type supplier name"
                    value={form.supplier}
                    onChange={e => set('supplier', e.target.value)}
                  />
                  <button type="button" className="btn-supplier-toggle" onClick={() => { setCustomSupplier(false); set('supplier', allSuppliers[0]) }}>List</button>
                </div>
              ) : (
                <div className="supplier-custom">
                  <select value={form.supplier} onChange={e => set('supplier', e.target.value)}>
                    {allSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button type="button" className="btn-supplier-toggle" onClick={() => { setCustomSupplier(true); set('supplier', '') }}>Other</button>
                </div>
              )}
            </label>
            <label>
              Person *
              <select value={form.person} onChange={e => set('person', e.target.value)}>
                {PERSONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Bought Date
              <input placeholder="e.g. Jun 7" value={form.bought_date} onChange={e => set('bought_date', e.target.value)} />
            </label>
            <label>
              Delivery Window
              <input placeholder="e.g. Jun 10–12" value={form.delivery_window} onChange={e => set('delivery_window', e.target.value)} />
            </label>
            <label>
              Delivered Date
              <input placeholder="e.g. Jun 10" value={form.delivered_date} onChange={e => set('delivered_date', e.target.value)} />
            </label>
          </div>

          <div className="form-row">
            <label>
              Urgent Deadline
              <input placeholder="e.g. Jun 15" value={form.urgent_deadline} onChange={e => set('urgent_deadline', e.target.value)} />
            </label>
            <label>
              Wishlist Status
              <select value={form.wishlist_status} onChange={e => set('wishlist_status', e.target.value)}>
                {WISHLIST_STATUSES.map(s => <option key={s} value={s}>{s || '— none —'}</option>)}
              </select>
            </label>
            <label>
              Progress (0–100)
              <input type="number" min="0" max="100" value={form.progress} onChange={e => set('progress', e.target.value)} />
            </label>
          </div>

          <label className="form-row-full">
            Price is approximate
            <input type="checkbox" checked={form.is_estimate} onChange={e => set('is_estimate', e.target.checked)} />
          </label>

          <label className="form-row-full">
            Note
            <textarea rows={2} value={form.note} onChange={e => set('note', e.target.value)} />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-submit">{isEditing ? 'Save Changes' : 'Add Item'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
