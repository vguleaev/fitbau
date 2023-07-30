import { useCounterStore } from '@/stores/counter.store';

export default function Counter() {
  const { counter, increase, reset } = useCounterStore();

  return (
    <div>
      <h1 className="mb-2">count: {counter}</h1>
      <button className="btn mr-2" onClick={increase}>
        increase
      </button>
      <button className="btn" onClick={reset}>
        reset
      </button>
    </div>
  );
}
