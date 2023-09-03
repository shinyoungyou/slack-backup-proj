import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Divider from "@mui/material/Divider";
import { DateTime } from "luxon";

interface Props {
  group: string;
}

export default function DateFilters({ group }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [viewCalendar, setViewCalendar] = useState<boolean>(false);
  const [formattedDate, setFormattedDate] = useState<string>("");

  const open = Boolean(anchorEl);

  useEffect(() => {
    const formattedGroupDate = DateTime.fromISO(group, {
      zone: "UTC",
    }).toFormat("EEE, MMM dd");
    setFormattedDate(formattedGroupDate);
  }, [group]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCalendar = (isOpen: boolean) => {
    setAnchorEl(null);
    setViewCalendar(isOpen);
  };

  const todayFormatted = DateTime.now().toFormat("EEE, MMM dd");
  const yesterdayFormatted = DateTime.now()
    .minus({ days: 1 })
    .toFormat("EEE, MMM dd");

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {formattedDate === todayFormatted
          ? "Today"
          : formattedDate === yesterdayFormatted
          ? "Yesterday"
          : formattedDate}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem disabled>Jump to...</MenuItem>
        {formattedDate === todayFormatted ? (
          <>
            <MenuItem onClick={handleClose}>Yesterday</MenuItem>
          </>
        ) : formattedDate === yesterdayFormatted ? (
          <>
            <MenuItem onClick={handleClose}>Today</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleClose}>Today</MenuItem>
            <MenuItem onClick={handleClose}>Yesterday</MenuItem>
          </>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleCalendar(true)}>
          Jump to a specific date
        </MenuItem>
      </Menu>

      {viewCalendar && (
        <Calendar onChange={(date: any) => handleCalendar(false)} />
      )}
    </>
  );
}
