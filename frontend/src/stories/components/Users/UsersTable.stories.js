import React from 'react';

import UsersTable from 'main/components/Users/UsersTable';
import usersFixtures from 'fixtures/usersFixtures';

export default {
    title: 'components/users/UsersTable',
    component: UsersTable
};

const Template = (args) => {
    return (
        <UsersTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    users: []
};

export const ThreeUsers = Template.bind({});

ThreeUsers.args = {
    users: usersFixtures.threeUsers
};

export const OneUsers = Template.bind({});

OneUsers.args = {
    users: usersFixtures.threeUsers.slice(0,1)
}

/*
export const ThreeCommonsAdmin = Template.bind({});

ThreeCommonsAdmin.args = {
    commons: commonsPlusFixtures.threeCommonsPlus,
    currentUser: currentUserFixtures.adminUser
};

export const OneCommonsAdmin = Template.bind({});

OneCommonsAdmin.args = {
    commons: commonsPlusFixtures.oneCommonsPlus,
    currentUser: currentUserFixtures.adminUser
}
*/