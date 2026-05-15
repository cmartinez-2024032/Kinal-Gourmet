import { Download, Loader2 } from "lucide-react";

export const DownloadExcelButton = ({ onDownload, loading, className }) => {
    return (
        <button
            onClick={onDownload}
            disabled={loading}
            className={className || `
                group relative flex items-center gap-3 px-8 py-4 
                bg-emerald-600 hover:bg-emerald-500 
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em]
                transition-all duration-300 shadow-xl shadow-emerald-900/20 
                hover:-translate-y-1 active:scale-95 overflow-hidden
            `}
        >
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Download size={18} className="group-hover:bounce transition-transform duration-300" />
            )}

            <span className="relative z-10">
                {loading ? "Generando Archivo..." : "Exportar a Excel"}
            </span>
        </button>
    );
};