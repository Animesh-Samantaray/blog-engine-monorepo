const categories = ['All', 'Technology', 'Sports', 'Art', 'Education', 'Travel', 'Food', 'Lifestyle', 'Other']

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            value === category
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}