import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "react-query";
import ChatPanel from 'main/components/Chat/ChatPanel';
import {chatMessageFixtures} from 'fixtures/chatMessageFixtures';
import userCommonsFixtures from 'fixtures/userCommonsFixtures';

describe('ChatPanel', () => {
    const commonsId = 1;

    const queryClient = new QueryClient();

    test('renders empty ChatMessageCreate and ChatDisplay', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ChatPanel commonsId={commonsId} />
            </QueryClientProvider>
            );

        await waitFor(() => {
            expect(screen.getByTestId('ChatDisplay')).toBeInTheDocument();
        });

        expect(screen.queryByText('Anonymous')).not.toBeInTheDocument();
        
        expect(screen.getByTestId('ChatMessageCreate-Message')).toBeInTheDocument();
        expect(screen.getByTestId('ChatMessageCreate-Send')).toBeInTheDocument();

        expect(screen.getByTestId('ChatPanel')).toHaveStyle('backgroundColor: white');
    });

    test('renders messages from fixtures', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ChatPanel 
                commonsId={commonsId} 
                messages={chatMessageFixtures.oneChatMessage} 
                userCommons={userCommonsFixtures.oneUserCommons} 
                />
            </QueryClientProvider>
            );

        await waitFor(() => {
            expect(screen.getByText('George Washington (1)')).toBeInTheDocument();
        });
        
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

});
