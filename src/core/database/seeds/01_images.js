/* eslint-disable no-await-in-loop */
import images from '../data/images.json';

exports.seed = knex => knex('images')
    .del()
    .then(async () => {
        let data = [];
        for (let i = 0; i < images.length; i += 1) {
            data.push(images[i]);
            if ((i % 3000 === 0 && i !== 0) || i === images.length - 1) {
                await knex('images').insert(data);
                data = [];
            }
        }
    });
