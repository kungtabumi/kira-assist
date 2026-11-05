import React, { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { ZoomIn, Eye, Sparkles, Sliders, Maximize2, Touchpad } from 'lucide-react';

interface WastraMacroViewerProps {
  src: string;
  alt: string;
  title?: string;
  technique?: string;
  region?: string;
}

export const WastraMacroViewer: React.FC<WastraMacroViewerProps> = ({
  src,
  alt,
  title,
  technique,
  region
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(2.5);
  const [lensPosition, setLensPosition] = useState<{ x: number; y: number; percentX: number; percentY: number }>({
    x: 0,
    y: 0,
    percentX: 50,
    percentY: 50
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setLensPosition({ x, y, percentX, percentY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      setIsHovered(true);
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Top Controls for Macro Zoom */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#963824] border border-[#D5CABE] font-medium text-[11px] shrink-0">
          <ZoomIn size={12} className="text-[#C89B53]" />
          <span>Macro Zoom Tenun</span>
          <span className="text-[#78716C]">({zoomLevel}x)</span>
        </div>

        {/* Preset Macro Levels */}
        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          <span className="text-[10px] uppercase font-bold text-[#78716C] mr-1 hidden md:inline">Perbesaran:</span>
          <button
            onClick={() => setZoomLevel(1.8)}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer text-center ${
              zoomLevel === 1.8 ? 'bg-[#1C1917] text-[#FAF7F2] font-semibold' : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#F3EEE4] border border-[#E7DFD5]'
            }`}
          >
            1.8x Motif
          </button>
          <button
            onClick={() => setZoomLevel(2.5)}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer text-center ${
              zoomLevel === 2.5 ? 'bg-[#963824] text-[#FAF7F2] font-semibold' : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#F3EEE4] border border-[#E7DFD5]'
            }`}
          >
            2.5x Serat
          </button>
          <button
            onClick={() => setZoomLevel(3.5)}
            className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer text-center ${
              zoomLevel === 3.5 ? 'bg-[#1C1917] text-[#FAF7F2] font-semibold' : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#F3EEE4] border border-[#E7DFD5]'
            }`}
          >
            3.5x Pakan
          </button>
        </div>
      </div>

      {/* Main Interactive Zoomable Image Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[400px] rounded-2xl overflow-hidden border border-[#E7DFD5] bg-[#FAF7F2] shadow-inner select-none cursor-crosshair group touch-none"
      >
        {/* Base Normal Image */}
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            isHovered ? 'opacity-85' : 'opacity-100'
          }`}
        />

        {/* Hover Loupe / Lens Simulation Overlay */}
        {isHovered && (
          <>
            {/* Circular Macro Loupe following mouse / finger */}
            <div
              className="absolute pointer-events-none rounded-full border-2 border-[#FAF7F2] shadow-2xl overflow-hidden hidden sm:block ring-4 ring-[#963824]/40"
              style={{
                width: '180px',
                height: '180px',
                left: `${lensPosition.x - 90}px`,
                top: `${lensPosition.y - 90}px`,
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${containerRef.current ? containerRef.current.offsetWidth * zoomLevel : 1000}px ${
                  containerRef.current ? containerRef.current.offsetHeight * zoomLevel : 800
                }px`,
                backgroundPosition: `${-(lensPosition.x * zoomLevel - 90)}px ${-(lensPosition.y * zoomLevel - 90)}px`
              }}
            >
              {/* Crosshair Center Point in Loupe */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-full h-[1px] bg-white/70" />
                <div className="h-full w-[1px] bg-white/70 absolute" />
                <div className="w-4 h-4 rounded-full border border-white/80 absolute" />
              </div>

              {/* Mini Loupe Badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#1C1917]/85 text-[#FAF7F2] text-[9px] font-mono tracking-wider backdrop-blur-xs">
                {zoomLevel}x MACRO
              </div>
            </div>

            {/* Mobile Touch Zoom Overlay */}
            <div
              className="absolute inset-0 pointer-events-none block sm:hidden"
              style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `${lensPosition.percentX}% ${lensPosition.percentY}%`,
                backgroundSize: `${zoomLevel * 100}%`
              }}
            />
          </>
        )}

        {/* Idle Guide Indicator Badge */}
        {!isHovered && (
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#1C1917]/80 text-[#FAF7F2] text-xs backdrop-blur-md border border-white/20 flex items-center gap-1.5 pointer-events-none shadow-md max-w-[85%] truncate">
            <ZoomIn size={13} className="text-[#C89B53] shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-medium truncate">Sentuh/arahkan kursor untuk zoom serat</span>
          </div>
        )}

        {/* Quick Facts Floating Card on Bottom Left */}
        <div className="absolute bottom-3 left-3 max-w-[75%] sm:max-w-[60%] p-2.5 sm:p-3 rounded-xl bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E7DFD5] shadow-xs flex flex-wrap items-center gap-x-3 gap-y-1 text-xs pointer-events-none">
          {technique && (
            <div>
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-[#78716C] block">Teknik Tenun</span>
              <strong className="text-[#1C1917] text-[10px] sm:text-[11px] truncate block">{technique}</strong>
            </div>
          )}
          {region && (
            <div>
              <span className="text-[8px] sm:text-[9px] uppercase font-bold text-[#78716C] block">Asal Wilayah</span>
              <strong className="text-[#963824] text-[10px] sm:text-[11px] truncate block">{region}</strong>
            </div>
          )}
        </div>

      </div>

      {/* Macro Weave Inspection Note */}
      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[11px] text-[#57534E] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#963824] animate-pulse shrink-0" />
          <span className="text-[10px] sm:text-[11px] leading-relaxed">
            <strong>Inspeksi Serat Benang:</strong> Geser jari atau kursor untuk meneliti kerapatan jalinan pakan & lungsi, pigmen pewarna alami, serta tekstur benang pintal tangan.
          </span>
        </div>
      </div>
    </div>
  );
};
