import React from 'react';
import ChatMessageDisplay from 'main/components/Chat/ChatMessageDisplay';
import { useBackend } from "main/utils/useBackend";

const ChatDisplay = ({ commonsId }) => {
    const initialMessagePageSize = 10;
    const refreshRate = 2000;
    
    // Stryker disable all
    const {
      data: messages
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
      data: userCommonsList
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
  
    const userIdToUsername = Array.isArray(userCommonsList)
    ? userCommonsList.reduce((acc, user) => {
        acc[user.userId] = user.username || "";
        return acc;
        }, {})
    : {};
  
    return (
      <div style={{ overflowY: "scroll", maxHeight: "400px" }} aria-label="ChatDisplay" >
        {Array.isArray(messages) && messages.slice(0, initialMessagePageSize).map((message) => (
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
  