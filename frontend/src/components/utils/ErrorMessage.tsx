interface Props {
  message: string;
}  

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <p style={{ color: "red", fontSize: "0.8em", margin: "0.2em 0" }}>{message}</p>
  );
}

export default ErrorMessage;