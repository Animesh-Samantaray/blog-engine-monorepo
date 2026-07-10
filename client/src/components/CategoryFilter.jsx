const categories = ['All', 'Technology', 'Sports', 'Art', 'Education', 'Travel', 'Food', 'Lifestyle', 'Other']

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
            value === category
              ? 'bg-[color:var(--color-blue)] text-white'
              : 'border border-[var(--color-border)] bg-[color:var(--color-card)] text-secondary hover:border-[color:var(--color-blue)] hover:text-primary'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}