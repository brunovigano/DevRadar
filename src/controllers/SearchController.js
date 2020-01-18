const Developer = require('../models/Developer');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    console.log(req.query);

    const { lat, lon, techs } = req.query;

    const techsArray = parseStringAsArray(techs);

    const searchResult = await Developer.find({
      techs: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat],
          },
          $maxDistance: 10000,
        },
      },
    });

    console.log(searchResult);

    return res.status(200).json({ searchResult });
  },
};
