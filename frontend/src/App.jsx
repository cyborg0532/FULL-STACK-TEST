import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/profiles';

const blankProfile = {
  name: '',
  email: '',
  phone: '',
  address: '',
  age: ''
};

export default function App() {
  const [newProfile, setNewProfile] = useState({ ...blankProfile });
  const [searchId, setSearchId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [profile, setProfile] = useState({ ...blankProfile });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function createProfile(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProfile, age: Number(newProfile.age) })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.msg || 'Could not create profile');

      setMessage(`Profile created. ID: ${result.id || result.data.id}`);
      setNewProfile({ ...blankProfile });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function searchProfile(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(searchId.trim())}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.msg || 'Could not find profile');

      setProfileId(result.data.id);
      setProfile({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        address: result.data.address,
        age: String(result.data.age)
      });
      setMessage(`Profile ${result.data.id} loaded.`);
    } catch (requestError) {
      setProfileId('');
      setError(requestError.message);
    }
  }

  async function updateProfile(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(profileId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, age: Number(profile.age) })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.msg || 'Could not update profile');

      setMessage(`Profile ${result.data.id} updated.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main>
      <h1>Profile Management</h1>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      <section>
        <h2>Create a profile</h2>
        <form onSubmit={createProfile}>
          <label>
            Name
            <input required value={newProfile.name} onChange={(event) => setNewProfile({ ...newProfile, name: event.target.value })} />
          </label>
          <label>
            Email
            <input required type="email" value={newProfile.email} onChange={(event) => setNewProfile({ ...newProfile, email: event.target.value })} />
          </label>
          <label>
            Phone
            <input required type="tel" value={newProfile.phone} onChange={(event) => setNewProfile({ ...newProfile, phone: event.target.value })} />
          </label>
          <label>
            Address
            <textarea required value={newProfile.address} onChange={(event) => setNewProfile({ ...newProfile, address: event.target.value })} />
          </label>
          <label>
            Age
            <input required type="number" min="0" value={newProfile.age} onChange={(event) => setNewProfile({ ...newProfile, age: event.target.value })} />
          </label>
          <button type="submit">Create profile</button>
        </form>
      </section>

      <section>
        <h2>Find a profile</h2>
        <form className="search-form" onSubmit={searchProfile}>
          <label>
            Profile ID
            <input required placeholder="P1001" value={searchId} onChange={(event) => setSearchId(event.target.value)} />
          </label>
          <button type="submit">Search</button>
        </form>

        {profileId && (
          <form onSubmit={updateProfile}>
            <p>Editing {profileId}</p>
            <label>
              Name
              <input required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
            </label>
            <label>
              Email
              <input required type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
            </label>
            <label>
              Phone
              <input required type="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
            </label>
            <label>
              Address
              <textarea required value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} />
            </label>
            <label>
              Age
              <input required type="number" min="0" value={profile.age} onChange={(event) => setProfile({ ...profile, age: event.target.value })} />
            </label>
            <button type="submit">Save changes</button>
          </form>
        )}
      </section>
    </main>
  );
}
