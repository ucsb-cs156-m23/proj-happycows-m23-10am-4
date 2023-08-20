import React from 'react';
import ChatPanel from 'main/components/Chat/ChatPanel';
import {chatMessageFixtures} from 'fixtures/chatMessageFixtures';
import userCommonsFixtures from 'fixtures/userCommonsFixtures';

export default {
    title: 'components/Chat/ChatPanel',
    component: ChatPanel
};

const Template = (args) => {
    return (
        <ChatPanel {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    commonsId: 1,
    messages: [],
    userCommons: userCommonsFixtures.threeUserCommons
};

export const OneMessage = Template.bind({});

OneMessage.args = {
    commonsId: 1,
    messages: chatMessageFixtures.oneChatMessage,
    userCommons: userCommonsFixtures.oneUserCommons
};

export const ThreeMessages = Template.bind({});

ThreeMessages.args = {
    commonsId: 1,
    messages: chatMessageFixtures.threeChatMessages,
    userCommons: userCommonsFixtures.threeUserCommons
};

export const TwelveMessages = Template.bind({});

TwelveMessages.args = {
    commonsId: 1,
    messages: chatMessageFixtures.twelveChatMessages,
    userCommons: userCommonsFixtures.tenUserCommons
};
