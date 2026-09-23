function RequestForm({ items, form, setForm, onSubmit }) {
  const foodOptions = items.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.id})`,
  }))

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Request a Portion</h2>
      </div>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label>
            Roommate
            <select
              value={form.roommate}
              onChange={(event) => setForm((current) => ({ ...current, roommate: event.target.value }))}
            >
              <option value="">Select roommate</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </label>

          <label>
            Food Item
            <select
              value={form.itemId}
              onChange={(event) => setForm((current) => ({ ...current, itemId: event.target.value }))}
            >
              <option value="">Select food</option>
              {foodOptions.map((food) => (
                <option key={food.value} value={food.value}>
                  {food.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Requested Portion
          <input
            type="number"
            min="1"
            value={form.portion}
            onChange={(event) => setForm((current) => ({ ...current, portion: event.target.value }))}
            placeholder="25"
          />
        </label>

        <button type="submit" className="primary-button wide-button">
          Request Portion
        </button>
      </form>
    </section>
  )
}

export default RequestForm
