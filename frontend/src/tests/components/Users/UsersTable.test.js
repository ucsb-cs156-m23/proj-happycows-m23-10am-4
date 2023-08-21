import { render, screen } from "@testing-library/react";
import UsersTable from "main/components/Users/UsersTable";
import usersFixtures from "fixtures/usersFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

describe("UserTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UsersTable users={[]} />
            </QueryClientProvider>
        );
    });

    test("renders without crashing for three users", () => {
        render(
            <QueryClientProvider client={queryClient}>
                    <UsersTable users={usersFixtures.threeUsers} />
            </QueryClientProvider>
        );
    });

    test("Has the expected colum headers and content", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UsersTable users={usersFixtures.threeUsers}/>
            </QueryClientProvider>
        );
    
        const expectedHeaders = ["id", "First Name", "Last Name", "Email", "Admin", "Hidden", "Hide", "Unhide"];
        const expectedFields = ["id", "givenName", "familyName", "email", "admin", "hidden", "hide", "unhide"];
        const testId = "UsersTable";

        for (let i = 0; i < expectedHeaders.length; i++) {
            const header = screen.getByTestId(`${testId}-header-${expectedFields[i]}`);
            expect(header).toBeInTheDocument();
            expect(header).toHaveTextContent(expectedHeaders[i]);
        }

        expectedFields.forEach( (field)=> {
          const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });

        // For each hide and unhide button, check the class and text content
        expect(screen.getByTestId(`${testId}-cell-row-0-col-hide-button`)).toHaveClass("btn btn-danger");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-hide-button`)).toHaveTextContent("Hide");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-unhide-button`)).toHaveClass("btn btn-success");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-unhide-button`)).toHaveTextContent("Unhide");

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-admin`)).toHaveTextContent("true");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-admin`)).toHaveTextContent("false");

        // row 0 is admin, so hide button should be disabled
        expect(screen.getByTestId(`${testId}-cell-row-0-col-hide-button`)).toBeDisabled();
        expect(screen.getByTestId(`${testId}-cell-row-0-col-unhide-button`)).toBeDisabled();

        // row 1 is not admin, so hide button should be enabled
        expect(screen.getByTestId(`${testId}-cell-row-1-col-hide-button`)).toBeEnabled();
        expect(screen.getByTestId(`${testId}-cell-row-1-col-unhide-button`)).toBeDisabled();
      });
});
