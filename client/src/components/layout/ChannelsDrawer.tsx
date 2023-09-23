import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";
import { resetMessages } from "@/stores/messagesSlice";
import { router } from "@/router/Routes";
import { Channel } from "@/models/channel";

interface Props {
  toggleDrawer: any;
}

export default function ChannelsDrawer({ toggleDrawer }: Props) {
  const { channels } = useAppSelector((state) => state.channels);
  const dispatch = useAppDispatch();


  function changeChannel(channel: Channel) {
    router.navigate(`/${channel.name}/feed`);
    dispatch(resetMessages());
  }

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
            <ListItemButton onClick={() => changeChannel(channel)}>
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
