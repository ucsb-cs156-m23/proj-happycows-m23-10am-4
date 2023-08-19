import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ChatMessageCreate from "main/components/Chat/ChatMessageCreate";
import { chatMessageFixtures } from "fixtures/chatMessageFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("ChatMessageCreate", () => {
    const commonsId = 1;

    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/chat/get/all").reply(200, chatMessageFixtures.oneChatMessage[0]);
    });

    test("renders without crashing", async () => {
        // arrange
        const submitAction = jest.fn();

        //act
        render(
            <QueryClientProvider client={queryClient}>
                <ChatMessageCreate submitAction={submitAction}  />
            </QueryClientProvider>
        );

        //assert

        await waitFor(() => {
            expect(screen.getByText(/Send/)).toBeInTheDocument();
        });

        expect(screen.getByTestId("ChatMessageCreate-Message")).toBeInTheDocument();
        expect(screen.getByTestId("ChatMessageCreate-Send")).toBeInTheDocument();

    });

    test("shows an error when the message input is empty", async () => {
        // arrange
        const submitAction = jest.fn();

        //act
        render(
            <QueryClientProvider client={queryClient}>
                <ChatMessageCreate submitAction={submitAction}  />
            </QueryClientProvider>
        );

        //assert
        const sendButton = screen.getByTestId("ChatMessageCreate-Send");

        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText("Message cannot be empty")).toBeInTheDocument();
        });
    });

    test("calls the correct submit action on successful submission", async () => {
        // arrange
        const submitAction = jest.fn();
        const messageText = "Hello, World!";

        //act
        render(
            <QueryClientProvider client={queryClient}>
                <ChatMessageCreate submitAction={submitAction}  />
            </QueryClientProvider>
        );

        const messageInput = screen.getByTestId("ChatMessageCreate-Message");
        const sendButton = screen.getByTestId("ChatMessageCreate-Send");

        fireEvent.change(messageInput, {target: {value: messageText}});
        fireEvent.click(sendButton);

        // Wait for submit action to be called
        await waitFor(() => {
            expect(submitAction).toHaveBeenCalledTimes(1);
        });
    });

    test("When you fill in the message form and click submit, the right things happen", async () => {

        const messageText = "Hello World";
        const expectedMessage = {
            message: messageText,
            commonsId: commonsId,
        };
    
        axiosMock.onPost("/api/chat/post").reply(200, chatMessageFixtures.oneChatMessage[0] );
    
        render(
            <QueryClientProvider client={queryClient}>
                <ChatMessageCreate commonsId={commonsId} />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Send/)).toBeInTheDocument();
        });
    
        const messageInput = screen.getByTestId("ChatMessageCreate-Message");
        const sendButton = screen.getByTestId("ChatMessageCreate-Send");
    
        fireEvent.change(messageInput, { target: { value: messageText } });
        fireEvent.click(sendButton);
    
        await waitFor(() => 
            expect(axiosMock.history.post.length).toBe(1)
        );
    
        expect(axiosMock.history.post[0].data).toEqual(JSON.stringify(expectedMessage));

        expect(mockToast).toHaveBeenCalledWith(<div>Message Sent!
            <br />{`id: 1`}
            <br />{`userId: 1`}
            <br />{`commonsId: 1`}
            <br />{`message: Hello World`}
        </div>);
    
    });
    
});
