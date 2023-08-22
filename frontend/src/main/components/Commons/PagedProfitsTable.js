/* eslint-disable */
import React from 'react';
import { Pagination } from 'react-bootstrap';


const PagedProfitsTable = ({ data, onPageChange}) => {
    //eslint - disable next line
    const { content, pageable, _ , totalPages, totalElements} = data;

    console.log("Table Debug");
    console.log(content);
    console.log(pageable);


    const renderPageItems = () => {
        const pageItems = [];

        // Display Ellipsis if needed before the first item
        if (pageable.pageNumber >= 3) {
            pageItems.push(<Pagination.Ellipsis key="ellipsis-start" />);
        }

        // Add the two previous pages and the current active page
        for (let i = pageable.pageNumber - 2; i <= pageable.pageNumber; i++) {
            if (i >= 0) {
                pageItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === pageable.pageNumber}
                        onClick={() => onPageChange(i)}
                    >
                        {i + 1}
                    </Pagination.Item>
                );
            }
        }

        // Add Ellipsis if needed after the current active page
        if (pageable.pageNumber + 3 < totalPages) {
            pageItems.push(<Pagination.Ellipsis key="ellipsis-end" />);
        }

        return pageItems;
    };



    return (
        <div>
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

            {/* Pagination component */}
            <Pagination>
                <Pagination.First onClick={() => onPageChange(0)} />
                <Pagination.Prev onClick={() => onPageChange(pageable.pageNumber - 1)} />
                {renderPageItems()}
                <Pagination.Next onClick={() => onPageChange(pageable.pageNumber + 1)} />
                <Pagination.Last onClick={() => onPageChange(totalPages - 1)} />
            </Pagination>
        </div>
    );
};

export default PagedProfitsTable;
