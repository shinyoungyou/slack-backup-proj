import { useState } from "react";
import { NavLink } from "react-router-dom"
import AppBar from "@mui/material/AppBar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function Navbar() {
  const [value, setValue] = useState(0);

  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{ top: "auto", bottom: 0 }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction component={NavLink} to="/feed" label="Feed" icon={<HomeIcon />} />
        <BottomNavigationAction component={NavLink} to="/search" label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction component={NavLink} to="/write" label="Write" icon={<BorderColorIcon />} />
        <BottomNavigationAction component={NavLink} to="/profile"
          label="Profile"
          icon={<PersonOutlineOutlinedIcon />}
        />
      </BottomNavigation>
    </AppBar>
  );
}
