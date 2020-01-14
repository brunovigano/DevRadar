const axios = require('axios');
const Developer = require('../models/Developer');

const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res) {

        const devs = await Developer.find({});

        return res.status(200).json(devs);
    },

    async store(req, res) {
        const { github_username, techs, lat, lon } = req.body;

        if (await Developer.findOne({ github_username })) {
            return res.status(400).json({ 'error': 'Username already exists' })
        }

        const res_github = await axios.get(`https://api.github.com/users/${github_username}`);

        const { name = login, bio, avatar_url } = res_github.data;

        const techsArray = parseStringAsArray(techs);

        const location = {
            type: 'Point',
            coordinates: [lon, lat]
        }



        const devPersist = await Developer.create({
            github_username,
            name,
            bio,
            avatar_url,
            techs: techsArray,
            location
        });

        return res.status(200).json(devPersist);
    }
};