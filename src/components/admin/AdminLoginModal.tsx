import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@msmultiservices.com.br');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMsg(res.message || 'Credenciais inválidas. Verifique seu login.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#D8AE35]/10 border border-[#D8AE35]/30 flex items-center justify-center text-[#D8AE35] mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Painel Administrativo</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Área restrita de gestão da MS Multi Services
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-300 font-medium mb-1">E-mail de Acesso</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#171717] border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D8AE35]"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-300 font-medium mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#171717] border border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D8AE35]"
            />
          </div>

          <div className="p-3 rounded-lg bg-[#161616] border border-neutral-800 text-[11px] text-neutral-400">
            <strong className="text-white block mb-0.5">Credenciais Padrão:</strong>
            E-mail: <code className="text-[#D8AE35]">admin@msmultiservices.com.br</code><br/>
            Senha: <code className="text-[#D8AE35]">admin123456</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D8AE35] hover:bg-[#e4be4a] disabled:bg-neutral-800 text-black font-bold text-xs rounded-xl transition-all shadow-md shadow-[#D8AE35]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
