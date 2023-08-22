/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Container, CardGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import Profits from "main/components/Commons/Profits";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";
import Background from "../../assets/PlayPageBackground.png";

import PagedProfitsTable from "main/components/Commons/PagedProfitsTable";
import dummy from "../../assets/UserHomeDummy.json";

export default function PlayPage() {

  const { commonsId } = useParams();
  const { data: currentUser } = useCurrentUser();

    const [currentPage, setCurrentPage] = useState(0);
    const [userQueryPageSize, setuserQueryPageSize] = useState(3);
    const [pageddata, setpageddata] = useState([]);


    useEffect(() => {
        FetchData();
    }, []);

    const FetchData = () => {
        const { data: temp } = useBackend(
            [`/api/profits/paged/commonsid?commonsId=${commonsId}&page=${currentPage}&size=${userQueryPageSize}`],
            {
                method: "GET",
                url: "/api/profits/paged/commonsid",
                params: {
                    commonsId: commonsId
                }
            }
        );
        setpageddata(temp);
        console.log("Fetch");
        console.log(pageddata);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        console.log("Index changed");
        console.log(currentPage);
        FetchData();
    };


  return (
    <div data-testid="playpage-div">
            <PagedProfitsTable data={pageddata} onPageChange={handlePageChange}></PagedProfitsTable>
    </div>
  )
}