import { Card } from 'react-bootstrap';

const ChatMessageDisplay = ({ message, testId }) => {
  if (!message.username) {
    message.username = "Anonymous";
  }
  if (message.timestamp) {
    message.timestamp = message.timestamp.replace('T', ' ').split('.')[0];
  }

  return (
    <Card data-testid={testId}>
      <Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Card.Title data-testid={`${testId}-User`} style={{ margin: 0 }}>
            {message.username} ({message.userId})
          </Card.Title>
          <Card.Subtitle data-testid={`${testId}-Date`} style={{ margin: 0 }}>
            {message.timestamp}
          </Card.Subtitle>
        </div>
        <Card.Text data-testid={`${testId}-Message`}>{message.message}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ChatMessageDisplay;
