import { useEffect, useRef } from 'react'

export function Dialog({ open, onOpenChange, children }) {
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onOpenChange(false) }
        if (open) document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onOpenChange])

    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
            <div role="dialog" aria-modal className="relative z-10 w-full max-w-lg rounded-lg border bg-white p-4 shadow-xl">
                {children}
            </div>
        </div>
    )
}

export function DialogHeader({ title, description }) {
    return (
        <div className="mb-3">
            {title ? <div className="text-base font-semibold">{title}</div> : null}
            {description ? <p className="text-sm text-neutral-600">{description}</p> : null}
        </div>
    )
}


