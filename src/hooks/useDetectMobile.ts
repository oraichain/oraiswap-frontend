export function getMobileOperatingSystem() {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
}

export const isAndroidMobile = getMobileOperatingSystem() === 'Android';
export const isIosMobile = getMobileOperatingSystem() === 'iOS';
