import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import PlayPage from "main/pages/PlayPage";
import {apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
import pagedprofitsFixture from "fixtures/pagedprofitsFixture";
import {systemInfoFixtures} from "fixtures/systemInfoFixtures";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        commonsId: 1
    })
}));

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("PlayPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        const userCommons = {
            commonsId: 1,
            id: 1,
            totalWealth: 0,
            userId: 1
        };
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/usercommons/forcurrentuser", {params: {commonsId: 1}}).reply(200, userCommons);
        axiosMock.onGet("/api/commons", {params: {id: 1}}).reply(200, {
            id: 1,
            name: "Sample Commons"
        });
        axiosMock.onGet("/api/commons/all").reply(200, [
            {
                id: 1,
                name: "Sample Commons"
            }
        ]);
        axiosMock.onGet("/api/commons/plus", {params: {id: 1}}).reply(200, {
            commons: {
                id: 1,
                name: "Sample Commons"
            },
            totalPlayers: 5,
            totalCows: 5
        });
        //axiosMock.onGet("/api/profits/all/commonsid").reply(200, []);
        axiosMock.onGet('/api/profits/paged/commonsid?commonsId=1&pageNumber=0&pageSize=7').reply(200, pagedprofitsFixture.Page0);

        axiosMock.onPut("/api/usercommons/sell").reply(200, userCommons);
        axiosMock.onPut("/api/usercommons/buy").reply(200, userCommons);
    });

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("buy and sell buttons behave as expected", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("buy-cow-button")).toBeInTheDocument();
        const buyCowButton = screen.getByTestId("buy-cow-button");
        fireEvent.click(buyCowButton);

        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));

        const sellCowButton = screen.getByTestId("sell-cow-button");
        fireEvent.click(sellCowButton);

        await waitFor(() => expect(axiosMock.history.put.length).toBe(2));

        expect(mockToast).toBeCalledWith("Cow sold!");
    });

    test("3 Card components in page show up", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Announcements/)).toBeInTheDocument();
        expect(await screen.findByTestId("CommonsPlay")).toBeInTheDocument();
        expect(await screen.findByText("Manage Cows")).toBeInTheDocument();
        expect(await screen.findByText("Your Farm Stats")).toBeInTheDocument();
        expect(await screen.findByText("Profits")).toBeInTheDocument();
    });

    test('should fetch data when mounted', async () => {
        axiosMock.onGet('/api/profits/paged/commonsid?commonsId=1&pageNumber=0&pageSize=7').reply(200, pagedprofitsFixture.Page0);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        const testId = "ProfitsTable";
        await screen.findByTestId(`${testId}-cell-row-0-col-Profit`);
        expect(screen.getByTestId(`${testId}-cell-row-0-col-Profit`)).toHaveTextContent("$12.650");
    });


    test('User can navigate the profit table', async () => {

        axiosMock.onGet('/api/profits/paged/commonsid?commonsId=1&pageNumber=1&pageSize=7').reply(200, pagedprofitsFixture.Page1);
        axiosMock.onGet('/api/profits/paged/commonsid?commonsId=1&pageNumber=7&pageSize=7').reply(200, pagedprofitsFixture.Page7);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PlayPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        const testId = "ProfitsTable";
        await waitFor(() => expect(screen.getByTestId(`${testId}-cell-row-0-col-Profit`)).toHaveTextContent("$12.650"));
        fireEvent.click(screen.getByTestId("PageNavBottom-btn-last"));
        await waitFor(() => expect(screen.getByTestId(`${testId}-cell-row-0-col-Profit`)).toHaveTextContent("$3.450"));
        fireEvent.click(screen.getByTestId("PageNavBottom-btn-first"));
        await waitFor(() => expect(screen.getByTestId(`${testId}-cell-row-0-col-Profit`)).toHaveTextContent("$12.650"));
        fireEvent.click(screen.getByTestId("PageNavBottom-btn-next"));
        await waitFor(() => expect(screen.getByTestId(`${testId}-cell-row-0-col-Profit`)).toHaveTextContent("$2.300"));
        fireEvent.click(screen.getByTestId("PageNavBottom-btn-prev"));
        await waitFor(() => expect(screen.getByTestId(`${testId}-cell-row-0-col-Profit`)).toHaveTextContent("$12.650"));
        fireEvent.click(screen.getByTestId("PageNavBottom-btn-item-1"));
        await waitFor(() => expect(screen.getByTestId(`${testId}-cell-row-0-col-Profit`)).toHaveTextContent("$2.300"));
        fireEvent.click(screen.getByTestId("PageNavBottom-btn-item-0"));
        await waitFor(() => expect(screen.getByTestId(`${testId}-cell-row-0-col-Profit`)).toHaveTextContent("$12.650"));

    });

});