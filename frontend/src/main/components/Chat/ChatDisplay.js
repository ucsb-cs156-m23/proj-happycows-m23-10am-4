import React from 'react';
import ChatMessageDisplay from 'main/components/Chat/ChatMessageDisplay';
import { useBackend } from "main/utils/useBackend";

// Props for storybook manual injection

const ChatDisplay = ({ commonsId, messages: messagesProp, userCommons: userCommonsListProp }) => {
    const initialMessagePageSize = 10;
    const refreshRate = 2000;

    // Stryker disable all

    const {
        data: messagesData
        } = useBackend(
            ["/api/chat/get"],
            {
                method: "GET",
                url: "/api/chat/get/all",
                params: {
                    commonsId: commonsId,
                }
            },
            { refetchInterval: refreshRate }
        );
  
      const {
        data: userCommonsListData
        } = useBackend(
            ["/api/usercommons/all"],
            {
                method: "GET",
                url: "/api/usercommons/all",
                params: {
                    commonsId: commonsId,
                }
            },
            { refetchInterval: refreshRate }
      );
      
    // Stryker restore all

    const messages = messagesProp || messagesData;
    const userCommonsList = userCommonsListProp || userCommonsListData;
  
    const sortedMessages = Array.isArray(messages) && messages.sort((a, b) => a.id - b.id);

    const userIdToUsername = Array.isArray(userCommonsList)
    ? userCommonsList.reduce((acc, user) => {
        acc[user.userId] = user.username || "";
        return acc;
        }, {})
    : {};

    return (
      <div style={{ overflowY: "scroll", maxHeight: "400px" }} data-testid="ChatDisplay" >
        {Array.isArray(sortedMessages) && sortedMessages.slice(0, initialMessagePageSize).map((message) => (
            <ChatMessageDisplay 
                key={message.id} 
                message={{ ...message, username: userIdToUsername[message.userId] }} 
                testId={`ChatMessageDisplay-${message.id}`}
            />
        ))}
      </div>
    );
};

export default ChatDisplay;
