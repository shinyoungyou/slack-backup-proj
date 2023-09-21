import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "@/apis/agent";
import { Message, MessageParams } from "@/models/message";
import { RootState } from "@/stores/configureStore";

interface MessagesState {
  messages: Message[];
  hasPrev: boolean;
  hasNext: boolean;
  messagesLoaded: boolean; // messages load trigger
  messageLength: number;
  status: string;
  messageParams: MessageParams;
}

function getAxiosParams(messageParams: MessageParams) {
  const params = new URLSearchParams();
  if (messageParams.selectedDate) {
    params.append("selectedDate", messageParams.selectedDate.toString());
  } else if (messageParams.search && messageParams.search !== "") {
    params.append("search", messageParams.search);
  } else {
    if (messageParams.lastId !== "") {
      params.append("lastId", messageParams.lastId.toString());
    }
    params.append("direction", messageParams.direction);
  }

  return params;
}

export const fetchMessagesAsync = createAsyncThunk<
  Message[],
  void,
  { state: RootState }
>("messages/fetchMessagesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().messages.messageParams);
  try {
    return await agent.Messages.list(params);
    // return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchMessageAsync = createAsyncThunk<Message, string>(
  "messages/fetchMessageAsync",
  async (MessageId, thunkAPI) => {
    try {
      const message = await agent.Messages.details(MessageId);
      return message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

function initParams(): MessageParams {
  return {
    lastId: "",
    selectedDate: "",
    direction: "next",
    search: ""
  };
}

export const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    hasPrev: true,
    hasNext: true,
    messagesLoaded: false,
    messageLength: 0,
    status: "idle",
    messageParams: initParams(),
  } as MessagesState,
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
      if (action.payload !== "") {
        state.messageParams.selectedDate = action.payload;
        state.messagesLoaded = false;
      } else {
        state.messageParams.selectedDate = action.payload;
      }
    },
    setDirection: (state, action) => {    
      state.messageParams.direction = action.payload;
    },
    setLastId: (state, action) => {
      state.messageParams.lastId = action.payload;
      state.messagesLoaded = false;
    },
    setSearchParam: (state, action) => {    
      state.messageParams.search = action.payload;
      state.messagesLoaded = false;
    },
    resetMessageParams: (state) => {
      state.messageParams = initParams();
    },
    resetMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessagesAsync.pending, (state, action) => {
      state.status = "pendingFetchMessages";
    });
    builder.addCase(fetchMessagesAsync.fulfilled, (state, action) => {
      // Convert the postedDate field from string to Date for each message
      action.payload.forEach((message) => {
        message.postedDate = new Date(message.postedDate)!;
      });

      if (state.messageParams.selectedDate) {
        state.messages = action.payload;
      } else if (state.messageParams.search) {
        state.messages = action.payload;
        state.hasPrev = false;
        state.hasNext = false;
      } else {
        if (state.messageParams.direction === 'prev') {
          state.messages.unshift(...action.payload.reverse());
          state.hasPrev = action.payload.length === 6;
          state.hasNext = true;
          if (state.messages.length > 8) {
            state.messages = state.messages.slice(0, state.messages.length-3); 
          }
        } else {
          state.messages.push(...action.payload);
          state.hasNext = action.payload.length === 6;
          state.hasPrev = true;
          if (state.messages.length > 8) {
            state.messages = state.messages.slice(3); 
          }
        }
      }
      state.status = "idle";
      state.messagesLoaded = true;
    });
    builder.addCase(fetchMessagesAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchMessageAsync.pending, (state) => {
      state.status = "pendingFetchMessage";
    });
    builder.addCase(fetchMessageAsync.fulfilled, (state, action) => {
      state.messages.push(action.payload as Message);
      state.status = "idle";
    });
    builder.addCase(fetchMessageAsync.rejected, (state, action) => {
      console.log(action);
      state.status = "idle";
    });
  },
});

export const { setSelectedDate, setDirection, setLastId, setSearchParam, resetMessageParams, resetMessages } =
  messagesSlice.actions;
