import { TokenItemType } from 'config/bridgeTokens';

export interface ModalProps {
  className?: string;
  isOpen: boolean;
  close: () => void;
  isCloseBtn?: boolean;
  onLiquidityChange?: (amountLpInUsdt?: number) => void;
  myLpUsdt?: bigint;
  myLpBalance?: bigint;
  pairDenoms?: string;
  open?: () => void;
  assetToken?: TokenItemType | any;
  lpPrice?: number;
}
