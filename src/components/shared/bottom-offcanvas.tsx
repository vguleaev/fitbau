import { FaTimes } from 'react-icons/fa';

type ComponentProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export const BottomOffcanvas = ({ isOpen, children, onClose }: ComponentProps) => {
  return (
    <div>
      <div className="drawer drawer-end">
        <input id="bottom-offcanvas" type="checkbox" checked={isOpen} className="drawer-toggle" />

        <div className="drawer-side">
          <div className="menu p-4 w-80 h-full bg-base-200 text-base-content w-full mt-[64px]">
            <div className="z-[1] p-2 cursor-pointer flex justify-end" onClick={() => onClose()}>
              <FaTimes className="h-6 w-6" />
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};