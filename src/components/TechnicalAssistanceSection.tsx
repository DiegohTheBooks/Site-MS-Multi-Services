import React from 'react';
import { Wrench, Cpu, BatteryCharging, Sparkles, CheckCircle, ArrowRight, Shield, Clock } from 'lucide-react';
import labImage from '../assets/images/ms_assistance_lab_1791603869515.jpg';

interface TechnicalAssistanceSectionProps {
  onRequestQuote: () => void;
}

export const TechnicalAssistanceSection: React.FC<TechnicalAssistanceSectionProps> = ({
  onRequestQuote
}) => {
  const services = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#D8AE35]" />,
      title: "Troca de Telas e Displays",
      description: "Instalação de peças com fidelidade de cores, taxa de atualização nativa e calibração de sensores biométricos e True Tone."
    },
    {
      icon: <BatteryCharging className="w-5 h-5 text-[#D8AE35]" />,
      title: "Troca de Baterias Certificadas",
      description: "Baterias com células novas de alta densidade, saúde a 100% e ciclo de vida prolongado para seu smartphone ou notebook."
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#D8AE35]" />,
      title: "Reparo em Placas & Microssoldagem",
      description: "Recuperação de circuitos integrados (PMIC, CI de Carga, Codec de Áudio) e desoxidação após contato com líquidos."
    },
    {
      icon: <Wrench className="w-5 h-5 text-[#D8AE35]" />,
      title: "Limpeza Preventiva & Upgrade",
      description: "Troca de pasta térmica de alto rendimento, despoeiramento de coolers e expansão de memória RAM ou SSD NVMe."
    }
  ];

  return (
    <section className="bg-[#0b0b0b] border-t border-neutral-800/80 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D8AE35] mb-2">
            <span>Assistência Técnica Especializada MS</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400">Laboratório Físico Próprio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4 [text-wrap:balance]">
            Cuidado Profissional e Peças Rigorosas Para Seu Equipamento.
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Mais do que vender os melhores produtos, a MS Multi Services conta com uma bancada técnica completa para diagnósticos transparentes, orçamentos sem compromisso e garantia em cada reparo executado.
          </p>
        </div>

        {/* Content Split: Image & Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Lab Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#141414] shadow-xl">
              <img
                src={labImage}
                alt="Laboratório técnico MS Multi Services"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#090909]/90 border border-neutral-800 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#D8AE35] uppercase font-bold block">Controle de Qualidade</span>
                  <span className="text-sm font-semibold text-white">Inspeção microscópica e teste de bancada</span>
                </div>
                <div className="px-2.5 py-1 bg-neutral-800 text-white text-xs font-mono rounded">
                  Garantia de 90 dias
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Como funciona o atendimento
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800/80 flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#D8AE35]/15 border border-[#D8AE35]/40 text-[#D8AE35] text-xs font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Solicitação e Entrada</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Envie os dados do seu aparelho pelo formulário ou traga pessoalmente em nosso balcão. Você recebe o número de Ordem de Serviço na hora.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800/80 flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#D8AE35]/15 border border-[#D8AE35]/40 text-[#D8AE35] text-xs font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Diagnóstico e Orçamento Transparente</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Nossos técnicos analisam os componentes, explicam o defeito com fotos e informam o valor exato antes de qualquer intervenção.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800/80 flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-lg bg-[#D8AE35]/15 border border-[#D8AE35]/40 text-[#D8AE35] text-xs font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Execução Rápida e Testes Finais</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Reparo realizado com peças originais ou de qualidade premium homologada. Testes de estresse, bateria e selagem antes da liberação.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onRequestQuote}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#D8AE35]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Solicitar Orçamento de Assistência</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-neutral-800/80">
          {services.map((svc, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-[#141414] border border-neutral-800 hover:border-[#D8AE35]/50 transition-colors">
              <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-neutral-800 w-fit mb-3">
                {svc.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{svc.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{svc.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
