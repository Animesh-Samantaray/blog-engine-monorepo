export default function SearchBar({ value, onChange, onSubmit, onClear }) {
  return (
    <form
      className="flex flex-col gap-2.5 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-field flex-1"
        placeholder="Search blogs by title"
        type="search"
      />
      <div className="flex gap-2.5">
        <button type="submit" className="btn-primary">
          Search
        </button>
        {value ? (
          <button type="button" className="btn-secondary" onClick={onClear}>
            Clear
          </button>
        ) : null}
      </div>
    </form>
  )
}