const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Channel = require('../../models/Channel');

//@route POST /api/channel
//@desc Create or update channel
//@access Private
router.post('/', [auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, users } = req.body;
    const channelFields = {};
    channelFields.owner = req.user.id;

    if(name)  channelFields.name = name;

    
    channelFields.whitelist = [];
    channelFields.blacklist = [];
    
    if(!users){
        channelFields.users  = [];
    }else{
        if(type == 'whitelist'){
            channelFields.whitelist = users;
            channelFields.users = users;
        }else if(type == 'blacklist'){
            channelFields.blacklist = users;
        }
    }

    channelFields.whitelist.unshift(req.user.id);
    channelFields.users.unshift(req.user.id);

    try {
        if(req.body.channel_id){
        let  channel = await Channel.findById(req.body.channel_id);

            if(!channel){
                return res.status(404).json({ msg: 'Channel not found' });
            }

            channel  = await Channel.findOneAndUpdate(
                { name: name },
                { $set: channelFields },
                { new: true }
            );

            return res.json(channel);
        }

        channel = new Channel(channelFields);
        await channel.save();

        res.json(channel);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route GET /api/channel
//@desc Get all channels
//@access Private
router.get('/', auth, async (req, res) => {
    try {
        const channels = await Channel.find().select('-messages');

        if(!channels){
            return res.status(404).json({ msg: 'No channels found' });
        }

        const clientObjects = channels.map(channel => {
            const whitelistIndex = channel.whitelist.indexOf(req.user.id);
            const blacklistIndex = channel.blacklist.indexOf(req.user.id);
            const userIndex = channel.users.indexOf(req.user.id);
    
            let whitelisted = false;
            let blacklisted = false;
            let joined = false;
            let owner = false;
    
            if(whitelistIndex >= 0) whitelisted = true;
            if(blacklistIndex >= 0) blacklisted = true;
            if(userIndex >= 0) joined = true;
            if(channel.owner  == req.user.id) owner = true;

            return {
                id: channel.id,
                name: channel.name,
                whitelisted:  whitelisted,
                blacklisted: blacklisted,
                joined: joined,
                owner: owner
            };
        });

        res.json(clientObjects);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route GET /api/channel/:channel_id
//@desc Get channel by id
//@access Private
router.get('/:channel_id', auth, async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.channel_id);

        if(!channel){
            return res.status(404).json({ msg: 'Channel not found' });
        }

        const whitelistIndex = channel.whitelist.indexOf(req.user.id);
        const blacklistIndex = channel.blacklist.indexOf(req.user.id);
        const userIndex = channel.users.indexOf(req.user.id);

        let whitelisted = false;
        let blacklisted = false;
        let joined = false;
        let owner = false;

        if(whitelistIndex >= 0) whitelisted = true;
        if(blacklistIndex >= 0) blacklisted = true;
        if(userIndex >= 0) joined = true;
        if(channel.owner  == req.user.id) owner = true;

        const clientObject = {
            id: channel.id,
            name: channel.name,
            whitelisted:  whitelisted,
            blacklisted: blacklisted,
            joined: joined,
            owner: owner,
            messages: channel.messages.splice(0, 100)
        };

        res.json(clientObject);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route GET /api/channel/joined
//@desc Get all channels joined by user
//@access Private
router.get('/joined', auth, async (req, res) => {
    try {
        const channels = await Channel.find({ users: [req.user.id] }).select('-messages');

        if(!channels){
            return res.status(404).json({ msg: 'No channels found' });
        }

        const clientObjects = channels.map(channel => {
            const whitelistIndex = channel.whitelist.indexOf(req.user.id);
            const blacklistIndex = channel.blacklist.indexOf(req.user.id);
            const userIndex = channel.users.indexOf(req.user.id);
    
            let whitelisted = false;
            let blacklisted = false;
            let joined = false;
            let owner = false;
    
            if(whitelistIndex >= 0) whitelisted = true;
            if(blacklistIndex >= 0) blacklisted = true;
            if(userIndex >= 0) joined = true;
            if(channel.owner  == req.user.id) owner = true;

            return {
                id: channel.id,
                name: channel.name,
                whitelisted:  whitelisted,
                blacklisted: blacklisted,
                joined: joined,
                owner: owner
            };
        });

        res.json(clientObjects);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route PUT /api/channel/:channel_id/join
//@desc User join/leave channel
//@access Private
router.put('/:channel_id/join', auth, async (req, res) => {
    try {
        const channels = await Channel.findById(req.params.channel_id);

        if(!channels){
            return res.status(404).json({ msg: 'No channels found' });
        }

        const userIndex = channel.users.indexOf(req.user.id);
        const whitelistIndex = channel.whitelist.indexOf(req.user.id);
        const remove = false;

        if(userIndex >= 0){
            remove = true;
            channel.users.splice(userIndex, 1);
        }
        if(whitelistIndex >= 0){
            remove = true;
            channel.whitelist.splice(whitelistIndex, 1);
        }

        if(remove){
            await channel.save();
            return res.json(channel);
        }

        const blacklistIndex =  channel.blacklist.indexOf(req.user.id);

        if(blacklistIndex >= 0){
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        if(userIndex < 0)  channel.users.unshift(req.user.id);
        if(whitelistIndex < 0) channel.whitelist.unshift(req.user.id);

        await channel.save();
        res.json(channel);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route PUT /api/channel/:channel_id/user
//@desc Add user to channel
//@access Private
router.put('/:channel_id/user', [auth, [
    check('user_id', 'A User is needed').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const channel = await Channel.findById(req.params.channel_id);

        if(!channel){
            return res.status(404).json({ msg: 'Channel not found' });
        }

        if(channel.owner != req.user.id){
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const userIndex = channel.users.indexOf(req.body.user_id);
        const whitelistIndex = channel.whitelist.indexOf(req.body.user_id);
        const blacklistIndex = channel.blacklist.indexOf(req.body.user_id);

        if(blacklistIndex >= 0){
            channel.blacklist.splice(blacklistIndex, 1);
        }
        if(userIndex < 0){
            channel.users.unshift(req.body.user_id);
        }
        if(whitelistIndex < 0){
            channel.whitelist.unshift(req.body.user_id);
        }

        await channel.save();
        res.json(channel);
    } catch (error) {
        console.error(errror.message);
        res.status(500).send('Server error');
    }
});

//@route DELETE /api/channel
//@desc Delete channel
//@access Private
router.delete('/', [auth, [
    check('channel_id', 'Channel ID is needed').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const channel = Channel.findById(req.body.channel_id);

        if(!channel){
            return res.status(404).json({msg: 'Channel not found' });
        }

        if(channel.owner != req.user.id){
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        
        await Channel.findOneAndDelete({_id: req.body.channel_id});

        res.send('Success');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route DELETE /api/channel/:channel_id/user
//@desc Blacklist user
//@access Private
router.delete('/:channel_id/user', [auth, [
    check('user_id', 'User ID is needed').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const channel = await Channel.findById(req.params.channel_id);

        if(!channel){
            return res.status(404).json({ msg: 'Channel not found' });
        }

        if(channel.owner != req.user.id){
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const userIndex = channel.users.indexOf(req.body.user_id);
        const whitelistIndex = channel.whitelist.indexOf(req.body.user_id);
        const blacklistIndex = channel.blacklist.indexOf(req.body.user_id);

        if(userIndex >= 0){
            channel.users.splice(userIndex, 1);
        }
        if(whitelistIndex >= 0){
            channel.whitelist.splice(whitelistIndex, 1);
        }
        if(blacklistIndex < 0){
            channel.blacklist.unshift(req.body.user_id);
        }

        await channel.save();
        res.json(channel);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route GET /api/channel/:channel_id/settings
//@desc Get Channel object for settings
//@access Private
router.get('/:channel_id/settings', auth, async (req, res) => {
    try{
        const channel = await Channel.findById(req.params.channel_id, 'owner name');

        if(!channel){
            return res.status(404).json({ msg: 'Channel not found' });
        }

        if(channel.owner != req.user.id){
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        return res.json(channel);
    }catch(error){
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route GET /api/channel/:channel_id/settings/whitelist
//@desc Get whitelist of channel
//@access Private
router.get('/:channel_id/settings/whitelist', auth, async (req, res) => {
    try{
        const channel = await Channel.findById(req.params.channel_id, 'owner whitelist');

        if(!channel){
            return res.status(404).json({ msg: 'Channel not found' });
        }

        if(channel.owner != req.user.id){
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        return res.json(channel);
    }catch(error){
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route GET /api/channel/:channel_id/settings/blacklist
//@desc Get blacklist of channel
//@access Private
router.get('/:channel_id/settings/blacklist', auth, async (req, res) => {
    try{
        const channel = await Channel.findById(req.params.channel_id, 'owner blacklist');

        if(!channel){
            return res.status(404).json({ msg: 'Channel not found' });
        }

        if(channel.owner != req.user.id){
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        return res.json(channel);
    }catch(error){
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;