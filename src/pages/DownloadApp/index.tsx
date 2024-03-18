import { isAndroidMobile, isIosMobile } from 'hooks/useDetectMobile';
import React, { useEffect } from 'react';
import UniversalSwap from 'pages/UniversalSwap/index';

export const owalletAndroidDownloadUrl = 'https://play.google.com/store/apps/details?id=com.io.owallet&hl=vi&gl=US';
export const owalletIosDownloadUrl = 'https://apps.apple.com/us/app/owallet/id1626035069';
export const owalletExtensionDownloadUrl =
  'https://chromewebstore.google.com/detail/owallet/hhejbopdnpbjgomhpmegemnjogflenga';
const DownloadApp: React.FC = () => {
  const redirectStore = async () => {
    if (isAndroidMobile) {
      return window.location.replace(owalletAndroidDownloadUrl);
    }

    if (isIosMobile) {
      return window.location.replace(owalletIosDownloadUrl);
    }

    return window.location.replace(owalletExtensionDownloadUrl);
  };

  useEffect(() => {
    redirectStore();
  }, []);

  return <UniversalSwap />;
};

export default DownloadApp;
