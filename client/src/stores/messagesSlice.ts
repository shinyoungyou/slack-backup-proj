import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "@/apis/agent";
import { Message } from "@/models/Message";
import { RootState } from "@/stores/configureStore";

interface MessagesState {
    MessagesLoaded: boolean;
    status: string;
}

const messagesAdapter = createEntityAdapter<Message>();

export const fetchMessagesAsync = createAsyncThunk<Message[], void, {state: RootState}>(
    'Messages/fetchMessagesAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Messages.list();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchMessageAsync = createAsyncThunk<Message, string>(
    'Messages/fetchMessageAsync',
    async (MessageId, thunkAPI) => {
        try {
            const Message = await agent.Messages.details(MessageId);
            return Message;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const MessagesSlice = createSlice({
    name: 'Messages',
    initialState: messagesAdapter.getInitialState<MessagesState>({
        MessagesLoaded: false,
        status: 'idle',
    }),
    reducers: {
        setMessage: (state, action) => {
            messagesAdapter.upsertOne(state, action.payload);
            state.MessagesLoaded = false;
        },
        removeMessage: (state, action) => {
            messagesAdapter.removeOne(state, action.payload);
            state.MessagesLoaded = false;
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchMessagesAsync.pending, (state, action) => {
            state.status = 'pendingFetchMessages'
        });
        builder.addCase(fetchMessagesAsync.fulfilled, (state, action) => {
            messagesAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.MessagesLoaded = true;
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

export const MessageSelectors = messagesAdapter.getSelectors((state: RootState) => state.Messages);

export const { setMessage, removeMessage } = MessagesSlice.actions;