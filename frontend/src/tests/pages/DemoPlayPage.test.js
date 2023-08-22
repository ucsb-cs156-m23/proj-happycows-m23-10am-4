import { fireEvent, render, screen} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import DemoPlayPage from "main/pages/DemoPlayPage";


jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
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

describe("DemoPlayPage tests", () => {
    const queryClient = new QueryClient();


    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DemoPlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });


    test("click buy, sell, and leaderboard buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DemoPlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("buy-cow-button")).toBeInTheDocument();
        const buyCowButton = screen.getByTestId("buy-cow-button");
        fireEvent.click(buyCowButton);
        expect(mockToast).toBeCalledWith("Buy cow demo");
        //await waitFor(() => expect(axiosMock.history.put.length).toBe(1));
        const sellCowButton = screen.getByTestId("sell-cow-button");
        fireEvent.click(sellCowButton);
        expect(mockToast).toBeCalledWith("Sell cow demo");
        expect(await screen.findByTestId("user-leaderboard-button")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("user-leaderboard-button"));
        expect(mockToast).toHaveBeenCalledWith(
            'Please log in before trying the leaderboard feature'
        );

    });

    test("Static texts are displayed as expected", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DemoPlayPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(await screen.findByText(/Announcements/)).toBeInTheDocument();
        expect(await screen.findByTestId("CommonsPlay")).toBeInTheDocument();
        expect(await screen.findByText(/5.564B/)).toBeInTheDocument();
        expect(await screen.findByText(/Cow Health: 20.5%/)).toBeInTheDocument();
        expect(await screen.findByText(/Market Cow Price: /)).toBeInTheDocument();
        expect(await screen.findByText(/You will earn profits from milking your cows everyday at 4am./)).toBeInTheDocument();
        expect(await screen.findByText(/Market Cow Price: /)).toBeInTheDocument();
        expect(await screen.findByText(/Total Players: 1/)).toBeInTheDocument();
        expect(await screen.findByText(/1500/)).toBeInTheDocument();
        expect(await screen.findByText('2023-08-19')).toBeInTheDocument();

    });
});
