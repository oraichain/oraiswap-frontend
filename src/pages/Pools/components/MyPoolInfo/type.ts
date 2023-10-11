export interface ModalProps {
  className?: string;
  isOpen: boolean;
  close: () => void;
  isCloseBtn?: boolean;
  onLiquidityChange?: () => void;
  myLpUsdt?: bigint;
  myLpBalance?: bigint;
  pairDenoms?: string;
  open?: () => void;
}
