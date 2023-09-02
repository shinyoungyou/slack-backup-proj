import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "@/apis/agent";
import { Message } from "@/models/message";
import { RootState } from "@/stores/configureStore";

interface MessagesState {
    messagesLoaded: boolean;
    status: string;
}

const messagesAdapter = createEntityAdapter<Message>();

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