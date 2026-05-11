export const ReportFilters = ({
    startDate,
    endDate,
    onChange
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center">
            
            {/* FECHA INICIO */}
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    Fecha inicial
                </label>

                <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
            </div>

            {/* FECHA FINAL */}
            <div className="w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    Fecha final
                </label>

                <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
            </div>

        </div>
    );
};