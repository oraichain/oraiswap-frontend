export interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
}
