import { Company } from '@/types';
import Link from 'next/link';

interface CompanyListProps {
  companies: Company[];
}

export default function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
      <h3 className="font-semibold text-gray-900 mb-3">Company Bowls</h3>
      <div className="space-y-2">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/bowl/${company.id}`}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-semibold text-sm">
                {company.logo}
              </div>
              <span className="text-sm">{company.name}</span>
            </div>
            <span className="text-xs text-gray-500">{(company.memberCount / 1000).toFixed(1)}k</span>
          </Link>
        ))}
        <Link href="/companies" className="block text-sm text-blue-600 hover:underline mt-3">
          View all companies →
        </Link>
      </div>
    </div>
  );
}
