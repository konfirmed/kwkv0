'use client';
import { authenticate } from '@/app/lib/actions';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
// import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProviders } from 'next-auth/react';
import { signIn } from 'next-auth/react';

export default function SignInForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    const handleClick = () => {
      signIn("google");
    };
    // const handleClick - () => {
    //   signIn("github");
    // };

    const [providers, setProviders] = useState(null );
    useEffect(() => {
      const setUpProviders = async () => {
        const response = await getProviders();
        console.log('Providers =', response);
        setProviders(response);
      };
      setUpProviders();
    }, []);
    return (
      <form action={dispatch} className="space-y-3  ">
        <div className="w-full rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Create an Account
          </h1>
          <div className="flex w-full flex-col ">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
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
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Confirm password"
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <SignInButton />
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
          <button onClick={handleClick}
          className="my-4 flex w-full items-center justify-center gap-4 rounded   border bg-white p-2">
            <Image
              src="/google-icon.png"
              alt="google icon"
              width={30}
              height={30}
            />
            <p className="font-bold">Continue with Google</p>
          </button>
          <button onClick={handleClick}
          className="flex w-full items-center justify-center gap-4 rounded   border bg-white p-2">
            <Image src="/github.png" alt="google icon" width={30} height={30} />
            <p className="font-bold">Continue with Git Hub</p>
          </button>
        </div>
      </form>
    );
  }
  function SignInButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        className="mt-4 w-full  bg-[#775436] hover:bg-[#504231]  md:mt-10"
        aria-disabled={pending}
      >
        Sign Up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
    );
  }