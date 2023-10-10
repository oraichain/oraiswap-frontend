export interface ModalProps {
  className?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isCloseBtn?: boolean;
  onLiquidityChange?: () => void;
  myLpUsdt?: bigint;
  myLpBalance?: bigint;
}
