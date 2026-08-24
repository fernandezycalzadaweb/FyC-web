import { createContext, useContext, useState, useEffect } from 'react'

const KEY = 'fyc_cesta'

function loadItems() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? [] }
  catch { return [] }
}

const CestaContext = createContext(null)

export function CestaProvider({ children }) {
  const [items, setItems] = useState(loadItems)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const add    = (nombre) => setItems((p) => p.includes(nombre) ? p : [...p, nombre])
  const remove = (nombre) => setItems((p) => p.filter((n) => n !== nombre))
  const clear  = ()       => setItems([])
  const has    = (nombre) => items.includes(nombre)
  const toggle = (nombre) => setItems((p) =>
    p.includes(nombre) ? p.filter((n) => n !== nombre) : [...p, nombre]
  )

  return (
    <CestaContext.Provider value={{ items, add, remove, clear, has, toggle, count: items.length }}>
      {children}
    </CestaContext.Provider>
  )
}

export function useCesta() {
  return useContext(CestaContext)
}
