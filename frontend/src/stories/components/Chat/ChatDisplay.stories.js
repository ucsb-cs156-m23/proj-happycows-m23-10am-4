import React from 'react';
import ChatDisplay from 'main/components/Chat/ChatDisplay';
import {chatMessageFixtures} from 'fixtures/chatMessageFixtures';
import {userCommonsFixtures} from 'fixtures/userCommonsFixtures';

export default {
    title: 'components/Chat/ChatDisplay',
    component: ChatDisplay
};

const Template = (args) => {
    return (
        <ChatDisplay {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    commonsId: 1,
    messages: [],
    userCommons: userCommonsFixtures.tenUserCommons
};

export const OneMessage = Template.bind({});

OneMessage.args = {
    commonsId: 1,
    messages: chatMessageFixtures.oneChatMessage,
    userCommons: userCommonsFixtures.tenUserCommons
};

export const ThreeMessages = Template.bind({});

ThreeMessages.args = {
    commonsId: 1,
    messages: chatMessageFixtures.threeChatMessages,
    userCommons: userCommonsFixtures.tenUserCommons
};
