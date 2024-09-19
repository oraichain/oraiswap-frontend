interface RequestModalProps {
  pending: boolean;
  result: any;
}

const RequestModal = (props: RequestModalProps) => {
  const { pending, result } = props;
  return (
    <>
      {pending ? (
        <div>
          <div>{'Pending JSON-RPC Request'}</div>
          <div>{'Approve or reject request using your wallet'}</div>
        </div>
      ) : result ? (
        <div>
          <h3>{result.valid ? 'JSON-RPC Request Approved' : 'JSON-RPC Request Failed'}</h3>
          <ul>
            {Object.keys(result).map((key) => (
              <li key={key}>
                <span>{key}</span>
                <span>{result[key].toString()}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h4>{'JSON-RPC Request Rejected'}</h4>
        </div>
      )}
    </>
  );
};

export default RequestModal;
