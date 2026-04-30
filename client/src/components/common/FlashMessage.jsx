function FlashMessage({ message }) {
  return <div className={`flash-message flash-${message.type}`}>{message.text}</div>;
}

export default FlashMessage;
