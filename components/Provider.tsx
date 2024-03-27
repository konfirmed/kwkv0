'use client'

import React from 'react';
import { Session } from 'next-auth'; // Import Session type from next-auth
import { SessionProvider } from 'next-auth/react';

interface ProviderProps {
  children: React.ReactNode;
  session: Session | null; // Define the type for the session object
}

const Provider: React.FC<ProviderProps> = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default Provider;
