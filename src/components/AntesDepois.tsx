import React, { useState, useRef } from 'react';
import { AntesDepoisItem } from '../dados';

interface AntesDepoisProps {
  itens: AntesDepoisItem[];
}

function CardComparacao({ item }: { item: AntesDepoisItem }) {
  const [posicao, setPosicao] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const arrastandoRef = useRef(false);

  const atualizarPosicao = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentual = (x / rect.width) * 100;
    setPosicao(percentual);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    arrastandoRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    atualizarPosicao(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!arrastandoRef.current) return;
    atualizarPosicao(e.clientX);
  };

  const handlePointerUp = () => {
    arrastandoRef.current = false;
  };

  return (
    <div className="space-y-3">
      <div className="border border-[#D8BE94]/55 p-2">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative aspect-[4/5] w-full overflow-hidden bg-[#2A060E] select-none cursor-ew-resize touch-none"
        >
          <img
            src={item.depois.src}
            alt={item.depois.alt}
            width={item.depois.width}
            height={item.depois.height}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="block h-full w-full object-cover object-top pointer-events-none"
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - posicao}% 0 0)` }}
          >
            <img
              src={item.antes.src}
              alt={item.antes.alt}
              width={item.antes.width}
              height={item.antes.height}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="block h-full w-full object-cover object-top pointer-events-none"
            />
          </div>

          <div
            className="absolute inset-y-0 w-[1px] bg-[#D8BE94]"
            style={{ left: `${posicao}%` }}
          >
            <button
              type="button"
              aria-label="Arrastar comparador de antes e depois"
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') setPosicao((p) => Math.max(5, p - 5));
                if (e.key === 'ArrowRight') setPosicao((p) => Math.min(95, p + 5));
              }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-[#2A060E] text-[#F5ECDD] border border-[#D8BE94] flex items-center justify-center text-xs focus-visible:outline-2 focus-visible:outline-[#D8BE94]"
            >
              ‹ ›
            </button>
          </div>

          <span className="absolute bottom-3 left-3 bg-[#2A060E] text-[#F5ECDD] border border-[#D8BE94]/55 text-[11px] uppercase tracking-[0.22em] px-2.5 py-1">
            Antes
          </span>
          <span className="absolute bottom-3 right-3 bg-[#2A060E] text-[#F5ECDD] border border-[#D8BE94]/55 text-[11px] uppercase tracking-[0.22em] px-2.5 py-1">
            Depois
          </span>
        </div>
      </div>
      {item.legenda && (
        <p className="text-sm font-light text-[#CDB3B0]">{item.legenda}</p>
      )}
    </div>
  );
}

export default function AntesDepois({ itens }: AntesDepoisProps) {
  if (!itens || itens.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-[#D8BE94]/40">
      <h3 className="font-display text-[28px] md:text-[36px] font-normal not-italic text-[#F5ECDD] mb-8">
        Antes e depois
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {itens.map((item) => (
          <CardComparacao key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
