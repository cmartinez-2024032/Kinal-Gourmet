import { TrendingUp } from "lucide-react";

export const ReportCard = ({
    title,
    value,
    icon: Icon = TrendingUp,
    description
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm text-gray-500 font-medium">
                        {title}
                    </h3>

                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {value}
                    </p>
                </div>

                <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                    <Icon size={24} />
                </div>
            </div>

            {description && (
                <p className="text-sm text-gray-400">
                    {description}
                </p>
            )}
        </div>
    );
};