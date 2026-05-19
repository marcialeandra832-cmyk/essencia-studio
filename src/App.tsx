import React, { useEffect, useRef } from 'react';
import { 
  Scissors, 
  Sparkles, 
  Star, 
  MapPin, 
  Phone, 
  Instagram, 
  Clock, 
  ChevronRight,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('Todos');
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = [
    'Todos', 'Cabelo', 'Depilação', 'Barba', 'Estética', 'Mãos e Pés', 'Maquiagem', 'Massagem', 'Sobrancelha'
  ];

  const allServices = [
    { id: 1, category: 'Sobrancelha', name: 'Design de Sobrancelha', time: '30min', price: 'R$ 50,00' },
    { id: 2, category: 'Cabelo', name: 'Corte Feminino Autorais', time: '60min', price: 'Sob Consulta' },
    { id: 3, category: 'Cabelo', name: 'Penteado para Eventos', time: '90min', price: 'A partir de R$ 150' },
    { id: 4, category: 'Estética', name: 'Hidratação Profunda Kérastase', time: '45min', price: 'R$ 180,00' },
    { id: 5, category: 'Barba', name: 'Barba e Bigode Premium', time: '40min', price: 'R$ 60,00' },
    { id: 6, category: 'Mãos e Pés', name: 'Manicure e Pedicure Spa', time: '90min', price: 'R$ 120,00' },
    { id: 7, category: 'Maquiagem', name: 'Maquiagem Social', time: '60min', price: 'R$ 200,00' },
    { id: 8, category: 'Massagem', name: 'Massagem Relaxante', time: '60min', price: 'R$ 150,00' },
    { id: 9, category: 'Depilação', name: 'Depilação Completa', time: '60min', price: 'Sob Consulta' },
    { id: 10, category: 'Estética', name: 'Limpeza de Pele Profunda', time: '90min', price: 'R$ 220,00' },
  ];

  const packages = [
    { name: 'Dia de Noiva Premium', items: ['Cabelo', 'Maquiagem', 'Unhas', 'Massagem'], price: 'Sob Consulta' },
    { name: 'Combo Estética Capilar', items: ['Hidratação', 'Corte', 'Escova'], price: 'R$ 350,00' },
    { name: 'Spa Day Relax', items: ['Massagem', 'Limpeza de Pele', 'Manicure'], price: 'R$ 450,00' },
  ];

  const filteredServices = allServices.filter(s => {
    const matchesCategory = activeCategory === 'Todos' || s.category.includes(activeCategory);
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    // Hero Entrance
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2
      });

      gsap.from('.hero-sub', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
      });

      gsap.from('.hero-cta', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: 'back.out(1.7)'
      });

      // Section Titles Reveal
      gsap.utils.toArray('.section-reveal').forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power2.out'
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const services = [
    { title: "Cabelos & Penteados", desc: "Cortes autorais e penteados para momentos inesquecíveis.", icon: <Scissors className="w-6 h-6 text-gold" /> },
    { title: "Estética Capilar", desc: "Tratamentos profundos para a saúde e brilho dos seus fios.", icon: <Sparkles className="w-6 h-6 text-gold" /> },
    { title: "Maquiagem Profissional", desc: "Realçando sua beleza natural com técnicas de luxo.", icon: <Star className="w-6 h-6 text-gold" /> },
    { title: "Estética Facial", desc: "Cuidados exclusivos para uma pele radiante e rejuvenescida.", icon: <Sparkles className="w-6 h-6 text-gold" /> }
  ];

  const testimonials = [
    { name: "Jessica", date: "21/02/2025", text: "Super atenciosos e queridos, são profissionais excelentes. ❤️" },
    { name: "Alexandra Calliari", date: "2024", text: "Ambiente agradável e com uma energia incrível!!" },
    { name: "Cléo Store", date: "2024", text: "Lugar incrível com uma loja de roupas maravilhosa." }
  ];

  const partners = ["L'Oréal Professionnel", "Kérastase", "Wella Professionals", "Truss Professional", "Redken", "Schwarzkopf"];

  return (
    <div className="min-h-screen selection:bg-gold/30 selection:text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-display tracking-[0.15em] text-gold font-bold uppercase">
              Essencia Studio
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-medium uppercase tracking-widest">
            <a href="#home" className="hover:text-gold transition-colors">Início</a>
            <a href="#servicos" className="hover:text-gold transition-colors">Serviços</a>
            <a href="#sobre" className="hover:text-gold transition-colors">Sobre</a>
            <a href="#contato" className="hover:text-gold transition-colors">Contato</a>
            <a 
              href="https://wa.me/5511987654321" 
              target="_blank" 
              className="px-6 py-2 bg-gold text-dark font-bold rounded-full hover:bg-white transition-all duration-300"
            >
              Agendar
            </a>
          </div>

          <button className="md:hidden text-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass absolute top-20 left-0 w-full p-6 flex flex-col gap-6 text-center"
          >
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Início</a>
            <a href="#servicos" onClick={() => setIsMenuOpen(false)}>Serviços</a>
            <a href="#sobre" onClick={() => setIsMenuOpen(false)}>Sobre</a>
            <a href="#contato" onClick={() => setIsMenuOpen(false)}>Contato</a>
            <a href="https://wa.me/5511987654321" className="bg-gold text-dark py-3 rounded-full font-bold">Agendar Agora</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Salon Interior" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="overflow-hidden mb-4">
            <h1 className="hero-title text-5xl md:text-8xl font-display leading-[0.9] tracking-tighter text-balance">
              A Arte de Revelar sua <span className="text-gold italic">Essência</span>
            </h1>
          </div>
          <p className="hero-sub text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light tracking-wide">
            Especialistas em transformar olhares e elevar a autoestima através de técnicas exclusivas de visagismo e estética avançada.
          </p>
          <div className="hero-cta flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="https://wa.me/5511987654321" 
              className="group relative px-10 py-5 bg-gold text-dark font-bold rounded-full overflow-hidden transition-all animate-pulse-gold"
            >
              <span className="relative z-10 flex items-center gap-2">
                Agende sua Experiência <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a href="#servicos" className="text-sm uppercase tracking-[0.2em] hover:text-gold transition-colors border-b border-white/20 pb-1">
              Descubra nossos serviços
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Authority Marquee */}
      <div className="py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="marquee-content flex items-center gap-20 px-10">
          {[...partners, ...partners].map((partner, i) => (
            <span key={i} className="text-xl md:text-2xl font-display text-white/20 whitespace-nowrap uppercase tracking-[0.3em]">
              {partner}
            </span>
          ))}
        </div>
      </div>

      {/* Services List Icons (Existing) */}
      <section className="py-20 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {services.map((s, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-6">
                {s.icon}
              </div>
              <h3 className="text-xl mb-3">{s.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detailed Menu & Packages */}
      <section id="menu" className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-reveal text-center mb-16">
            <span className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block">Experiências & Valores</span>
            <h2 className="text-4xl md:text-6xl mb-8">Menu de <span className="text-gold">Serviços</span></h2>
          </div>

          {/* Search & Categories */}
          <div className="mb-12 space-y-8">
            <div className="relative max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Pesquisar serviço..." 
                className="w-full glass rounded-full py-4 px-8 pl-14 outline-none focus:border-gold/50 transition-all text-white/80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/50">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin hidden" />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                    ? 'bg-gold text-dark font-bold' 
                    : 'glass text-white/40 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredServices.map(service => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={service.id} 
                className="glass p-8 rounded-3xl group hover:border-gold/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 border border-gold/20 px-2 py-1 rounded">
                    {service.category}
                  </span>
                  <span className="text-xs text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {service.time}
                  </span>
                </div>
                <h3 className="text-xl mb-2 group-hover:text-gold transition-colors">{service.name}</h3>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-lg font-display text-white/80">{service.price}</span>
                  <a 
                    href={`https://wa.me/5511987654321?text=Olá! Gostaria de agendar: ${service.name}`}
                    target="_blank"
                    className="text-xs uppercase tracking-widest font-bold text-gold hover:text-white transition-colors flex items-center gap-2"
                  >
                    Agendar <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Packages Section */}
          <div className="section-reveal text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-6">Pacotes <span className="text-gold italic">Exclusivos</span></h2>
            <p className="text-white/40 max-w-xl mx-auto">Combinações pensadas para uma experiência completa de cuidado e relaxamento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <div key={i} className="glass p-10 rounded-[2rem] border-gold/10 hover:border-gold/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-16 h-16 text-gold" />
                </div>
                <h3 className="text-2xl mb-6 font-display">{pkg.name}</h3>
                <ul className="space-y-3 mb-10">
                  {pkg.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-white/50 flex items-center gap-2">
                      <div className="w-1 h-1 bg-gold rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-display text-gold">{pkg.price}</span>
                  <a 
                    href={`https://wa.me/5511987654321?text=Olá! Tenho interesse no pacote: ${pkg.name}`}
                    target="_blank"
                    className="px-6 py-2 bg-white/5 hover:bg-gold hover:text-dark rounded-full text-xs font-bold transition-all"
                  >
                    Saber Mais
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden glass p-2">
              <img 
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800" 
                alt="Salon Experience" 
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 glass rounded-3xl p-8 hidden md:block">
              <div className="text-4xl font-display text-gold mb-2">2.3k+</div>
              <p className="text-sm text-white/40 uppercase tracking-widest">Seguidores no Instagram</p>
              <div className="mt-6 flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-dark overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i+20}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section-reveal">
            <span className="text-gold uppercase tracking-[0.3em] text-sm mb-6 block">Nossa História</span>
            <h2 className="text-4xl md:text-6xl mb-8 leading-tight">Onde a Tradição encontra a <span className="text-gold italic">Modernidade</span></h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              O Essencia Studio é mais que um salão de beleza; é um refúgio de bem-estar urbano. Com uma trajetória marcada pela excelência, oferecemos um atendimento personalizado que respeita a individualidade de cada de nossas clientes.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-gold shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Horário Amplo</h4>
                  <p className="text-xs text-white/40">Segunda a Sábado até as 19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Instagram className="w-6 h-6 text-gold shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Portfólio Vivo</h4>
                  <p className="text-xs text-white/40">Acompanhe nossas transformações diárias</p>
                </div>
              </div>
            </div>
            <a 
              href="https://www.instagram.com/essencia_studio_spa" 
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 glass rounded-full hover:bg-white/10 transition-all"
            >
              <Instagram className="w-5 h-5" /> Seguir no Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-reveal text-center mb-20">
            <h2 className="text-4xl md:text-5xl mb-6">O que nossas <span className="text-gold">Clientes</span> dizem</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="glass p-10 rounded-3xl relative">
                <div className="absolute top-10 right-10 text-gold/20">
                  <MessageCircle className="w-12 h-12" />
                </div>
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                </div>
                <p className="text-lg italic mb-8 text-white/80 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center font-display text-gold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-xs text-white/40">{t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contato" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1920" 
            alt="Beauty Detail" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl mb-8">Pronta para sua <span className="text-gold italic">Transformação?</span></h2>
          <p className="text-xl text-white/50 mb-12 font-light">
            Reserve seu horário e descubra por que somos referência em beleza e estética exclusiva.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <a 
              href="https://wa.me/5511987654321" 
              className="w-full md:w-auto px-12 py-6 bg-gold text-dark font-bold rounded-full text-lg hover:bg-white transition-all shadow-2xl shadow-gold/20 flex items-center justify-center gap-3"
            >
              <Phone className="w-6 h-6" /> Agendar via WhatsApp
            </a>
            <div className="text-left">
              <p className="text-sm text-white/40 uppercase tracking-widest mb-1">Ou ligue para nós</p>
              <p className="text-xl font-display">(11) 98765-4321</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-display tracking-[0.15em] text-gold font-bold uppercase">
                Essencia Studio
              </span>
            </div>
            <p className="text-white/40 max-w-sm mb-8 leading-relaxed">
              Excelência em Cabelos, Estética & Bem-estar. Um refúgio acolhedor e luxuoso criado para realçar a sua essência com serviços de excelência.
            </p>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/essencia_studio_spa" target="_blank" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gold uppercase tracking-widest text-sm mb-6">Links Úteis</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#home" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Serviços</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#contato" className="hover:text-white transition-colors">Agendamento</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold uppercase tracking-widest text-sm mb-6">Contato</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>Av. Pres. Juscelino Kubitschek, 1830 - Itaim Bibi, São Paulo - SP, 04543-011</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>(11) 98765-4321</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>Seg - Sáb: 08:00 - 19:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/20 uppercase tracking-widest">
          <p>© 2026 Essencia Studio. Todos os direitos reservados.</p>
          <p>Itaim Bibi, São Paulo - SP</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5511987654321" 
        target="_blank"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        <MessageCircle className="w-8 h-8" />
      </a>
    </div>
  );
}
