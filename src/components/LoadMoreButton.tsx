interface LoadMoreButtonProps {
  onClick: () => void
  loading?: boolean
  label?: string
}

export function LoadMoreButton({ onClick, loading = false, label = 'Carregar mais' }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center py-8">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Carregando...' : label}
      </button>
    </div>
  )
}
