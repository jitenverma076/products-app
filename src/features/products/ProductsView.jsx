import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts, fetchCategories, createProduct, updateProduct, removeProduct } from './api'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import Button from '../../components/ui/button'
import Input from '../../components/ui/input'
import Skeleton from '../../components/ui/skeleton'
import { Dialog, DialogHeader } from '../../components/ui/dialog'
import { Table, TSimple } from '../../components/ui/table'
import Badge from '../../components/ui/badge'

export default function ProductsView() {
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [openAdd, setOpenAdd] = useState(false)
    const [editData, setEditData] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const qc = useQueryClient()

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories
    })

    const queryKey = useMemo(() => ['products', { page, search, category }], [page, search, category])
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey,
        queryFn: () => fetchProducts({ page, limit: 10, q: search, category }),
        keepPreviousData: true
    })

    function updateAllProductCaches(updater) {
        const queries = qc.getQueriesData({ queryKey: ['products'] })
        queries.forEach(([key, value]) => {
            if (!value) return
            qc.setQueryData(key, (old) => {
                if (!old) return old
                const next = { ...old }
                if (Array.isArray(next.products)) {
                    next.products = updater(next.products)
                }
                if (typeof next.total === 'number') {
                    next.total = Math.max(0, next.products?.length ?? 0, next.total)
                }
                return next
            })
        })
    }

    const addMut = useMutation({
        mutationFn: createProduct,
        onMutate: async (newItem) => {
            await qc.cancelQueries({ queryKey: ['products'] })
            const snapshots = qc.getQueriesData({ queryKey: ['products'] })
            updateAllProductCaches((arr) => [{ id: Math.random(), ...newItem }, ...arr])
            return { snapshots }
        },
        onError: (_err, _vars, ctx) => {
            ctx?.snapshots?.forEach(([key, data]) => qc.setQueryData(key, data))
        },
        onSuccess: (result) => {
            updateAllProductCaches((arr) => [{ ...result }, ...arr.filter(p => p.id !== result.id)])
        }
    })
    const editMut = useMutation({
        mutationFn: ({ id, values }) => updateProduct(id, values),
        onMutate: async ({ id, values }) => {
            await qc.cancelQueries({ queryKey: ['products'] })
            const snapshots = qc.getQueriesData({ queryKey: ['products'] })
            updateAllProductCaches((arr) => arr.map((p) => (p.id === id ? { ...p, ...values } : p)))
            return { snapshots }
        },
        onError: (_err, _vars, ctx) => {
            ctx?.snapshots?.forEach(([key, data]) => qc.setQueryData(key, data))
        },
        onSuccess: ({ id, ...rest }) => {
            updateAllProductCaches((arr) => arr.map((p) => (p.id === id ? { ...p, ...rest } : p)))
        }
    })
    const delMut = useMutation({
        mutationFn: (id) => removeProduct(id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ['products'] })
            const snapshots = qc.getQueriesData({ queryKey: ['products'] })
            updateAllProductCaches((arr) => arr.filter((p) => p.id !== id))
            return { snapshots }
        },
        onError: (_err, _vars, ctx) => {
            ctx?.snapshots?.forEach(([key, data]) => qc.setQueryData(key, data))
        },
        onSuccess: () => {
            setDeletingId(null)
        }
    })

    const total = data?.total ?? 0
    const hasPrev = page > 0
    const hasNext = (page + 1) * 10 < total

    return (
        <div className="space-y-4">
            <div className="mb-2 grid gap-3 sm:grid-cols-2">
                <Card className="overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-sm text-neutral-500">Snapshot</div>
                                <div className="text-lg font-semibold">Catalog Overview</div>
                            </div>
                            <div className="flex gap-2">
                                <Badge tone="blue">Products {total}</Badge>
                                <Badge tone="green">Page {page + 1}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-sky-50 to-emerald-50">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-neutral-600">Quick action</div>
                            <Button variant="success" onClick={() => setOpenAdd(true)}>Add Product</Button>
                        </div>
                        <p className="mt-2 text-sm text-neutral-500">Create a new product and it will appear in the list instantly.</p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Badge tone="blue">Total {total}</Badge>
                    <Badge tone="green">Page {page + 1}</Badge>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => { setPage(0); setSearch(e.target.value) }}
                            className="w-full sm:w-56"
                        />
                        <select
                            className="h-9 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm sm:w-auto"
                            value={category}
                            onChange={(e) => { setPage(0); setCategory(e.target.value) }}
                        >
                            <option value="">All categories</option>
                            {(categories || []).map((c) => (
                                <option key={c.slug || c} value={c.slug || c}>{c.name || c}</option>
                            ))}
                        </select>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={() => setOpenAdd(true)}>Add Product</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-sm text-red-600">{error?.message || 'Something went wrong'} <Button variant="ghost" onClick={() => refetch()}>Retry</Button></div>
                    ) : (data?.products?.length ? (
                        <>
                            <div className="sm:hidden space-y-3">
                                {data.products.map((p) => (
                                    <div key={p.id} className="rounded-xl border border-neutral-200/70 bg-white/90 p-3 shadow-sm backdrop-blur">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex gap-3">
                                                <img src={p.thumbnail || (p.images && p.images[0])} alt="" className="h-12 w-12 flex-none rounded-md object-cover ring-1 ring-neutral-200" />
                                                <div>
                                                    <div className="font-medium">{p.title}</div>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                                                        <span>${p.price}</span>
                                                        <Badge tone="amber">{p.category}</Badge>
                                                        <span>Stock: {p.stock}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-2">
                                            <Button variant="success" size="sm" className="flex-1" onClick={() => setEditData(p)} disabled={editMut.isPending && editData?.id === p.id}>{editMut.isPending && editData?.id === p.id ? 'Saving...' : 'Edit'}</Button>
                                            <Button variant="danger" size="sm" className="flex-1" onClick={() => { setDeletingId(p.id); delMut.mutate(p.id) }} disabled={deletingId === p.id}>{deletingId === p.id ? 'Deleting...' : 'Delete'}</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Table className="-mx-2 hidden overflow-x-auto sm:mx-0 sm:block">
                                <TSimple headers={["Product", "Price", "Category", "Stock", "Actions"]}>
                                    {data.products.map((p) => (
                                        <tr key={p.id} className="group">
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <img src={p.thumbnail || (p.images && p.images[0])} alt="" className="h-10 w-10 rounded-md object-cover ring-1 ring-neutral-200" />
                                                    <div className="font-medium">{p.title}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-middle">${p.price}</td>
                                            <td className="px-4 py-3 align-middle"><Badge tone="amber">{p.category}</Badge></td>
                                            <td className="px-4 py-3 align-middle">{p.stock}</td>
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="success" size="sm" onClick={() => setEditData(p)} disabled={editMut.isPending && editData?.id === p.id}>{editMut.isPending && editData?.id === p.id ? 'Saving...' : 'Edit'}</Button>
                                                    <Button variant="danger" size="sm" onClick={() => { setDeletingId(p.id); delMut.mutate(p.id) }} disabled={deletingId === p.id}>{deletingId === p.id ? 'Deleting...' : 'Delete'}</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </TSimple>
                            </Table>
                        </>
                    ) : (
                        <div className="rounded-lg border bg-white p-6 text-center text-sm text-neutral-600">
                            <div className="mb-2 text-base font-medium">No products found</div>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    ))}

                    <div className="mt-4 flex items-center justify-between gap-2 sm:justify-end">
                        <Button className="flex-1 sm:flex-none" variant="outline" size="sm" disabled={!hasPrev || isFetching} onClick={() => setPage((v) => Math.max(0, v - 1))}>Previous</Button>
                        <Button className="flex-1 sm:flex-none" variant="outline" size="sm" disabled={!hasNext || isFetching} onClick={() => setPage((v) => v + 1)}>Next</Button>
                    </div>
                </CardContent>
            </Card>

            <AddDialog open={openAdd} onOpenChange={setOpenAdd} onSubmit={(values) => addMut.mutate(values, { onSuccess: () => setOpenAdd(false) })} />
            <EditDialog data={editData} onClose={() => setEditData(null)} onSubmit={(values) => editMut.mutate({ id: editData.id, values }, { onSuccess: () => setEditData(null) })} />
        </div>
    )
}

function AddDialog({ open, onOpenChange, onSubmit }) {
    const [values, setValues] = useState({ title: '', price: '', category: '', stock: '' })
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogHeader title="Add Product" />
            <form
                onSubmit={(e) => { e.preventDefault(); onSubmit({ ...values, price: Number(values.price), stock: Number(values.stock) }) }}
                className="space-y-3"
            >
                <Field label="Title"><Input value={values.title} onChange={(e) => setValues(v => ({ ...v, title: e.target.value }))} required /></Field>
                <Field label="Price"><Input type="number" value={values.price} onChange={(e) => setValues(v => ({ ...v, price: e.target.value }))} required /></Field>
                <Field label="Category"><Input value={values.category} onChange={(e) => setValues(v => ({ ...v, category: e.target.value }))} required /></Field>
                <Field label="Stock"><Input type="number" value={values.stock} onChange={(e) => setValues(v => ({ ...v, stock: e.target.value }))} required /></Field>
                <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Dialog>
    )
}

function EditDialog({ data, onClose, onSubmit }) {
    const [values, setValues] = useState(() => data ? { title: data.title, price: data.price, category: data.category, stock: data.stock } : { title: '', price: '', category: '', stock: '' })
    if (!data) return null
    return (
        <Dialog open={!!data} onOpenChange={(v) => { if (!v) onClose() }}>
            <DialogHeader title="Edit Product" />
            <form
                onSubmit={(e) => { e.preventDefault(); onSubmit({ ...values, price: Number(values.price), stock: Number(values.stock) }) }}
                className="space-y-3"
            >
                <Field label="Title"><Input value={values.title} onChange={(e) => setValues(v => ({ ...v, title: e.target.value }))} required /></Field>
                <Field label="Price"><Input type="number" value={values.price} onChange={(e) => setValues(v => ({ ...v, price: e.target.value }))} required /></Field>
                <Field label="Category"><Input value={values.category} onChange={(e) => setValues(v => ({ ...v, category: e.target.value }))} required /></Field>
                <Field label="Stock"><Input type="number" value={values.stock} onChange={(e) => setValues(v => ({ ...v, stock: e.target.value }))} required /></Field>
                <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Dialog>
    )
}

function Field({ label, children }) {
    return (
        <label className="block text-sm">
            <div className="mb-1 text-neutral-700">{label}</div>
            {children}
        </label>
    )
}


