export default function Input({ className = '', ...props }) {
    return (
        <input
            className={`h-9 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-sky-200 ${className}`}
            {...props}
        />
    )
}


