'use client'
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FormEvent } from 'react';
import {
  AtSymbolIcon,
  KeyIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import AcmeLogo from '@/app/ui/acme-logo';
import { useRouter } from 'next/navigation';

export default function Form() {
  const router = useRouter(); // Use useRouter here

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    console.log({ response });

    if (!response?.error) {
      router.push('/dashboard');
    } else {
      console.error('Authentication failed:', response.error);
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[600px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-[#5d534a] p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
        <div className="w-full rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className={`${lusitana.className} mb-3 text-2xl`}>
              Login
            </h1>
            <div className="flex w-full flex-col">
              <div>
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    type="email"
                    placeholder="Enter your email address"
                    required
                  />
                  <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                  <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>
            <button type="submit" className="mt-4 w-full bg-[#775436]">
              Login <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" /> 
            </button>
          </div>
        </form>
        <div className="flex w-full flex-col">
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Do not have an account?{' '}
              <Link href="../register" className="text-[#775436]">
               Register here
              </Link>
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}