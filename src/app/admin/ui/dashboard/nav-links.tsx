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
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Debuggers', href: '/dashboard/debuggers', icon: UserGroupIcon },
  { name: 'CrUX Metrics', href: '/real-users', icon: UserGroupIcon }, 
  { name: 'Capo JS', href: '/admin/dashboard/capo', icon: UserGroupIcon },
  //create a new folder for debuggers
  { name: 'Largest Contentful Paint', href: '/dashboard/debuggers/lcp', icon: UserGroupIcon }, // debugger
  { name: 'LongTask', href: '/dashboard/longtask', icon: UserGroupIcon }, // debugger
  { name: 'Layout Stability', href: '/dashboard/debuggers/dcls', icon: UserGroupIcon }, // debugger
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
