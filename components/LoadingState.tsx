// components/LoadingState.tsx
export default function LoadingState({ message = "Chargement en cours..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-full w-full py-12">
      <div className="flex flex-col items-center space-y-4 text-muted-foreground">
        <svg
          className="animate-spin h-6 w-6 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}