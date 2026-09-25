const profilesMockDB = [];
let currentIdCounter = 1001;

const validateProfileData = (data) => {
  const errors = [];
  const { name, email, phone, address, age } = data;

  if (!name || typeof name !== 'string' || !name.trim()) errors.push('Name is required and must be text');
  
  if (!email || !/^.+@.+\..+\$/.test(email)) {
    errors.push('A valid email address is required');
  }
  
  if (!phone || !phone.trim()) errors.push('Phone number is required');
  if (!address || !address.trim()) errors.push('Address is required');
  
  if (age === undefined || age === null || isNaN(age) || Number(age) < 0) {
    errors.push('Age is required and must be a positive number');
  }

  return errors;
};

exports.createProfile = async (req, res) => {
  try {
    const validationErrors = validateProfileData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid request data',
        errors: validationErrors
      });
    }

    const { name, email, phone, address, age } = req.body;

    const emailExists = profilesMockDB.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid request data',
        errors: ['Email already registered']
      });
    }

    const newProfile = {
      id: `P${currentIdCounter++}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      age: Number(age)
    };

    profilesMockDB.push(newProfile);

    return res.status(201).json({
      success: true,
      msg: 'profile created successfully',
      data: newProfile
    });

  } catch (error) {
    console.error(error.message); 
    return res.status(500).json({
      success: false,
      msg: 'An unexpected internal server error occurred. Please try again later.'
    });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const foundProfile = profilesMockDB.find(p => p.id === profileId);

    if (!foundProfile) {
      return res.status(404).json({
        success: false,
        msg: `Profile with ID '${profileId}' does not exist`
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Profile fetched successfully',
      data: foundProfile
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: 'An unexpected internal server error occurred. Please try again later.'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    const profileIndex = profilesMockDB.findIndex(p => p.id === profileId);

    if (profileIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: `Cannot update. Profile with ID '${profileId}' does not exist`
      });
    }

    const validationErrors = validateProfileData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid request data',
        errors: validationErrors
      });
    }

    const { name, email, phone, address, age } = req.body;

    const emailConflict = profilesMockDB.find(
      p => p.email.toLowerCase() === email.toLowerCase() && p.id !== profileId
    );
    if (emailConflict) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid request data',
        errors: ['Email is already in use by another profile']
      });
    }

    profilesMockDB[profileIndex] = {
      id: profileId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      age: Number(age)
    };

    return res.status(200).json({
      success: true,
      msg: 'profile updated successfully',
      data: profilesMockDB[profileIndex]
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      msg: 'An unexpected internal server error occurred. Please try again later.'
    });
  }
};
