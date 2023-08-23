import OurTable from "main/components/OurTable";
import { hasRole } from "main/utils/currentUser";
import {parseMoney} from "../../utils/MoneyParsing";

// should take in a players list from a commons
export default function LeaderboardTable({ leaderboardUsers , currentUser }) {

    const columns = [
        {
            Header: 'User Id',
            accessor: 'userId', 
        },
        {
            Header: 'Username',
            accessor: 'username', 
        },
        {
            Header: 'Total Wealth',
            accessor: 'totalWealth',
        },
        {
            Header: 'Cows Owned',
            accessor: 'numOfCows', 
        },
        {
            Header: 'Cow Health',
            accessor: 'cowHealth', 
        },
        {
            Header: 'Cows Bought',
            accessor: 'cowsBought', 
        },
        {
            Header: 'Cows Sold',
            accessor: 'cowsSold', 
        },
        {
            Header: 'Cow Deaths',
            accessor: 'cowDeaths', 
        },
    ];

    const testid = "LeaderboardTable";

    /* Temp filler for admin leaderboard table */

    const columnsIfAdmin = [
        {
            Header: '(Admin) userCommons Id',
            accessor: 'id'
        },
        ...columns

    ];

    const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN") ? columnsIfAdmin : columns;

    // Parse Wealth attribute
    const parsedData = leaderboardUsers.map(item => ({
        ...item,
        totalWealth: '$' + parseMoney(item.totalWealth)
    }));

    return <OurTable
        data={parsedData}
        columns={columnsToDisplay}
        testid={testid}
    />;

};