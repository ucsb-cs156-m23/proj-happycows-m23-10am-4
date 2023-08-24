import React from "react";
import { Row, Card, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import { daysSinceTimestamp } from "main/utils/dateUtils";
import { toast } from "react-toastify";

export default function CommonsOverview({ commonsPlus, currentUser }) {

    let navigate = useNavigate();
    const leaderboardButtonClick = () => {
        if (currentUser) {navigate("/leaderboard/" + commonsPlus.commons.id);} else {
            // Display a toast message indicating the user should log in
            toast("Please log in before trying the leaderboard feature");
        }
    };
    const showLeaderboard = (hasRole(currentUser, "ROLE_ADMIN") || commonsPlus.commons.showLeaderboard );
    return (
        <Card data-testid="CommonsOverview">
            <Card.Header as="h5">Announcements</Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Card.Title>Today is day {daysSinceTimestamp(commonsPlus.commons.startingDate)}!</Card.Title>
                        <Card.Text>Total Players: {commonsPlus.totalUsers}</Card.Text>
                    </Col>
                    <Col>
                        {showLeaderboard &&
                            (<Button variant="outline-success" data-testid="user-leaderboard-button" onClick={leaderboardButtonClick}>
                                Leaderboard
                            </Button>)}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}; 