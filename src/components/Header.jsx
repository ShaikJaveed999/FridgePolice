function Header({ onReset }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Shared food tracking for roommates</p>
        <h1>🧊 FridgePolice</h1>
      </div>
      <button type="button" className="secondary-button" onClick={onReset}>
        Reset Demo Data
      </button>
    </header>
  )
}

export default Header
