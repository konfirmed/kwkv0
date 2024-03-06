import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
        <Link href="/lab-metrics">Lab Metrics </Link>
        <Link href="/metrics">Metrics </Link>
      </div>
    </main>
  );
}