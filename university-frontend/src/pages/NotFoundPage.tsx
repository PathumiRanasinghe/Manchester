

export default function NotFoundPage() {
  return (
    <div className="flex items-center min-h-screen  text-fuchsia-500 font-roboto" style={{margin: "0 10vw", overflow: "hidden"}}>
      <div className="wrapper flex-grow w-[40vw] max-w-[500px] mx-auto ">
        <h1 className="m-0 text-[5em] font-thin">Hmm.</h1>
        <p className="w-[95%] text-[1.3em] leading-[1.4]">
          It seems that you're lost in a perpetual black hole. Let us help guide you out and get you back home.
        </p>
        <div className="buttons whitespace-nowrap inline-block mt-8">
          <button type="button" onClick={() => window.location.href = '/'} className="inline-block px-4 py-3 mr-4 mb-4 border-4 border-fuchsia-400 text-fuchsia-400 font-medium uppercase no-underline tracking-widest relative overflow-hidden transition-all duration-300 hover:text-fuchsia-200">
            home
          </button>
          <br />
          <span className="block uppercase text-fuchsia-300 tracking-wider text-center">Help me out</span>
        </div>
      </div>
      <div className="space relative w-[75px] h-[calc(50vh+37.5px)] rounded-t-[37.5px] overflow-hidden mx-auto pointer-events-none" style={{WebkitTransform: "translateZ(0)"}}>
        <div className="blackhole border-[5px] border-fuchsia-600 h-[75px] w-[75px] rounded-full absolute top-0 left-0">
          <div className="absolute top-[-5px] left-[-5px] h-[85px] w-[85px] border-[5px] border-fuchsia-600 border-r-transparent border-b-transparent rounded-full rotate-45 z-5"></div>
        </div>
        <div className="ship absolute bottom-[-150px] left-[10px] h-[150px] w-[55px]" ></div>
      </div>
      <style>{`
        @keyframes blackhole {
          to { transform: translateY(-100vh); }
        }
        @media (max-width: 600px) {
          body { margin: 0 5vw; }
        }
      `}</style>
    </div>
  );
}
