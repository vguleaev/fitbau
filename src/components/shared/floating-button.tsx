import React from 'react';
import { FaPlus } from 'react-icons/fa';

type ComponentProps = {
  onClick: () => void;
};

export const FloatingButton = ({ onClick }: ComponentProps) => {
  return (
    <div className="fixed bottom-[80px] right-[20px]">
      <button onClick={() => onClick()} className="btn btn-lg btn-circle btn-primary">
        <FaPlus className="w-7 h-7" />
      </button>
    </div>
  );
};
