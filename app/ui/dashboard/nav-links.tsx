'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

// move all debuggers to a seperate folder. This will seperate Web Perf metrics from other metrics like SEO, Accessibility, etc.

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  // { name: 'Debuggers', href: '/dashboard/debuggers', icon: UserGroupIcon },
  { name: 'Real User Metrics', href: '/dashboard/metrics', icon: UserGroupIcon }, 
  { name: 'Lab Metrics', href: '/dashboard/lab-metrics', icon: UserGroupIcon },
  { name: 'Snapshots', href: '/dashboard/snapshots', icon: UserGroupIcon },
  { name: 'Pages', href: '/dashboard/pages', icon: UserGroupIcon },
  { name: 'Settings', href: '/dashboard/lab-metrics', icon: UserGroupIcon },
 
  // { name: 'LongTask', href: '/dashboard/longtask', icon: UserGroupIcon }, // debbuger
  // { name: 'Layout Stability', href: '/dashboard/debuggers/dcls', icon: UserGroupIcon }, // debbuger
  
  // {
  //   name: 'Account Dasboard',
  //   href: '/dashboard/account',
  //   icon: DocumentDuplicateIcon,
  // },
  // { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  // { name: 'Invoices', href: '/dashboard/invoices', icon: UserGroupIcon },
  // { name: 'Settings', href: '/dashboard/settings', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
