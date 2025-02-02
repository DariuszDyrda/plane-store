import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import FlightIcon from '@mui/icons-material/Flight';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ChangeEvent, useState } from 'react';
import { fetchPlanes } from '../PlaneList/planeListSlice';
import { selectSearchQuery, setSearch } from './searchSlice';
import LoginDialog from '../LoginDialog/LoginDialog';
import { logout, selectAdmin } from '../LoginDialog/loginSlicer';
import EditDialog from '../EditDialog/EditDialog';
import { Alert, AlertColor, Snackbar } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export function NavBar() {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector(selectSearchQuery);
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(fetchPlanes({ skip: 0, take: 9, search: event.target.value }))
    dispatch(setSearch(event.target.value));
  }

  const admin = useAppSelector(selectAdmin);

  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [snackBarState, setSnackBarState] = useState({
    open: false,
    severity: 'success',
    message: 'Your order was places successfully',
  })

  const handleCloseSnackBar = () => {
    setSnackBarState({ ...snackBarState, open: false });
  }

  const displaySnackBar = (severity: AlertColor, message: string) => {
    setSnackBarState({
      open: true,
      severity,
      message
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <FlightIcon />
          </IconButton>
          {
            admin ?
              (
                <>
                <Button color="inherit" onClick={() => dispatch(logout())}>Logout</Button>
                <Button color="inherit" onClick={() => setOpenNewDialog(true)}>Add new plane</Button>
                { openNewDialog && (
                  <EditDialog onClose={() => setOpenNewDialog(false)} displaySnackBar={displaySnackBar} isSnackBarOpen={snackBarState.open} />
                )}
                <Snackbar open={snackBarState.open} autoHideDuration={3000} onClose={handleCloseSnackBar}>
                  <Alert severity={snackBarState.severity as AlertColor} sx={{ width: '100%' }}>
                    {snackBarState.message}
                  </Alert>
                </Snackbar>
                </>
              )
              : (<Button color="inherit" onClick={() => setOpenLoginDialog(true)}>Login</Button>)
          }
          <LoginDialog isOpen={openLoginDialog} close={() => setOpenLoginDialog(false)}/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            {admin?.email || "PLANE STORE"}
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleChange}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}