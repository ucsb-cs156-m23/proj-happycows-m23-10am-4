import React from "react";
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
import dummy from "assets/UserHomeDummy.json";

export default function PlayPage() {

    const { commonsId } = useParams();
    const { data: currentUser } = useCurrentUser();

    // Stryker disable all: disable for axios API call, hard to inserted it within ternary expressions
    const { data: userCommons } =
        currentUser.loggedIn
            ? useBackend(
                [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`],
                {
                    method: "GET",
                    url: "/api/usercommons/forcurrentuser",
                    params: {
                        commonsId: commonsId
                    }
                }
            )
            :dummy['SessionInfo'];

    const { data: commonsPlus } =
        currentUser.loggedIn
            ? useBackend(
                [`/api/commons/plus?id=${commonsId}`],
                {
                    method: "GET",
                    url: "/api/commons/plus",
                    params: {
                        id: commonsId
                    }
                }
            )
            :dummy['SessionInfo2'];

    const { data: userCommonsProfits } =
        currentUser.loggedIn
            ? useBackend(
                [`/api/profits/all/commonsid?commonsId=${commonsId}`],
                {
                    method: "GET",
                    url: "/api/profits/all/commonsid",
                    params: {
                        commonsId: commonsId
                    }
                }
            )
            :dummy['Transactions'];

    const { data: userpagedProfits } =
        currentUser.loggedIn
            ? useBackend(
                [`/api/profits/paged/commonsid?commonsId=${commonsId}`],
                {
                    method: "GET",
                    url: "/api/profits/paged/commonsid",
                    params: {
                        commonsId: commonsId
                    }
                }
            )
            :dummy['PagedTransactions'];


    const objectToAxiosParamsBuy = (newUserCommons) => ({
        url: "/api/usercommons/buy",
        method: "PUT",
        data: newUserCommons,
        params: {
            commonsId: commonsId
        }
    });

    const objectToAxiosParamsSell = (newUserCommons) => ({
        url: "/api/usercommons/sell",
        method: "PUT",
        data: newUserCommons,
        params: {
            commonsId: commonsId
        }
    });

    const mutationbuy = useBackendMutation(
        objectToAxiosParamsBuy,
        null,
        [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
    );

    const mutationsell = useBackendMutation(
        objectToAxiosParamsSell,
        { onSuccess: onSuccessSell },
        [`/api/usercommons/forcurrentuser?commonsId=${commonsId}`]
    );
    // Stryker restore all


    const onBuy = (userCommons) => {
        mutationbuy.mutate(userCommons)
    };


    const onSuccessSell = () => {
        toast(`Cow sold!`);
    }

    const onSell = (userCommons) => {
        mutationsell.mutate(userCommons)
    };

    console.log("----------------1---------------");
    console.log(commonsId);
    console.log("----------------2---------------");
    console.log(currentUser);
    console.log("----------------3---------------");
    console.log(userCommons);
    console.log("----------------4---------------");
    console.log(commonsPlus);
    console.log("----------------5---------------");
    console.log(userCommonsProfits);
    console.log("----------------6---------------");
    console.log(userpagedProfits);


    return (
        <div style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }} data-testid="playpage-div">
            <BasicLayout >
                <Container >
                    {!!currentUser && <CommonsPlay currentUser={currentUser} />}
                    {!!commonsPlus && <CommonsOverview commonsPlus={commonsPlus} currentUser={currentUser} />}
                    <br />
                    {!!userCommons && !!commonsPlus &&
                        <CardGroup >
                            <ManageCows userCommons={userCommons} commons={commonsPlus.commons} onBuy={onBuy} onSell={onSell} />
                            <FarmStats userCommons={userCommons} />
                            <Profits userCommons={userCommons} profits={userCommonsProfits} />
                        </CardGroup>
                    }
                </Container>
            </BasicLayout>
        </div>
    )
}