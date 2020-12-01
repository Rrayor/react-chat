const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

//@route POST /api/user
//@desc Register user
//@access Public
router.post('/', [
    check('username', 'Please enter a username').not().isEmpty(),
    check('password', 'Please enter a password with at least 6 characters').isLength({min: 6})
],
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, color } = req.body;

    try {
        let user = await User.findOne({ username }, 'username');

        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        user = new User({ username, password, color  });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
            if(err) throw err;
            res.json({ token });
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;