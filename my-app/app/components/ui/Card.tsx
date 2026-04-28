interface CardProps {
  icon: string;
  title: string;
  description: string;
  details?: string[];
}

export default function Card({ icon, title, description, details }: CardProps) {
  return (
    <div className="group bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {details && (
        <ul className="space-y-2">
          {details.map((detail, i) => (
            <li key={i} className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              {detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}