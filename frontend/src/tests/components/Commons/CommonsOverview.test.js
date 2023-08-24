import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CommonsOverview from "main/components/Commons/CommonsOverview";
import PlayPage from "main/pages/PlayPage";
import commonsFixtures from "fixtures/commonsFixtures";
import leaderboardFixtures from "fixtures/leaderboardFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import  pagedprofitsFixture  from "fixtures/pagedprofitsFixture";
import commonsPlusFixtures from "fixtures/commonsPlusFixtures";
import { toast } from 'react-toastify';

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('react-toastify', () => ({
    toast: jest.fn(),
}));

describe("CommonsOverview tests", () => {

    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        render(
            <CommonsOverview commonsPlus={commonsPlusFixtures.oneCommonsPlus[0]} />
        );
    });

    test("Popping out toast messages for visitor", async () => {
        render(
            <CommonsOverview commonsPlus={commonsPlusFixtures.threeCommonsPlus[1]} currentUser={null}/>
        );
        expect(await screen.findByTestId("user-leaderboard-button")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("user-leaderboard-button"));
        // Expect visitor receives toast message
        expect(toast).toHaveBeenCalledWith(
            'Please log in before trying the leaderboard feature'
        );

    });

    test("Redirects to the LeaderboardPage for an admin when you click visit", async () => {
        apiCurrentUserFixtures.adminUser.user.commons = commonsFixtures.oneCommons[0];
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/commons/plus", {params: {id:1}}).reply(200, commonsPlusFixtures.oneCommonsPlus[0]);
        axiosMock.onGet("/api/leaderboard/all").reply(200, leaderboardFixtures.threeUserCommonsLB);
        axiosMock.onGet('/api/profits/paged/commonsid?commonsId=1&pageNumber=0&pageSize=7').reply(200, pagedprofitsFixture.Page0);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(axiosMock.history.get.length).toEqual(5);
        });
        expect(await screen.findByTestId("user-leaderboard-button")).toBeInTheDocument();
        const leaderboardButton = screen.getByTestId("user-leaderboard-button");
        fireEvent.click(leaderboardButton);
        expect(toast).not.toHaveBeenCalled();
        expect(mockNavigate).toBeCalledWith( "/leaderboard/4" );
    });

    test("No LeaderboardPage for an ordinary user when commons has showLeaderboard = false", async () => {
        const ourCommons = {
            ...commonsFixtures.oneCommons,
            showLeaderboard : false
        };
        const ourCommonsPlus = {
            ...commonsPlusFixtures.oneCommonsPlus,
            commons : ourCommons
        }
        apiCurrentUserFixtures.userOnly.user.commonsPlus = commonsPlusFixtures.oneCommonsPlus[0];
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/commons/plus", {params: {id:1}}).reply(200, ourCommonsPlus);
        axiosMock.onGet("/api/leaderboard/all").reply(200, leaderboardFixtures.threeUserCommonsLB);
        axiosMock.onGet('/api/profits/paged/commonsid?commonsId=1&pageNumber=0&pageSize=7').reply(200, pagedprofitsFixture.Page0);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(axiosMock.history.get.length).toEqual(4);
        });
        expect(() => screen.getByTestId("user-leaderboard-button")).toThrow();
    });
});