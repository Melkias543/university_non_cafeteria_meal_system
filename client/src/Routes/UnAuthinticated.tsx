


export const UnAuthinticated =()=>{

    return (

        <>
        <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
  {/* Background decoration to make it feel "designed" */}
  <div className="absolute w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-50 -top-10 -left-10"></div>
  <div className="absolute w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -bottom-10 -right-10"></div>

  <div className="relative z-10 p-10 bg-white/80 backdrop-blur-md border border-slate-200 shadow-2xl rounded-3xl text-center max-w-sm">
    {/* Animated Icon */}
    <div className="mb-6 flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 scale-150 bg-red-500/20 rounded-full animate-ping"></div>
        <div className="relative bg-red-500 text-white p-4 rounded-2xl shadow-lg shadow-red-200">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
    </div>

    {/* Your Original Text - Enhanced */}
    <div className="relative text-red-600 font-black tracking-widest text-xl uppercase mb-2">
      <span className="absolute inset-0 animate-ping opacity-20">Unauthorized</span>
      <span className="relative">Unauthorized</span>
    </div>

    <p className="text-slate-500 font-medium text-sm">
      Hold tight! We're redirecting you to the safe zone.
    </p>

    {/* Minimalist Progress Bar */}
    <div className="mt-6 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div className="bg-red-500 h-full w-1/2 animate-[loading_2s_ease-in-out_infinite] origin-left"></div>
    </div>
  </div>
</div>
        
        </>
    )
}