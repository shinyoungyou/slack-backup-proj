import { useState } from "react";
import Calendar from "react-calendar";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Divider from '@mui/material/Divider';
import { format, addDays } from "date-fns";

interface Props {
  group: string;
  scrollToSpecificDate: (date: string) => void;
  setDateExists: any;
}

export default function DateFilters({ group, scrollToSpecificDate, setDateExists }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [viewCalendar, setViewCalendar] = useState<boolean>(false);

  const open = Boolean(anchorEl);
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

  const todayFormatted = format(new Date(), "EEE, MMM dd yyyy");
  const yesterdayFormatted = format(addDays(new Date(), -1), "EEE, MMM dd yyyy");

  const groupWithoutYear = group.slice(0, -5);

  const handleDateClick = (date: string) => {
    setDateExists([]);
    if (date === 'today') {
      scrollToSpecificDate(todayFormatted); 
    } else if (date === 'yesterday') {
      scrollToSpecificDate(yesterdayFormatted); 
    } else {
      scrollToSpecificDate(date);
    }
    setAnchorEl(null);
  };

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
        {group === todayFormatted
          ? "Today"
          : group === yesterdayFormatted
          ? "Yesterday"
          : groupWithoutYear}
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
        {group === todayFormatted ? (
            <MenuItem onClick={() => handleDateClick("yesterday")}>Yesterday</MenuItem>
           
        ) : group === yesterdayFormatted ? (
            <MenuItem onClick={() => handleDateClick("today")}>Today</MenuItem>
        ) : (
          <div>
            <MenuItem onClick={() => handleDateClick("today")}>Today</MenuItem>
            <MenuItem onClick={() => handleDateClick("yesterday")}>Yesterday</MenuItem>
          </div>
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleCalendar(true)}>Jump to a specific date</MenuItem>
      </Menu>

      {viewCalendar && <Calendar
        onChange={(date: any) => {
          handleDateClick(format(date, "EEE, MMM dd yyyy"));
          handleCalendar(false);
        }}
      />}
    </>
  );
};
