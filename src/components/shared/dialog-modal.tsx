import React, { useEffect, useRef } from 'react';

type ComponentProps = {
  isOpened: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export const DialogModal = ({ isOpened, children, onClose }: ComponentProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement | null) => {
    if (element === null) {
      return false;
    }
    const r = element.getBoundingClientRect();
    return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
  };

  useEffect(() => {
    if (isOpened) {
      dialogRef.current?.showModal();
      document.body.classList.add('modal-open'); // prevent bg scroll
    } else {
      dialogRef.current?.close();
      document.body.classList.remove('modal-open');
    }
  }, [isOpened]);

  return (
    <dialog
      id="my-modal-dialog"
      className="modal"
      ref={dialogRef}
      onClick={(e) =>
        dialogRef.current && !isClickInsideRectangle(e as unknown as MouseEvent, containerRef.current) && onClose()
      }>
      <div className="modal-box mb-[3rem]" ref={containerRef}>
        {children}
      </div>
    </dialog>
  );
};
