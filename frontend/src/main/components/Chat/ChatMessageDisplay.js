import { Card } from 'react-bootstrap';

const ChatMessageDisplay = ({ message, testId }) => {
  if (!message.username) {
    message.username = "Anonymous";
  }
  if (message.timestamp) {
    message.timestamp = message.timestamp.replace('T', ' ').split('.')[0];
  }

  return (
    <Card>
      <Card.Body data-testid={testId} >
        <Card.Title data-testid={`${testId}-User`}>{message.username} ({message.userId})</Card.Title>
        <Card.Subtitle data-testid={`${testId}-Date`}>{message.timestamp}</Card.Subtitle>
        <Card.Text data-testid={`${testId}-Message`}>{message.message}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ChatMessageDisplay;
