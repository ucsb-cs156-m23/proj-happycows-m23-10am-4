import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

const ChatMessageCreate = ({ commonsId, submitAction:submitProp }) => {

    const testid = "ChatMessageCreate";

    const objectToAxiosParams = (newMessage) => ({
        url: "/api/chat/post",
        method: "POST",
        data: {message: newMessage.message, commonsId: commonsId}
    });

    const onSuccess = (chatMessage) => {
        toast(<div>Message Sent!
            <br />{`id: ${chatMessage.id}`}
            <br />{`userId: ${chatMessage.userId}`}
            <br />{`commonsId: ${chatMessage.commonsId}`}
            <br />{`message: ${chatMessage.message}`}
        </div>);
        reset();
    }
   
    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/chat/get/all"]
    );

    const submitAction = submitProp || (async (data) => {
        mutation.mutate(data);
    });

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm( );

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                <Col sm={10}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            data-testid={`${testid}-Message`}
                            id="message"
                            type="text"
                            {...register("message", { required: "Message cannot be empty" })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.message?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col sm={2}>
                    <Button type="submit" data-testid={`${testid}-Send`}>Send</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default ChatMessageCreate;