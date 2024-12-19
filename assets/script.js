import fs from 'node:fs';
fs.readFile('api.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    fs.readdir('../public/images/', (err, files) => {
        const json = JSON.parse(data);
        const propsToRemove = ['team', 'crates', 'collections', 'wears', 'paint_index', 'souvenir', 'stattrak', 'min_float', 'max_float', 'pattern', 'category', 'description']
        for (let key in json) {
            propsToRemove.forEach(prop => {
                delete json[key][prop];
            });
            json[key].image = json[key].image.replace(/.*\//, "");
            if (files.indexOf(json[key].image) === -1) {
                delete json[key];
            }
        }

        const proc = [];
        json.forEach(el => {
            console.log(proc.filter(p => p.weapon.name === el.weapon.name && p.rarity.id === el.rarity.id).length === 0);
            if (el && proc.filter(p => p.weapon.name === el.weapon.name && p.rarity.id === el.rarity.id).length === 0) {
                proc.push(el)
            }
        });
        files.filter(file => proc.map(p => p.image).indexOf(file) === -1).forEach(file => {
            fs.unlinkSync('../public/images/' + file);
        });
        fs.writeFileSync('processed_data.json', JSON.stringify(proc));

    });

});
