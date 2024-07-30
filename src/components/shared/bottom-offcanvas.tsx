import { FaTimes } from 'react-icons/fa';

type ComponentProps = {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const BottomOffcanvas = ({ isOpen, children, title, onClose }: ComponentProps) => {
  return (
    <div>
      <div className="drawer drawer-end">
        <input id="bottom-offcanvas" type="checkbox" readOnly checked={isOpen} className="drawer-toggle" />

        <div className="drawer-side z-[1]">
          <div className="menu p-4 h-full bg-base-200 text-base-content w-full flex flex-col">
            <div className="flex flex-row justify-between mt-2">
              {title && <span className="text-lg font-bold">{title}</span>}
              <div className="cursor-pointer" onClick={() => onClose()}>
                <FaTimes className="h-6 w-6" />
              </div>
            </div>

            <div className="h-[90%]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
