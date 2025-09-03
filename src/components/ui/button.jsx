import { twMerge } from 'tailwind-merge'

export default function Button({ as: Tag = 'button', className = '', variant = 'default', size = 'md', ...props }) {
    const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50'
    const variants = {
        default: 'bg-neutral-900 text-white hover:bg-neutral-800',
        outline: 'border border-neutral-300 bg-white hover:bg-neutral-50',
        ghost: 'hover:bg-neutral-100',
        subtle: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700',
        warning: 'bg-amber-500 text-white hover:bg-amber-600',
        danger: 'bg-rose-600 text-white hover:bg-rose-700'
    }
    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-base'
    }
    const cls = twMerge(base, variants[variant] || variants.default, sizes[size] || sizes.md, className)
    return <Tag className={cls} {...props} />
}


