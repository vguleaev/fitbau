import Image from 'next/image';
import styles from '@/styles/Home.module.scss';
import Counter from '@/components/counter';
import { useCounterStore } from '@/stores/counter.store';
import { GetServerSideProps } from 'next';
import AuthForm from '@/components/auth-form';

type ComponentProps = {
  data: {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/100`);
  const data = await res.json();

  return { props: { data } };
};

export default function Home({ data }: ComponentProps) {
  useCounterStore.setState({ counter: data.id });

  return (
    <>
      <div className={styles.main}>
        <h1 className="text-2xl mb-5">Fullstack Next.js project starter</h1>
        <div className="flex mb-32">
          <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
          <Image className="ml-5" src="/vercel.svg" alt="13" width={40} height={31} priority />
        </div>

        <div className="flex flex-col lg:flex-row p-2 gap-5">
          <div className="card card-compact bg-base-100 shadow-xl mb-5">
            <div className="card-body">
              <h2 className="card-title">Zustand state</h2>
              <Counter />
            </div>
          </div>
          <div className="card card-compact bg-base-100 shadow-xl mb-5">
            <div className="card-body">
              <h2 className="card-title">NextAuth</h2>
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
