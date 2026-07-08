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
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20'
              : 'border border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}