import { Alert, Box, Button, Divider, IconButton, OutlinedInput, Paper, TextField, Typography, } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StyledBox } from './styles'
import { Check, RemoveRedEye } from '@mui/icons-material'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { logOut, setCredentials } from '../../features/users/userSlice'
import {  useDispatch} from 'react-redux';
import {  useLogInUserMutation } from '../../app/api/apiSlice';
import CustomDialog from '../utils/CustomDialog';
import { resetStore } from '../../helpers/functions';
import CustomCircularPogress from '../utils/CircularProgress';
// ... (imports)


function Home() {




  const dispatch = useDispatch()


  const [logInUser, logInUserResult] = useLogInUserMutation();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('');
  const [progress, setProgress] = useState(false);

  useEffect(()=>{
    console.log('HEHEHEHEH')
    resetStore(dispatch)

  },[])
  useEffect(() => {
    if (location.state && location.state.registrationSuccess) {
      setShowSuccessAlert(true);
      navigate({
        state: {},
        replace: true,
      });
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await logInUser(formData);
    

  };
  useEffect(()=>{
     console.log(progress)

  }, [progress])
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (logInUserResult.status==='rejected') {
      if (logInUserResult.error.status === 401) {
        setDialogMessage('Email or password are incorrect')
        dispatch(logOut())

      } else {
        console.log(logInUserResult.status)
        setDialogMessage('Unknown error occurred')
        dispatch(logOut())


      }
      setDialogType("Error")
      setProgress(false)

      setDialogOpen(true)
    } else  if (logInUserResult.status === 'fulfilled') {
        setDialogOpen(false)
        setProgress(false)
        dispatch(setCredentials({ user: logInUserResult.data.user, token: logInUserResult.data.token }))


        navigate(`/main`,);
        
        console.log(logInUserResult.data.user._id,'login successful')
    } else if (logInUserResult.status === 'pending') {
      console.log(logInUserResult.status)
      setDialogOpen(false)

      setProgress(true)


      }

    






  }, [logInUserResult, navigate])
  return (
    <StyledBox >
      <Box sx={{ width: '65%', display: 'flex', flexDirection: 'row', justifyContent: 'center' ,flex:1}}>
        <form onSubmit={handleSubmit} >
          <Paper sx={{ padding:'10px' , height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <OutlinedInput name='email' required onChange={handleChange('email')} sx={{ width: '300px' }} placeholder='Email address' />
            </Box>
            <Box>
              <TextField name='password' required onChange={handleChange('password')} type={visible ? 'password' : 'text'} sx={{ width: '300px' }} placeholder='Password' InputProps={{ endAdornment: (<IconButton onClick={() => setVisible(!visible)}>{visible ? <VisibilityOffIcon /> : <RemoveRedEye />}</IconButton>) }} />
            </Box>
            <Button type='submit' variant='contained'>
              LogIn
            </Button>
            <Box sx={{ marginLeft: '90px' }}>
              <Link style={{ textDecoration: 'none' }}>Forgot password</Link>
            </Box>
            <Divider />

          </Paper>
        </form>
      </Box>
      {showSuccessAlert && (
        <Alert
          sx={{
            position: 'absolute',
            top: '50%',
            right: '50%',
            zIndex: '3',
          }}
          variant={'filled'}
          severity='success'
          icon={<Check fontSize='inherit' />}
          action={
            <Button
              color='inherit'
              size='small'
              onClick={() => {
                setShowSuccessAlert(false);
              }}
            >
              UNDO
            </Button>
          }
        >
          Registration successful! You can now log in.
        </Alert>
      )}
      
      <CustomDialog message={dialogMessage} isOpen={dialogOpen} setIsOpen={setDialogOpen} type={dialogType} />
      {progress ? <CustomCircularPogress
      /> : null}  
    </StyledBox>
  );
}

export default Home;


