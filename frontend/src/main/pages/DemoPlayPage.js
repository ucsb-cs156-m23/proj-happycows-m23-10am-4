/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Container, CardGroup } from "react-bootstrap";
import { toast } from "react-toastify";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import Profits from "main/components/Commons/Profits";


import PagedProfitsTable from "main/components/Commons/PagedProfitsTable";
import dummy from "assets/UserHomeDummy.json";
import {useBackend} from "../utils/useBackend";

export default function DemoPlayPage() {

    const [currentPage, setCurrentPage] = useState(0);
    const [userQueryPageSize, setuserQueryPageSize] = useState(3);
    const [pageddata, setpageddata] = useState([]);

    const  commonsId  = 0;
    const  currentUser  = null;

    const userCommons = dummy['SessionInfo'];
    const commonsPlus = dummy['SessionInfo2'];

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        console.log("Index changed");
        console.log(currentPage);
        FetchData();
    };

    const fummy = {
        "content": [
            {
                "id": 11,
                "userCommons": {
                    "username": "Yuanchen Meng",
                    "totalWealth": 999999999999481.4,
                    "numOfCows": 23,
                    "cowHealth": 0.20000000000001,
                    "cowsBought": 23,
                    "cowsSold": 0,
                    "cowDeaths": 0,
                    "commonsId": 1,
                    "userId": 5
                },
                "amount": 1150,
                "timestamp": "2023-08-15T04:00:00.046697",
                "numCows": 23,
                "avgCowHealth": 100
            },
            {
                "id": 14,
                "userCommons": {
                    "username": "Yuanchen Meng",
                    "totalWealth": 999999999999481.4,
                    "numOfCows": 23,
                    "cowHealth": 0.20000000000001,
                    "cowsBought": 23,
                    "cowsSold": 0,
                    "cowDeaths": 0,
                    "commonsId": 1,
                    "userId": 5
                },
                "amount": 575,
                "timestamp": "2023-08-16T02:56:32.332651",
                "numCows": 23,
                "avgCowHealth": 50
            },
            {
                "id": 19,
                "userCommons": {
                    "username": "Yuanchen Meng",
                    "totalWealth": 999999999999481.4,
                    "numOfCows": 23,
                    "cowHealth": 0.20000000000001,
                    "cowsBought": 23,
                    "cowsSold": 0,
                    "cowDeaths": 0,
                    "commonsId": 1,
                    "userId": 5
                },
                "amount": 3.45,
                "timestamp": "2023-08-16T04:00:00.060382",
                "numCows": 23,
                "avgCowHealth": 0.3
            }
        ],
        "pageable": {
            "sort": {
                "sorted": false,
                "empty": true,
                "unsorted": true
            },
            "pageNumber": 0,
            "pageSize": 3,
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "last": false,
        "totalPages": 3,
        "totalElements": 9,
        "sort": {
            "sorted": false,
            "empty": true,
            "unsorted": true
        },
        "number": 0,
        "size": 3,
        "first": true,
        "numberOfElements": 3,
        "empty": false
    }





    return (
        <div data-testid="playpage-div">
                <PagedProfitsTable data={fummy} onPageChange={handlePageChange}></PagedProfitsTable>
        </div>
    )
}

/*
                <Container >
                    <CommonsPlay currentUser={currentUser} />
                    <CommonsOverview commonsPlus={commonsPlus} currentUser={currentUser} />
                    <br />
                    <CardGroup >
                        <ManageCows userCommons={userCommons} commons={commonsPlus.commons} onBuy={onBuy} onSell={onSell} />
                        <FarmStats userCommons={userCommons} />
                        <Profits userCommons={userCommons} profits={userCommonsProfits} />
                    </CardGroup>
                </Container>
* */