const InfoLiquidity = ({
  title,
  data,
  type,
  currency = { value: '$', before: true },
}) => {
  return (
    <div>
      <p>{title}</p>
      <p>{currency.value}</p>
      <p>{currency.value}</p>
    </div>
  );
};

export default InfoLiquidity;