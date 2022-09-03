const express = require('express')
const path = require('path')
const app = express();
const PORT = process.env.PORT || 8000
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');


const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const data = await fs.promises.readdir(path.join(__dirname, 'public'));
        res.json([...data])
    } catch (err) {
        res.send(err.message)
    }
})



app.get('/read/:filename', async (req, res) => {

    const filename = req.params.filename;
     try{    
    const data = await fs.promises.readdir(path.join(__dirname, 'public'));
    console.log("data==>", data);
    if (data.includes(`${filename}`)) {
        fs.readFile(path.join(__dirname, 'public', `${filename}`), 'utf8', (err, data) => {
            if (err) throw err;

            res.send(data)
        })
    }
}catch(err){
    res.send(err.message)
}

})

app.get('/createFile', urlencodedParser, async (req, res) => {
    const fileName = req.query.filename
   try{
    const data = await fs.promises.readdir(path.join(__dirname, 'public'));
    if (!data.includes(`${fileName}.txt`)) {
        fs.writeFile(`public/${fileName}.txt`, '', (err) => {
            if (err) throw err;
            res.send(`created new File ${fileName}`)
        })
    } else {
        res.send("This named File already exist")
    }
}catch(err){
    res.send(err.message)
}
})

app.post('/write/:filename', (req, res) => {
    const { filename } = req.params

    const { data } = req.body

    fs.writeFile(path.join(__dirname, "public", filename), data, (err) => {
        if (err) res.send("Not write")
        res.send(data)
    })


})

app.delete('/:filename', (req, res) => {
    const { filename } = req.params;

    fs.unlink(path.join(__dirname, 'public', filename), function (err) {
        if (err) throw err;
        console.log('File deleted!');
        res.send("deleted")
    });
})

app.listen(PORT, () => console.log("listening on PORT: ", PORT))

