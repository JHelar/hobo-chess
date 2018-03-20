const sass = require('node-sass');
const fs = require('fs');

sass.render({
    file: './styles/styles.scss'
}, (err, result) => {
    if(!err){
        fs.writeFile('./dist/styles.css', result.css, err => {
            if(!err){
                console.info('styles.css written');
            }else{
                console.error(err)
            }
        })
    }else{
        console.error(err)
    }
})