interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color?: 'red' | 'green' | 'blue' | 'yellow';
}

export function StatCard({ title, value, icon, trend, trendUp, color = 'red' }: StatCardProps) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
