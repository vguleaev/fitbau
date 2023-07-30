import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const target = e.target as HTMLFormElement;

    const response = await signIn('credentials', {
      redirect: false,
      csrfToken: target.csrfToken.value,
      email: target.email.value,
      password: target.password.value,
    });

    if (response?.ok) {
      toast.success(`Successfully logged in!`);
      await router.push('/');
    } else {
      toast.error(`${response?.error}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-96 flex flex-col flex-auto justify-center items-center">
        <div className="mb-4">
          <Image src="/images/logo.png" alt="App Logo" width={80} height={80} priority />
        </div>
        <div className="mb-4 text-center">
          <h1 className="text-2xl tracking-tight mb-5">Fitbau</h1>
          <form onSubmit={onSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input
              placeholder="Email"
              className="input input-bordered w-full max-w-xs mb-4"
              name="email"
              type="email"
              required
            />
            <input
              placeholder="Password"
              className="input input-bordered w-full max-w-xs mb-4"
              name="password"
              type="password"
              required
            />
            <div className="flex flex-row gap-3 justify-center mb-4">
              <button className={`btn btn-primary w-full max-w-xs`} type="submit" disabled={isLoading}>
                <span className={isLoading ? 'loading loading-spinner' : ''} />
                Sign in with email
              </button>
            </div>
          </form>
          <Link href="/auth/signup" className="cursor-pointer underline underline-offset-4">
            Don&apos;t have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
