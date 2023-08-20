import ChatMessageDisplay from "main/components/Chat/ChatMessageDisplay";

import { chatMessageFixtures } from "fixtures/chatMessageFixtures";
import { render, screen, waitFor } from "@testing-library/react";

describe("ChatMessageDisplay tests", () => {

    test("renders correct content with username", async () => {

        const message_no_name = chatMessageFixtures.oneChatMessage[0];

        const message = {...message_no_name, username: "John Doe"};

        // act
        render(
            <ChatMessageDisplay message={message} />
        );

        // assert
        await waitFor(() => {
            expect(screen.getByText("Hello World")).toBeInTheDocument();
        });

        expect(screen.getByText("John Doe (1)")).toBeInTheDocument();
        expect(screen.getByText("2023-08-17 23:57:46")).toBeInTheDocument();
    });

    test("renders correct content with empty username", async () => {

        const message_no_name = chatMessageFixtures.oneChatMessage[0];

        const message = {...message_no_name, username: ""};

        // act
        render(
            <ChatMessageDisplay message={message} />
        );

        // assert
        await waitFor(() => {
            expect(screen.getByText("Hello World")).toBeInTheDocument();
        });

        expect(screen.getByText("Anonymous (1)")).toBeInTheDocument();
        expect(screen.getByText("2023-08-17 23:57:46")).toBeInTheDocument();
    });

    test("renders correct content with no timestamp or username", async () => {

        const message_no_name = chatMessageFixtures.oneChatMessage[0];
        message_no_name.timestamp = null;

        // act
        render(
            <ChatMessageDisplay testId="ChatMessageDisplay-1" message={message_no_name} />
        );

        // assert
        await waitFor(() => {
            expect(screen.getByTestId("ChatMessageDisplay-1-Message")).toHaveTextContent("Hello World");
        });

        expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveTextContent("Anonymous (1)");
        expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveTextContent("");
    });

});
