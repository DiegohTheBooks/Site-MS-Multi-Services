import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Wrench, CheckCircle } from 'lucide-react';
import heroImage from '../assets/images/ms_hero_tech_banner_1791603825951.jpg';

interface HeroBannerProps {
  onExploreProducts: () => void;
  onRequestAssistance: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreProducts,
  onRequestAssistance
}) => {
  return (
    <section className="relative overflow-hidden bg-[#090909] border-b border-neutral-800/80 pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Background ambient lighting in deep gold */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D8AE35]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-950/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Editorial brand kicker without pill boxes */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D8AE35] mb-4">
              <span>Loja Oficial & Assistência Técnica Especializada</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-400">Desde 2020</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 [text-wrap:balance]">
              Tecnologia de Alta Performance, Acessórios Originais & Suporte Especializado.
            </h1>

            {/* Clean descriptive paragraph */}
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              Compre smartphones, periféricos de precisão e componentes com procedência garantida e envio ágil. E quando seu equipamento precisar de reparo, conte com nosso laboratório técnico próprio.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExploreProducts}
                className="px-6 py-3.5 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-sm rounded-lg transition-all flex items-center gap-2.5 shadow-lg shadow-[#D8AE35]/20 cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px]"
              >
                <span>Ver Catálogo de Produtos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRequestAssistance}
                className="px-6 py-3.5 bg-[#171717] hover:bg-neutral-800 text-white border border-neutral-700 hover:border-[#D8AE35]/60 font-semibold text-sm rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-[#D8AE35]" />
                <span>Solicitar Assistência Técnica</span>
              </button>
            </div>

            {/* Micro trust cues */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-400 border-t border-neutral-800/80 pt-6">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#D8AE35]" />
                <span>Estoque pronta entrega</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#D8AE35]" />
                <span>Garantia de 90 dias a 1 ano</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#D8AE35]" />
                <span>Pagamento facilitado em até 12x ou PIX</span>
              </div>
            </div>

          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#171717] shadow-2xl group">
              <img
                src={heroImage}
                alt="Showcase de tecnologia e produtos MS Multi Services"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent opacity-80" />
              
              {/* Floating product highlight tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#090909]/90 border border-neutral-800/90 backdrop-blur-md flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#D8AE35] uppercase font-bold tracking-wider">Destaque da Coleção</div>
                  <div className="text-sm font-semibold text-white">Ecossistema Flagship Pro</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-400">A partir de</div>
                  <div className="text-sm font-bold text-white font-mono-numbers">R$ 549,00</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3-Pillar Confidence Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-neutral-800/70">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#121212]/70 border border-neutral-800/70">
            <div className="p-3 bg-[#171717] rounded-lg border border-[#D8AE35]/30 text-[#D8AE35] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Procedência e Garantia</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Todos os produtos são testados rigorosamente antes do envio, com nota e cobertura direta.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#121212]/70 border border-neutral-800/70">
            <div className="p-3 bg-[#171717] rounded-lg border border-[#D8AE35]/30 text-[#D8AE35] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Envio Expresso ou Retirada</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Opção de retirada em mãos no balcão técnico ou envio seguro para todo o território nacional.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#121212]/70 border border-neutral-800/70">
            <div className="p-3 bg-[#171717] rounded-lg border border-[#D8AE35]/30 text-[#D8AE35] shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Laboratório Próprio</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Bancada de assistência com peças de alta qualidade e técnicos prontos para diagnosticar seu aparelho.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
