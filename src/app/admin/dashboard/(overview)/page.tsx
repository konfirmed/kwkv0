import { lusitana } from '@/app/kwk/ui/fonts';
import { LH } from '@/app/kwk/components/lh';
import { Suspense } from 'react';
import {
    RevenueChartSkeleton,
    LatestInvoicesSkeleton,
    CardsSkeleton,
  } from '@/app/kwk/ui/skeletons';
 
export default async function Page() {
  // const {
  //   numberOfInvoices,
  //   numberOfCustomers,
  // TRA LA LA   totalPaidInvoices,
  //   totalPendingInvoices,
  // } = await fetchCardData();
      
  return (
    <main>
      <LH />
    </main>
  );
}