import { Link } from "wouter";
import { CertificationScheme } from "@shared/schema";
import { 
  BellRing, 
  Hash, 
  Briefcase, 
  TrendingUp, 
  ShoppingCart
} from "lucide-react";

interface SchemeCardProps {
  scheme: CertificationScheme;
}

const SchemeCard = ({ scheme }: SchemeCardProps) => {
  // Map icon string to Lucide icon
  const getIcon = () => {
    switch (scheme.icon) {
      case "bullhorn":
        return <BellRing className="text-white" />;
      case "hashtag":
        return <Hash className="text-tertiary" />;
      case "briefcase":
        return <Briefcase className="text-white" />;
      case "chart-line":
        return <TrendingUp className="text-white" />;
      case "shopping-cart":
        return <ShoppingCart className="text-white" />;
      default:
        return <BellRing className="text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden skema-card">
      <div className="p-4">
        <div className="flex items-start mb-4">
          <div className={`${scheme.iconBackground} rounded-md p-3 mr-3`}>
            {getIcon()}
          </div>
          <h3 className="font-heading font-semibold">{scheme.name}</h3>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            Profesi Terkait
          </span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            Lembaga Diklat
          </span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            Lowongan Pekerjaan
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{scheme.description}</p>
        <Link
          href={`/skema/${scheme.slug}`}
          className="inline-block bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded transition-colors duration-200"
        >
          Lihat Skema
        </Link>
      </div>
    </div>
  );
};

export default SchemeCard;
