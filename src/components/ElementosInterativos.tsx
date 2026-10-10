import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Foto } from '../dados';

/**
 * 1. ENTRADA DO SITE:
 * Monograma "E" desenhado em linha champagne (1,2s), seguido pela cortina
 * dividindo ao meio e deslizando para cima e para baixo. Só na 1ª visita da sessão.
 */
export function CortinaEntrada() {
  const reduzirMovimento = useReducedMotion();
  const [visivel, setVisivel] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem('essencia_intro_vista');
    } catch {
      return false;
    }
  });
  const [abrindoCortina, setAbrindoCortina] = useState(false);

  useEffect(() => {
    if (!visivel) return;
    if (reduzirMovimento) {
      try {
        sessionStorage.setItem('essencia_intro_vista', '1');
      } catch {
        // ignore
      }
      setVisivel(false);
      return;
    }

    const timerAbrir = window.setTimeout(() => {
      setAbrindoCortina(true);
    }, 1250);

    const timerFinalizar = window.setTimeout(() => {
      try {
        sessionStorage.setItem('essencia_intro_vista', '1');
      } catch {
        // ignore
      }
      setVisivel(false);
    }, 2150);

    return () => {
      window.clearTimeout(timerAbrir);
      window.clearTimeout(timerFinalizar);
    };
  }, [visivel, reduzirMovimento]);

  if (!visivel) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden flex flex-col"
    >
      {/* Metade superior da cortina */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: abrindoCortina ? '-100%' : '0%' }}
        transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
        className="w-full h-1/2 bg-[#3A0A15] border-b border-[#D8BE94]/25"
      />

      {/* Metade inferior da cortina */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: abrindoCortina ? '100%' : '0%' }}
        transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
        className="w-full h-1/2 bg-[#3A0A15]"
      />

      {/* Monograma central desenhado em SVG */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: abrindoCortina ? 0 : 1,
          scale: abrindoCortina ? 0.94 : 1,
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          className="overflow-visible"
        >
          {/* Círculo de 1px champagne */}
          <motion.circle
            cx="48"
            cy="48"
            r="44"
            stroke="#D8BE94"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          {/* Letra E desenhada em traço */}
          <motion.path
            d="M57 31 H39 V65 H57 M39 48 H53"
            stroke="#F5ECDD"
            strokeWidth="1.3"
            strokeLinecap="square"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.1 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * 11. CURSOR PRÓPRIO NO COMPUTADOR:
 * Ponto champagne pequeno que vira círculo maior com "VER" sobre fotos e "AGENDAR" sobre botões.
 */
export function CursorPersonalizado() {
  const reduzirMovimento = useReducedMotion();
  const [habilitado, setHabilitado] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [modo, setModo] = useState<'padrao' | 'ver' | 'agendar'>('padrao');

  useEffect(() => {
    if (reduzirMovimento) return;
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)');
    setHabilitado(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setHabilitado(e.matches);
    mq.addEventListener('change', onChange);

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const alvo = e.target as HTMLElement | null;
      const cursorEl = alvo?.closest('[data-cursor]') as HTMLElement | null;
      const tipo = cursorEl?.getAttribute('data-cursor');
      if (tipo === 'ver') {
        setModo('ver');
      } else if (tipo === 'agendar') {
        setModo('agendar');
      } else {
        setModo('padrao');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [reduzirMovimento]);

  if (!habilitado || reduzirMovimento) return null;

  const expandido = modo === 'ver' || modo === 'agendar';

  return (
    <motion.div
      aria-hidden="true"
      animate={{
        x: pos.x - (expandido ? 34 : 5),
        y: pos.y - (expandido ? 34 : 5),
        width: expandido ? 68 : 10,
        height: expandido ? 68 : 10,
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.4 }}
      className={`fixed top-0 left-0 z-[90] rounded-full pointer-events-none flex items-center justify-center border border-[#D8BE94] transition-colors duration-200 ${
        expandido ? 'bg-[#2A060E]/90 text-[#F5ECDD]' : 'bg-[#D8BE94]'
      }`}
    >
      {expandido && (
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#D8BE94] font-normal select-none">
          {modo === 'ver' ? 'VER' : 'AGENDAR'}
        </span>
      )}
    </motion.div>
  );
}

/**
 * 11. BOTÃO MAGNÉTICO NO COMPUTADOR
 */
export function BotaoMagnetico({
  children,
  onClick,
  className = '',
  cursorType = 'agendar',
  type = 'button',
  disabled = false,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  cursorType?: 'agendar' | 'ver' | undefined;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const reduzirMovimento = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [deslocamento, setDeslocamento] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduzirMovimento || disabled || !ref.current) return;
    if (window.innerWidth < 1024) return;
    const rect = ref.current.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centroX) * 0.22;
    const deltaY = (e.clientY - centroY) * 0.22;
    setDeslocamento({
      x: Math.max(-8, Math.min(8, deltaX)),
      y: Math.max(-6, Math.min(6, deltaY)),
    });
  };

  const handleMouseLeave = () => {
    setDeslocamento({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      data-cursor={cursorType}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: deslocamento.x, y: deslocamento.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/**
 * 5. TÍTULOS EM MOVIMENTO:
 * Entra linha por linha subindo de trás de uma máscara, com 0,12s de diferença entre elas.
 */
export function TituloEmLinhas({
  linhas,
  as = 'h2',
  className = '',
  aoCarregar = false,
}: {
  linhas: string[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  aoCarregar?: boolean;
}) {
  const reduzirMovimento = useReducedMotion();
  const Tag = as;

  if (reduzirMovimento) {
    return <Tag className={className}>{linhas.join(' ')}</Tag>;
  }

  return (
    <Tag className={className} aria-label={linhas.join(' ')}>
      {linhas.map((linha, idx) => (
        <span key={idx} className="block overflow-hidden pb-1 -mb-1">
          <motion.span
            aria-hidden="true"
            className="block"
            initial={{ y: '105%', opacity: 0 }}
            {...(aoCarregar
              ? { animate: { y: '0%', opacity: 1 } }
              : {
                  whileInView: { y: '0%', opacity: 1 },
                  viewport: { once: true, amount: 0.25 },
                })}
            transition={{
              duration: 0.72,
              delay: idx * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {linha}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * 4. FOTOS QUE SE REVELAM:
 * Primeiro a moldura champagne se desenha, depois a foto é revelada por uma máscara
 * de baixo para cima enquanto a imagem reduz de 115% para 100% (0,9s). Uma vez por foto.
 */
export function FotoRevelada({
  foto,
  aspectClass = 'aspect-[4/5]',
  emoldurada = true,
  className = '',
}: {
  foto: Foto;
  aspectClass?: string;
  emoldurada?: boolean;
  className?: string;
}) {
  const reduzirMovimento = useReducedMotion();

  if (reduzirMovimento) {
    return (
      <div
        data-cursor="ver"
        className={emoldurada ? 'border border-[#D8BE94]/55 p-2' : ''}
      >
        <div className={`overflow-hidden bg-[#2A060E] ${aspectClass}`}>
          <img
            src={foto.src}
            alt={foto.alt}
            width={foto.width}
            height={foto.height}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`block w-full h-full object-cover object-top ${className}`}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      data-cursor="ver"
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, amount: 0.2 }}
      className={`relative ${emoldurada ? 'p-2' : ''}`}
    >
      {emoldurada && (
        <>
          {/* Topo */}
          <motion.span
            aria-hidden="true"
            variants={{
              oculto: { scaleX: 0 },
              visivel: { scaleX: 1 },
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute top-0 left-0 right-0 h-[1px] bg-[#D8BE94]/55 origin-left pointer-events-none"
          />
          {/* Direita */}
          <motion.span
            aria-hidden="true"
            variants={{
              oculto: { scaleY: 0 },
              visivel: { scaleY: 1 },
            }}
            transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
            className="absolute top-0 bottom-0 right-0 w-[1px] bg-[#D8BE94]/55 origin-top pointer-events-none"
          />
          {/* Base */}
          <motion.span
            aria-hidden="true"
            variants={{
              oculto: { scaleX: 0 },
              visivel: { scaleX: 1 },
            }}
            transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#D8BE94]/55 origin-right pointer-events-none"
          />
          {/* Esquerda */}
          <motion.span
            aria-hidden="true"
            variants={{
              oculto: { scaleY: 0 },
              visivel: { scaleY: 1 },
            }}
            transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
            className="absolute top-0 bottom-0 left-0 w-[1px] bg-[#D8BE94]/55 origin-bottom pointer-events-none"
          />
        </>
      )}

      <motion.div
        variants={{
          oculto: { clipPath: 'inset(100% 0% 0% 0%)' },
          visivel: { clipPath: 'inset(0% 0% 0% 0%)' },
        }}
        transition={{
          duration: 0.9,
          delay: emoldurada ? 0.32 : 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`overflow-hidden bg-[#2A060E] ${aspectClass}`}
      >
        <motion.img
          src={foto.src}
          alt={foto.alt}
          width={foto.width}
          height={foto.height}
          loading="lazy"
          referrerPolicy="no-referrer"
          variants={{
            oculto: { scale: 1.15 },
            visivel: { scale: 1 },
          }}
          transition={{
            duration: 0.9,
            delay: emoldurada ? 0.32 : 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`block w-full h-full object-cover object-top ${className}`}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Contador com números rolando verticalmente para a barra "Monte o seu dia"
 */
export function TextoRolando({ valor }: { valor: string }) {
  const reduzirMovimento = useReducedMotion();

  if (reduzirMovimento) {
    return <span>{valor}</span>;
  }

  return (
    <span className="inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={valor}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block tabular-nums"
        >
          {valor}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
