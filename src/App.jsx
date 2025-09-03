import { useState } from 'react'
import Products from './features/products/ProductsView.jsx'

function Shell({ children }) {
  const [navOpen, setNavOpen] = useState(false)
  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-50 to-neutral-100 text-neutral-900">
      <div className="flex min-h-dvh">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 translate-x-[-100%] border-r border-neutral-200/70 bg-white/90 p-5 backdrop-blur transition md:static md:z-auto md:translate-x-0 ${navOpen ? '!translate-x-0 shadow-xl rounded-r-2xl' : ''}`}>
          <div className="text-lg font-semibold tracking-tight">Products</div>
          <div className="mt-3 h-px bg-neutral-200/70" />
          <nav className="mt-3 text-sm text-neutral-600">
            <a className="block rounded-md px-3 py-2 transition hover:bg-neutral-100 active:bg-neutral-100" href="#">Dashboard</a>
          </nav>
        </aside>
        {navOpen ? <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setNavOpen(false)} /> : null}
        <main className="flex-1">
          <header className="sticky top-3 z-10">
            <div className="pointer-events-none mx-4">
              <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-2.5 shadow-md ring-1 ring-black/5 backdrop-blur">
                <div className="flex items-center gap-2">
                  <button aria-label="Toggle navigation" className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-white hover:bg-neutral-50" onClick={() => setNavOpen(v => !v)}>
                    <span className="i-[menu] h-4 w-4">≡</span>
                  </button>
                  <div className="font-semibold tracking-tight">Product Dashboard</div>
                </div>
                <div className="hidden sm:block text-xs text-neutral-500">Manage your catalog</div>
              </div>
            </div>
          </header>
          <div className="mx-auto max-w-6xl p-4 pt-6 sm:p-6 sm:pt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Shell>
      <div id="products-view">
        <Products />
      </div>
    </Shell>
  )
}

export default App
