import React, { useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import {
  DADOS_SALAO,
  AssinaturaCasa,
  Profissional,
} from '../dados';
import {
  TituloEmLinhas,
  FotoRevelada,
  BotaoMagnetico,
} from './ElementosInterativos';
import AntesDepois from './AntesDepois';

/**
 * 6. "OS MAIS PEDIDOS" EM CARROSSEL 3D + Palavra ESSENCIA gigante no fundo
 */
export function SecaoMaisPedidos({
  aoEscolherAssinatura,
}: {
  aoEscolherAssinatura: (item: AssinaturaCasa) => void;
}) {
  const reduzirMovimento = useReducedMotion();
  const secaoRef = useRef<HTMLElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [inclinacaoMouse, setInclinacaoMouse] = useState({ rx: 0, ry: 0 });
  const touchInicioX = useRef<number | null>(null);

  const itens = DADOS_SALAO.assinaturas;
  const total = itens.length;

  const { scrollYProgress } = useScroll({
    target: secaoRef,
    offset: ['start end', 'end start'],
  });

  const xEssencia = useTransform(scrollYProgress, [0, 1], ['12%', '-38%']);

  const girarAnterior = () => {
    setIndiceAtivo((atual) => (atual - 1 + total) % total);
  };

  const girarProximo = () => {
    setIndiceAtivo((atual) => (atual + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchInicioX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchInicioX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchInicioX.current;
    if (deltaX > 36) {
      girarAnterior();
    } else if (deltaX < -36) {
      girarProximo();
    }
    touchInicioX.current = null;
  };

  const handleMouseMoveCentro = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduzirMovimento || window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setInclinacaoMouse({
      rx: -ny * 7,
      ry: nx * 7,
    });
  };

  const resetarInclinacao = () => {
    setInclinacaoMouse({ rx: 0, ry: 0 });
  };

  return (
    <section
      ref={secaoRef}
      className="relative py-16 md:py-[120px] border-t border-[#D8BE94]/25 overflow-hidden"
    >
      {/* Palavra ESSENCIA gigante (30% da largura da tela por letra) andando com a rolagem */}
      <motion.div
        aria-hidden="true"
        style={reduzirMovimento ? undefined : { x: xEssencia }}
        className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap font-display text-[28vw] leading-none texto-contorno-champagne z-0"
      >
        ESSENCIA
      </motion.div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-16">
          <TituloEmLinhas
            linhas={['Os mais pedidos']}
            className="font-display font-normal not-italic text-[36px] md:text-[64px] leading-[1.08] text-[#F5ECDD]"
          />

          {/* Setas finas champagne */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={girarAnterior}
              aria-label="Serviço anterior"
              className="min-h-[44px] min-w-[44px] border border-[#D8BE94]/55 text-[#D8BE94] hover:bg-[#D8BE94] hover:text-[#2A060E] transition-colors flex items-center justify-center cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={girarProximo}
              aria-label="Próximo serviço"
              className="min-h-[44px] min-w-[44px] border border-[#D8BE94]/55 text-[#D8BE94] hover:bg-[#D8BE94] hover:text-[#2A060E] transition-colors flex items-center justify-center cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Palco do Carrossel 3D */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[440px] sm:h-[500px] md:h-[560px] flex items-center justify-center perspective-1200 select-none"
        >
          {itens.map((item, idx) => {
            // Calcula posição relativa (-1: esquerda, 0: centro, 1: direita)
            let offset = idx - indiceAtivo;
            if (offset > 1) offset -= total;
            if (offset < -1) offset += total;

            const ehCentro = offset === 0;
            // Deslocamento horizontal responsivo e rotação 35 graus para dentro nos laterais
            const rotateY = ehCentro
              ? inclinacaoMouse.ry
              : offset < 0
              ? 35
              : -35;
            const rotateX = ehCentro ? inclinacaoMouse.rx : 0;
            const escala = ehCentro ? 1 : 0.85;
            const xPercent = offset * 78;

            return (
              <motion.div
                key={item.id}
                onMouseMove={ehCentro ? handleMouseMoveCentro : undefined}
                onMouseLeave={ehCentro ? resetarInclinacao : undefined}
                onClick={() => {
                  if (ehCentro) {
                    aoEscolherAssinatura(item);
                  } else {
                    setIndiceAtivo(idx);
                  }
                }}
                animate={{
                  x: `${xPercent}%`,
                  scale: escala,
                  rotateY: reduzirMovimento ? 0 : rotateY,
                  rotateX: reduzirMovimento ? 0 : rotateX,
                  zIndex: ehCentro ? 20 : 10,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 170,
                  damping: 24,
                }}
                style={{ transformStyle: 'preserve-3d' }}
                data-cursor={ehCentro ? 'agendar' : 'ver'}
                className="absolute w-[236px] sm:w-[290px] md:w-[340px] cursor-pointer text-left"
              >
                <div className="relative">
                  <FotoRevelada
                    foto={item.foto}
                    emoldurada={true}
                    aspectClass="aspect-[212/290]"
                  />
                  {/* Escurecimento nos cartões laterais */}
                  {!ehCentro && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[#2A060E]/55 transition-opacity duration-300 pointer-events-none"
                    />
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-display font-normal not-italic text-[21px] text-[#F5ECDD]">
                      {item.nome}
                    </h3>
                    <p className="font-display text-[16px] text-[#D8BE94] mt-0.5">
                      {item.preco}
                    </p>
                  </div>

                  {ehCentro && (
                    <span className="text-[11px] uppercase tracking-[0.24em] text-[#D8BE94] underline underline-offset-4 shrink-0">
                      AGENDAR
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * 7. "RESULTADOS" COM ROLAGEM LATERAL (Presa na tela no computador + arrastável com parallax no celular)
 */
export function SecaoResultados() {
  const reduzirMovimento = useReducedMotion();
  const containerDesktopRef = useRef<HTMLDivElement>(null);
  const carrosselMobileRef = useRef<HTMLDivElement>(null);
  const [scrollMobileX, setScrollMobileX] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerDesktopRef,
    offset: ['start start', 'end end'],
  });

  // Desloca os 6 quadros horizontalmente enquanto a pessoa rola para baixo
  const xGaleria = useTransform(scrollYProgress, [0, 1], ['0%', '-52%']);
  // Palavra ESSENCIA gigante ao fundo se desloca com a rolagem
  const xEssencia = useTransform(scrollYProgress, [0, 1], ['15%', '-45%']);

  const handleMobileScroll = () => {
    if (!carrosselMobileRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carrosselMobileRef.current;
    const maxScroll = Math.max(1, scrollWidth - clientWidth);
    setScrollMobileX(scrollLeft / maxScroll);
  };

  return (
    <section id="resultados" className="border-t border-[#D8BE94]/25">
      {/* Versão Computador: seção presa na tela com rolagem lateral */}
      <div
        ref={containerDesktopRef}
        className="hidden lg:block relative h-[280vh]"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center py-16">
          {/* Palavra ESSENCIA gigante no fundo */}
          <motion.div
            aria-hidden="true"
            style={reduzirMovimento ? undefined : { x: xEssencia }}
            className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap font-display text-[28vw] leading-none texto-contorno-champagne z-0"
          >
            ESSENCIA
          </motion.div>

          <div className="relative z-10 max-w-[1200px] w-full mx-auto px-8 mb-10 flex items-end justify-between">
            <TituloEmLinhas
              linhas={['Resultados']}
              className="font-display font-normal not-italic text-[64px] leading-[1.08] text-[#F5ECDD]"
            />

            <a
              href={DADOS_SALAO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center text-[12px] font-normal uppercase tracking-[0.24em] text-[#D8BE94] underline underline-offset-8 decoration-[#D8BE94]/60 hover:text-[#F5ECDD] transition-colors"
            >
              VER MAIS NO INSTAGRAM
            </a>
          </div>

          <div className="relative z-10 pl-[max(2rem,calc((100vw-1200px)/2+2rem))]">
            <motion.div
              style={reduzirMovimento ? undefined : { x: xGaleria }}
              className="flex items-center gap-12 w-max pr-24"
            >
              {DADOS_SALAO.resultados.map((foto, idx) => {
                const alturaAlternada =
                  idx % 2 === 0 ? '-translate-y-4' : 'translate-y-6';
                const larguraCard =
                  foto.proporcao === 'alta'
                    ? 'w-[340px]'
                    : foto.proporcao === 'media'
                    ? 'w-[360px]'
                    : 'w-[380px]';
                const aspectClass =
                  foto.proporcao === 'alta'
                    ? 'aspect-[3/4]'
                    : foto.proporcao === 'media'
                    ? 'aspect-[4/5]'
                    : 'aspect-[7/8]';

                return (
                  <div
                    key={foto.id}
                    className={`${larguraCard} shrink-0 ${alturaAlternada}`}
                  >
                    <FotoRevelada
                      foto={foto}
                      emoldurada={true}
                      aspectClass={aspectClass}
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Versão Celular / Tablet: fileira de arrastar para o lado com encaixe foto a foto e deslocamento interno */}
      <div className="lg:hidden relative py-16 overflow-hidden">
        <div
          aria-hidden="true"
          style={
            reduzirMovimento
              ? undefined
              : { transform: `translateX(${10 - scrollMobileX * 45}%)` }
          }
          className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap font-display text-[32vw] leading-none texto-contorno-champagne z-0 transition-transform duration-150"
        >
          ESSENCIA
        </div>

        <div className="relative z-10 px-5 mb-10">
          <TituloEmLinhas
            linhas={['Resultados']}
            className="font-display font-normal not-italic text-[36px] leading-[1.08] text-[#F5ECDD]"
          />
        </div>

        <div
          ref={carrosselMobileRef}
          onScroll={handleMobileScroll}
          className="relative z-10 flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-5"
        >
          {DADOS_SALAO.resultados.map((foto, idx) => {
            const deslocamentoInterno = reduzirMovimento
              ? 0
              : (scrollMobileX - idx * 0.18) * 22;

            return (
              <div
                key={foto.id}
                className="w-[78vw] sm:w-[54vw] shrink-0 snap-center border border-[#D8BE94]/55 p-2"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#2A060E]">
                  <img
                    src={foto.src}
                    alt={foto.alt}
                    width={foto.width}
                    height={foto.height}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    style={
                      reduzirMovimento
                        ? undefined
                        : {
                            transform: `scale(1.1) translateX(${deslocamentoInterno}px)`,
                          }
                    }
                    className="block w-full h-full object-cover object-top transition-transform duration-150"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 px-5 mt-10">
          <a
            href={DADOS_SALAO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center text-[12px] font-normal uppercase tracking-[0.24em] text-[#D8BE94] underline underline-offset-8 decoration-[#D8BE94]/60 hover:text-[#F5ECDD] transition-colors"
          >
            VER MAIS NO INSTAGRAM
          </a>
        </div>
      </div>

      {/* Componente de Antes e Depois (só aparece se antesDepois tiver itens) */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <AntesDepois itens={DADOS_SALAO.antesDepois} />
      </div>
    </section>
  );
}

/**
 * 8. EQUIPE COM CARTÕES QUE VIRAM (3D Flip Card)
 */
export function CartaoProfissional3D({
  profissional,
  aoAgendarComProfissional,
}: {
  profissional: Profissional;
  aoAgendarComProfissional: (prof: Profissional) => void;
}) {
  const reduzirMovimento = useReducedMotion();
  const [virado, setVirado] = useState(false);

  return (
    <div
      className="perspective-1200"
      onMouseEnter={() => {
        if (window.innerWidth >= 1024) setVirado(true);
      }}
      onMouseLeave={() => {
        if (window.innerWidth >= 1024) setVirado(false);
      }}
    >
      <motion.div
        animate={{ rotateY: virado ? 180 : 0 }}
        transition={{
          duration: reduzirMovimento ? 0.01 : 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full aspect-[4/5] preserve-3d"
      >
        {/* FRENTE DO CARTÃO */}
        <div
          onClick={() => setVirado(true)}
          role="button"
          tabIndex={0}
          aria-label={`Ver detalhes e agendar com ${profissional.nome}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setVirado(true);
            }
          }}
          className="absolute inset-0 backface-hidden cursor-pointer flex flex-col border border-[#D8BE94]/55 p-2 bg-[#3A0A15]"
        >
          <div className="relative flex-1 overflow-hidden bg-[#2A060E]">
            <img
              src={profissional.foto.src}
              alt={profissional.foto.alt}
              width={profissional.foto.width}
              height={profissional.foto.height}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="block w-full h-full object-cover object-top"
            />

            {/* Sinal de "virar" no canto indicando que é clicável */}
            <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#2A060E]/85 border border-[#D8BE94]/55 text-[10px] uppercase tracking-[0.22em] text-[#D8BE94] flex items-center gap-1.5">
              <span>VIRAR</span>
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </span>

            {/* Faixa inferior com o nome na frente */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#2A060E] via-[#2A060E]/80 to-transparent">
              <h3 className="font-display font-normal not-italic text-[24px] text-[#F5ECDD]">
                {profissional.nome}
              </h3>
            </div>
          </div>
        </div>

        {/* VERSO DO CARTÃO */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 border border-[#D8BE94]/55 p-6 bg-[#2A060E] flex flex-col items-center justify-between text-center">
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVirado(false);
              }}
              aria-label="Voltar para a foto"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[10px] uppercase tracking-[0.22em] text-[#CDB3B0] hover:text-[#D8BE94] cursor-pointer"
            >
              VOLTAR
            </button>
          </div>

          <div className="space-y-4 my-auto px-2">
            <div className="w-10 h-10 rounded-full border border-[#D8BE94]/55 flex items-center justify-center mx-auto font-display text-[18px] text-[#D8BE94]">
              {profissional.primeiroNome[0]}
            </div>
            <h3 className="font-display font-normal not-italic text-[28px] text-[#F5ECDD]">
              {profissional.nome}
            </h3>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#D8BE94]">
              {profissional.especialidade}
            </p>
          </div>

          <div className="w-full pt-4 border-t border-[#D8BE94]/25">
            <BotaoMagnetico
              onClick={() => aoAgendarComProfissional(profissional)}
              className="w-full min-h-[48px] px-5 py-3 border border-[#D8BE94] text-[11px] uppercase tracking-[0.24em] text-[#F5ECDD] hover:bg-[#D8BE94] hover:text-[#2A060E] transition-colors cursor-pointer"
            >
              AGENDAR COM {profissional.primeiroNome.toUpperCase()}
            </BotaoMagnetico>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
