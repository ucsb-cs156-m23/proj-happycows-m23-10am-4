import { render, screen, waitFor } from "@testing-library/react";
import PagedProfitsTable from "main/components/Commons/PagedProfitsTable";
import profitsFixtures from "fixtures/pagedprofitsFixture";

describe("Paged Profit Table tests",  () => {
    test("renders without crashing for empty profits", () => {
        render(
            <PagedProfitsTable data={[]} />
        );
    });

    test("First Page and basic components are rendered as expected", async () => {
        render(
            <PagedProfitsTable data={profitsFixtures.Page0} />
        );
        await waitFor(()=>{
            expect(screen.getByTestId("ProfitsTable-header-Profit") ).toBeInTheDocument();
        });

        // Check header
        const expectedHeaders = [ "Profit", "Date", "Health", "Cows"];
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        // Check first row
        await waitFor(() => expect(screen.getByTestId(`ProfitsTable-cell-row-0-col-Profit`)).toHaveTextContent("$12.650"));
        expect(screen.getByTestId(`ProfitsTable-cell-row-0-col-date`)).toHaveTextContent("2023-08-20");
        expect(screen.getByTestId(`ProfitsTable-cell-row-0-col-Health`)).toHaveTextContent("1.10%");
        expect(screen.getByTestId(`ProfitsTable-cell-row-0-col-numCows`)).toHaveTextContent("23");

        // Check all btn at the bottom show up
        expect(screen.getByTestId(`PageNavBottom-btn-last`)).toBeInTheDocument();
        expect(screen.getByTestId(`PageNavBottom-btn-first`)).toBeInTheDocument();
        expect(screen.getByTestId(`PageNavBottom-btn-prev`)).toBeInTheDocument();
        expect(screen.getByTestId(`PageNavBottom-btn-next`)).toBeInTheDocument();

        // Check page number btn renders correctly
        expect(screen.getByTestId(`PageNavBottom-btn-item-0`)).toBeInTheDocument();
        expect(screen.getByTestId(`PageNavBottom-btn-item-1`)).toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-3')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-4')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-5')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-6')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-7')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item--1')).not.toBeInTheDocument();

        // Check Styling and content
        expect(screen.getByTestId(`PageNavBottom-btn-item-0`)).toHaveTextContent("1");
        //expect(screen.getByTestId(`PageNavBottom-btn-item-0`).parentElement).toHaveClass('active');
        //expect(screen.getByTestId(`PageNavBottom-btn-item-1`).parentElement).not.toHaveClass('active');
    });

    test("Last Page and basic components are rendered as expected", async () => {
        render(
            <PagedProfitsTable data={profitsFixtures.Page7} />
        );

        await waitFor(() => expect(screen.getByTestId(`ProfitsTable-cell-row-0-col-Profit`)).toHaveTextContent("$3.450"));

        // Check page number btn renders correctly
        expect(screen.getByTestId(`PageNavBottom-btn-item-6`)).toBeInTheDocument();
        expect(screen.getByTestId(`PageNavBottom-btn-item-7`)).toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-5')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-4')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-3')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('PageNavBottom-btn-item-8')).not.toBeInTheDocument();

        // Check Styling and content
        expect(screen.getByTestId(`PageNavBottom-btn-item-7`)).toHaveTextContent("8");
        //expect(screen.getByTestId(`PageNavBottom-btn-item-7`).parentElement).toHaveClass('active');
        //expect(screen.getByTestId(`PageNavBottom-btn-item-6`).parentElement).not.toHaveClass('active');

    });
});