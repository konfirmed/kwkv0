import Form from './form';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export default function LoginPage() {
  return <Form />;
}

// Renamed to use standard Next.js convention for server-side props
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
