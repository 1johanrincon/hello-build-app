import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const CLIENT_ID = 'Iv23libLjbUMr9U3Eul0'
  const SECRET_ID = '23db870ea8a87d0d1a821dc2f215ef27a14e26d1'
  const REDIRECT_URL = 'http://localhost:3000/dashboard'
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user');
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!user) {
      navigate("/")
    }

    if (code) {
      getGitHubToken(code);
    }
  }, [])

  const getGitHubToken = async (code) => {
    try {
      const response = await fetch('/login/oauth/access_token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: SECRET_ID,
          code,
          redirect_uri: REDIRECT_URL,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)

      const responseText = await response.text();
      console.log(responseText)
      const urlParams = new URLSearchParams(responseText);
      const accessToken = urlParams.get('access_token');
      console.log(accessToken);
      localStorage.setItem('github_token', accessToken);
      getDataUser()
    } catch (error) {
      console.error('Error al obtener el token:', error);
    }
  };

  const getDataUser = async () => {
    const query = `{
      viewer {
        login
        name
        bio
        avatarUrl
        location
        email
        company
        websiteUrl
        createdAt
        updatedAt
        repositories(first: 100) {
          nodes {
            name
            description
            url
            createdAt
            updatedAt
            owner {
              login
            }
          }
        }
        followers(first: 100) {
          nodes {
            login
            avatarUrl
          }
        }
        following(first: 100) {
          nodes {
            login
            avatarUrl
          }
        }
        starredRepositories(first: 100) {
          nodes {
            name
            owner {
              login
            }
            description
            url
          }
        }
      }
    }
    `
    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('github_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.errors) {
        console.log(error)
      } else {
        console.log(data)
      }

    } catch (error) {
      console.log(error)
    }
  };


  const loginGitHub = () => {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID)
  }


  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Button variant="contained" onClick={loginGitHub} sx={{ textAlign: 'start' }} >
        Link GitHub
      </Button>
    </Container>
  );
};

export default Dashboard;
