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

    useEffect(() => {
        FetchData();
    }, []);

    const FetchData = () => {
        const { data: userCommonsProfits } = useBackend(
            [`/api/profits/paged/commonsid?commonsId=${commonsId}&page=${currentPage}&size=${userQueryPageSize}`],
            {
                method: "GET",
                url: "/api/profits/paged/commonsid",
                params: {
                    commonsId: commonsId
                }
            }
        );
        setpageddata(userCommonsProfits);
        console.log("Fetch");
        console.log(pageddata);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        console.log("Index changed");
        console.log(currentPage);
        FetchData();
    };

    const onBuy = () => {
        toast(`Buy cow demo`);
    };

    const onSell = () => {
        toast(`Sell cow demo`);
    };

    return (
        <div data-testid="playpage-div">
            <BasicLayout >
                <PagedProfitsTable data={pageddata} onPageChange={handlePageChange}></PagedProfitsTable>
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