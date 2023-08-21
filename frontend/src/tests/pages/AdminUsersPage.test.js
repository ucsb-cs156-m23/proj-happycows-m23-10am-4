import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminUsersPage from "main/pages/AdminUsersPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import usersFixtures from "fixtures/usersFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("AdminUsersPage tests",  () => {
    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    const setup = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
    };

    test("renders without crashing on two users", async () => {
        setup();
        axiosMock.onGet("/api/admin/users").reply(200, usersFixtures.threeUsers);
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminUsersPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(await screen.findByText("Users")).toBeInTheDocument();
    });

    test("hide buttons", async () => {
        let threeUsersCopy = JSON.parse(JSON.stringify(usersFixtures.threeUsers));
        setup();
        axiosMock.onGet("/api/admin/users").reply( _config => {
            return [200, threeUsersCopy];
            }
        );

        axiosMock.onPut("/api/admin/user/hide").reply(config => {
            if (config.params.userId === 2) {
                threeUsersCopy[1]["hidden"] = true;
                axiosMock.onGet("/api/admin/users").reply( _config => {
                    console.log(threeUsersCopy);
                    return [200, threeUsersCopy];
                    }
                );
                return [200, "User 2 has been hidden"];
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminUsersPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // the second user is not hidden and not admin, so the hide button should be enabled
        expect(await screen.findByTestId("UsersTable-cell-row-1-col-hide-button")).toBeEnabled();
        expect(await screen.findByTestId("UsersTable-cell-row-1-col-unhide-button")).toBeDisabled();

        const hideButton = await screen.findByTestId("UsersTable-cell-row-1-col-hide-button");

        fireEvent.click(hideButton);

        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));
        expect(axiosMock.history.put[0].url).toBe("/api/admin/user/hide");
        expect(mockToast).toHaveBeenCalledWith("User 2 has been hidden");
    });


    test("unhide buttons", async () => {
        let threeUsersCopy = JSON.parse(JSON.stringify(usersFixtures.threeUsers));
        threeUsersCopy[1]["hidden"] = true;

        setup();
        axiosMock.onGet("/api/admin/users").reply( _config => {
            console.log(threeUsersCopy);
            return [200, threeUsersCopy];
            }
        );

        axiosMock.onPut("/api/admin/user/unhide").reply(config => {
            if (config.params.userId === 2) {
                threeUsersCopy[1]["hidden"] = false;
                axiosMock.onGet("/api/admin/users").reply( _config => {
                    console.log(threeUsersCopy);
                    return [200, threeUsersCopy];
                    }
                );
                return [200, "User 2 has been unhidden"];
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminUsersPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("UsersTable-cell-row-0-col-hide-button")).toBeDisabled();
        expect(await screen.findByTestId("UsersTable-cell-row-0-col-unhide-button")).toBeDisabled();

        expect(await screen.findByTestId("UsersTable-cell-row-1-col-hide-button")).toBeDisabled();
        expect(await screen.findByTestId("UsersTable-cell-row-1-col-unhide-button")).not.toBeDisabled();

        expect(await screen.findByTestId("UsersTable-cell-row-2-col-hide-button")).not.toBeDisabled();
        expect(await screen.findByTestId("UsersTable-cell-row-2-col-unhide-button")).toBeDisabled();

        const unhideButton = await screen.findByTestId("UsersTable-cell-row-1-col-unhide-button");
        fireEvent.click(unhideButton);

        await waitFor(() => expect(axiosMock.history.put.length).toBe(1));
        expect(axiosMock.history.put[0].url).toBe("/api/admin/user/unhide");
        expect(mockToast).toHaveBeenCalledWith("User 2 has been unhidden");
    });
});
