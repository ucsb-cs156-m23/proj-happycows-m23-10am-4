import React from 'react';
import { Stack } from 'react-bootstrap'; // Assuming you're using react-bootstrap for the Stack component
import ChatMessageCreate from 'main/components/Chat/ChatMessageCreate';
import ChatDisplay from 'main/components/Chat/ChatDisplay';

const ChatPanel = ({ commonsId, messages: messagesProp, userCommons: userCommonsProp }) => {
  return (
    <Stack gap={2} style={{ backgroundColor: 'white' }} data-testid="ChatPanel" > 
      <ChatDisplay commonsId={commonsId} messages={messagesProp} userCommons={userCommonsProp} />
      <ChatMessageCreate commonsId={commonsId} />
    </Stack>
  );
};

export default ChatPanel;
