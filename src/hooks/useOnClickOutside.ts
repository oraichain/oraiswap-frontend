import { useEffect } from 'react';

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // check if click event is outside elmt
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);

    // check event when click inside iframe
    function windowBlurred(e) {
      const el = document.activeElement;
      if (el.tagName.toLowerCase() === 'iframe') {
        // iframeClickedLast = true;
        // onFocus();
        handler(e);
      }
    }
    window.addEventListener('blur', windowBlurred, true);

    return () => {
      document.removeEventListener('mousedown', listener);
      window.removeEventListener('blur', windowBlurred, true);
    };
  }, [ref, handler]);
}
