import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Card } from "react-bootstrap";
import {timestampToDate} from "../../utils/dateUtils";
import OurTable from "../OurTable";
import {parseMoney} from "main/utils/MoneyParsing"


const PagedProfitsTable = ({ data, onPageChange}) => {
    //eslint-disable-next-line no-unused-vars
    const { content, pageable, _ , totalPages} = data;

    const profitsForTable =
        content ?
            content.map(item => ({
                date: timestampToDate(item.timestamp),
                ...item
            })) :
            // Stryker disable next-line ArrayDeclaration : no need to test what happens if [] is replaced with ["Stryker was here"]
            [];
    profitsForTable.reverse();

    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const memoizedColumns = React.useMemo(() =>
            [
                {
                    Header: "Profit",
                    accessor: (row) => `$${parseMoney(row.amount)}`,
                },
                {
                    Header: "Date",
                    accessor: "date",
                },
                {
                    Header: "Health",
                    accessor: (row) => `${row.avgCowHealth.toFixed(2) + '%'}`
                },
                {
                    Header: "Cows",
                    accessor: "numCows",
                },
            ],
        []);
    const memoizedDates = React.useMemo(() => profitsForTable, [profitsForTable]);
    // Stryker restore ArrayDeclaration

    return (
        <div>
            <Card>
                <Card.Header as="h5">
                    Profits
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        You will earn profits from milking your cows everyday at 4am.
                    </Card.Title>
                    <OurTable
                        data={memoizedDates}
                        columns={memoizedColumns}
                        testid={"ProfitsTable"}
                    />
                </Card.Body>


                {/* Pagination component */}
                <div data-testid="PageNavBottom" className="d-flex justify-content-center">
                    <Pagination >
                        <Pagination.First onClick={() => onPageChange(0)} data-testid="PageNavBottom-btn-first"/>
                        <Pagination.Prev onClick={() => onPageChange(pageable.pageNumber - 1)} data-testid="PageNavBottom-btn-prev"/>

                        {/* Loop through the nearby pages */}
                        {Array.from({ length: totalPages }, (_, index) => {
                            if (
                                index >= pageable.pageNumber - 1 &&
                                index <= pageable.pageNumber + 1
                            ) {
                                return (
                                    <Pagination.Item
                                        key={index}
                                        active={index === pageable.pageNumber}
                                        onClick={() => onPageChange(index)}
                                        data-testid = {`PageNavBottom-btn-item-${index}`}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                );
                            }
                            return null;
                        })}

                        <Pagination.Next onClick={() => onPageChange(pageable.pageNumber + 1)} data-testid="PageNavBottom-btn-next"/>
                        <Pagination.Last onClick={() => onPageChange(totalPages - 1)} data-testid="PageNavBottom-btn-last" />
                    </Pagination>
                </div>
            </Card>

        </div>
    );
};

export default PagedProfitsTable;