import { lusitana } from '../fonts';
// import { fetchCruxData } from '@/app/lib/data';
import { useEffect, useState } from 'react';

  export default async function MCardWrapper() {
    // const {
    //     lcp,
    //     fid,
    //     cls,
    //     fcp,
    //     ttfb,
    //     inp,
    // } = await fetchCruxData();
  
    return (
      <>
        {/* NOTE: comment in this code when you get to this point in the course */}
  
        {/* <MCard metric='lcp' p75={lcp} />
        <MCard metric='fid' p75={fid} />
        <MCard metric='cls' p75={cls} />
        <MCard metric='fcp' p75={fcp} />
        <MCard metric='ttfb' p75={ttfb} />
        <MCard metric='inp' p75={inp} /> */}
  
      </>
    );
  }
  
  export function MCard({
    metric,
    p75,
  }: {
    metric: string;
    p75: number | string;
  }) {
  
    return (
      <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
          <h3 className="ml-2 text-sm font-medium">{metric}</h3>
        </div>
        <p
          className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {p75}
        </p>
      </div>
    );
  }
  