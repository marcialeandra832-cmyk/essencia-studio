import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import Lenis from 'lenis';
import { DADOS_SALAO, Profissional } from './dados';
import {
  CortinaEntrada,
  CursorPersonalizado,
  BotaoMagnetico,
  TituloEmLinhas,
  FotoRevelada,
  TextoRolando,
} from './components/ElementosInterativos';
import {
  SecaoMaisPedidos,
  SecaoResultados,
  CartaoProfissional3D,
} from './components/SecoesEspeciais';

export interface ItemAgendamento {
  id: string;
  nome: string;
  preco: string;
  categoria: string;
  duracao: string;
  minutos: number;
  valorNumerico: number;
  sobConsulta: boolean;
}

export default function App() {
  const reduzirMovimento = useReducedMotion();
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [mostrarMenuCompleto, setMostrarMenuCompleto] = useState(false);
  const [perguntaAberta, setPerguntaAberta] = useState<string | null>(
    DADOS_SALAO.perguntasFrequentes[0]?.id ?? null
  );

  // Recurso "Monte o seu dia"
  const [itensDia, setItensDia] = useState<ItemAgendamento[]>([]);

  // Estados do Agendamento em 4 passos
  const [modalAberto, setModalAberto] = useState(false);
  const [passoAgendamento, setPassoAgendamento] = useState(1);
  const [direcaoPasso, setDirecaoPasso] = useState<1 | -1>(1);
  const [confirmandoDesenho, setConfirmandoDesenho] = useState(false);
  const [usandoMonteSeuDiaNoModal, setUsandoMonteSeuDiaNoModal] = useState(false);

  const [servicoSelecionado, setServicoSelecionado] = useState<ItemAgendamento | null>(null);
  const [profissionalSelecionada, setProfissionalSelecionada] = useState<Profissional | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');

  // Calendário sempre inicia no mês atual real
  const [mesCalendario, setMesCalendario] = useState<Date>(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  // Referência e inclinação 3D da Abertura
  const aberturaRef = useRef<HTMLElement>(null);
  const [aberturaMouse, setAberturaMouse] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });

  const { scrollYProgress: scrollAbertura } = useScroll({
    target: aberturaRef,
    offset: ['start start', 'end start'],
  });

  const yFotoAbertura = useTransform(scrollAbertura, [0, 1], ['0%', '18%']);
  const escurecerFotoAbertura = useTransform(scrollAbertura, [0, 1], [0, 0.45]);

  // 3. ROLAGEM SUAVE com Lenis apenas no computador
  useEffect(() => {
    if (reduzirMovimento) return;
    const ehDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;
    if (!ehDesktop) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    if (modalAberto) {
      lenis.stop();
    } else {
      lenis.start();
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduzirMovimento, modalAberto]);

  const opcoesAgendamento: ItemAgendamento[] = useMemo(
    () => [
      ...DADOS_SALAO.servicos.map((s) => ({
        id: s.id,
        nome: s.nome,
        preco: s.preco,
        categoria: s.categoria,
        duracao: s.duracao,
        minutos: s.minutos,
        valorNumerico: s.valorNumerico,
        sobConsulta: s.sobConsulta,
      })),
      ...DADOS_SALAO.pacotes.map((p) => ({
        id: p.id,
        nome: p.nome,
        preco: p.preco,
        categoria: 'Pacote',
        duracao: p.itens,
        minutos: p.minutos,
        valorNumerico: p.valorNumerico,
        sobConsulta: p.sobConsulta,
      })),
    ],
    []
  );

  const servicosFiltrados = useMemo(() => {
    if (categoriaAtiva === 'Todos') return DADOS_SALAO.servicos;
    return DADOS_SALAO.servicos.filter((s) => s.categoria === categoriaAtiva);
  }, [categoriaAtiva]);

  const servicosVisiveis = mostrarMenuCompleto
    ? servicosFiltrados
    : servicosFiltrados.slice(0, 8);

  useEffect(() => {
    if (modalAberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalAberto]);

  // Cálculos do recurso "Monte o seu dia"
  const resumoMonteSeuDia = useMemo(() => {
    const minutosTotais = itensDia.reduce((acc, item) => acc + item.minutos, 0);
    const valorTotal = itensDia.reduce((acc, item) => acc + item.valorNumerico, 0);
    const temSobConsulta = itensDia.some((item) => item.sobConsulta);

    let textoTempo = `${minutosTotais} min`;
    if (minutosTotais >= 60) {
      const horas = Math.floor(minutosTotais / 60);
      const mins = minutosTotais % 60;
      textoTempo = mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
    }

    let textoValor = `R$ ${valorTotal}`;
    if (temSobConsulta && valorTotal > 0) {
      textoValor = `a partir de R$ ${valorTotal}`;
    } else if (temSobConsulta && valorTotal === 0) {
      textoValor = 'Sob consulta';
    }

    return {
      quantidade: itensDia.length,
      minutosTotais,
      textoTempo,
      valorTotal,
      textoValor,
    };
  }, [itensDia]);

  const alternarItemNoDia = (item: ItemAgendamento) => {
    setItensDia((atual) => {
      const existe = atual.some((i) => i.id === item.id);
      if (existe) {
        return atual.filter((i) => i.id !== item.id);
      }
      return [...atual, item];
    });
  };

  const removerItemDoDia = (id: string) => {
    setItensDia((atual) => atual.filter((i) => i.id !== id));
  };

  const resetarCalendarioParaMesAtual = () => {
    const hoje = new Date();
    setMesCalendario(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  };

  const irParaPasso = (novoPasso: number) => {
    setDirecaoPasso(novoPasso > passoAgendamento ? 1 : -1);
    setPassoAgendamento(novoPasso);
  };

  const abrirAgendamentoGeral = () => {
    resetarCalendarioParaMesAtual();
    setUsandoMonteSeuDiaNoModal(false);
    setConfirmandoDesenho(false);
    if (!servicoSelecionado) {
      setServicoSelecionado(opcoesAgendamento[0]);
    }
    setProfissionalSelecionada(null);
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setDirecaoPasso(1);
    setPassoAgendamento(1);
    setModalAberto(true);
  };

  const abrirAgendamentoPorServico = (opcao: ItemAgendamento) => {
    resetarCalendarioParaMesAtual();
    setUsandoMonteSeuDiaNoModal(false);
    setConfirmandoDesenho(false);
    setServicoSelecionado(opcao);
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setDirecaoPasso(1);
    setPassoAgendamento(2);
    setModalAberto(true);
  };

  const abrirAgendamentoMonteSeuDia = () => {
    if (itensDia.length === 0) return;
    resetarCalendarioParaMesAtual();
    setUsandoMonteSeuDiaNoModal(true);
    setConfirmandoDesenho(false);
    setServicoSelecionado({
      id: 'monte-seu-dia',
      nome: itensDia.map((i) => i.nome).join(' + '),
      preco: resumoMonteSeuDia.textoValor,
      categoria: 'Monte o seu dia',
      duracao: resumoMonteSeuDia.textoTempo,
      minutos: resumoMonteSeuDia.minutosTotais,
      valorNumerico: resumoMonteSeuDia.valorTotal,
      sobConsulta: itensDia.some((i) => i.sobConsulta),
    });
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setDirecaoPasso(1);
    setPassoAgendamento(2);
    setModalAberto(true);
  };

  const abrirAgendamentoPorProfissional = (profissional: Profissional) => {
    resetarCalendarioParaMesAtual();
    setUsandoMonteSeuDiaNoModal(false);
    setConfirmandoDesenho(false);
    setProfissionalSelecionada(profissional);
    if (!servicoSelecionado) {
      setServicoSelecionado(opcoesAgendamento[0]);
    }
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setDirecaoPasso(1);
    setPassoAgendamento(1);
    setModalAberto(true);
  };

  const nomesMeses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const podeVoltarMes = useMemo(() => {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();
    return (
      mesCalendario.getFullYear() > anoAtual ||
      (mesCalendario.getFullYear() === anoAtual && mesCalendario.getMonth() > mesAtual)
    );
  }, [mesCalendario]);

  const irParaMesAnterior = () => {
    if (!podeVoltarMes) return;
    setMesCalendario(
      new Date(mesCalendario.getFullYear(), mesCalendario.getMonth() - 1, 1)
    );
  };

  const irParaProximoMes = () => {
    setMesCalendario(
      new Date(mesCalendario.getFullYear(), mesCalendario.getMonth() + 1, 1)
    );
  };

  const ehDataPassada = (data: Date) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data < hoje;
  };

  const diasDoCalendario = useMemo(() => {
    const ano = mesCalendario.getFullYear();
    const mes = mesCalendario.getMonth();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const diaSemanaPrimeiro = new Date(ano, mes, 1).getDay();
    const deslocamentoInicial = diaSemanaPrimeiro === 0 ? 6 : diaSemanaPrimeiro - 1;

    const lista: (Date | null)[] = [];
    for (let i = 0; i < deslocamentoInicial; i++) {
      lista.push(null);
    }
    for (let dia = 1; dia <= totalDias; dia++) {
      lista.push(new Date(ano, mes, dia));
    }
    return lista;
  }, [mesCalendario]);

  const confirmarAgendamentoWhatsApp = () => {
    if (
      !servicoSelecionado ||
      !dataSelecionada ||
      !horarioSelecionado ||
      !nomeCliente.trim() ||
      !telefoneCliente.trim()
    ) {
      return;
    }

    const dataPorExtenso = dataSelecionada.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const linhasMensagem: string[] = [
      `Olá! Gostaria de confirmar meu agendamento no ${DADOS_SALAO.nome}:`,
      '',
    ];

    if (usandoMonteSeuDiaNoModal && itensDia.length > 0) {
      linhasMensagem.push('Serviços escolhidos:');
      itensDia.forEach((item) => {
        linhasMensagem.push(`- ${item.nome} (${item.duracao}) — ${item.preco}`);
      });
      linhasMensagem.push(`Tempo total estimado: ${resumoMonteSeuDia.textoTempo}`);
      linhasMensagem.push(`Valor total: ${resumoMonteSeuDia.textoValor}`);
    } else {
      linhasMensagem.push(`Serviço: ${servicoSelecionado.nome}`);
      linhasMensagem.push(`Valor: ${servicoSelecionado.preco}`);
    }

    linhasMensagem.push(`Data: ${dataPorExtenso}`);
    linhasMensagem.push(`Horário: ${horarioSelecionado}`);

    if (profissionalSelecionada) {
      linhasMensagem.push(`Profissional: ${profissionalSelecionada.nome}`);
    }

    linhasMensagem.push(`Nome: ${nomeCliente.trim()}`);
    linhasMensagem.push(`Telefone: ${telefoneCliente.trim()}`);

    const url = `https://wa.me/${DADOS_SALAO.whatsapp}?text=${encodeURIComponent(
      linhasMensagem.join('\n')
    )}`;

    if (reduzirMovimento) {
      window.open(url, '_blank', 'noopener,noreferrer');
      setModalAberto(false);
      return;
    }

    // Desenha o sinal de "confirmado" em linha antes de abrir o WhatsApp
    setConfirmandoDesenho(true);
    window.setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setConfirmandoDesenho(false);
      setModalAberto(false);
    }, 850);
  };

  const handleMouseMoveAbertura = (e: React.MouseEvent<HTMLElement>) => {
    if (reduzirMovimento || window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setAberturaMouse({
      rx: -ny * 4,
      ry: nx * 4,
      tx: -nx * 10,
      ty: -ny * 8,
    });
  };

  const resetarMouseAbertura = () => {
    setAberturaMouse({ rx: 0, ry: 0, tx: 0, ty: 0 });
  };

  const urlWhatsappDuvida = `https://wa.me/${DADOS_SALAO.whatsapp}?text=${encodeURIComponent(
    DADOS_SALAO.mensagemWhatsappDuvida
  )}`;

  return (
    <div className="min-h-screen bg-[#3A0A15] text-[#F5ECDD] font-sans font-light">
      {/* 1. Cortina de Entrada na primeira visita da sessão */}
      <CortinaEntrada />

      {/* 11. Cursor próprio no computador */}
      <CursorPersonalizado />

      {/* 1. Topo fixo */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#3A0A15] border-b border-[#D8BE94]/30">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          <a
            href="#inicio"
            className="font-display font-normal not-italic text-[14px] tracking-[0.26em] uppercase text-[#F5ECDD] whitespace-nowrap shrink-0 py-2"
          >
            ESSENCIA STUDIO
          </a>

          <nav
            aria-label="Navegação principal"
            className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.24em] text-[#CDB3B0]"
          >
            <a
              href="#servicos"
              className="py-2 hover:text-[#F5ECDD] transition-colors whitespace-nowrap"
            >
              Serviços
            </a>
            <a
              href="#resultados"
              className="py-2 hover:text-[#F5ECDD] transition-colors whitespace-nowrap"
            >
              Resultados
            </a>
            <a
              href="#equipe"
              className="py-2 hover:text-[#F5ECDD] transition-colors whitespace-nowrap"
            >
              Equipe
            </a>
            <a
              href="#salao"
              className="py-2 hover:text-[#F5ECDD] transition-colors whitespace-nowrap"
            >
              O salão
            </a>
            <a
              href="#contato"
              className="py-2 hover:text-[#F5ECDD] transition-colors whitespace-nowrap"
            >
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <BotaoMagnetico
              onClick={abrirAgendamentoGeral}
              className="min-h-[44px] px-5 py-2 border border-[#D8BE94] text-[#F5ECDD] text-[11px] font-normal uppercase tracking-[0.24em] hover:bg-[#D8BE94] hover:text-[#2A060E] transition-colors cursor-pointer whitespace-nowrap"
            >
              AGENDAR
            </BotaoMagnetico>

            <button
              type="button"
              onClick={() => setMenuMobileAberto(!menuMobileAberto)}
              aria-expanded={menuMobileAberto}
              aria-label={menuMobileAberto ? 'Fechar menu' : 'Abrir menu'}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-[#F5ECDD] hover:text-[#D8BE94] transition-colors cursor-pointer"
            >
              {menuMobileAberto ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu móvel */}
        {menuMobileAberto && (
          <div className="lg:hidden bg-[#3A0A15] border-b border-[#D8BE94]/30 px-5 py-4">
            <nav
              aria-label="Menu móvel"
              className="flex flex-col divide-y divide-[#D8BE94]/20"
            >
              <a
                href="#servicos"
                onClick={() => setMenuMobileAberto(false)}
                className="min-h-[44px] flex items-center text-[12px] uppercase tracking-[0.24em] text-[#F5ECDD]"
              >
                Serviços
              </a>
              <a
                href="#resultados"
                onClick={() => setMenuMobileAberto(false)}
                className="min-h-[44px] flex items-center text-[12px] uppercase tracking-[0.24em] text-[#F5ECDD]"
              >
                Resultados
              </a>
              <a
                href="#equipe"
                onClick={() => setMenuMobileAberto(false)}
                className="min-h-[44px] flex items-center text-[12px] uppercase tracking-[0.24em] text-[#F5ECDD]"
              >
                Equipe
              </a>
              <a
                href="#salao"
                onClick={() => setMenuMobileAberto(false)}
                className="min-h-[44px] flex items-center text-[12px] uppercase tracking-[0.24em] text-[#F5ECDD]"
              >
                O salão
              </a>
              <a
                href="#contato"
                onClick={() => setMenuMobileAberto(false)}
                className="min-h-[44px] flex items-center text-[12px] uppercase tracking-[0.24em] text-[#F5ECDD]"
              >
                Contato
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16 md:pt-20">
        {/* 2. Abertura com profundidade e inclinação 3D */}
        <section
          id="inicio"
          ref={aberturaRef}
          onMouseMove={handleMouseMoveAbertura}
          onMouseLeave={resetarMouseAbertura}
          className="relative bg-[#3A0A15] overflow-hidden perspective-1200"
        >
          <div className="lg:grid lg:grid-cols-12 lg:min-h-[calc(100vh-80px)] lg:items-center">
            {/* Foto à direita no computador / topo no celular */}
            <motion.div
              data-cursor="ver"
              animate={
                reduzirMovimento
                  ? undefined
                  : {
                      rotateX: aberturaMouse.rx,
                      rotateY: aberturaMouse.ry,
                    }
              }
              transition={{ type: 'spring', stiffness: 150, damping: 24 }}
              className="relative h-[580px] lg:h-full lg:min-h-[calc(100vh-80px)] lg:col-span-6 lg:order-2 overflow-hidden bg-[#2A060E]"
            >
              <motion.div
                style={reduzirMovimento ? undefined : { y: yFotoAbertura }}
                className="w-full h-full"
              >
                <motion.img
                  src={DADOS_SALAO.abertura.foto.src}
                  alt={DADOS_SALAO.abertura.foto.alt}
                  width={DADOS_SALAO.abertura.foto.width}
                  height={DADOS_SALAO.abertura.foto.height}
                  referrerPolicy="no-referrer"
                  animate={reduzirMovimento ? undefined : { scale: [1, 1.08] }}
                  transition={
                    reduzirMovimento
                      ? undefined
                      : {
                          duration: 18,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                        }
                  }
                  className="block w-full h-full object-cover object-top"
                />
              </motion.div>

              {/* Escurecimento suave conforme rola */}
              <motion.div
                aria-hidden="true"
                style={
                  reduzirMovimento ? undefined : { opacity: escurecerFotoAbertura }
                }
                className="absolute inset-0 bg-[#2A060E] pointer-events-none"
              />

              {/* Fusão inferior no celular */}
              <div
                aria-hidden="true"
                className="lg:hidden absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#3A0A15] via-[#3A0A15]/75 to-transparent pointer-events-none"
              />
              {/* Fusão lateral esquerda no computador */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#3A0A15] via-[#3A0A15]/60 to-transparent pointer-events-none"
              />
            </motion.div>

            {/* Texto à esquerda no computador / sobreposto abaixo no celular */}
            <motion.div
              animate={
                reduzirMovimento
                  ? undefined
                  : {
                      x: aberturaMouse.tx,
                      y: aberturaMouse.ty,
                    }
              }
              transition={{ type: 'spring', stiffness: 150, damping: 24 }}
              className="relative z-10 -mt-28 lg:mt-0 lg:col-span-6 lg:order-1 px-5 sm:px-8 lg:pl-12 xl:pl-24 lg:pr-10 pb-16 lg:py-24"
            >
              <div className="max-w-[540px] lg:ml-auto">
                <p className="text-[11px] md:text-[12px] uppercase tracking-[0.26em] text-[#D8BE94] font-normal mb-5">
                  {DADOS_SALAO.abertura.rotulo}
                </p>

                <TituloEmLinhas
                  as="h1"
                  aoCarregar={true}
                  linhas={DADOS_SALAO.abertura.tituloLines}
                  className="font-display font-normal not-italic text-[42px] sm:text-[54px] lg:text-[66px] xl:text-[74px] leading-[1.06] text-[#F5ECDD] mb-6"
                />

                <p className="text-base md:text-lg font-light text-[#CDB3B0] leading-relaxed mb-10 max-w-md">
                  {DADOS_SALAO.abertura.texto}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <BotaoMagnetico
                    onClick={abrirAgendamentoGeral}
                    className="min-h-[48px] px-8 py-3.5 bg-[#F5ECDD] text-[#3A0A15] text-[12px] font-semibold uppercase tracking-[0.24em] hover:bg-[#D8BE94] hover:text-[#2A060E] transition-colors cursor-pointer text-center"
                  >
                    AGENDAR PELO WHATSAPP
                  </BotaoMagnetico>

                  <a
                    href="#servicos"
                    className="min-h-[44px] inline-flex items-center text-[12px] font-normal uppercase tracking-[0.24em] text-[#D8BE94] underline underline-offset-8 decoration-[#D8BE94]/60 hover:text-[#F5ECDD] transition-colors"
                  >
                    VER SERVIÇOS E VALORES
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Apresentação */}
        <section className="py-16 md:py-[120px] px-5 md:px-8">
          <div className="max-w-[960px] mx-auto text-center">
            <div
              aria-hidden="true"
              className="w-[1px] h-[56px] bg-[#D8BE94]/55 mx-auto mb-10"
            />
            <p className="font-display font-normal not-italic text-[27px] md:text-[40px] leading-[1.32] text-[#F5ECDD] mb-8 text-balance">
              “{DADOS_SALAO.apresentacao.frase}”
            </p>
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] text-[#CDB3B0] font-normal">
              {DADOS_SALAO.apresentacao.marcas}
            </p>
          </div>
        </section>

        {/* 4 & 6. "Os mais pedidos" em Carrossel 3D */}
        <SecaoMaisPedidos
          aoEscolherAssinatura={(item) =>
            abrirAgendamentoPorServico({
              id: item.id,
              nome: item.nome,
              preco: item.preco,
              categoria: item.categoria,
              duracao: item.duracao,
              minutos: item.minutos,
              valorNumerico: item.valorNumerico,
              sobConsulta: item.sobConsulta,
            })
          }
        />

        {/* 5 & 9. Serviços e valores (id="servicos") — Lista Viva + Monte o seu dia */}
        <section
          id="servicos"
          className="py-16 md:py-[120px] bg-[#F5ECDD] text-[#3A0A15]"
        >
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
              <TituloEmLinhas
                linhas={['Serviços e valores']}
                className="font-display font-normal not-italic text-[36px] md:text-[64px] leading-[1.08] text-[#3A0A15]"
              />
              <p className="text-xs font-light text-[#7A5A5F]">
                Use o sinal <strong className="font-semibold text-[#3A0A15]">+</strong> para montar o seu dia com mais de um serviço.
              </p>
            </div>

            {/* Categorias em uma linha de texto com letras espaçadas */}
            <div
              role="tablist"
              aria-label="Categorias de serviços"
              className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar border-b border-[#B79B8F]/50 pb-4 mb-10 -mx-5 px-5 md:mx-0 md:px-0"
            >
              {DADOS_SALAO.categoriasServicos.map((cat) => {
                const ativa = categoriaAtiva === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={ativa}
                    onClick={() => {
                      setCategoriaAtiva(cat);
                      setMostrarMenuCompleto(false);
                    }}
                    className={`min-h-[44px] text-[12px] uppercase tracking-[0.24em] whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-[#3A0A15] ${
                      ativa
                        ? 'text-[#3A0A15] font-semibold underline underline-offset-[14px] decoration-[#3A0A15]'
                        : 'text-[#7A5A5F] font-normal hover:text-[#3A0A15]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Lista de serviços viva com saída/entrada em sequência ao trocar de categoria */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${categoriaAtiva}-${mostrarMenuCompleto ? 'todos' : 'oito'}`}
                initial={reduzirMovimento ? false : 'oculto'}
                animate="visivel"
                exit={reduzirMovimento ? undefined : 'saida'}
                variants={{
                  oculto: {},
                  visivel: {
                    transition: { staggerChildren: 0.05 },
                  },
                  saida: {
                    transition: { staggerChildren: 0.03, staggerDirection: -1 },
                  },
                }}
                className="space-y-2"
              >
                {servicosVisiveis.map((servico) => {
                  const adicionadoNoDia = itensDia.some((i) => i.id === servico.id);
                  const itemFormatado: ItemAgendamento = {
                    id: servico.id,
                    nome: servico.nome,
                    preco: servico.preco,
                    categoria: servico.categoria,
                    duracao: servico.duracao,
                    minutos: servico.minutos,
                    valorNumerico: servico.valorNumerico,
                    sobConsulta: servico.sobConsulta,
                  };

                  return (
                    <motion.div
                      key={servico.id}
                      variants={{
                        oculto: { opacity: 0, y: 10 },
                        visivel: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.4, ease: 'easeOut' },
                        },
                        saida: {
                          opacity: 0,
                          y: -8,
                          transition: { duration: 0.22, ease: 'easeIn' },
                        },
                      }}
                      className="group relative py-3.5"
                    >
                      <div className="flex items-baseline gap-2 md:gap-4">
                        {/* Botão "+" para adicionar ao "Monte o seu dia" */}
                        <button
                          type="button"
                          onClick={() => alternarItemNoDia(itemFormatado)}
                          aria-label={
                            adicionadoNoDia
                              ? `Remover ${servico.nome} do seu dia`
                              : `Adicionar ${servico.nome} ao seu dia`
                          }
                          title={
                            adicionadoNoDia
                              ? 'Remover do seu dia'
                              : 'Adicionar ao seu dia'
                          }
                          className={`min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-[#3A0A15] ${
                            adicionadoNoDia
                              ? 'text-[#3A0A15]'
                              : 'text-[#7A5A5F] hover:text-[#3A0A15]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 border flex items-center justify-center transition-colors ${
                              adicionadoNoDia
                                ? 'bg-[#3A0A15] text-[#F5ECDD] border-[#3A0A15]'
                                : 'border-[#B79B8F] group-hover:border-[#3A0A15]'
                            }`}
                          >
                            {adicionadoNoDia ? (
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.2"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            )}
                          </span>
                        </button>

                        <span className="font-display text-[20px] md:text-[24px] text-[#3A0A15] leading-snug">
                          {servico.nome}
                        </span>

                        <span
                          aria-hidden="true"
                          className="flex-1 border-b border-dotted border-[#B79B8F] min-w-[20px]"
                        />

                        {/* Preço desliza 6px para a esquerda ao passar o mouse / tocar */}
                        <span className="font-display text-[19px] md:text-[23px] text-[#3A0A15] shrink-0 transition-transform duration-300 group-hover:-translate-x-[6px]">
                          {servico.preco}
                        </span>

                        <button
                          type="button"
                          data-cursor="agendar"
                          onClick={() => abrirAgendamentoPorServico(itemFormatado)}
                          className="hidden sm:inline-flex min-h-[44px] items-center ml-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3A0A15] underline underline-offset-4 hover:text-[#7A5A5F] transition-colors cursor-pointer shrink-0 focus-visible:outline-[#3A0A15]"
                        >
                          AGENDAR
                        </button>
                      </div>

                      <div className="flex items-center justify-between pl-9 mt-0.5">
                        <span className="text-xs font-light text-[#7A5A5F]">
                          {servico.duracao}
                        </span>
                        <button
                          type="button"
                          onClick={() => abrirAgendamentoPorServico(itemFormatado)}
                          className="sm:hidden min-h-[44px] inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3A0A15] underline underline-offset-4 cursor-pointer"
                        >
                          AGENDAR
                        </button>
                      </div>

                      {/* Fio bordô que cresce da esquerda para a direita embaixo da linha */}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#3A0A15] origin-left scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-500 pointer-events-none"
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {servicosFiltrados.length > 8 && !mostrarMenuCompleto && (
              <div className="mt-10 pt-6 border-t border-[#B79B8F]/50">
                <button
                  type="button"
                  onClick={() => setMostrarMenuCompleto(true)}
                  className="min-h-[44px] inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.24em] text-[#3A0A15] underline underline-offset-8 hover:text-[#7A5A5F] transition-colors cursor-pointer focus-visible:outline-[#3A0A15]"
                >
                  VER TODOS OS SERVIÇOS
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 6. Pacotes */}
        <section className="py-16 md:py-[120px] bg-[#3A0A15] text-[#F5ECDD]">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <TituloEmLinhas
              linhas={['Pacotes']}
              className="font-display font-normal not-italic text-[36px] md:text-[64px] leading-[1.08] text-[#F5ECDD] mb-12 md:mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8BE94]/45">
              {DADOS_SALAO.pacotes.map((pacote, index) => {
                const adicionadoNoDia = itensDia.some((i) => i.id === pacote.id);
                const itemPacote: ItemAgendamento = {
                  id: pacote.id,
                  nome: pacote.nome,
                  preco: pacote.preco,
                  categoria: 'Pacote',
                  duracao: pacote.duracao,
                  minutos: pacote.minutos,
                  valorNumerico: pacote.valorNumerico,
                  sobConsulta: pacote.sobConsulta,
                };

                return (
                  <div
                    key={pacote.id}
                    className={`py-8 md:py-2 flex flex-col justify-between ${
                      index === 0
                        ? 'md:pr-10 pt-0'
                        : index === 1
                        ? 'md:px-10'
                        : 'md:pl-10 pb-0'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-display font-normal not-italic text-[28px] text-[#F5ECDD]">
                          {pacote.nome}
                        </h3>

                        {/* Sinal de mais para adicionar pacote ao "Monte o seu dia" */}
                        <button
                          type="button"
                          onClick={() => alternarItemNoDia(itemPacote)}
                          aria-label={
                            adicionadoNoDia
                              ? `Remover ${pacote.nome} do seu dia`
                              : `Adicionar ${pacote.nome} ao seu dia`
                          }
                          className={`min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center cursor-pointer transition-colors ${
                            adicionadoNoDia
                              ? 'text-[#D8BE94]'
                              : 'text-[#CDB3B0] hover:text-[#D8BE94]'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 border flex items-center justify-center transition-colors ${
                              adicionadoNoDia
                                ? 'bg-[#D8BE94] text-[#2A060E] border-[#D8BE94]'
                                : 'border-[#D8BE94]/55'
                            }`}
                          >
                            {adicionadoNoDia ? (
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.2"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            )}
                          </span>
                        </button>
                      </div>

                      <p className="text-sm font-light text-[#CDB3B0] leading-relaxed mb-6">
                        {pacote.itens}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="font-display text-[22px] text-[#D8BE94]">
                        {pacote.preco}
                      </p>
                      <div>
                        <button
                          type="button"
                          data-cursor="agendar"
                          onClick={() => abrirAgendamentoPorServico(itemPacote)}
                          className="min-h-[44px] inline-flex items-center text-[11px] font-normal uppercase tracking-[0.24em] text-[#F5ECDD] underline underline-offset-8 decoration-[#D8BE94]/70 hover:text-[#D8BE94] transition-colors cursor-pointer"
                        >
                          AGENDAR PACOTE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Resultados com rolagem lateral */}
        <SecaoResultados />

        {/* 8. Equipe com cartões que viram (id="equipe") */}
        <section
          id="equipe"
          className="py-16 md:py-[120px] border-t border-[#D8BE94]/25"
        >
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <TituloEmLinhas
              linhas={['Nossa equipe']}
              className="font-display font-normal not-italic text-[36px] md:text-[64px] leading-[1.08] text-[#F5ECDD] mb-12 md:mb-16"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12">
              {DADOS_SALAO.equipe.map((profissional) => (
                <CartaoProfissional3D
                  key={profissional.id}
                  profissional={profissional}
                  aoAgendarComProfissional={abrirAgendamentoPorProfissional}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 9. O salão (id="salao") */}
        <section
          id="salao"
          className="py-16 md:py-[120px] border-t border-[#D8BE94]/25"
        >
          <div className="max-w-[1200px] mx-auto md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Foto do espaço em largura total no celular (metade da tela no computador), SEM moldura */}
              <div className="lg:col-span-6">
                <FotoRevelada
                  foto={DADOS_SALAO.salao.fotoSalao}
                  emoldurada={false}
                  aspectClass="aspect-[4/5] w-full"
                />
              </div>

              {/* Texto e foto menor de tratamento emoldurada ao lado */}
              <div className="lg:col-span-6 px-5 md:px-0">
                <TituloEmLinhas
                  linhas={[DADOS_SALAO.salao.titulo]}
                  className="font-display font-normal not-italic text-[36px] md:text-[64px] leading-[1.08] text-[#F5ECDD] mb-6"
                />

                <p className="text-base md:text-lg font-light text-[#CDB3B0] leading-relaxed mb-10">
                  {DADOS_SALAO.salao.texto}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-end pt-8 border-t border-[#D8BE94]/30">
                  <div className="sm:col-span-7 space-y-3 text-sm font-light text-[#CDB3B0]">
                    <p>
                      <span className="text-[11px] uppercase tracking-[0.22em] text-[#D8BE94] block mb-1">
                        Horário
                      </span>
                      {DADOS_SALAO.horario}
                    </p>
                    <p>
                      <span className="text-[11px] uppercase tracking-[0.22em] text-[#D8BE94] block mb-1">
                        Endereço
                      </span>
                      {DADOS_SALAO.endereco}
                    </p>
                    <div className="pt-2">
                      <a
                        href={DADOS_SALAO.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center text-[11px] font-normal uppercase tracking-[0.24em] text-[#D8BE94] underline underline-offset-8 decoration-[#D8BE94]/70 hover:text-[#F5ECDD] transition-colors"
                      >
                        COMO CHEGAR
                      </a>
                    </div>
                  </div>

                  {/* Foto menor emoldurada ao lado: FOTO_TRATAMENTO */}
                  <div className="sm:col-span-5 max-w-[220px] sm:max-w-none">
                    <FotoRevelada
                      foto={DADOS_SALAO.salao.fotoTratamento}
                      emoldurada={true}
                      aspectClass="aspect-[4/5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Depoimentos */}
        <section className="py-16 md:py-[120px] bg-[#2A060E] border-t border-[#D8BE94]/25">
          <div className="max-w-[1000px] mx-auto px-5 md:px-8 text-center">
            <div className="space-y-16 md:space-y-20">
              {DADOS_SALAO.depoimentos.map((depoimento) => (
                <blockquote key={depoimento.id} className="space-y-5">
                  <p className="font-display font-normal not-italic text-[24px] md:text-[32px] leading-[1.35] text-[#F5ECDD] text-balance">
                    “{depoimento.texto}”
                  </p>
                  <footer className="text-[11px] uppercase tracking-[0.24em] text-[#D8BE94] font-normal">
                    {depoimento.nome} · {depoimento.data}
                  </footer>
                </blockquote>
              ))}
            </div>

            <div className="mt-14 pt-10 border-t border-[#D8BE94]/25">
              <a
                href={DADOS_SALAO.googleAvaliacoesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center text-[11px] font-normal uppercase tracking-[0.24em] text-[#D8BE94] underline underline-offset-8 decoration-[#D8BE94]/60 hover:text-[#F5ECDD] transition-colors"
              >
                VER AVALIAÇÕES NO GOOGLE
              </a>
            </div>
          </div>
        </section>

        {/* 11. Perguntas frequentes */}
        <section className="py-16 md:py-[120px] bg-[#F5ECDD] text-[#3A0A15]">
          <div className="max-w-[920px] mx-auto px-5 md:px-8">
            <TituloEmLinhas
              linhas={['Perguntas frequentes']}
              className="font-display font-normal not-italic text-[36px] md:text-[64px] leading-[1.08] text-[#3A0A15] mb-10 md:mb-14"
            />

            <div className="divide-y divide-[#B79B8F] border-y border-[#B79B8F]">
              {DADOS_SALAO.perguntasFrequentes.map((item) => {
                const aberta = perguntaAberta === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => setPerguntaAberta(aberta ? null : item.id)}
                      aria-expanded={aberta}
                      className="w-full min-h-[58px] py-5 flex items-center justify-between gap-6 text-left cursor-pointer focus-visible:outline-[#3A0A15]"
                    >
                      <span className="font-display text-[20px] md:text-[23px] text-[#3A0A15]">
                        {item.pergunta}
                      </span>
                      <span className="text-[#3A0A15] shrink-0" aria-hidden="true">
                        {aberta ? (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        )}
                      </span>
                    </button>
                    {aberta && (
                      <div className="pb-6 pr-8 text-base font-light text-[#7A5A5F] leading-relaxed">
                        {item.resposta}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 12. Chamado final (id="contato") */}
        <section
          id="contato"
          className="py-16 md:py-[120px] bg-[#2A060E] text-[#F5ECDD]"
        >
          <div className="max-w-[760px] mx-auto px-5 md:px-8 text-center">
            {/* Monograma: letra "E" em Marcellus dentro de um círculo de 1px champagne */}
            <div
              aria-hidden="true"
              className="w-14 h-14 rounded-full border border-[#D8BE94] flex items-center justify-center mx-auto mb-8"
            >
              <span className="font-display text-[24px] text-[#F5ECDD] leading-none">
                E
              </span>
            </div>

            <TituloEmLinhas
              linhas={[DADOS_SALAO.chamadoFinal.titulo]}
              className="font-display font-normal not-italic text-[40px] md:text-[72px] leading-[1.08] text-[#F5ECDD] mb-5"
            />

            <p className="text-base md:text-lg font-light text-[#CDB3B0] mb-10 max-w-md mx-auto">
              {DADOS_SALAO.chamadoFinal.texto}
            </p>

            <BotaoMagnetico
              onClick={abrirAgendamentoGeral}
              className="min-h-[50px] px-10 py-4 bg-[#D8BE94] text-[#2A060E] text-[12px] font-semibold uppercase tracking-[0.25em] hover:bg-[#F5ECDD] transition-colors cursor-pointer"
            >
              AGENDAR PELO WHATSAPP
            </BotaoMagnetico>

            <div className="mt-10 space-y-1 text-xs font-light text-[#CDB3B0]">
              <p>{DADOS_SALAO.horario}</p>
              <p>{DADOS_SALAO.endereco}</p>
            </div>
          </div>
        </section>
      </main>

      {/* 13. Rodapé */}
      <footer
        className={`bg-[#2A060E] text-[#F5ECDD] border-t border-[#D8BE94]/25 py-10 ${
          itensDia.length > 0 ? 'pb-36 md:pb-28' : ''
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#D8BE94]/20 items-start">
            <div className="md:col-span-5 space-y-2">
              <p className="font-display text-[15px] tracking-[0.26em] uppercase text-[#F5ECDD] mb-3">
                ESSENCIA STUDIO
              </p>
              <p className="text-xs font-light text-[#CDB3B0] leading-relaxed">
                {DADOS_SALAO.endereco}
              </p>
              <p className="text-xs font-light text-[#CDB3B0]">
                {DADOS_SALAO.telefone} · {DADOS_SALAO.horario}
              </p>
            </div>

            <nav
              aria-label="Links do rodapé"
              className="md:col-span-5 flex flex-wrap gap-x-6 gap-y-1 text-[11px] uppercase tracking-[0.22em] text-[#CDB3B0]"
            >
              <a
                href="#servicos"
                className="min-h-[44px] inline-flex items-center hover:text-[#F5ECDD] transition-colors"
              >
                Serviços
              </a>
              <a
                href="#resultados"
                className="min-h-[44px] inline-flex items-center hover:text-[#F5ECDD] transition-colors"
              >
                Resultados
              </a>
              <a
                href="#equipe"
                className="min-h-[44px] inline-flex items-center hover:text-[#F5ECDD] transition-colors"
              >
                Equipe
              </a>
              <a
                href="#salao"
                className="min-h-[44px] inline-flex items-center hover:text-[#F5ECDD] transition-colors"
              >
                O salão
              </a>
              <a
                href="#contato"
                className="min-h-[44px] inline-flex items-center hover:text-[#F5ECDD] transition-colors"
              >
                Contato
              </a>
            </nav>

            <div className="md:col-span-2 md:text-right">
              <a
                href={DADOS_SALAO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center text-[11px] uppercase tracking-[0.24em] text-[#D8BE94] underline underline-offset-4 hover:text-[#F5ECDD] transition-colors"
              >
                INSTAGRAM
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-light text-[#CDB3B0]/70">
            <p>
              © {new Date().getFullYear()} {DADOS_SALAO.nome}. Todos os direitos
              reservados.
            </p>
            <p>Atendimento com hora marcada</p>
          </div>
        </div>
      </footer>

      {/* RECURSO NOVO: Barra fixa "Monte o seu dia" */}
      <AnimatePresence>
        {itensDia.length > 0 && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-[#2A060E] border-t border-[#D8BE94] text-[#F5ECDD] px-5 py-3.5"
          >
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Lista de itens selecionados (um toque remove) */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#D8BE94] shrink-0 mr-1">
                  SEU DIA:
                </span>
                {itensDia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => removerItemDoDia(item.id)}
                    title="Toque para remover"
                    className="min-h-[34px] px-3 py-1 border border-[#D8BE94]/50 text-xs font-light text-[#F5ECDD] hover:border-[#D8BE94] hover:text-[#D8BE94] flex items-center gap-2 shrink-0 cursor-pointer transition-colors"
                  >
                    <span>{item.nome}</span>
                    <span className="text-[#D8BE94] text-[10px]">✕</span>
                  </button>
                ))}
              </div>

              {/* Resumo com números rolando + Botão AGENDAR TUDO */}
              <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 border-t md:border-t-0 border-[#D8BE94]/20 pt-2.5 md:pt-0">
                <div className="flex items-baseline gap-4 text-xs sm:text-sm">
                  <span className="text-[#CDB3B0]">
                    <TextoRolando valor={`${resumoMonteSeuDia.quantidade}`} />{' '}
                    {resumoMonteSeuDia.quantidade === 1 ? 'serviço' : 'serviços'}
                  </span>
                  <span className="text-[#D8BE94]/40">·</span>
                  <span className="text-[#CDB3B0]">
                    <TextoRolando valor={resumoMonteSeuDia.textoTempo} />
                  </span>
                  <span className="text-[#D8BE94]/40">·</span>
                  <span className="font-display text-[17px] text-[#D8BE94]">
                    <TextoRolando valor={resumoMonteSeuDia.textoValor} />
                  </span>
                </div>

                <BotaoMagnetico
                  onClick={abrirAgendamentoMonteSeuDia}
                  className="min-h-[44px] px-6 py-2.5 bg-[#D8BE94] text-[#2A060E] text-[11px] font-semibold uppercase tracking-[0.24em] hover:bg-[#F5ECDD] transition-colors cursor-pointer whitespace-nowrap"
                >
                  AGENDAR TUDO
                </BotaoMagnetico>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 14. Botão flutuante do WhatsApp (círculo champagne com ícone em bordô) */}
      <a
        href={urlWhatsappDuvida}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
        className={`fixed right-5 z-30 w-14 h-14 rounded-full bg-[#D8BE94] text-[#3A0A15] flex items-center justify-center hover:bg-[#F5ECDD] transition-all duration-300 ${
          itensDia.length > 0 ? 'bottom-28 md:bottom-20' : 'bottom-5'
        }`}
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.126.556 4.124 1.535 5.865l-1.535 5.605 5.752-1.509c1.696.912 3.633 1.431 5.694 1.431 6.627 0 12-5.373 12-12s-5.373-12-11.446-11.392z" />
        </svg>
      </a>

      {/* 10. AGENDAMENTO COM TRANSIÇÕES (Cortina subindo, passos deslizando, barra champagne, check desenhado) */}
      <AnimatePresence>
        {modalAberto && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-agendamento"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setModalAberto(false);
            }}
            className="fixed inset-0 z-50 bg-[#2A060E]/85 flex items-end md:items-center justify-center md:p-6"
          >
            {/* Cortina #2A060E subindo de baixo */}
            <motion.div
              initial={reduzirMovimento ? { opacity: 0 } : { y: '100%' }}
              animate={reduzirMovimento ? { opacity: 1 } : { y: '0%' }}
              exit={reduzirMovimento ? { opacity: 0 } : { y: '100%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-[#2A060E] text-[#F5ECDD] w-full h-[94dvh] md:h-auto md:max-h-[90vh] md:max-w-lg border border-[#D8BE94]/55 flex flex-col overflow-hidden"
            >
              {/* Tela de confirmação com traço desenhado em linha antes de abrir o WhatsApp */}
              <AnimatePresence>
                {confirmandoDesenho && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 bg-[#2A060E] flex flex-col items-center justify-center p-8 text-center"
                  >
                    <svg
                      width="84"
                      height="84"
                      viewBox="0 0 84 84"
                      fill="none"
                      className="mb-6"
                    >
                      <motion.circle
                        cx="42"
                        cy="42"
                        r="38"
                        stroke="#D8BE94"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                      <motion.path
                        d="M26 43 L37 54 L58 31"
                        stroke="#F5ECDD"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
                      />
                    </svg>
                    <p className="font-display text-[26px] text-[#F5ECDD] mb-2">
                      Horário reservado
                    </p>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#D8BE94]">
                      ABRINDO O WHATSAPP...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cabeçalho */}
              <div className="px-6 py-5 border-b border-[#D8BE94]/30 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[#D8BE94] block mb-1">
                    PASSO {passoAgendamento} DE 4
                  </span>
                  <h2
                    id="titulo-modal-agendamento"
                    className="font-display font-normal not-italic text-[26px] leading-none text-[#F5ECDD]"
                  >
                    {passoAgendamento === 1 && 'Escolha o serviço'}
                    {passoAgendamento === 2 && 'Escolha o dia'}
                    {passoAgendamento === 3 && 'Escolha o horário'}
                    {passoAgendamento === 4 && 'Seus dados'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  aria-label="Fechar janela de agendamento"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#CDB3B0] hover:text-[#F5ECDD] transition-colors cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Barra de progresso que cresce em champagne */}
              <div className="px-6 pt-3 shrink-0">
                <div className="w-full h-[1px] bg-[#D8BE94]/25 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: passoAgendamento / 4 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full bg-[#D8BE94] origin-left"
                  />
                </div>
              </div>

              {/* Conteúdo com transição lateral entre os passos */}
              <div className="p-6 overflow-y-auto overflow-x-hidden flex-1">
                {profissionalSelecionada && (
                  <div className="mb-5 pb-3 border-b border-[#D8BE94]/30 flex items-center justify-between text-xs text-[#CDB3B0]">
                    <span>
                      Profissional:{' '}
                      <strong className="text-[#F5ECDD] font-normal">
                        {profissionalSelecionada.nome}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setProfissionalSelecionada(null)}
                      className="text-[11px] uppercase tracking-[0.2em] text-[#D8BE94] underline cursor-pointer py-1"
                    >
                      Alterar
                    </button>
                  </div>
                )}

                <AnimatePresence mode="wait" custom={direcaoPasso}>
                  <motion.div
                    key={passoAgendamento}
                    custom={direcaoPasso}
                    initial={
                      reduzirMovimento
                        ? { opacity: 0 }
                        : { x: direcaoPasso > 0 ? 60 : -60, opacity: 0 }
                    }
                    animate={{ x: 0, opacity: 1 }}
                    exit={
                      reduzirMovimento
                        ? { opacity: 0 }
                        : { x: direcaoPasso > 0 ? -60 : 60, opacity: 0 }
                    }
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Passo 1: Serviço ou pacote */}
                    {passoAgendamento === 1 && (
                      <div className="divide-y divide-[#D8BE94]/25 border-y border-[#D8BE94]/25">
                        {opcoesAgendamento.map((opcao) => {
                          const selecionado =
                            servicoSelecionado?.nome === opcao.nome;
                          return (
                            <button
                              key={opcao.id}
                              type="button"
                              onClick={() => {
                                setUsandoMonteSeuDiaNoModal(false);
                                setServicoSelecionado(opcao);
                              }}
                              className={`w-full py-3.5 px-3 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                                selecionado
                                  ? 'bg-[#D8BE94] text-[#3A0A15]'
                                  : 'hover:bg-[#3A0A15]'
                              }`}
                            >
                              <div>
                                <p
                                  className={`font-display text-[18px] ${
                                    selecionado
                                      ? 'text-[#3A0A15]'
                                      : 'text-[#F5ECDD]'
                                  }`}
                                >
                                  {opcao.nome}
                                </p>
                                <p
                                  className={`text-xs font-light ${
                                    selecionado
                                      ? 'text-[#3A0A15]/80'
                                      : 'text-[#CDB3B0]'
                                  }`}
                                >
                                  {opcao.categoria} · {opcao.duracao}
                                </p>
                              </div>
                              <span
                                className={`font-display text-[17px] shrink-0 ${
                                  selecionado
                                    ? 'text-[#3A0A15]'
                                    : 'text-[#D8BE94]'
                                }`}
                              >
                                {opcao.preco}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Passo 2: Dia */}
                    {passoAgendamento === 2 && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-[#D8BE94]/30 pb-3">
                          <button
                            type="button"
                            onClick={irParaMesAnterior}
                            disabled={!podeVoltarMes}
                            aria-label="Mês anterior"
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#F5ECDD] disabled:opacity-25 disabled:cursor-not-allowed hover:text-[#D8BE94] cursor-pointer"
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

                          <span className="font-display text-[18px] text-[#F5ECDD]">
                            {nomesMeses[mesCalendario.getMonth()]}{' '}
                            {mesCalendario.getFullYear()}
                          </span>

                          <button
                            type="button"
                            onClick={irParaProximoMes}
                            aria-label="Próximo mês"
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#F5ECDD] hover:text-[#D8BE94] cursor-pointer"
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

                        <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.2em] text-[#CDB3B0]">
                          <span>Seg</span>
                          <span>Ter</span>
                          <span>Qua</span>
                          <span>Qui</span>
                          <span>Sex</span>
                          <span>Sáb</span>
                          <span>Dom</span>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {diasDoCalendario.map((dia, idx) => {
                            if (!dia) {
                              return <div key={`vazio-${idx}`} className="h-11" />;
                            }

                            const ehDomingo = dia.getDay() === 0;
                            const passado = ehDataPassada(dia);
                            const bloqueado = ehDomingo || passado;

                            const selecionado =
                              dataSelecionada &&
                              dataSelecionada.getDate() === dia.getDate() &&
                              dataSelecionada.getMonth() === dia.getMonth() &&
                              dataSelecionada.getFullYear() === dia.getFullYear();

                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={bloqueado}
                                onClick={() => setDataSelecionada(dia)}
                                className={`min-h-[44px] text-sm tabular-nums transition-colors flex items-center justify-center ${
                                  selecionado
                                    ? 'bg-[#D8BE94] text-[#3A0A15] font-semibold'
                                    : bloqueado
                                    ? 'text-[#CDB3B0]/25 line-through cursor-not-allowed'
                                    : 'text-[#F5ECDD] hover:bg-[#3A0A15] cursor-pointer'
                                }`}
                              >
                                {dia.getDate()}
                              </button>
                            );
                          })}
                        </div>

                        <p className="text-xs font-light text-[#CDB3B0]">
                          Atendimento de segunda a sábado. Domingos fechado.
                        </p>
                      </div>
                    )}

                    {/* Passo 3: Horário */}
                    {passoAgendamento === 3 && (
                      <div className="space-y-6">
                        {dataSelecionada && (
                          <p className="text-sm font-light text-[#CDB3B0]">
                            Data escolhida:{' '}
                            <strong className="text-[#F5ECDD] font-normal">
                              {dataSelecionada.toLocaleDateString('pt-BR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </strong>
                          </p>
                        )}

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.24em] text-[#D8BE94] mb-3">
                            MANHÃ
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {DADOS_SALAO.horariosManha.map((hora) => {
                              const selecionado = horarioSelecionado === hora;
                              return (
                                <button
                                  key={hora}
                                  type="button"
                                  onClick={() => setHorarioSelecionado(hora)}
                                  className={`min-h-[44px] py-2.5 text-sm tabular-nums border transition-colors cursor-pointer ${
                                    selecionado
                                      ? 'bg-[#D8BE94] text-[#3A0A15] border-[#D8BE94] font-semibold'
                                      : 'border-[#D8BE94]/40 text-[#F5ECDD] hover:border-[#D8BE94]'
                                  }`}
                                >
                                  {hora}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.24em] text-[#D8BE94] mb-3">
                            TARDE
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {DADOS_SALAO.horariosTarde.map((hora) => {
                              const selecionado = horarioSelecionado === hora;
                              return (
                                <button
                                  key={hora}
                                  type="button"
                                  onClick={() => setHorarioSelecionado(hora)}
                                  className={`min-h-[44px] py-2.5 text-sm tabular-nums border transition-colors cursor-pointer ${
                                    selecionado
                                      ? 'bg-[#D8BE94] text-[#3A0A15] border-[#D8BE94] font-semibold'
                                      : 'border-[#D8BE94]/40 text-[#F5ECDD] hover:border-[#D8BE94]'
                                  }`}
                                >
                                  {hora}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Passo 4: Nome e telefone, com resumo */}
                    {passoAgendamento === 4 && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="campo-nome-cliente"
                              className="block text-[11px] uppercase tracking-[0.22em] text-[#D8BE94] mb-2"
                            >
                              SEU NOME
                            </label>
                            <input
                              id="campo-nome-cliente"
                              type="text"
                              value={nomeCliente}
                              onChange={(e) => setNomeCliente(e.target.value)}
                              placeholder="Nome e sobrenome"
                              className="w-full min-h-[44px] px-3.5 py-2.5 bg-transparent border border-[#D8BE94]/45 text-sm text-[#F5ECDD] placeholder:text-[#CDB3B0]/50 focus:border-[#D8BE94] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="campo-telefone-cliente"
                              className="block text-[11px] uppercase tracking-[0.22em] text-[#D8BE94] mb-2"
                            >
                              SEU TELEFONE / WHATSAPP
                            </label>
                            <input
                              id="campo-telefone-cliente"
                              type="tel"
                              value={telefoneCliente}
                              onChange={(e) => setTelefoneCliente(e.target.value)}
                              placeholder="(49) 99999-9999"
                              className="w-full min-h-[44px] px-3.5 py-2.5 bg-transparent border border-[#D8BE94]/45 text-sm text-[#F5ECDD] placeholder:text-[#CDB3B0]/50 focus:border-[#D8BE94] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Resumo */}
                        <div className="p-4 border border-[#D8BE94]/45 bg-[#3A0A15] space-y-2 text-sm">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-[#D8BE94]">
                            RESUMO DO AGENDAMENTO
                          </p>

                          {usandoMonteSeuDiaNoModal && itensDia.length > 0 ? (
                            <div className="space-y-1.5">
                              {itensDia.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between gap-3 text-xs"
                                >
                                  <span className="text-[#F5ECDD]">
                                    {item.nome} ({item.duracao})
                                  </span>
                                  <span className="text-[#D8BE94] shrink-0">
                                    {item.preco}
                                  </span>
                                </div>
                              ))}
                              <div className="pt-2 border-t border-[#D8BE94]/25 flex justify-between gap-3">
                                <span className="text-xs text-[#CDB3B0]">
                                  Total ({resumoMonteSeuDia.textoTempo})
                                </span>
                                <span className="font-display text-[17px] text-[#D8BE94]">
                                  {resumoMonteSeuDia.textoValor}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between gap-4">
                              <span className="font-display text-[18px] text-[#F5ECDD]">
                                {servicoSelecionado?.nome}
                              </span>
                              <span className="font-display text-[18px] text-[#D8BE94] shrink-0">
                                {servicoSelecionado?.preco}
                              </span>
                            </div>
                          )}

                          <p className="text-xs font-light text-[#CDB3B0]">
                            {dataSelecionada?.toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}{' '}
                            às {horarioSelecionado}
                          </p>
                          {profissionalSelecionada && (
                            <p className="text-xs font-light text-[#CDB3B0]">
                              Profissional: {profissionalSelecionada.nome}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Rodapé do modal */}
              <div className="px-6 py-4 border-t border-[#D8BE94]/30 flex items-center justify-between gap-4 shrink-0 bg-[#2A060E]">
                <button
                  type="button"
                  onClick={() => {
                    if (passoAgendamento === 1) {
                      setModalAberto(false);
                    } else {
                      irParaPasso(passoAgendamento - 1);
                    }
                  }}
                  className="min-h-[44px] px-5 py-2 border border-[#D8BE94]/55 text-[11px] uppercase tracking-[0.24em] text-[#F5ECDD] hover:border-[#D8BE94] transition-colors cursor-pointer"
                >
                  VOLTAR
                </button>

                {passoAgendamento < 4 ? (
                  <button
                    type="button"
                    disabled={
                      (passoAgendamento === 1 && !servicoSelecionado) ||
                      (passoAgendamento === 2 && !dataSelecionada) ||
                      (passoAgendamento === 3 && !horarioSelecionado)
                    }
                    onClick={() => irParaPasso(passoAgendamento + 1)}
                    className="min-h-[44px] px-7 py-2 bg-[#D8BE94] text-[#2A060E] text-[11px] font-semibold uppercase tracking-[0.24em] hover:bg-[#F5ECDD] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    PRÓXIMO
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!nomeCliente.trim() || !telefoneCliente.trim()}
                    onClick={confirmarAgendamentoWhatsApp}
                    className="min-h-[44px] px-7 py-2 bg-[#D8BE94] text-[#2A060E] text-[11px] font-semibold uppercase tracking-[0.24em] hover:bg-[#F5ECDD] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    CONFIRMAR NO WHATSAPP
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
