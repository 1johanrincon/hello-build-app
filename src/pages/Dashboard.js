import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Box, Typography, TextField, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Star } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { getGitHubToken } from '../services/dashboar-service'


const Dashboard = () => {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const [repos, setRepos] = useState([]);
  const [originalRepos, setOriginalRepos] = useState([]);
  const [starRepos, setStarRepos] = useState([]);
  const [isToken, setIsToken] = useState(false);
  const [gitHubUser, setGitHubUser] = useState({});
  const navigate = useNavigate();

  const columns = [
    {
      field: 'name',
      renderHeader: () => (
        <strong>
          {'Name'}
        </strong>
      )
      , width: 200,
      headerAlign: "center"
    },
    {
      field: 'description',
      renderHeader: () => (
        <strong>
          {'Description'}
        </strong>
      ),
      headerAlign: "center",
      width: 250,
    },
    {
      field: 'createdAt',
      headerAlign: "center",
      renderHeader: () => (
        <strong>
          {'Created At'}
        </strong>
      ),
      valueFormatter: (row) => {
        const date = new Date(row);
        return date.toISOString().split('T')[0];
      },
      width: 150,
      editable: true,
    },
    {
      field: 'url',
      renderHeader: () => (
        <strong>
          {'Url'}
        </strong>
      ),
      headerAlign: "center",
      width: 400,
    },
    {
      field: 'isFavourite',
      renderHeader: () => (
        <strong>
          {'Favourite'}
        </strong>
      ),
      headerAlign: "center",
      width: 200,
      renderCell: ({ row }) => {
        const addFavourite = () => {
          row.isFavourite = true;
          setStarRepos((prev) => [row, ...prev])
          setRepos((prev) => prev.filter(r => r.name !== row.name))
        };
        const deleteFavourite = () => {
          row.isFavourite = false;
          setStarRepos((prev) => prev.filter(r => r.name !== row.name))
          setRepos((prev) => [row, ...prev])
        }
        return (
          <Button
            variant="contained"
            endIcon={<Star />}
            sx={{ backgroundColor: row.isFavourite ? 'red' : 'green', borderRadius: '20px' }}
            onClick={row.isFavourite ? deleteFavourite : addFavourite}
          >
            {row.isFavourite ? 'Delete Favourite' : 'Add Favourite'}
          </Button>
        )
      }
    }
  ];

  useEffect(() => {
    const user = localStorage.getItem('user');
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!user) {
      navigate("/")
    }
    const favouritesRepos = JSON.parse(localStorage.getItem('favourites'));
    if (favouritesRepos?.length > 0) {
      setStarRepos(favouritesRepos)
    }
    if (code) {
      getGitHubData(code);
    }
  }, [])

  useEffect(() => {
    if (starRepos?.length > 0) {
      localStorage.setItem('favourites', JSON.stringify(starRepos))
    }
  }, [starRepos])



  const getGitHubData = async (code) => {
    try {
      const data = await getGitHubToken(code)
      if (!data) {
        navigate("/")
      }
      setIsToken(true);
      const repositories = data.data.viewer.repositories.nodes;
      repositories.map(data => data.isFavourite = false)
      const starLocal = JSON.parse(localStorage.getItem('favourites'))
      if (starLocal?.length > 0) {
        setStarRepos(starLocal)
      }
      const finalResult = repositories.filter(repo => !starLocal?.some(star => star.name === repo.name));
      setOriginalRepos(finalResult)
      setRepos(finalResult)
      setGitHubUser({ 'name': data.data.viewer.name, 'avatar': data.data.viewer.avatarUrl })
    } catch (error) {
      console.log(error)
    }
  };


  const loginGitHub = () => {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID)
  }

  const filterRepos = (query) => {
    if (query === '') {
      const finalResult = originalRepos.filter(repo => !starRepos?.some(star => star.name === repo.name));
      setRepos(finalResult);
      return;
    }
    const filter = repos.filter(r => r?.name.toLowerCase().includes(query.toLowerCase()));
    setRepos(filter)
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 2 }}>
      {!isToken &&
        <Box sx={{ textAlign: 'center', paddingTop: 40 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GitHubIcon />}
            onClick={loginGitHub}
          >
            Link GitHub account
          </Button>
        </Box>
      }
      {isToken &&
        <Box sx={{ minHeight: '90vh', width: '100%' }}>
          <Box sx={{ paddingTop: 2, paddingBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h4' align='left' sx={{ color: 'white' }}>
              Welcome {gitHubUser?.name}!
            </Typography>
            <Box
              sx={{
                width: 100,
                height: 100,
                backgroundImage: `url(${gitHubUser?.avatar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 15,
              }}
            />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Paper sx={{ width: '50%', display: 'inline-block' }}>
              <TextField placeholder='Search' type='text' sx={{ width: '100%', borderRadius: 10 }} onChange={(e) => filterRepos(e.target.value)} />
            </Paper>
          </Box>
          <Box sx={{ paddingTop: 2, paddingBottom: 1 }}>
            <Typography variant='h6' align='left' sx={{ alignItems: 'center', color: 'white' }} >
              Repositories
            </Typography>
          </Box>
          <DataGrid
            getRowId={() => uuidv4()}
            rows={repos}
            columns={columns}
            disableRowSelectionOnClick
            sx={{ backgroundColor: 'white', width: '100%' }}
            hideFooterPagination={true}
            pagination={false}
          />
          <Box sx={{ paddingTop: 2, paddingBottom: 1 }}>
            <Typography variant='h6' align='left' sx={{ alignItems: 'center', color: 'white' }} >
              Favourite Repositories
            </Typography>
          </Box>
          <DataGrid
            getRowId={() => uuidv4()}
            rows={starRepos}
            columns={columns}
            disableRowSelectionOnClick
            sx={{ backgroundColor: 'white', width: '100%' }}
            hideFooterPagination={true}
            pagination={false}
            localeText={{ noRowsLabel: "You don't have favourite repositories, try adding one. " }}
          />
        </Box>
      }
    </Container>
  );
};

export default Dashboard;
