import Layout from '@/layout/layout';
import PAGE_URL from '@/constants/page.constant';

export default function Home() {
  return (
    <Layout page={PAGE_URL.WORKOUTS}>
      <div className="flex justify-center text-center m-5">Workouts</div>
    </Layout>
  );
}
