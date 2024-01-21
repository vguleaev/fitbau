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

  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    if (dialogRef.current && !isClickInsideRectangle(e.nativeEvent, containerRef.current)) {
      onClose();
    }
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    document.body.classList.remove('modal-open');
  };

  const openDialog = () => {
    dialogRef.current?.showModal();
    document.body.classList.add('modal-open'); // prevent bg scroll
  };

  useEffect(() => {
    if (isOpened) {
      openDialog();
    } else {
      closeDialog();
    }

    const onEscKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpened) {
        onClose();
      }
    };

    document.addEventListener('keydown', onEscKeyDown);
    return () => {
      document.removeEventListener('keydown', onEscKeyDown);
    };
  }, [isOpened, onClose]);

  return (
    <dialog id="my-modal-dialog" className="modal" ref={dialogRef} onClick={(e) => onDialogClick(e)}>
      <div className="modal-box mb-[3rem]" ref={containerRef}>
        {children}
      </div>
    </dialog>
  );
};
