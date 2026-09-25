const profiles = [];
let nextId = 1001;

function validateProfile(data) {
  if (!data || typeof data !== 'object') return false;

  const { name, email, phone, address, age } = data;
  const validEmail = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return typeof name === 'string' && name.trim() !== '' &&
    validEmail &&
    typeof phone === 'string' && phone.trim() !== '' &&
    typeof address === 'string' && address.trim() !== '' &&
    age !== '' && age !== null && age !== undefined &&
    Number.isFinite(Number(age)) && Number(age) >= 0;
}

function cleanProfile(data) {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    age: Number(data.age)
  };
}

exports.createProfile = (req, res) => {
  if (!validateProfile(req.body)) {
    return res.status(400).json({ success: false, msg: 'Invalid request data' });
  }

  const profile = {
    id: `P${nextId++}`,
    ...cleanProfile(req.body),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  profiles.push(profile);

  return res.status(201).json({
    success: true,
    msg: 'Profile created successfully',
    id: profile.id,
    data: profile
  });
};

exports.getProfileById = (req, res) => {
  const profile = profiles.find((item) => item.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ success: false, msg: 'Profile not found' });
  }

  return res.status(200).json({ success: true, data: profile });
};

exports.updateProfile = (req, res) => {
  const profile = profiles.find((item) => item.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ success: false, msg: 'Profile not found' });
  }
  if (!validateProfile(req.body)) {
    return res.status(400).json({ success: false, msg: 'Invalid request data' });
  }

  Object.assign(profile, cleanProfile(req.body), { updatedAt: new Date() });
  return res.status(200).json({
    success: true,
    msg: 'Profile updated successfully',
    data: profile
  });
};
