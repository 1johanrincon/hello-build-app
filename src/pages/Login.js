import { Button, Container, TextField, Typography, Paper, Box, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [showError, setShowError] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLogin(true);
    }
  }, [])

  useEffect(() => {
  }, [isLogin])

  const saveUser = (e) => {
    e.preventDefault();
    const userLocal = { 'username': username, 'password': password }
    localStorage.setItem('user', JSON.stringify(userLocal))
    clearForm();
    setIsLogin(true)
  };

  const login = (e) => {
    setShowError(false);
    e.preventDefault();
    const userLocal = JSON.parse(localStorage.getItem('user'))
    if (username === userLocal?.username && password === userLocal?.password) {
      clearForm()
      navigate('/dashboard')
      return;
    }
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  function clearForm() {
    setUsername('')
    setPassword('')
  }

  return (
    <Container maxWidth="xs" sx={{ paddingTop: 8 }}>
      <Paper elevation={3} sx={{ height: 450, width: 300, margin: 2, padding: 2, paddingTop: 10 }}>
        <Typography variant='h3' align='center' sx={{ alignItems: 'center' }} >
          {isLogin ? 'Login' : 'Sing Up'}
        </Typography>
        <Box sx={{ alignItems: 'center', paddingTop: 3, paddingBottom: 3 }}>
          <TextField value={username || ''} onChange={(e) => setUsername(e.target.value)} placeholder='User' type='text' sx={{ alignSelf: 'center', paddingTop: 1, paddingBottom: 1 }} required fullWidth />
          <TextField value={password || ''} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' sx={{ alignSelf: 'center', paddingTop: 1, paddingBottom: 1 }} required fullWidth />
          {showError && <Typography variant='caption' align='center' sx={{ alignItems: 'center', color: 'red' }} >
            Incorrect username or password, please try again.
          </Typography>}
        </Box>
        <Button variant="contained" type="submit" fullWidth onClick={isLogin ? login : saveUser} sx={{ marginBottom: 2 }} >
          {isLogin ? 'Login' : 'Sing Up'}
        </Button>
        <Box sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography variant='caption' align='center'  >
            {isLogin ?
              <Link onClick={() => setIsLogin(false)}>Create new account</Link>
              : <Link onClick={() => setIsLogin(true)}>Do you already have an account?</Link>}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
