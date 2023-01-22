import React from 'react'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-medium">Welcome to ProjPeers</h1>
      <p className="text-lg font-light mb-4">Connect with like-minded individuals to collaborate on projects.</p>
      <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg">
        <a href="/login" className="no-underline text-white">Join Now</a>
      </button>
    <br/>
      <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg">
        <a href="/profile" className="no-underline text-white">Profile page.. this should come as a part of signing up </a>
      </button>

    <br/>
    <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg">
      <a href="/test" className="no-underline text-white">Language rating page which is essentially a modification of our profile page </a>
    </button>
  </div>
  )
}

export default Home
