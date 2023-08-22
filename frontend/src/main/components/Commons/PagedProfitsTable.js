import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Card } from "react-bootstrap";
import {timestampToDate} from "../../utils/dateUtils";
import OurTable from "../OurTable";
import {parseMoney} from "main/utils/MoneyParsing"


const PagedProfitsTable = ({ data, onPageChange}) => {
    //eslint-disable-next-line no-unused-vars
    const { content, pageable, _ , totalPages, totalElements} = data;

    console.log("Table Debug");
    console.log(content);
    console.log(pageable);


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
            </Card>

            {/* Pagination component */}
            <Pagination>
                <Pagination.First onClick={() => onPageChange(0)} />
                <Pagination.Prev onClick={() => onPageChange(pageable.pageNumber - 1)} />

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
                            >
                                {index + 1}
                            </Pagination.Item>
                        );
                    }
                    return null;
                })}

                <Pagination.Next onClick={() => onPageChange(pageable.pageNumber + 1)} />
                <Pagination.Last onClick={() => onPageChange(totalPages - 1)} />
            </Pagination>
        </div>
    );
};

export default PagedProfitsTable;

/*
            <Pagination>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index === pageable['pageNumber']}
                        onClick={() => onPageChange(index)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>


             <ul>
                {content && content.map((item) => (
                    <li key={item.id}>
                        <p>Amount: {item.amount}</p>
                        <p>Timestamp: {item.timestamp}</p>
                        <p>Number of Cows: {item.numCows}</p>
                        <p>Average Cow Health: {item.avgCowHealth}</p>
                    </li>
                ))}
            </ul>
*/
