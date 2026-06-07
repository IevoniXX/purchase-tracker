import { useState, useMemo, useEffect, useCallback } from 'react'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import Tabs from './components/Tabs'
import ItemSection from './components/ItemSection'
import AddItemForm from './components/AddItemForm'
import { SECTIONS, STATUSES, getStats, SUPPLIER_MAP } from './data/mockData'
import { fetchItems, createItem, updateItem, deleteItem as apiDeleteItem } from './api'

function toFrontend(item) {
  return {
    ...item,
    supplier: SUPPLIER_MAP[item.supplier] || { label: item.supplier, icon: '📦' },
    isEstimate: item.is_estimate,
    boughtDate: item.bought_date,
    deliveryWindow: item.delivery_window,
    deliveredDate: item.delivered_date,
    urgentDeadline: item.urgent_deadline,
    wishlistStatus: item.wishlist_status,
  }
}

export default function App() {
  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [personFilter, setPersonFilter] = useState('Both')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const loadItems = useCallback(() => {
    fetchItems().then(data => setItems(data.map(toFrontend)))
  }, [])

  useEffect(() => { loadItems() }, [loadItems])

  async function handleAdd(payload) {
    await createItem(payload)
    loadItems()
    setShowForm(false)
  }

  async function handleEdit(payload) {
    await updateItem(editingItem.id, payload)
    loadItems()
    setEditingItem(null)
  }

  function openEdit(item) {
    setEditingItem({
      ...item,
      supplier: item.supplier.label,
      is_estimate: item.isEstimate,
      bought_date: item.boughtDate,
      delivery_window: item.deliveryWindow,
      delivered_date: item.deliveredDate,
      urgent_deadline: item.urgentDeadline,
      wishlist_status: item.wishlistStatus,
    })
  }

  async function handleDelete(id) {
    await apiDeleteItem(id)
    loadItems()
  }

  const filteredByPerson = useMemo(() => {
    if (personFilter === 'Both') return items
    return items.filter(i => i.person === personFilter || i.person === 'Both')
  }, [personFilter, items])

  const stats = useMemo(() => getStats(filteredByPerson), [filteredByPerson])

  const counts = useMemo(() => ({
    [STATUSES.WISHLIST]: filteredByPerson.filter(i => i.status === STATUSES.WISHLIST).length,
    [STATUSES.ORDERED]: filteredByPerson.filter(i => i.status === STATUSES.ORDERED).length,
    [STATUSES.PICKUP]: filteredByPerson.filter(i => i.status === STATUSES.PICKUP).length,
    [STATUSES.DELIVERED]: filteredByPerson.filter(i => i.status === STATUSES.DELIVERED).length,
  }), [filteredByPerson])

  const knownSuppliers = useMemo(
    () => [...new Set(items.map(i => i.supplier.label))],
    [items]
  )

  const visibleSections = SECTIONS.filter(
    s => activeTab === 'all' || s.key === activeTab
  )

  return (
    <>
      <Header personFilter={personFilter} onPersonFilterChange={setPersonFilter} />
      <StatsBar stats={stats} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
      <main className="main-content">
        <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Item</button>
        {visibleSections.map(section => (
          <ItemSection
            key={section.key}
            title={section.title}
            items={filteredByPerson.filter(i => i.status === section.key)}
            onDelete={handleDelete}
            onEdit={openEdit}
          />
        ))}
        <div className="future-banner">
          <strong>🏠 Coming soon: Home Inventory</strong><br />
          Track everything you own — age, condition, original cost, estimated resale value.
          Know what to keep, sell, or toss.
        </div>
      </main>
      {showForm && <AddItemForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} knownSuppliers={knownSuppliers} />}
      {editingItem && <AddItemForm editItem={editingItem} onSubmit={handleEdit} onCancel={() => setEditingItem(null)} knownSuppliers={knownSuppliers} />}
    </>
  )
}
