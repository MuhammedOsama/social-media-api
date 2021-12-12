const express = require('express');
const {promise} = require("bcrypt/promises");
const router = express.Router();

// models
const Post = require('../models/post');
const User = require('../models/user');

// create post
router.get('/', async (req, res) => {
    try {
        const post = await new Post(req.body);

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({$set: req.body});
            res.status(200).json('The post has been updated.');
        } else {
            res.status(403).json('You can update only your post.');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json('The post has been deleted.');
        } else {
            res.status(403).json('You can delete only your post.');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// like/dislike post
router.get('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json('The post has been liked.');
        } else {
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json('The post has been disliked.');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// get post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get timeline posts
router.get('/timeline/all', async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts = await promise.all(currentUser.following.map((friendId) => {
            return Post.find({userId: friendId});
        }));
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
