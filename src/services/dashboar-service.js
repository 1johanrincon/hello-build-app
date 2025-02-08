
export const getGitHubToken = async (code) => {
    try {
      const response = await fetch('/login/oauth/access_token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_SECRET_ID,
          code,
          redirect_uri: process.env.REACT_APP_REDIRECT_URL,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      const urlParams = new URLSearchParams(responseText);
      const accessToken = urlParams.get('access_token');
      if (accessToken) {
        localStorage.setItem('github_token', accessToken);
        return getDataUser(accessToken);
      }
    } catch (error) {
      console.error('Error al obtener el token:', error);
    }
  };

  export const getDataUser = async (accessToken) => {
    const query = `{
      viewer {
        name
        avatarUrl
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
      }
    }
    `
    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (data.errors) {
        console.log(data.errors)
      }
      return data;
    } catch (error) {
      console.log(error)
      throw "ERROR retrieving GITHUB user data";
    }
  };