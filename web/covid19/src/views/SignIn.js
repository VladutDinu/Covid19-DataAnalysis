import React, { useRef,useState, Component } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
let handlers={
  email: false,
  emailString:'',
  password: '',
  count : 0,
  render: true,
  to: '#'
}
function useForceUpdate(){
  const [email, setEmail] = useState(false); 
  const [count, setCount] = useState(0); 
  const [render, setRender] = useState(true); 
  const [password, setPassword] = useState(''); 
  const [emailString, setEmailString] = useState(''); 
  //get request on data to signup
  return () => {
    setEmail(handlers.email);
    setCount(handlers.count);
    setRender(handlers.render);
    setPassword(handlers.password);
    setEmailString(handlers.emailString);
  }; 
}
function renderWrong(){
  if(handlers.count > 0){
    if(handlers.email){
      handlers.render = true;
      handlers.to='/Dashboard';
    }
    else{
      handlers.render =  false;
    }
  }
  else{
    handlers.render = true;
  }
  console.log('render ='+(handlers.render).toString());
}
function validEmail(emailRef){
  if(typeof emailRef.current.value !== "undefined"){
    let lastAtPos = emailRef.current.value.indexOf('@');
    let lastDotPos = emailRef.current.value.indexOf('.');
    if((lastAtPos < lastDotPos && lastAtPos > 0 && (emailRef.current.value.length - lastDotPos) > 2  && !(emailRef.current.value.indexOf('@') == -1) && lastDotPos > 2)){
       handlers.email=true;
       handlers.emailString=emailRef.current.value;
     }
    else{
      handlers.email=false;
    }
  }
  else{
    handlers.email=false;
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function SignIn() {
  const classes = useStyles();
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const forceUpdate = useForceUpdate();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputRef={emailRef}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          {( handlers.render ) ? null : <p>Wrong email</p>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputRef={passwordRef}
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={() => {handlers.password = passwordRef.current.value}}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            href={handlers.to}
            onClick={() =>{
              validEmail(emailRef)
              renderWrong()
              forceUpdate()
            }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="SignUp" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}