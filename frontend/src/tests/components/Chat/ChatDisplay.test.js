import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import ChatDisplay from "main/components/Chat/ChatDisplay";
import userCommonsFixtures from "fixtures/userCommonsFixtures";
import { chatMessageFixtures } from "fixtures/chatMessageFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("ChatDisplay tests", () => {
  const queryClient = new QueryClient();

  const axiosMock = new AxiosMockAdapter(axios);

  const commonsId = 1;

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
  });

  test("renders without crashing", async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ChatDisplay commonsId={commonsId} />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    await waitFor(() => {
        expect(screen.getByTestId("ChatDisplay")).toBeInTheDocument();
    });

    expect(screen.getByTestId("ChatDisplay")).toHaveStyle("overflowY: scroll");
    expect(screen.getByTestId("ChatDisplay")).toHaveStyle("maxHeight: 400px");

  });

  test("displays one message correctly with username", async () => {

    //arrange

    axiosMock.onGet("/api/chat/get/all").reply(200, chatMessageFixtures.oneChatMessage);
    axiosMock.onGet("/api/usercommons/all").reply(200, userCommonsFixtures.oneUserCommons);

    //act
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ChatDisplay commonsId={commonsId} />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    //assert
    await waitFor(() => {
        expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });
    expect(axiosMock.history.get[0].url).toBe("/api/chat/get/all");
    expect(axiosMock.history.get[0].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(axiosMock.history.get.length).toBe(2);
    });
    expect(axiosMock.history.get[1].url).toBe("/api/usercommons/all");
    expect(axiosMock.history.get[1].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(screen.getByTestId("ChatMessageDisplay-1")).toBeInTheDocument();
    });
    expect(screen.getByText("George Washington (1)")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.getByText("2023-08-17 23:57:46")).toBeInTheDocument();

  });

  test("displays three messages correctly with usernames in the correct order", async () => {

    //arrange

    axiosMock.onGet("/api/chat/get/all").reply(200, chatMessageFixtures.threeChatMessages);
    axiosMock.onGet("/api/usercommons/all").reply(200, userCommonsFixtures.threeUserCommons);

    //act
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ChatDisplay commonsId={commonsId} />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    //assert
    await waitFor(() => {
        expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });
    expect(axiosMock.history.get[0].url).toBe("/api/chat/get/all");
    expect(axiosMock.history.get[0].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(axiosMock.history.get.length).toBe(2);
    });
    expect(axiosMock.history.get[1].url).toBe("/api/usercommons/all");
    expect(axiosMock.history.get[1].params).toEqual({ commonsId: 1 });

    const container = screen.getByTestId("ChatDisplay");

    await waitFor(() => {
        expect(container.children[0].getAttribute("data-testid")).toBe("ChatMessageDisplay-1");
        expect(container.children[1].getAttribute("data-testid")).toBe("ChatMessageDisplay-2");
        expect(container.children[2].getAttribute("data-testid")).toBe("ChatMessageDisplay-3");
    });

    expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveTextContent("George Washington (1)");
    expect(screen.getByTestId("ChatMessageDisplay-1-Message")).toHaveTextContent("Hello World");
    expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveTextContent("2023-08-17 23:57:46");

    expect(screen.getByTestId("ChatMessageDisplay-2-User")).toHaveTextContent("Thomas Jefferson (3)");
    expect(screen.getByTestId("ChatMessageDisplay-2-Message")).toHaveTextContent("Hello World How are you doing???");
    expect(screen.getByTestId("ChatMessageDisplay-2-Date")).toHaveTextContent("2023-08-18 02:59:11");

    expect(screen.getByTestId("ChatMessageDisplay-3-User")).toHaveTextContent("John Adams (2)");
    expect(screen.getByTestId("ChatMessageDisplay-3-Message")).toHaveTextContent("This is another test for chat messaging");
    expect(screen.getByTestId("ChatMessageDisplay-3-Date")).toHaveTextContent("2023-08-18 02:59:28");

  });

  test("displays one message correctly without users", async () => {

    //arrange

    axiosMock.onGet("/api/chat/get/all").reply(200, chatMessageFixtures.threeChatMessages);
    axiosMock.onGet("/api/usercommons/all").reply(200, []);

    //act
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ChatDisplay commonsId={commonsId} />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    //assert
    await waitFor(() => {
        expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });
    expect(axiosMock.history.get[0].url).toBe("/api/chat/get/all");
    expect(axiosMock.history.get[0].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(axiosMock.history.get.length).toBe(2);
    });
    expect(axiosMock.history.get[1].url).toBe("/api/usercommons/all");
    expect(axiosMock.history.get[1].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(screen.getByTestId("ChatMessageDisplay-1")).toBeInTheDocument();

    });
    expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveTextContent("Anonymous (1)");
    expect(screen.getByTestId("ChatMessageDisplay-1-Message")).toHaveTextContent("Hello World");
    expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveTextContent("2023-08-17 23:57:46");

  });

  test("displays one message correctly without usernames", async () => {

    //arrange

    axiosMock.onGet("/api/chat/get/all").reply(200, chatMessageFixtures.threeChatMessages);
    axiosMock.onGet("/api/usercommons/all").reply(200, [{userId: 1}]);

    //act
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ChatDisplay commonsId={commonsId} />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    //assert
    await waitFor(() => {
        expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });
    expect(axiosMock.history.get[0].url).toBe("/api/chat/get/all");
    expect(axiosMock.history.get[0].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(axiosMock.history.get.length).toBe(2);
    });
    expect(axiosMock.history.get[1].url).toBe("/api/usercommons/all");
    expect(axiosMock.history.get[1].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(screen.getByTestId("ChatMessageDisplay-1")).toBeInTheDocument();

    });
    expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveTextContent("Anonymous (1)");
    expect(screen.getByTestId("ChatMessageDisplay-1-Message")).toHaveTextContent("Hello World");
    expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveTextContent("2023-08-17 23:57:46");

  });

  test("displays cuts off at 10 messages", async () => {

    //arrange

    axiosMock.onGet("/api/chat/get/all").reply(200, chatMessageFixtures.twelveChatMessages);
    axiosMock.onGet("/api/usercommons/all").reply(200, userCommonsFixtures.threeUserCommons);

    //act
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ChatDisplay commonsId={commonsId} />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    //assert
    await waitFor(() => {
        expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });
    expect(axiosMock.history.get[0].url).toBe("/api/chat/get/all");
    expect(axiosMock.history.get[0].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(axiosMock.history.get.length).toBe(2);
    });
    expect(axiosMock.history.get[1].url).toBe("/api/usercommons/all");
    expect(axiosMock.history.get[1].params).toEqual({ commonsId: 1 });

    await waitFor(() => {
        expect(screen.getByTestId("ChatMessageDisplay-1")).toBeInTheDocument();
        expect(screen.getByTestId("ChatMessageDisplay-2")).toBeInTheDocument();
        expect(screen.getByTestId("ChatMessageDisplay-10")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("ChatMessageDisplay-11")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ChatMessageDisplay-12")).not.toBeInTheDocument();
    
    expect(screen.queryByText("This should not appear")).not.toBeInTheDocument();
    expect(screen.queryByText("This should also be cut off")).not.toBeInTheDocument();


  });

});
