export default function Badge({ tone = 'neutral', children, className = '' }) {
    const styles = {
        neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        blue: 'bg-sky-50 text-sky-700 border-sky-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        red: 'bg-rose-50 text-rose-700 border-rose-200'
    }
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles[tone] || styles.neutral} ${className}`}>
            {children}
        </span>
    )
}


