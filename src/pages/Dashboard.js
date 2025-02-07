import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('github_token'); // Asegúrate de guardar el token de GitHub al hacer login con OAuth

//     if (!token) {
//       setError('You must log in to see repositories.');
//       return;
//     }

//     const fetchRepos = async () => {
//       try {
//         const response = await fetch('https://api.github.com/user/repos', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setRepos(data);
//         } else {
//           setError('Failed to fetch repositories');
//         }
//       } catch (err) {
//         setError('An error occurred');
//       }
//     };

//     fetchRepos();
//   }, []);

  return (
    <div>
      <h2>Your Repositories</h2>
      {/* {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default Dashboard;
