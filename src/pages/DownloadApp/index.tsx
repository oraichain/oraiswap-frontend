import { isAndroidMobile, isIosMobile } from 'hooks/useDetectMobile';
import React, { useEffect } from 'react';
import UniversalSwap from 'pages/UniversalSwap/index';

const DownloadApp: React.FC = () => {
  const redirectStore = async () => {
    if (isAndroidMobile) {
      return window.location.replace('https://play.google.com/store/apps/details?id=com.io.owallet&hl=vi&gl=US');
    }

    if (isIosMobile) {
      return window.location.replace('https://apps.apple.com/us/app/owallet/id1626035069');
    }

    return window.location.replace('https://chromewebstore.google.com/detail/owallet/hhejbopdnpbjgomhpmegemnjogflenga');
  };

  useEffect(() => {
    redirectStore();
  }, []);

  return <UniversalSwap />;
};

export default DownloadApp;
