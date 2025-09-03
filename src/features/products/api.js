const BASE = 'https://dummyjson.com'

export async function fetchProducts({ page = 0, limit = 10, q = '', category = '' } = {}) {
    const skip = page * limit
    let url
    if (q) {
        url = new URL(`${BASE}/products/search`)
        url.searchParams.set('q', q)
    } else if (category) {
        url = new URL(`${BASE}/products/category/${encodeURIComponent(category)}`)
    } else {
        url = new URL(`${BASE}/products`)
    }
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('skip', String(skip))
    url.searchParams.set('delay', '800')
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to load products')
    return res.json()
}

export async function createProduct(body) {
    const res = await fetch(`${BASE}/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error('Failed to create product')
    return res.json()
}

export async function updateProduct(id, body) {
    const res = await fetch(`${BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error('Failed to update product')
    return res.json()
}

export async function removeProduct(id) {
    const res = await fetch(`${BASE}/products/${id}`, {
        method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to delete product')
    return res.json()
}

export async function fetchCategories() {
    const res = await fetch(`${BASE}/products/categories`)
    if (!res.ok) throw new Error('Failed to load categories')
    return res.json()
}


