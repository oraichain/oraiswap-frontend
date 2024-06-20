import { useEffect } from 'react';

// export const useListenCustomEvent = (eventType: string) => {
//   useEffect(() => {
//     window.addEventListener(eventType, (event) => console.log(event));

//     return () => {
//       window.removeEventListener(eventType);
//     };
//   }, [eventType]);
// };

export const useDispatchEvent = (eventType: string, eventData: any) => {
  console.log('eventData', eventData);

  useEffect(() => {
    const event = new CustomEvent(eventType, { detail: eventData });
    window.document.dispatchEvent(event);
  }, [eventData]); // eventData, eventType
};
