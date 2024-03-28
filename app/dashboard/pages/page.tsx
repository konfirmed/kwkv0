import CardWrapper from '@/app/ui/dashboard/cards';
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// import { fetchCardData } from '@/app/lib/data'; // Remove fetchLatestInvoices
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
  //   totalPaidInvoices,
  //   totalPendingInvoices,
  // } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
        <Card title="CrUX metrics" value={''} type="collected" />
        <Card title="Synthetic Metrics" value={''} type="pending" />
        <Card title="Layout Shift Debugger" value={''} type="invoices" />
        <Card
          title="Long Tasks Debugger"
          value={""}
          type="customers"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pb-2">
        <Card title="Speculation Rules" value={''} type="collected" />
        <Card title="Largest Contentful Paint" value={''} type="pending" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 pt-3">
        <Card title="Actual Head" value={''} type="collected" />
        <Card title="Sorted Head" value={''} type="pending" />
      </div>
      <div className="grid gap-6 pt-3">
        <Card title="SEO Analyzer" value={''} type="invoices" />
        <Card
          title="Waterfall"
          value={""}
          type="customers"
        />
      </div>
    </main>
  );
}