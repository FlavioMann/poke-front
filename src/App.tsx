import { Route, Routes } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { HomePage } from '@/pages/HomePage'
import { PokemonDetailPage } from '@/pages/PokemonDetailPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { ComparePage } from '@/pages/ComparePage'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 pb-16 sm:pb-0">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/comparar" element={<ComparePage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
