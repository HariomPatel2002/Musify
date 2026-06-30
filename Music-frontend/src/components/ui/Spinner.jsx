export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} border-2 border-gray-300 dark:border-[#333] border-t-violet-500 rounded-full animate-spin`}
      />
    </div>
  );
}
