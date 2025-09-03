export function Table({ className = '', ...props }) {
    return <div className={`overflow-x-auto rounded-xl border border-neutral-200/70 bg-white/90 ${className}`} {...props} />
}

export function TSimple({ headers = [], children }) {
    return (
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
            <thead className="text-neutral-600">
                <tr>
                    {headers.map((h, i) => (
                        <th key={h} className={`sticky top-0 z-[1] bg-white/90 px-4 py-3 text-left font-medium ${i === 0 ? 'rounded-tl-xl' : ''} ${i === headers.length - 1 ? 'rounded-tr-xl' : ''}`}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    )
}


