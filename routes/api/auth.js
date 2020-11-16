const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const gravatar = require('gravatar');
const {
    check,
    validationResult
} = require('express-validator');

const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
});

router.post('/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is Required').exists()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // See if user exists
            const {
                email,
                password
            } = req.body;

            try {
                let user = await User.findOne({
                    email
                });
                if (!user) {
                    return res.status(400).json({
                        errors: [{
                            msg: 'Invalid Credentials'
                        }]
                    })
                }
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{
                            msg: 'Invalid Credentials'
                        }]
                    })
                }
                // Return jsonwebtoken
                const payload = {
                    user: {
                        id: user.id
                    }
                };
                jwt.sign(payload,
                    config.get('jwtSecret'), {
                        expiresIn: 360000
                    },
                    (err, token) => {
                        if (err) throw err;
                        res.json({token});
                    }
                );
            } catch (err) {
                console.error(err.message);
            }

        } else {
            return res.status(400).json({
                errors: errors.array()
            })
        }
    });

module.exports = router;