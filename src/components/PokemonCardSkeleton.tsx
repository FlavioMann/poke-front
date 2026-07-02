export function PokemonCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="h-3 w-8 self-start rounded bg-neutral-200" />
      <div className="mt-2 h-24 w-24 rounded-full bg-neutral-200 sm:h-28 sm:w-28" />
      <div className="mt-3 h-4 w-20 rounded bg-neutral-200" />
      <div className="mt-2 h-5 w-16 rounded-full bg-neutral-200" />
    </div>
  )
}
