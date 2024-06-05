import { ReactNode } from 'react';

export type InputRangeType = {
  max?: number;
  min?: number;
  className: string;
  value: number;
  onChange: (val) => void;
  suffix?: ReactNode;
  showValue?: boolean;
};

const InputRange = ({
  showValue = true,
  max = 25,
  min = 1,
  className,
  value,
  onChange,
  suffix = '%'
}: InputRangeType) => {
  const progress = (100 * value) / 25;
  return (
    <div className={className}>
      <input
        type="range"
        onChange={(e) => {
          e.preventDefault();
          const value = e?.target?.value;
          onChange(value);
        }}
        value={value}
        min={min}
        max={max}
        style={{
          background: `linear-gradient(to right, #AEE67F ${progress}%, #EFEFEF ${progress}%)`
        }}
      ></input>
      {showValue ? (
        <div>
          {value}
          {suffix}
        </div>
      ) : (
        <div>{suffix}</div>
      )}
    </div>
  );
};

export default InputRange;
