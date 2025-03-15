const store = async (req, res, next) => {
    const { lastName, firstName, email, phone, username, password } = req.body;
    try {
      let user = new User({
        lastName,
        firstName,
        email,
        phone,
        username,
        password,
      });
      const savedUser = await user.save();
      return res.json({
        message: 'User added successfully!',
      });
    } catch (error) {
      console.log(error)
      return res.json({
        message: 'An error occured!',
      });
    }
};