import { Route, Routes } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { HomePage } from '@/pages/HomePage'
import { PokemonDetailPage } from '@/pages/PokemonDetailPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { ComparePage } from '@/pages/ComparePage'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/comparar" element={<ComparePage />} />
      </Routes>
    </div>
  )
}

export default App
