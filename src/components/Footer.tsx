import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Clock, MessageSquare, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenAssistance: () => void;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenAssistance,
  onOpenTracking
}) => {
  return (
    <footer className="bg-[#070707] border-t border-neutral-800 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://i.postimg.cc/MTnJQTSJ/MS.jpg"
                alt="MS Multi Services Logo"
                className="h-10 w-auto rounded border border-neutral-700"
              />
              <span className="font-bold text-white text-base tracking-tight">
                MS <span className="text-[#D8AE35]">MULTI SERVICES</span>
              </span>
            </div>

            <p className="text-neutral-400 leading-relaxed text-xs max-w-sm">
              Comércio eletrônico especializado em produtos de tecnologia, periféricos, componentes e assistência técnica de alta precisão. Qualidade e procedência comprovadas.
            </p>

            <div className="pt-2 text-[11px] text-neutral-500 space-y-1">
              <div>CNPJ: 48.912.345/0001-90</div>
              <div>MS MULTI SERVICES COMÉRCIO E MANUTENÇÃO LTDA.</div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  Catálogo de Produtos
                </a>
              </li>
              <li>
                <button onClick={onOpenAssistance} className="hover:text-white transition-colors text-left">
                  Assistência Técnica
                </button>
              </li>
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors text-left">
                  Rastrear Meu Pedido
                </button>
              </li>
              <li>
                <a href="#ofertas" className="hover:text-white transition-colors">
                  Ofertas em Destaque
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Políticas & Confiança
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>Garantia de 90 dias a 1 ano</li>
              <li>Política de Trocas e Devoluções</li>
              <li>Termos de Envio e Retirada</li>
              <li>Segurança e Privacidade (LGPD)</li>
              <li>Autenticidade de Peças</li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Atendimento
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D8AE35] shrink-0 mt-0.5" />
                <span>Rua do Comércio Tecnológico, 350 - Centro Comercial MS - São Paulo / SP</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D8AE35] shrink-0" />
                <span>(11) 3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>(11) 99999-8888 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D8AE35] shrink-0" />
                <span>Seg a Sex 08:30 - 18:30 | Sáb 09:00 - 14:00</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} MS Multi Services. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Ambiente Seguro com Criptografia SSL
            </span>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-neutral-500 hover:text-[#D8AE35] transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Painel do Lojista</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
