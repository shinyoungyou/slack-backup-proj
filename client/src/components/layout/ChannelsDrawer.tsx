import { useEffect } from "react";
import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { fetchChannelsAsync, setChannel } from "@/stores/channelsSlice";
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";

interface Props {
  toggleDrawer: any;
}

export default function ChannelsDrawer({ toggleDrawer }: Props) {
  const { channels } = useAppSelector((state) => state.channels);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchChannelsAsync());
  }, [])

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <ListItem>
        <ListItemText primary="Channels" />
      </ListItem>
      <Divider />
      <List>
        {channels.map((channel, index) => (
          <ListItem key={channel.slackId} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <TagIcon />
              </ListItemIcon>
              <ListItemText primary={channel.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
