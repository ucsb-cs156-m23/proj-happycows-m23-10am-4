/* eslint-disable */
import React from 'react';
import { Pagination } from 'react-bootstrap';


const PagedProfitsTable = ({ data, onPageChange}) => {
    //eslint - disable next line
    const { content, pageable, _ , totalPages, totalElements} = data;
    console.log("Table Debug");
    console.log(content);

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
        </div>
    );
};

export default PagedProfitsTable;
