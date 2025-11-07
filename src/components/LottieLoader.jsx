import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { getLottieData } from '../assets/lotties/lottieMappings';

/**
 * LottieLoader
 * Props:
 * - name: key from lottieMappings (e.g. 'loginLoader' or 'treeDataLoader')
 * - loop: boolean
 * - autoplay: boolean
 * - style/className: passed to wrapper
 */
const LottieLoader = ({ name, loop = true, autoplay = true, style = {}, className = '' }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let mounted = true;
    setAnimationData(null);

    (async () => {
      try {
        const data = await getLottieData(name);
        if (!mounted) return;
        setAnimationData(data);
      } catch (err) {
        // Ignore if unmounted; otherwise log
        if (mounted) console.error('Failed to load Lottie:', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [name]);

  if (!animationData) {
    return <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }} />;
  }

  return (
    <div className={className} style={style}>
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} />
    </div>
  );
};

export default LottieLoader;
