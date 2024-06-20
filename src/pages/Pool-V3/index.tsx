import React, { IframeHTMLAttributes, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useDispatchEvent } from './hooks/useAddCustomEvent';

const IF_URL = '/v3';
// const IF_URL = 'localhost:3001';
const PoolV3 = () => {
  const [iframeSrc, setIframeSrc] = useState(IF_URL);

  // useEffect(() => {
  //   const fetchHTMLContent = async () => {
  //     try {
  //       // const response = await fetch(IF_URL);
  //       // const htmlContent = await response.text();

  //       // console.log('htmlContent', htmlContent);

  //       const blob = await fetch(IF_URL).then((r) => r.blob());
  //       // const blob = new Blob([htmlContent], { type: 'text/html' });
  //       const blobURL = URL.createObjectURL(blob);

  //       setIframeSrc(blobURL);
  //     } catch (error) {
  //       console.error('Error fetching HTML content:', error);
  //     }
  //   };

  //   fetchHTMLContent();
  // }, []);

  console.log('first', iframeSrc);

  return (
    <div className={styles.poolV3}>
      <iframe src={iframeSrc} title="pool-v3" frameBorder={0} />
    </div>
  );
};

export default PoolV3;
