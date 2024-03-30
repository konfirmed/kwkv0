'use client';

import { FormEvent } from 'react';
import Link from 'next/link';
import { authenticate } from '@/app/lib/actions';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
// import { useFormState, useFormStatus } from 'react-dom';
import { lusitana } from '@/app/ui/fonts';
import AcmeLogo from '@/app/ui/acme-logo';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Form() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        id: formData.get('id'),
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    console.log({ response });
  };
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[600px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-[#5d534a] p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
          </div>
    <form
      onSubmit={handleSubmit}
      className="space-y-3  "
    >
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
                htmlFor="name"
              >
                 Name
              </label>
              <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
      id="name"
        name="name"
        type="name"
        placeholder="Enter name"
        required
      />
      <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
      <button type="submit"className="mt-4 w-full  bg-[#775436]"
     >
      Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" /> 
      </button>

      <div className="flex w-full flex-col">
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Already have an account?{' '}
              <Link href="/login"
                className="#775436">Login here
              </Link>
            </label>
          </div>
        </div>

      {/* <div
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
        </div> */}
      {/* <div className="my-4 flex w-full items-center justify-center gap-4 rounded   border bg-white p-2">
            <Image
              src="/google-icon.png"
              alt="google icon"
              width={30}
              height={30}
            />
            <p className="font-bold">Sign Up with Google</p>
          </div>
          <div className="flex w-full items-center justify-center gap-4 rounded   border bg-white p-2">
            <Image src="/github.png" alt="google icon" width={30} height={30} />
            <p className="font-bold">Sign Up with Git Hub</p>
          </div> */}
        </div>
      </form>
    {/* function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="mt-4 w-full  bg-[#775436] hover:bg-[#504231]  md:mt-10"
      aria-disabled={pending}
    >
      Sign Up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </button> */}

    <GoogleSignInButton />
    </div>
    </main>
  );
}
