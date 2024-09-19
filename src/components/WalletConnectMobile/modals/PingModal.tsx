interface PingModalProps {
  pending: boolean;
  result: any;
}

const PingModal = (props: PingModalProps) => {
  const { pending, result } = props;
  return (
    <>
      {pending ? (
        <div>
          <h3>{'Pending Session Ping'}</h3>
        </div>
      ) : result ? (
        <div>
          <h3>{result.valid ? 'Successful Session Ping' : 'Failed Session Ping'}</h3>
        </div>
      ) : (
        <div>
          <h3>{'Unknown Error with Session Ping'}</h3>
        </div>
      )}
    </>
  );
};

export default PingModal;
