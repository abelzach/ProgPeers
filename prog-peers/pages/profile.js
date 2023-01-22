import React, { useState, useEffect } from 'react';

function ProfilePage() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function fetchData() {
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      const userData = await userResponse.json();
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
      const reposData = await reposResponse.json();
      let languages = new Set();
      let pull_requests = 0;
      let issues = 0;
      reposData.forEach(repo => {
        languages.add(repo.language);
        pull_requests += repo.pull_requests;
        issues += repo.open_issues;
      });
      
      setProfile({
        ...userData,
        languages: [...languages],
        pull_requests,
        issues
      });
    }
    if (username) {
      fetchData();
    }
  }, [username]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      {profile.login && (
        <div>
          <h1>{profile.name}</h1>
          <img src={profile.avatar_url} alt={profile.login} />
          <p>Number of commits: {profile.public_repos}</p>
          <p>Languages used: {profile.languages.join(', ')}</p>
          <p>Stars received: {profile.stargazers_count}</p>
          <p>Pull requests: {profile.pull_requests}</p>
          <p>Issues solved: {profile.issues}</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
