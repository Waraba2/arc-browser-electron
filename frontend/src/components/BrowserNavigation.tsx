import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplayIcon from '@mui/icons-material/Replay';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';


const BrowserNavigation = ({ handleClose, goBack, goForward, reloadPage }) => {
  return (
    <Stack direction="row" spacing={2}>
      <IconButton onClick={handleClose}>
        <ViewSidebarOutlinedIcon />
      </IconButton>
      <IconButton onClick={goBack}>
        <ArrowBackIcon />
      </IconButton>
      <IconButton onClick={goForward}>
        <ArrowForwardIcon />
      </IconButton>
      <IconButton onClick={reloadPage}>
        <ReplayIcon />
      </IconButton>
    </Stack>
  );
}

export default BrowserNavigation;
