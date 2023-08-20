import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"

import { useBackendMutation } from "main/utils/useBackend";

const ChatMessageCreate = ({ commonsId, submitAction:submitProp }) => {

    const testid = "ChatMessageCreate";

    const objectToAxiosParams = (newMessage) => ({
        url: "/api/chat/post",
        method: "POST",
        data: newMessage
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
        [`/api/chat/get/all?commonsId=${commonsId}`]
    );

    const submitAction = submitProp || (async (data) => {
        const params = { commonsId: Number(commonsId), content: data.message };
        mutation.mutate(params);
    });

    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm( );

    return (
        <Form data-testid={testid} onSubmit={handleSubmit(submitAction)} 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Control
                data-testid={`${testid}-Message`}
                id="message"
                type="text"
                {...register("message", { required: "Message cannot be empty" })}
            />
            <Form.Control.Feedback type="invalid">
                {errors.message?.message}
            </Form.Control.Feedback>
            <Button type="submit" data-testid={`${testid}-Send`}>Send</Button>
        </Form>
    );
};

export default ChatMessageCreate;