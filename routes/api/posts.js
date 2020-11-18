const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');


router.post('/', [auth, [
    check('text', 'Text is Required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1
        });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

router.get('/:postid', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) {
            return res.status(404).json({
                msg: 'Post not found'
            });
        }

        res.json(post);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post not found'
            });
        }

        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

router.delete('/:postid', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) {
            return res.status(404).json({
                msg: 'Post not found'
            });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'Not authorized'
            });
        }
        await post.remove();
        res.json({
            msg: 'Post Removed'
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post not found'
            });
        }
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

router.put('/likes/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if user has liked post
        if (post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0) {
            return res.status(400).json({
                msg: 'User has already liked'
            });
        }
        post.likes.unshift({
            user: req.user.id
        });
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

router.delete('/:postid', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) {
            return res.status(404).json({
                msg: 'Post not found'
            });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: 'Not authorized'
            });
        }
        await post.remove();
        res.json({
            msg: 'Post Removed'
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Post not found'
            });
        }
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if user has liked post
        if (post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0) {
            return res.status(400).json({
                msg: 'Post has not been liked'
            });
        }
        const removeIndex = post.likes.map(like => like.user.toString())
            .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

router.post('/comment/:id', [auth, [
    check('text', 'Text is Required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

router.delete('/comment/:id/:commentid', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments
        .find(comment => comment.id === req.params.commentid);

        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({msg: 'Comment does not exist'})
        }

        // Delete Comment
        const removeIndex = post.likes.map(com => com.user.toString())
            .indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);
        
        //Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Unauthorized'});
        }
    } catch (error) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;