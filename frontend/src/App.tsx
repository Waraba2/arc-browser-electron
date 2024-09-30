import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplayIcon from '@mui/icons-material/Replay';
import Stack from '@mui/material/Stack';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import SearchBar from './components/SearchBar.tsx';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useState, useEffect } from 'react';
import axios from 'axios'
import Tooltip from '@mui/material/Tooltip';
import  texture from "./assets/grainy-texture.jpg";
import  maintexture from "./assets/main-texture.jpg";
import { Typography } from '@mui/material';


import { gql, useQuery } from '@apollo/client'

export const ALL_LINKS = gql`
  query {
    allLinks {
      timestamp
      link
      id
    }
  }
`

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    margin: theme.spacing(1, 1, 1, 1),
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden', // Updated to hide overflow for iframe
  })
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'block',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

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
};

const Tabs = () => {
  const { loading, error, data } = useQuery(ALL_LINKS);
  const [titles, setTitles] = useState({});

  useEffect(() => {
    const fetchTitles = async () => {
      if (data) {
        const newTitles = {};
        await Promise.all(
          data.allLinks.map(async (link) => {
            try {
              const response = await axios.get(
                `http://localhost:3001/fetch-title?url=${encodeURIComponent(link.link)}`
              );
              newTitles[link.id] = response.data.title;
            } catch (error) {
              console.error('Error fetching title:', error);
              newTitles[link.id] = 'Unknown Title';
            }
          })
        );
        setTitles(newTitles);
      }
    };

    fetchTitles();
  }, [data]);

  if (loading) return <div>loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Helper function to limit text length
  const truncateText = (text, maxLength = 10) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <List>
      {data.allLinks.map((link) => (
        <ListItem key={link.id} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <TravelExploreIcon />
            </ListItemIcon>
            <Tooltip title={titles[link.id] || 'Loading...'} arrow>
              <ListItemText
                primary={truncateText(titles[link.id] || 'Loading...', 30)}
                sx={{
                  userSelect: 'text', // Allow selecting text if clicked
                }}
              />
            </Tooltip>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

const App = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [history, setHistory] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const iframeRef = React.useRef(null);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const handleSearchSubmit = (url) => {
    setHistory((prev) => [...prev.slice(0, currentIndex + 1), url]);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const reloadPage = () => {
    if (iframeRef.current) {
      iframeRef.current.src = history[currentIndex];
    }
  };

  React.useEffect(() => {
    if (currentIndex >= 0 && currentIndex < history.length) {
      if (iframeRef.current) {
        iframeRef.current.src = history[currentIndex];
      }
    }
  }, [currentIndex, history]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: open ? `${drawerWidth}px 1fr` : `0 1fr`,
        gridTemplateRows: '100vh',
        transition: theme.transitions.create(['grid-template-columns'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundImage: `url(${texture})`,
        backgroundRepeat: "repeat",
      }}
    >
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <BrowserNavigation
            handleClose={handleDrawerClose}
            goBack={goBack}
            goForward={goForward}
            reloadPage={reloadPage}
          />
          <SearchBar setSearchQuery={handleSearchSubmit} />
        </DrawerHeader>
        <Divider />
        <Tabs />
      </Drawer>
      <Main>
        {currentIndex >= 0 ? (
          <iframe
            ref={iframeRef}
            src={history[currentIndex]}
            title="Webpage"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            sandbox="allow-same-origin allow-scripts"
          />
        ) : (
              <Box
                sx = {{
                  display: 'flex',           
                  flexDirection: 'column',
                  alignItems: 'center',       
                  justifyContent: 'center',
                  width: 1,
                  height: 1,
                  backgroundImage: `url(${maintexture})`,
                  backgroundRepeat: "repeat",
                }}
              >
                  <Typography  
                  variant="h1"
                  sx={{
                    fontWeight: 'bold',  
                    color: 'white',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  Meet the 
                </Typography>
                  <Typography  
                  variant="h1"
                  sx={{
                    fontWeight: 'bold',  
                    color: 'white',      
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  internet, again
                </Typography>
              </Box>
        )}
      </Main>
    </Box>
  );
};

export default App;

