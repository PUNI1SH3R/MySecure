import { FileText, Shield, Eye, ClipboardList } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    name: 'Secure Storage',
    description: 'Store documents securely on IPFS with blockchain verification.',
    icon: FileText,
  },
  {
    name: 'Access Control',
    description: 'Manage permissions with granular control over document access.',
    icon: Shield,
  },
  {
    name: 'View Documents',
    description: 'Access your documents securely from anywhere.',
    icon: Eye,
  },
  {
    name: 'Access Logs',
    description: 'Track document access with immutable blockchain logging.',
    icon: ClipboardList,
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32 bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Secure by Design</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for secure document management
          </p>
        </div>
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.name}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white hover:bg-gradient-to-b hover:from-blue-50 hover:to-white border-2 border-transparent hover:border-blue-100"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 group-hover:bg-white group-hover:shadow-lg transition-all duration-300 ring-8 ring-white/50 group-hover:ring-blue-100">
                  <feature.icon 
                    className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-all duration-300 transform group-hover:scale-110" 
                    aria-hidden="true" 
                  />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900 group-hover:text-blue-700 transition-colors duration-300 mb-3">
                  {feature.name}
                </dt>
                <dd className="text-sm leading-7 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </dd>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}