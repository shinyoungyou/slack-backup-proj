import { createSelector, createAsyncThunk, createEntityAdapter, createSlice, legacy_createStore } from "@reduxjs/toolkit";
import agent from "@/apis/agent";
import { Message, MessageParams } from "@/models/message";
import { RootState } from "@/stores/configureStore";
import { format } from 'date-fns';

interface MessagesState {
    bringMorePosts: boolean;
    messagesLoaded: boolean;  // messages load trigger
    messageLength: number;
    status: string;
    messageParams: MessageParams;
}

const messagesAdapter = createEntityAdapter<Message>();

const { selectAll } = messagesAdapter.getSelectors((state: RootState) => state.messages);

// Selector to get messages sorted by date
export const selectMessagesByDate = createSelector(
  [selectAll],
  (messages) => {
    return messages.slice().sort((a, b) => b.postedDate.getTime() - a.postedDate.getTime());
  }
);

function getAxiosParams(messageParams: MessageParams) {
    const params = new URLSearchParams();
    // if (messageParams.searchTerm) params.append('searchTerm', messageParams.searchTerm);
    if (messageParams.selectedDate) {
        params.append('selectedDate', messageParams.selectedDate.toString());
    } 
    if (messageParams.lastId !== '')  {
        params.append('lastId', messageParams.lastId.toString());
    }
    return params;
}

export const fetchMessagesAsync = createAsyncThunk<Message[], void, {state: RootState}>(
    'messages/fetchMessagesAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().messages.messageParams)
        try {
            return await agent.Messages.list(params);            
            // return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchMessageAsync = createAsyncThunk<Message, string>(
    'messages/fetchMessageAsync',
    async (MessageId, thunkAPI) => {
        try {
            const message = await agent.Messages.details(MessageId);
            return message;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

function initParams(): MessageParams {
    return {
        lastId: '',
        selectedDate: ''
    }
}

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: messagesAdapter.getInitialState<MessagesState>({
        bringMorePosts: true,
        messagesLoaded: false,
        messageLength: 0,
        status: 'idle',
        messageParams: initParams(),
    }),
    reducers: {
        // setMessage: (state, action) => {
        //     messagesAdapter.upsertOne(state, action.payload);
        //     state.messagesLoaded = false;
        // },
        // removeMessage: (state, action) => {
        //     messagesAdapter.removeOne(state, action.payload);
        //     state.messagesLoaded = false;
        // },
        setSelectedDate: (state, action) => {
            if (action.payload !== '') {
                state.messagesLoaded = false;    
                state.messageParams.selectedDate = action.payload;
                // state.messageParams.lastId = 1;
            } else {
                state.messageParams.selectedDate = action.payload;
            }
        },
        setLastId: (state, action) => {
            state.messagesLoaded = false;
            state.messageParams.lastId = action.payload;
        },
        resetMessageParams: (state) => {
            state.messageParams = initParams()
        },
    },
    extraReducers: (builder => {
        builder.addCase(fetchMessagesAsync.pending, (state, action) => {
            state.status = 'pendingFetchMessages'
        });
        builder.addCase(fetchMessagesAsync.fulfilled, (state, action) => {
            // Convert the postedDate field from string to Date for each message
            action.payload.forEach((message) => {
                message.postedDate = new Date(message.postedDate)!;
            });
            
            if (state.messageParams.selectedDate) {
                messagesAdapter.setAll(state, action.payload.reverse());
            } else {
                messagesAdapter.upsertMany(state, action.payload);
            }

            if (state.ids.length > 6) {
              const messagesToRemove = state.ids.slice(0, 3); // Get the oldest 4 messages
              messagesToRemove.forEach((messageId) => {
                messagesAdapter.removeOne(state, messageId);
              });
            }
            state.status = 'idle';
            state.messagesLoaded = true;
            state.bringMorePosts = action.payload.length === 6;
            state.messageLength = state.ids.length;
         
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

export const { setSelectedDate, setLastId, resetMessageParams } = messagesSlice.actions;