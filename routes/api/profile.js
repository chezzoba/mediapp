const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator');
const Profile = require('../../models/Profile');
const request = require('request');
const config = require('../../config/default.json');
const User = require('../../models/User');

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
                user: req.user.id
            })
            .populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'No Profile for this user'
            });
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.post('/', [auth, [
        check('status', 'Status is Required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            website,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body;

        // build a profile
        const profileFields = {
            user: req.user.id,
            website: website && website !== '' ?
                normalize(website, {
                    forceHttps: true
                }) : '',
            skills: Array.isArray(skills) ?
                skills : skills.split(',').map((skill) => ' ' + skill.trim()),
            ...rest
        };
        const socialFields = {
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook
        };

        // normalize social fields to ensure valid url
        for (const [key, value] of Object.entries(socialFields)) {
            if (value && value.length > 0)
                socialFields[key] = normalize(value, {
                    forceHttps: true
                });
        }
        // add to profileFields
        profileFields.social = socialFields;

        try {
            // Using upsert option (creates new doc if no match is found):
            let profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            });
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    });

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.get('/user/:userid', async (req, res) => {
    try {
        const profile = await Profile.findOne({
                user: req.params.userid
            })
            .populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400)
                .json({
                    msg: 'There is no profile for this user'
                });
        }
        res.json(profile);
    } catch (error) {
        if (error.kind == 'ObjectId') {
            return res.status(400)
                .json({
                    msg: 'Profile not found'
                });
        }
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        await User.findOneAndRemove({
            id: req.user.id
        });
        res.json({
            msg: 'User Deleted'
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.delete('/experience/:expid', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});

        const removeIndex = profile.experience.map(item => item.id)
        .indexOf(req.params.expid);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field Of Study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user: req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.delete('/education/:eduid', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});

        const removeIndex = profile.education.map(item => item.id)
        .indexOf(req.params.eduid);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.get('api/profile/github/:username', async (req, res) => {
    try {
        const un = req.params.username;
        const options = {
            uri: `https://api.github.com/users/${un}/repos?per_page=5&
            sort=created:asc&clientid=${config.get('ghclid')}&
            client_secret=${config.get('ghclisecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };
        request(options, (err, response, data) => {
            if (err) console.error(err);
            if (response.statusCode !== 200) {
                return res.status(404).json({msg: 'GH profile Not found'});
            }
            res.json(JSON.parse(data));
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;