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
            [`/api/chat/get?page=0&size=${initialMessagePageSize}&commonsId=${commonsId}`],
            {
                method: "GET",
                url: `/api/chat/get`,
                params: {
                    commonsId: commonsId,
                    page: 0,
                    size: initialMessagePageSize
                }
            },
            { refetchInterval: refreshRate }
        );
  
      const {
        data: userCommonsListData
        } = useBackend(
            [`/api/usercommons/all?commonsId=${commonsId}`],
            {
                method: "GET",
                url: "/api/usercommons/commons/all",
                params: {
                    commonsId: commonsId,
                }
            },
            { refetchInterval: refreshRate }
      );
      
    // Stryker restore all

    const messages = messagesProp || messagesData.content;
    const userCommonsList = userCommonsListProp || userCommonsListData;
  
    const sortedMessages = Array.isArray(messages) && messages.sort((a, b) => b.id - a.id);

    const userIdToUsername = Array.isArray(userCommonsList)
    ? userCommonsList.reduce((acc, user) => {
        acc[user.userId] = user.username || "";
        return acc;
        }, {})
    : {};

    return (
      <div style={{ display: "flex", flexDirection: "column-reverse", overflowY: "scroll", maxHeight: "300px" }} data-testid="ChatDisplay" >
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
