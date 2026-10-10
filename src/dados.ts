export interface Foto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface AssinaturaCasa {
  id: string;
  nome: string;
  preco: string;
  categoria: string;
  duracao: string;
  minutos: number;
  valorNumerico: number;
  sobConsulta: boolean;
  foto: Foto;
}

export interface Servico {
  id: string;
  categoria: string;
  nome: string;
  duracao: string;
  minutos: number;
  preco: string;
  valorNumerico: number;
  sobConsulta: boolean;
}

export interface Pacote {
  id: string;
  nome: string;
  itens: string;
  duracao: string;
  minutos: number;
  preco: string;
  valorNumerico: number;
  sobConsulta: boolean;
}

export interface Profissional {
  id: string;
  nome: string;
  primeiroNome: string;
  especialidade: string;
  foto: Foto;
}

export interface Depoimento {
  id: string;
  texto: string;
  nome: string;
  data: string;
}

export interface PerguntaFrequente {
  id: string;
  pergunta: string;
  resposta: string;
}

export interface AntesDepoisItem {
  id: string;
  antes: Foto;
  depois: Foto;
  legenda?: string;
}

export interface FotoResultado extends Foto {
  id: string;
  proporcao: 'alta' | 'media' | 'curta';
}

export const DADOS_SALAO = {
  nome: 'Essencia Studio',
  whatsapp: '5549999619123',
  telefone: '(49) 99961-9123',
  endereco: 'Av. Principal, 1830 — Centro',
  bairroCidade: 'ATENDIMENTO COM HORA MARCADA',
  horario: 'Segunda a sábado, das 8h às 19h',
  instagram: 'https://www.instagram.com/essencia_studio_spa',
  googleMapsUrl: 'https://www.google.com/maps',
  googleAvaliacoesUrl: 'https://www.google.com/maps',
  mensagemWhatsappDuvida:
    'Olá! Vim pelo site do Essencia Studio e gostaria de tirar uma dúvida.',

  abertura: {
    rotulo: 'SALÃO DE BELEZA',
    tituloLines: ['Cabelo, maquiagem', 'e estética', 'em um só lugar.'],
    titulo: 'Cabelo, maquiagem e estética em um só lugar.',
    texto: 'Com hora marcada, de segunda a sábado, das 8h às 19h.',
    foto: {
      src: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=75&w=1400',
      alt: 'Cliente ruiva com franja e batom vermelho',
      width: 1400,
      height: 1750,
    } as Foto,
  },

  apresentacao: {
    frase: 'Aqui o atendimento é com hora marcada e sem pressa.',
    marcas: "L'ORÉAL PROFESSIONNEL, KÉRASTASE, WELLA, REDKEN",
  },

  assinaturas: [
    {
      id: 'assinatura-noiva',
      nome: 'Dia de Noiva',
      preco: 'Sob consulta',
      categoria: 'Pacote',
      duracao: '240 min',
      minutos: 240,
      valorNumerico: 0,
      sobConsulta: true,
      foto: {
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=75&w=700',
        alt: 'Noiva com buquê em luz de fim de tarde',
        width: 700,
        height: 958,
      },
    },
    {
      id: 'assinatura-penteado',
      nome: 'Penteado para Eventos',
      preco: 'A partir de R$ 150',
      categoria: 'Cabelo',
      duracao: '90 min',
      minutos: 90,
      valorNumerico: 150,
      sobConsulta: true,
      foto: {
        src: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=75&w=700',
        alt: 'Penteado preso sendo finalizado',
        width: 700,
        height: 958,
      },
    },
    {
      id: 'assinatura-maquiagem',
      nome: 'Maquiagem Social',
      preco: 'R$ 200',
      categoria: 'Maquiagem',
      duracao: '60 min',
      minutos: 60,
      valorNumerico: 200,
      sobConsulta: false,
      foto: {
        src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=75&w=700',
        alt: 'Maquiagem sendo aplicada',
        width: 700,
        height: 958,
      },
    },
  ] as AssinaturaCasa[],

  categoriasServicos: [
    'Todos',
    'Cabelo',
    'Sobrancelha',
    'Maquiagem',
    'Mãos e Pés',
    'Estética',
    'Massagem',
    'Depilação',
    'Barba',
  ],

  servicos: [
    {
      id: 'srv-1',
      categoria: 'Sobrancelha',
      nome: 'Design de Sobrancelha',
      duracao: '30 min',
      minutos: 30,
      preco: 'R$ 50',
      valorNumerico: 50,
      sobConsulta: false,
    },
    {
      id: 'srv-2',
      categoria: 'Cabelo',
      nome: 'Corte Feminino Autoral',
      duracao: '60 min',
      minutos: 60,
      preco: 'Sob consulta',
      valorNumerico: 0,
      sobConsulta: true,
    },
    {
      id: 'srv-3',
      categoria: 'Cabelo',
      nome: 'Penteado para Eventos',
      duracao: '90 min',
      minutos: 90,
      preco: 'A partir de R$ 150',
      valorNumerico: 150,
      sobConsulta: true,
    },
    {
      id: 'srv-4',
      categoria: 'Cabelo',
      nome: 'Hidratação Profunda Kérastase',
      duracao: '45 min',
      minutos: 45,
      preco: 'R$ 180',
      valorNumerico: 180,
      sobConsulta: false,
    },
    {
      id: 'srv-5',
      categoria: 'Barba',
      nome: 'Barba e Bigode',
      duracao: '40 min',
      minutos: 40,
      preco: 'R$ 60',
      valorNumerico: 60,
      sobConsulta: false,
    },
    {
      id: 'srv-6',
      categoria: 'Mãos e Pés',
      nome: 'Manicure e Pedicure Spa',
      duracao: '90 min',
      minutos: 90,
      preco: 'R$ 120',
      valorNumerico: 120,
      sobConsulta: false,
    },
    {
      id: 'srv-7',
      categoria: 'Maquiagem',
      nome: 'Maquiagem Social',
      duracao: '60 min',
      minutos: 60,
      preco: 'R$ 200',
      valorNumerico: 200,
      sobConsulta: false,
    },
    {
      id: 'srv-8',
      categoria: 'Massagem',
      nome: 'Massagem Relaxante',
      duracao: '60 min',
      minutos: 60,
      preco: 'R$ 150',
      valorNumerico: 150,
      sobConsulta: false,
    },
    {
      id: 'srv-9',
      categoria: 'Depilação',
      nome: 'Depilação Completa',
      duracao: '60 min',
      minutos: 60,
      preco: 'Sob consulta',
      valorNumerico: 0,
      sobConsulta: true,
    },
    {
      id: 'srv-10',
      categoria: 'Estética',
      nome: 'Limpeza de Pele Profunda',
      duracao: '90 min',
      minutos: 90,
      preco: 'R$ 220',
      valorNumerico: 220,
      sobConsulta: false,
    },
  ] as Servico[],

  pacotes: [
    {
      id: 'pkg-dia-de-noiva',
      nome: 'Dia de Noiva',
      itens: 'Cabelo, maquiagem, unhas e massagem',
      duracao: '240 min',
      minutos: 240,
      preco: 'Sob consulta',
      valorNumerico: 0,
      sobConsulta: true,
    },
    {
      id: 'pkg-combo-capilar',
      nome: 'Combo Capilar',
      itens: 'Hidratação, corte e escova',
      duracao: '150 min',
      minutos: 150,
      preco: 'R$ 350',
      valorNumerico: 350,
      sobConsulta: false,
    },
    {
      id: 'pkg-spa-day',
      nome: 'Spa Day',
      itens: 'Massagem, limpeza de pele e manicure',
      duracao: '210 min',
      minutos: 210,
      preco: 'R$ 450',
      valorNumerico: 450,
      sobConsulta: false,
    },
  ] as Pacote[],

  resultados: [
    {
      id: 'resultado-1',
      src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=75&w=700',
      alt: 'Cabelo longo ondulado em tom mel',
      width: 700,
      height: 933,
      proporcao: 'alta',
    },
    {
      id: 'resultado-2',
      src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=75&w=700',
      alt: 'Corte chanel ruivo',
      width: 700,
      height: 780,
      proporcao: 'curta',
    },
    {
      id: 'resultado-3',
      src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=75&w=700',
      alt: 'Unhas com esmaltação escura',
      width: 700,
      height: 875,
      proporcao: 'media',
    },
    {
      id: 'resultado-4',
      src: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=75&w=700',
      alt: 'Ondas sendo modeladas com babyliss',
      width: 700,
      height: 875,
      proporcao: 'media',
    },
    {
      id: 'resultado-5',
      src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=75&w=700',
      alt: 'Coque alto com franja',
      width: 700,
      height: 933,
      proporcao: 'alta',
    },
    {
      id: 'resultado-6',
      src: 'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?auto=format&fit=crop&q=75&w=700',
      alt: 'Rabo de cavalo longo trançado, de perfil',
      width: 700,
      height: 780,
      proporcao: 'curta',
    },
  ] as FotoResultado[],

  antesDepois: [] as AntesDepoisItem[],

  equipe: [
    {
      id: 'camila-rocha',
      nome: 'Camila Rocha',
      primeiroNome: 'Camila',
      especialidade: 'Colorista e cortes',
      foto: {
        src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=75&w=600',
        alt: 'Camila Rocha, colorista',
        width: 600,
        height: 750,
      },
    },
    {
      id: 'juliana-prado',
      nome: 'Juliana Prado',
      primeiroNome: 'Juliana',
      especialidade: 'Maquiadora',
      foto: {
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=75&w=600',
        alt: 'Juliana Prado, maquiadora',
        width: 600,
        height: 750,
      },
    },
    {
      id: 'renata-alves',
      nome: 'Renata Alves',
      primeiroNome: 'Renata',
      especialidade: 'Esteticista',
      foto: {
        src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=75&w=600',
        alt: 'Renata Alves, esteticista',
        width: 600,
        height: 750,
      },
    },
  ] as Profissional[],

  salao: {
    titulo: 'O salão',
    texto:
      'Fazemos cabelo, unhas, maquiagem e estética no mesmo endereço. Antes de começar, a profissional conversa com você para entender o que quer e o que funciona no seu dia a dia.',
    fotoSalao: {
      src: 'https://images.unsplash.com/photo-1595944024804-733665a112db?auto=format&fit=crop&q=75&w=1000',
      alt: 'Interior do salão com lustre e espelhos',
      width: 1000,
      height: 1200,
    } as Foto,
    fotoTratamento: {
      src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=75&w=700',
      alt: 'Sérum de tratamento sendo aplicado',
      width: 700,
      height: 875,
    } as Foto,
  },

  depoimentos: [
    {
      id: 'depoimento-1',
      texto: 'Super atenciosos e queridos, são profissionais excelentes.',
      nome: 'Jessica',
      data: 'fevereiro de 2025',
    },
    {
      id: 'depoimento-2',
      texto: 'Ambiente agradável e com uma energia incrível!',
      nome: 'Alexandra Calliari',
      data: '2024',
    },
  ] as Depoimento[],

  perguntasFrequentes: [
    {
      id: 'faq-1',
      pergunta: 'Preciso agendar antes?',
      resposta:
        'Sim. O atendimento é com hora marcada, e você agenda pelo site em menos de um minuto.',
    },
    {
      id: 'faq-2',
      pergunta: 'Quais formas de pagamento vocês aceitam?',
      resposta: 'Pix, cartão de débito e cartão de crédito.',
    },
    {
      id: 'faq-3',
      pergunta: 'Posso remarcar meu horário?',
      resposta: 'Pode. Avise pelo WhatsApp com pelo menos 24 horas de antecedência.',
    },
    {
      id: 'faq-4',
      pergunta: 'Tem estacionamento?',
      resposta: 'Há estacionamento pago no prédio e vagas na rua.',
    },
  ] as PerguntaFrequente[],

  chamadoFinal: {
    titulo: 'Agende o seu horário.',
    texto: 'Marque pelo site e confirme pelo WhatsApp.',
  },

  horariosManha: ['08:00', '09:00', '10:00', '11:00'],
  horariosTarde: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
};
