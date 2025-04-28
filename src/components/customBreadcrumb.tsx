import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface ICrumb {
  label: string;
  href: string;
}

interface ICustomBreadcrumbProps {
  crumbs: ICrumb[];
}

const CustomBreadcrumb = ({ crumbs }: ICustomBreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg mb-6 flex items-center gap-1">
        {crumbs.map((crumb, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink
              href={crumb.href}
              className="flex items-center gap-1 hover: transition-colors font-semibold"
            >
              {crumb.label}
              {index < crumbs.length - 1 && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
