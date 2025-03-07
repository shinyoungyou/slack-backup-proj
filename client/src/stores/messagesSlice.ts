import { createSelector, createAsyncThunk, createEntityAdapter, createSlice, legacy_createStore } from "@reduxjs/toolkit";
import agent from "@/apis/agent";
import { Message } from "@/models/message";
import { RootState } from "@/stores/configureStore";
import { format } from 'date-fns';
import { MessageParams, Pagination } from '@/models/pagination';

interface MessagesState {
    messagesLoadTrigger: boolean;
    messagesLoaded: boolean; // true: load DONE, false: load ING
    status: string;
    messageParams: MessageParams;
    pagination: Pagination | null;
}

const messagesAdapter = createEntityAdapter<Message>();

export function getAxiosParams(messageParams: MessageParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', messageParams.pageNumber.toString());
    params.append('pageSize', messageParams.pageSize.toString());
    if (messageParams.selectedDate) {
        params.append('selectedDate', messageParams.selectedDate.toString());
    } else {
        
    }
    // if (messageParams.searchTerm) params.append('searchTerm', messageParams.searchTerm);
    return params;
}

export const fetchMessagesAsync = createAsyncThunk<Message[], void, {state: RootState}>(
    'messages/fetchMessagesAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().messages.messageParams)
        try {
            const response = await agent.Messages.list(params)            
            thunkAPI.dispatch(setPagination(response.pagination));
            return response.data;
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
        pageNumber: 1,
        pageSize: 4,
    }
}

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: messagesAdapter.getInitialState<MessagesState>({
        messagesLoadTrigger: false,
        messagesLoaded: false,
        status: 'idle',
        messageParams: initParams(),
        pagination: null
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
        setMessagesLoadTrigger: (state, action) => {
            state.messagesLoadTrigger = true;
        },
        setMessageParams: (state, action) => {
            if (action.payload.selectedDate !== '') {
                state.messagesLoadTrigger = true;    
                state.messageParams = {...state.messageParams, ...action.payload, pageNumber: 1 }
            } else {
                state.messageParams = {...state.messageParams, ...action.payload }
            }
        },
        setPageNumber: (state, action) => {
            state.messagesLoadTrigger = true;
            state.messageParams = {...state.messageParams, ...action.payload}
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        },
        resetMessageParams: (state) => {
            state.messageParams = initParams()
        },
    },
    extraReducers: (builder => {
        builder.addCase(fetchMessagesAsync.pending, (state, action) => {
            state.messagesLoaded = false; 
            state.messagesLoadTrigger = false;
            state.status = 'pendingFetchMessages'
        });
        builder.addCase(fetchMessagesAsync.fulfilled, (state, action) => {
            // Convert the postedDate field from string to Date for each message
            action.payload.forEach((message) => {
                message.postedDate = new Date(message.postedDate)!;
            });
            messagesAdapter.upsertMany(state, action.payload);
            state.status = 'idle';
            // state.messagesLoadTrigger = false;
            state.messagesLoaded = true;
            state.messageParams.selectedDate = '';
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

export const { setMessagesLoadTrigger, setMessageParams, setPageNumber, setPagination, resetMessageParams } = messagesSlice.actions;