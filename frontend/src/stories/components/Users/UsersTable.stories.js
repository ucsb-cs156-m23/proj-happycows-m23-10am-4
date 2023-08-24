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
let threeUsersCopy = JSON.parse(JSON.stringify(usersFixtures.threeUsers));
threeUsersCopy[2]["hidden"] = true;

ThreeUsers.args = {
    users: threeUsersCopy
};

export const OneUsers = Template.bind({});

OneUsers.args = {
    users: usersFixtures.threeUsers.slice(0,1)
}