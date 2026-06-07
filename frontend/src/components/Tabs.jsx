import { TABS } from '../data/mockData'

export default function Tabs({ activeTab, onTabChange, counts }) {
  return (
    <div className="tabs">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
          {tab.key !== 'all' && counts[tab.key] > 0 && (
            <span className="badge">{counts[tab.key]}</span>
          )}
        </button>
      ))}
    </div>
  )
}
