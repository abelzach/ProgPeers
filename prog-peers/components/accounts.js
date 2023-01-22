import { useState, useEffect, use } from 'react'
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [profile, setProfile] = useState({});
  const [pull_requests, SetPull_requests] = useState(null);
  const [MyLanguages, SetMyLanguages] = useState({});
  
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

      SetPull_requests(pull_requests);
      SetMyLanguages(languages);

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

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, pull_requests, languages`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url, pull_requests, languages }) {
    try {
      setLoading(true)

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        pull_requests,
        languages,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
        <center>
      <div>
        <label htmlFor="email">Email  </label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <br/>
      <div>
        <label htmlFor="username">Username  </label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <br/>
      <div>
        <label htmlFor="website">Website  </label>
        <input
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
        <br/>
      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, website, avatar_url, pull_requests, MyLanguages })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>
        <br/>
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
      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
      </center>
    </div>
  )
}