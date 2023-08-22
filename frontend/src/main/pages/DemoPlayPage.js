import React from "react";
import { Container, CardGroup } from "react-bootstrap";
import { toast } from "react-toastify";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CommonsOverview from "main/components/Commons/CommonsOverview";
import CommonsPlay from "main/components/Commons/CommonsPlay";
import FarmStats from "main/components/Commons/FarmStats";
import ManageCows from "main/components/Commons/ManageCows";
import Profits from "main/components/Commons/Profits";
import dummy from "assets/UserHomeDummy.json";

export default function DemoPlayPage() {

    const  commonsId  = 0;
    const  currentUser  = 0;

    const userCommons = dummy['SessionInfo'];
    const commonsPlus = dummy['SessionInfo2'];
    const userCommonsProfits = dummy['Transactions'];
    const userPagedProfits = dummy['PagedTransactions'];

    const onBuy = () => {
        toast(`Buy cow demo`);
    };

    const onSell = () => {
        toast(`Sold cow demo`);
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
                            <Profits userCommons={userCommons} profits={userCommonsProfits} />
                        </CardGroup>
                    }
                </Container>
            </BasicLayout>
        </div>
    )
}