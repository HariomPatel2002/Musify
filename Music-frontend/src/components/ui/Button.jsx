export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-violet-500 hover:bg-violet-600 text-white',
    secondary: 'bg-gray-100 dark:bg-[#242424] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-gray-900 dark:text-white',
    outline: 'border border-violet-500 text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10',
    ghost: 'hover:bg-gray-100 dark:hover:bg-[#242424] text-gray-600 dark:text-neutral-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
