interface RegisterButtonProps {
    onClick: () => void
  }
  
  export function RegisterButton({ onClick }: RegisterButtonProps) {
    return (
      <button
        onClick={onClick}
        className="mt-6 px-6 py-3 mx-auto bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out"
      >
        Download Photo
      </button>
    )
  }