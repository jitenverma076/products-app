export function Card({ className = '', ...props }) {
    return <div className={`rounded-2xl border border-neutral-200/70 bg-white/90 backdrop-blur shadow-md ${className}`} {...props} />
}

export function CardHeader({ className = '', ...props }) {
    return <div className={`p-4 ${className}`} {...props} />
}

export function CardTitle({ className = '', ...props }) {
    return <h3 className={`text-base font-semibold ${className}`} {...props} />
}

export function CardContent({ className = '', ...props }) {
    return <div className={`p-5 sm:p-6 ${className}`} {...props} />
}


