
import React, { useState, useEffect } from 'react';

function LanguageProfile() {
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');
  const [rating, setRating] = useState(0);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
      const reposData = await reposResponse.json();
      let languageRating = 0;
      let languageCount = 0;
      reposData.forEach(repo => {
        if (repo.language === language) {
          languageRating += repo.stargazers_count;
          languageCount++;
        }
      });
      setRating(languageRating / languageCount);
      setRepos(reposData);
      let lang = reposData.map(repo => repo.language);
      setLanguages([...new Set(lang.filter(Boolean))])
    }
    if (username && language) {
      fetchData();
    }
  }, [username, language]);

  return (
    <div className="bg-white-200 p-4">
      <div className="flex justify-center">
        <input
          className="bg-black p-2 rounded-lg mr-2"
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="bg-black p-2 rounded-lg mr-2"
          type="text"
          placeholder="Enter language"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        />
        <button className="bg-blue-500 p-2 rounded-lg text-black">Fetch Profile</button>
      </div>
      <div>
      {rating !== 0 && (
        <div>
            <p className="text-2xl font-bold">Language Rating: {rating}</p>
            <br/>
          <h2 className="text-lg font-bold">Most used languages:</h2>
          <ul className="list-disc pl-5">
                {languages.map(lang => (
              <li key={lang}>
                {lang}
              </li>
            ))}
          </ul>
        <br/>
          <h2 className="text-lg font-bold">Repositories:</h2>
          <ul className="list-disc pl-5">
            {repos.map(repo => (
              <li key={repo.id}>
                <a href={repo.html_url}>{repo.name}</a>
              </li>
            ))}
          </ul>
          
        </div>
      )}
      </div>
    </div>
  );
}

export default LanguageProfile;




