import { lusitana } from '@/app/ui/fonts';
import { LH } from '@/components/lh';
import { Suspense } from 'react';
import {
    RevenueChartSkeleton,
    LatestInvoicesSkeleton,
    CardsSkeleton,
  } from '@/app/ui/skeletons';
 
export default async function Page() {
  // const {
  //   numberOfInvoices,
  //   numberOfCustomers,
  // TRA LA LA   totalPaidInvoices,
  //   totalPendingInvoices,
  // } = await fetchCardData();
      
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <LH />
      
    </main>
  );
}