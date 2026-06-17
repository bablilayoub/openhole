export function PortalBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Soft atmospheric mesh gradient */}
      <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-40 mix-blend-screen blur-[100px]"
           style={{
             background: 'radial-gradient(ellipse at center, rgba(34, 211, 238, 0.15) 0%, rgba(192, 132, 252, 0.15) 30%, transparent 70%)'
           }}
      />
      
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: `32px 32px`,
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />
    </div>
  );
}
