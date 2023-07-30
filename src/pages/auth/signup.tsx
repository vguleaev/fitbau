import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    });
    setIsLoading(false);
    if (res.status === 200) {
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/signin');
      }, 1500);
    } else {
      toast.error(await res.text());
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-96 flex flex-col flex-auto justify-center items-center">
        <div className="mb-5">
          <Image src="/images/logo.png" alt="App Logo" width={70} height={70} priority />
        </div>
        <div className="mb-4 text-center">
          <h1 className="text-2xl tracking-tight mb-5">Create an account</h1>
          <form onSubmit={onSubmit}>
            <input
              placeholder="Name"
              className="input input-bordered w-full max-w-xs mb-4"
              name="name"
              type="text"
              required
            />
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
            <div className="flex flex-row gap-3 justify-center mb-2">
              <button className={`btn btn-primary w-full max-w-xs`} type="submit" disabled={isLoading}>
                <span className={isLoading ? 'loading loading-spinner' : ''} />
                Sign up with email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
