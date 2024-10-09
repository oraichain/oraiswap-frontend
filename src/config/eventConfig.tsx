import { EVENT_ENUM } from 'reducer/temporaryConfig';
import LogoFullImgDark from 'assets/images/OraiDEX_full_dark.svg';
import LogoFullImgLight from 'assets/images/OraiDEX_full_light.svg';
import LogoFullImgDarkHlw from 'assets/images/halloween/logo.svg';
import { ReactComponent as IconOrderBook } from 'assets/icons/ic_orderbook.svg';
import { ReactComponent as IconFuture } from 'assets/icons/ic_futures.svg';
import { ReactComponent as IconFutureHLW } from 'assets/icons/halloween/ic_future_hlw.svg';
import { ReactComponent as IconOrderbookHLW } from 'assets/icons/halloween/ic_orderbook_hlw.svg';
import spiderGif from 'assets/images/halloween/Spider.gif';
import handWave from 'assets/images/halloween/Hand-animation.gif';
import linkHlwActiveRight from 'assets/images/halloween/linkActiveRight.svg';
import linkHlwActiveLeft from 'assets/images/halloween/linkActiveLeft.svg';
import pumpkinLeft from 'assets/images/halloween/pumkin_left.svg';
import pumpkinRight from 'assets/images/halloween/pumkin_right.svg';
import topHlwBanner from 'assets/images/halloween/zombies.svg';
import bottomHlwBanner from 'assets/images/halloween/bats_bg.svg';
import btnSpiderRight from 'assets/images/halloween/spider_right.svg';
import btnSpiderLeft from 'assets/images/halloween/spider_left.svg';
import bottomHlwMenu from 'assets/images/halloween/bottomMenu.svg';

export type ConfigTheme = {
  logo: string;
  animation: {
    topImg: string;
    bottomImg: string;
  };
  menu: {
    orderBookIcon: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string;
      }
    >;
    futureIcon: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string;
      }
    >;
  };
  sideBar: {
    backgroundHover: string;
    rightLinkImg: string;
    leftLinkImg: string;
    bottomImg: string;
  };
  swapBox: {
    top: string;
    bottom: string;
    inner: {
      bottomRight: string;
      bottomLeft: string;
      button: {
        rightImg: string;
        leftImg: string;
      };
    };
  };
};

export const lightConfig: Record<EVENT_ENUM, ConfigTheme> = {
  [EVENT_ENUM.normal]: {
    logo: LogoFullImgDark,
    animation: {
      topImg: '',
      bottomImg: ''
    },
    menu: {
      orderBookIcon: IconOrderBook,
      futureIcon: IconFuture
    },
    sideBar: {
      backgroundHover: '',
      rightLinkImg: '',
      leftLinkImg: '',
      bottomImg: ''
    },
    swapBox: {
      top: '',
      bottom: '',
      inner: {
        bottomRight: '',
        bottomLeft: '',
        button: {
          rightImg: '',
          leftImg: ''
        }
      }
    }
  },
  [EVENT_ENUM.halloween]: {
    logo: LogoFullImgDark,
    animation: {
      topImg: '',
      bottomImg: ''
    },
    menu: {
      orderBookIcon: IconOrderBook,
      futureIcon: IconFuture
    },
    sideBar: {
      backgroundHover: '',
      rightLinkImg: '',
      leftLinkImg: '',
      bottomImg: ''
    },
    swapBox: {
      top: '',
      bottom: '',
      inner: {
        bottomRight: '',
        bottomLeft: '',
        button: {
          rightImg: '',
          leftImg: ''
        }
      }
    }
  }
};

export const darkConfig: Record<EVENT_ENUM, ConfigTheme> = {
  [EVENT_ENUM.normal]: {
    logo: LogoFullImgLight,
    animation: {
      topImg: '',
      bottomImg: ''
    },
    menu: {
      orderBookIcon: IconOrderBook,
      futureIcon: IconFuture
    },
    sideBar: {
      backgroundHover: '',
      rightLinkImg: '',
      leftLinkImg: '',
      bottomImg: ''
    },
    swapBox: {
      top: '',
      bottom: '',
      inner: {
        bottomRight: '',
        bottomLeft: '',
        button: {
          rightImg: '',
          leftImg: ''
        }
      }
    }
  },
  [EVENT_ENUM.halloween]: {
    logo: LogoFullImgDarkHlw,
    animation: {
      topImg: spiderGif,
      bottomImg: handWave
    },
    menu: {
      orderBookIcon: IconOrderbookHLW,
      futureIcon: IconFutureHLW
    },
    sideBar: {
      backgroundHover: '',
      rightLinkImg: linkHlwActiveRight,
      leftLinkImg: linkHlwActiveLeft,
      bottomImg: bottomHlwMenu
    },
    swapBox: {
      top: topHlwBanner,
      bottom: bottomHlwBanner,
      inner: {
        bottomRight: pumpkinRight,
        bottomLeft: pumpkinLeft,
        button: {
          rightImg: btnSpiderRight,
          leftImg: btnSpiderLeft
        }
      }
    }
  }
};

export const EVENT_CONFIG_THEME = {
  dark: darkConfig,
  light: lightConfig
};
