import { Download } from "lucide-react";

export const DownloadExcelButton = ({ onDownload, loading }) => {
    return (
        <button
            onClick={onDownload}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-5 py-3 rounded-xl font-medium transition active:scale-[0.98]"
        >
            <Download size={18} />

            {loading ? "Descargando..." : "Descargar Excel"}
        </button>
    );
};