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

export default function DemoPlayPage() {

    const [currentPage, setCurrentPage] = useState(0);

    // eslint-disable-next-line no-unused-vars
    const  commonsId  = 0;
    const  currentUser  = null;

    const userCommons = dummy['SessionInfo'];
    const commonsPlus = dummy['SessionInfo2'];
    const userCommonsProfits = dummy['Transactions'];
    //const userPagedProfits = dummy['PagedTransactions'];



    const onBuy = () => {
        toast(`Buy cow demo`);
    };

    const onSell = () => {
        toast(`Sell cow demo`);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        // TODO Fetch data for the new page and update the data object
    };


    return (
        <div data-testid="playpage-div">
            <BasicLayout >
                <PagedProfitsTable data={dummy['PagedTransactions']}  onPageChange={handlePageChange}></PagedProfitsTable>
            </BasicLayout>
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