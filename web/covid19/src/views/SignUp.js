import {React, useState, useRef} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {register_user} from '../services/User.services'
let handlers={
  email: false,
  emailString:'',
  password: false,
  passwordString: '',
  firstName: false,
  firstNameString : '',
  lastName : false,
  lastNameString: '',
  count : 0,
  render: true,
  to: '#'
}

function useForceUpdate(emailRef, passwordRef, firstNameRef, lastNameRef){
  const [email, setEmail] = useState(false); 
  const [count, setCount] = useState(0); 
  const [render, setRender] = useState(true); 
  const [password, setPassword] = useState(''); 
  const [emailString, setEmailString] = useState(''); 
  //get request on data to signup
  if(validName(firstNameRef, lastNameRef) && validEmail(emailRef) && validPassowrd(passwordRef)){
    if(handlers.count){
      register_user(firstNameRef.current.value+lastNameRef.current.value, emailRef.current.value, passwordRef.current.value )
      handlers.to='/Dashboard';
      handlers.count=0;
    }
    return () => {
      setEmail(handlers.email);
      setCount(handlers.count);
      setRender(handlers.render);
      setPassword(handlers.password);
      setEmailString(handlers.emailString);
    }; 
  }
  else{
    handlers.to = '#';
    return () => {
      setEmail(handlers.email);
      setCount(handlers.count);
      setRender(handlers.render);
      setPassword(handlers.password);
      setEmailString(handlers.emailString);
    }; 
  }
  
}

function validName(firstNameRef, lastNameRef){
  if (typeof firstNameRef.current.value !== "undefined" || typeof lastNameRef.current.value !== "undefined") {
    if (firstNameRef.current.value.length >= 3 && lastNameRef.current.value.length >= 3) {
      handlers.lastName=true;
      handlers.lastNameString=lastNameRef.current.value;
      handlers.firstName=true;
      handlers.firstNameString=firstNameRef.current.value;
      return true;
    }
    else{
      handlers.lastName=false;
      handlers.lastNameString=lastNameRef.current.value;
      handlers.firstName=false;
      handlers.firstNameString=firstNameRef.current.value;
      return false;
    }
  }
}


function validPassowrd(passwordRef){
  if (typeof passwordRef.current.value !== "undefined") {
    if (passwordRef.current.value.length > 8) {
      handlers.password=true;
      handlers.passwordString=passwordRef.current.value;
      return true;
    }
    else{
      handlers.password=false;
      handlers.passwordString=passwordRef.current.value;
      return false;
    }
  }
}

function validEmail(emailRef){
  if(typeof emailRef.current.value !== "undefined"){
    let lastAtPos = emailRef.current.value.indexOf('@');
    let lastDotPos = emailRef.current.value.indexOf('.');
    if((lastAtPos < lastDotPos && lastAtPos > 0 && (emailRef.current.value.length - lastDotPos) > 2  && !(emailRef.current.value.indexOf('@') == -1) && lastDotPos > 2)){
       handlers.email=true;
       handlers.emailString=emailRef.current.value;
       return true;
     }
    else{
      handlers.email=false;
      return false;
    }
  }
  else{
    handlers.email=false;
    return false;
  }
  handlers.count++;
  console.log(emailRef.current.value, handlers.email);
  
} 

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function SignUp() {
  const classes = useStyles();
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const firstNameRef = useRef('')
  const lastNameRef = useRef('')
  const forceUpdate = useForceUpdate(emailRef, passwordRef, firstNameRef, lastNameRef);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                inputRef={firstNameRef}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                inputRef={lastNameRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputRef={emailRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            href={handlers.to}
            onClick={() => {handlers.count=1;
              forceUpdate(emailRef, passwordRef, firstNameRef, lastNameRef);
             
            }
            }
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/SignIn" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}