import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import { memo } from "react";

interface Company {
  id: string;
  name: string;
  logo: string;
  todoCount: number;
}

interface CompanyCardProps {
  company: Company;
  isSelected: boolean;
  onFilter: () => void;
  onViewDetail: () => void;
}

export function CompanyCard({ company, isSelected, onFilter, onViewDetail }: CompanyCardProps) {
  if (!company || !company.id) {
    console.warn('CompanyCard received invalid company data:', company);
    return null;
  }

  return (
    <Card className={`p-4 transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex flex-col items-center gap-3">
        <div 
          className="w-16 h-16 rounded-full overflow-hidden bg-muted cursor-pointer hover:scale-105 transition-transform"
          onClick={onFilter}
        >
          <ImageWithFallback
            src={company.logo}
            alt={`${company.name} logo`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h3 
            className="font-medium cursor-pointer hover:text-primary transition-colors"
            onClick={onFilter}
          >
            {company.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {company.todoCount} todo{company.todoCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onViewDetail}
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          Company Detail
        </Button>
      </div>
    </Card>
  );
}

// Export memoized version to prevent unnecessary re-renders
export default memo(CompanyCard);