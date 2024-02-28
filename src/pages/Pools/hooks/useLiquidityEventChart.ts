import { sleep } from 'helper';
import { useEffect, useRef, useState } from 'react';
import { getInclude } from '../helpers';

export const useLiquidityEventChart = () => {
  const [currentDataVolume, setCurrentDataVolume] = useState([]);
  const [currentDataLiquidity, setCurrentDataLiquidity] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [currentItem, setCurrentItem] = useState<{
    value: number;
    time: string | number | { day: number; month: number; year: number };
  }>({ value: 0, time: '-' });

  const dataClick = useRef({ time: { day: 1, month: 1, year: 1 }, value: 0, clickedTwice: true });

  const onCrossMove = (item) => {
    setCurrentItem(item);
  };

  const onMouseLiquidityLeave = () => {
    if (currentDataLiquidity.length > 0) {
      setCurrentItem(currentDataLiquidity[currentDataLiquidity.length - 1]);
    }
  };

  const onMouseVolumeLeave = (e) => {
    if (currentDataVolume.length > 0)
      if (dataClick.current.clickedTwice) {
        let lastElt = currentDataVolume[currentDataVolume.length - 1];
        setCurrentItem({ time: lastElt.time, value: lastElt.value });
      } else {
        setCurrentItem({ time: dataClick.current.time, value: dataClick.current.value });
      }
  };

  const onClickChart = (e) => {
    let index = getInclude(currentDataVolume, (item) => {
      return item.time.year === e.time.year && item.time.month === e.time.month && item.time.day === e.time.day;
    });
    if (index > -1) {
      let same =
        e.time.year === dataClick.current.time.year &&
        e.time.month === dataClick.current.time.month &&
        e.time.day === dataClick.current.time.day;

      dataClick.current = {
        time: currentDataVolume[index].time,
        value: currentDataVolume[index].value,
        clickedTwice: same ? !dataClick.current.clickedTwice : false
      };
    }
  };

  const onChangeRangeVolume = async (value) => {
    try {
      setIsLoading(true);
      // let data = await getDataLiquidity(value)
      const data = DATA_LIQUIDITY_MOCK;

      setCurrentDataVolume(data);
      if (data.length > 0) {
        setCurrentItem({ ...data[data.length - 1] });
        // setRangeLiquidity(value)
      }

      // setRangeVolume(value)
      setIsLoading(false);
    } catch (e) {
      console.log('Volume ERROR: e', 'background: #FF0000; color:#FFFFFF', e);
      setIsLoading(false);
    }
  };

  const onChangeRangeLiquidity = async (value: string = 'DAY') => {
    try {
      setIsLoading(true);
      // let data = await getDataLiquidity(value)
      const data = DATA_LIQUIDITY_MOCK;

      sleep(1000);

      setCurrentDataLiquidity(data);
      if (data.length > 0) {
        setCurrentItem({ ...data[data.length - 1] });
        // setRangeLiquidity(value)
      }
      setIsLoading(false);
    } catch (e) {
      console.log('Liquidity ERROR: e', 'background: #FF0000; color:#FFFFFF', e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onChangeRangeLiquidity();
  }, []);

  return {
    currentDataLiquidity,
    currentItem,
    onCrossMove,
    onClickChart,
    onMouseLiquidityLeave,
    onMouseVolumeLeave
  };
};

const DATA_LIQUIDITY_MOCK = [
  {
    time: '2024-01-29T00:00:00.000Z',
    value: 15186381
  },
  {
    time: '2024-01-30T00:00:00.000Z',
    value: 15369808
  },
  {
    time: '2024-01-31T00:00:00.000Z',
    value: 14666815
  },
  {
    time: '2024-02-01T00:00:00.000Z',
    value: 14080691
  },
  {
    time: '2024-02-02T00:00:00.000Z',
    value: 13532554
  },
  {
    time: '2024-02-03T00:00:00.000Z',
    value: 13025174
  },
  {
    time: '2024-02-04T00:00:00.000Z',
    value: 12914096
  },
  {
    time: '2024-02-05T00:00:00.000Z',
    value: 13673090
  },
  {
    time: '2024-02-06T00:00:00.000Z',
    value: 13008852
  },
  {
    time: '2024-02-07T00:00:00.000Z',
    value: 12813845
  },
  {
    time: '2024-02-08T00:00:00.000Z',
    value: 12739527
  },
  {
    time: '2024-02-09T00:00:00.000Z',
    value: 12973204
  },
  {
    time: '2024-02-10T00:00:00.000Z',
    value: 12900695
  },
  {
    time: '2024-02-11T00:00:00.000Z',
    value: 12849813
  },
  {
    time: '2024-02-12T00:00:00.000Z',
    value: 13333876
  },
  {
    time: '2024-02-13T00:00:00.000Z',
    value: 13323275
  },
  {
    time: '2024-02-14T00:00:00.000Z',
    value: 12777470
  },
  {
    time: '2024-02-15T00:00:00.000Z',
    value: 12394313
  },
  {
    time: '2024-02-16T00:00:00.000Z',
    value: 12393760
  },
  {
    time: '2024-02-17T00:00:00.000Z',
    value: 12416720
  },
  {
    time: '2024-02-18T00:00:00.000Z',
    value: 13801393
  },
  {
    time: '2024-02-19T00:00:00.000Z',
    value: 16239678
  },
  {
    time: '2024-02-20T00:00:00.000Z',
    value: 16631884
  },
  {
    time: '2024-02-21T00:00:00.000Z',
    value: 17361575
  },
  {
    time: '2024-02-22T00:00:00.000Z',
    value: 17573575
  },
  {
    time: '2024-02-23T00:00:00.000Z',
    value: 17544073
  },
  {
    time: '2024-02-24T00:00:00.000Z',
    value: 17422899
  },
  {
    time: '2024-02-25T00:00:00.000Z',
    value: 18360843
  },
  {
    time: '2024-02-26T00:00:00.000Z',
    value: 18924591
  },
  {
    time: '2024-02-27T00:00:00.000Z',
    value: 18946800
  },
  {
    time: '2024-02-28T00:00:00.000Z',
    value: 18383705
  }
];
