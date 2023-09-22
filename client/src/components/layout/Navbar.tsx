import { useState } from "react";
import { NavLink } from "react-router-dom"
import AppBar from "@mui/material/AppBar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeIcon from "@mui/icons-material/Home";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import Drawer from '@mui/material/Drawer';

import * as React from 'react';
import ChannelsDrawer from './ChannelsDrawer';
import { useAppSelector, useAppDispatch } from "@/stores/configureStore";

export default function Navbar() {
  const { channel } = useAppSelector((state) => state.channels);

  const [value, setValue] = useState(1);
  const [anchor, setAnchor] = useState(false);

  const toggleDrawer =
  (open: boolean) =>
  (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setAnchor(open);
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{ top: "auto", bottom: 0 }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) =>{
          setValue(newValue === 0 ? 1 : newValue);
        }}
      >
        <BottomNavigationAction onClick={toggleDrawer(true)} label="Channels" icon={<ReadMoreIcon /> } />
        <BottomNavigationAction component={NavLink} to={`/${channel?.name}/feed`} label="Feed" icon={<HomeIcon /> } />
        <BottomNavigationAction component={NavLink} to="/feed" label="Write" icon={<BorderColorIcon />} />
        <BottomNavigationAction component={NavLink} to="/feed"
          label="Profile"
          icon={<PersonOutlineOutlinedIcon />}
        />
          <Drawer
            anchor="left"
            open={anchor}
            onClose={toggleDrawer(false)}
          >
            <ChannelsDrawer toggleDrawer={toggleDrawer} />
          </Drawer>
      </BottomNavigation>
    </AppBar>
  );
}
