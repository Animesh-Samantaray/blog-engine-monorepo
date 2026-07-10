export default function Footer() {
  return (
    <footer className="border-t surface-divider bg-[color:var(--color-bg-secondary)] transition-colors duration-200">
      <div className="section-shell py-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-secondary sm:flex-row sm:text-left">
          <p className="font-medium text-primary">Blog Management System</p>
          <p>Made by Animesh Samantaray</p>
        </div>
      </div>
    </footer>
  )
}