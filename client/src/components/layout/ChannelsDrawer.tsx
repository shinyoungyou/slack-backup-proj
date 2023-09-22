import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { useAppSelector } from "@/stores/configureStore";
import { router } from "@/router/Routes";

interface Props {
  toggleDrawer: any;
}

export default function ChannelsDrawer({ toggleDrawer }: Props) {
  const { channels } = useAppSelector((state) => state.channels);

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
            <ListItemButton onClick={() => router.navigate(`/${channel.name}/feed`)}>
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
