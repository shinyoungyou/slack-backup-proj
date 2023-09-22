import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "@/apis/agent";
import { Channel } from "@/models/channel";
import { RootState } from "@/stores/configureStore";

interface ChannelsState {
  channels: Channel[];
  channel: Channel | null; // current channel
  channelsLoaded: boolean; // channels load trigger
  status: string;
}

export const fetchChannelsAsync = createAsyncThunk<
Channel[],
  void,
  { state: RootState }
>("channels/fetchChannelsAsync", async (_, thunkAPI) => {
  try {
    return await agent.Channels.list();
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchChannelAsync = createAsyncThunk<Channel, string>(
  "channels/fetchchannelAsync",
  async (channelId, thunkAPI) => {
    try {
      const channel = await agent.Channels.details(channelId);
      return channel;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    channels: [],
    channel: null,
    channelsLoaded: false,
    status: "idle",
  } as ChannelsState,
  reducers: {
    setChannel: (state, action) => {
      state.channel = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannelsAsync.pending, (state, action) => {
      state.status = "pendingFetchChannels";
    });
    builder.addCase(fetchChannelsAsync.fulfilled, (state, action) => {
      state.channels = action.payload;
      state.status = "idle";
      state.channelsLoaded = true;
    });
    builder.addCase(fetchChannelsAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchChannelAsync.pending, (state) => {
      state.status = "pendingFetchChannel";
    });
    builder.addCase(fetchChannelAsync.fulfilled, (state, action) => {
      state.channels.push(action.payload as Channel);
      state.status = "idle";
    });
    builder.addCase(fetchChannelAsync.rejected, (state, action) => {
      console.log(action);
      state.status = "idle";
    });
  },
});

export const { setChannel } = channelsSlice.actions;
