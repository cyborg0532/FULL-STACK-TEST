const Profile = require('../data/profile');
const ProfileCounter = require('../data/profileCounter');

function handleError(res, error) {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ success: false, msg: 'Invalid request data' });
  }

  return res.status(500).json({ success: false, msg: 'Internal server error' });
}

exports.createProfile = async (req, res) => {
  try {
    const counter = await ProfileCounter.findByIdAndUpdate(
      'profile',
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const profile = await Profile.create({
      id: `P${counter.sequence}`,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      age: req.body.age
    });

    return res.status(201).json({
      success: true,
      msg: 'Profile created successfully',
      id: profile.id,
      data: profile
    });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ id: req.params.id });
    if (!profile) {
      return res.status(404).json({ success: false, msg: 'Profile not found' });
    }

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ id: req.params.id });
    if (!profile) {
      return res.status(404).json({ success: false, msg: 'Profile not found' });
    }

    profile.name = req.body.name;
    profile.email = req.body.email;
    profile.phone = req.body.phone;
    profile.address = req.body.address;
    profile.age = req.body.age;

    await profile.save();
    return res.status(200).json({
      success: true,
      msg: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    return handleError(res, error);
  }
};
