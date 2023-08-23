import React, { useState, useEffect } from "react";
import { Container, CardGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import PagedProfitsTable from "main/components/Commons/PagedProfitsTable";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";

import axios from "axios";

export default function PlayPage() {

  const { commonsId } = useParams();
  const { data: currentUser } = useCurrentUser();

    const [currentPage, setCurrentPage] = useState(0);
    //eslint-disable-next-line no-unused-vars
    const [userQueryPageSize, setuserQueryPageSize] = useState(7);
    const [pageddata, setpageddata] = useState([]);

    useEffect(() => {
        FetchData();
    }, []);

    useEffect(() => {
        FetchData();
    }, [currentPage]);

    const FetchData = () => {
        axios({
            method: "GET",
            url: `/api/profits/paged/commonsid?commonsId=${commonsId}&pageNumber=${currentPage}&pageSize=${userQueryPageSize}`,
        }).then(response => {
            setpageddata(response.data);
        })
            .catch(error => console.log(error));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        FetchData();
    };

  // Stryker disable all 
  const { data: userCommons } =
    useBackend(
      [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`],
      {
        method: "GET",
        url: "/api/usercommons/forcurrentuser",
        params: {
          commonsId: commonsId
        }
      }
    );
  // Stryker restore all 

  // Stryker disable all
  const { data: commonsPlus } =
    useBackend(
      [`/api/commons/plus?id=${commonsId}`],
      {
        method: "GET",
        url: "/api/commons/plus",
        params: {
          id: commonsId
        }
      }
    );
  // Stryker restore all


  // Stryker disable all (can't check if commonsId is null because it is mocked)
  const objectToAxiosParamsBuy = (newUserCommons) => ({
    url: "/api/usercommons/buy",
    method: "PUT",
    data: newUserCommons,
    params: {
      commonsId: commonsId
    }
  });
  // Stryker restore all


  // Stryker disable all 
  const mutationbuy = useBackendMutation(
    objectToAxiosParamsBuy,
    null,
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
  );
  // Stryker restore all 


  const onBuy = (userCommons) => {
    mutationbuy.mutate(userCommons)
  };


  const onSuccessSell = () => {
    toast(`Cow sold!`);
  }

  // Stryker disable all 
  const objectToAxiosParamsSell = (newUserCommons) => ({
    url: "/api/usercommons/sell",
    method: "PUT",
    data: newUserCommons,
    params: {
      commonsId: commonsId
    }
  });
  // Stryker restore all 


  // Stryker disable all 
  const mutationsell = useBackendMutation(
    objectToAxiosParamsSell,
    { onSuccess: onSuccessSell },
    [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
  );
  // Stryker restore all 


  const onSell = (userCommons) => {
    mutationsell.mutate(userCommons)
  };

  return (
    <div data-testid="playpage-div">
      <BasicLayout >
        <Container >
          {!!currentUser && <CommonsPlay currentUser={currentUser} />}
          {!!commonsPlus && <CommonsOverview commonsPlus={commonsPlus} currentUser={currentUser} />}
          <br />
          {!!userCommons && !!commonsPlus &&
            <CardGroup >
              <ManageCows userCommons={userCommons} commons={commonsPlus.commons} onBuy={onBuy} onSell={onSell} />
              <FarmStats userCommons={userCommons} />
              <PagedProfitsTable data={pageddata} onPageChange={handlePageChange} />
            </CardGroup>
          }
        </Container>
      </BasicLayout>
    </div>
  )
}