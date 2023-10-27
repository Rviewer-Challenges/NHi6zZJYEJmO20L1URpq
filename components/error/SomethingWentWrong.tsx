export default function SomethingWentWrong() {
  function tryAgain() {
    window.location.reload();
  }

  return (
    <div className="w-full text-center text-[#EDBC06] text-xl sm:text-2xl lg:text-3xl">
      <h2>Something went wrong 😢</h2>
      <button className="border-2 border-yellow-400 w-max px-6 py-2 rounded-3xl hover:bg-[#EDBC06] hover:text-[#1D2C5E] hover:border-[#1D2C5E] mt-4" onClick={tryAgain}>Try Again</button>
    </div>
  )
}