import { createSelector, createAsyncThunk, createEntityAdapter, createSlice, legacy_createStore } from "@reduxjs/toolkit";
import agent from "@/apis/agent";
import { Message } from "@/models/message";
import { RootState } from "@/stores/configureStore";

interface MessagesState {
    messagesLoaded: boolean;
    status: string;
}

const messagesAdapter = createEntityAdapter<Message>();

// Selectors
const { selectAll } = messagesAdapter.getSelectors((state: RootState) => state.messages);

// Selector to get messages sorted by date
export const selectMessagesByDate = createSelector(
  [selectAll],
  (messages) => {
    console.log(messages);
    
    return messages.slice().sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }
);

// Selector to group messages by date
export const selectGroupedMessages = createSelector(
  [selectMessagesByDate],
  (messagesByDate) => {
    return Object.entries(
      messagesByDate.reduce((groupedMessages, message) => {
        const dateKey = new Date(message.postedDate).toISOString().split('T')[0];
        if (!groupedMessages[dateKey]) {
          groupedMessages[dateKey] = [];
        }
        groupedMessages[dateKey].push(message);
        return groupedMessages;
      }, {} as { [key: string]: Message[] })
    );
  }
);

export const fetchMessagesAsync = createAsyncThunk<Message[], void, {state: RootState}>(
    'messages/fetchMessagesAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Messages.list();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchMessageAsync = createAsyncThunk<Message, string>(
    'messages/fetchMessageAsync',
    async (MessageId, thunkAPI) => {
        try {
            const Message = await agent.Messages.details(MessageId);
            return Message;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: messagesAdapter.getInitialState<MessagesState>({
        messagesLoaded: false,
        status: 'idle',
    }),
    reducers: {
        setMessage: (state, action) => {
            messagesAdapter.upsertOne(state, action.payload);
            state.messagesLoaded = false;
        },
        removeMessage: (state, action) => {
            messagesAdapter.removeOne(state, action.payload);
            state.messagesLoaded = false;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchMessagesAsync.pending, (state, action) => {
            state.status = 'pendingFetchMessages'
        });
        builder.addCase(fetchMessagesAsync.fulfilled, (state, action) => {
            messagesAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.messagesLoaded = true;
        });
        builder.addCase(fetchMessagesAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchMessageAsync.pending, (state) => {
            state.status = 'pendingFetchMessage';
        });
        builder.addCase(fetchMessageAsync.fulfilled, (state, action) => {
            messagesAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchMessageAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
    })
})

export const messageSelectors = messagesAdapter.getSelectors((state: RootState) => state.messages);

export const { setMessage, removeMessage } = messagesSlice.actions;