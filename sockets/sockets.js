const {io} = require('../index');
const Bands = require ('../models/bands')
const Band = require ('../models/band')
const bands = new Bands();

bands.addBand( new Band('Quenn'))
bands.addBand( new Band('bon jovi'))
bands.addBand( new Band('metalica'))

io.on('connection', client=>{
    console.log('Cliente conectado')
    client.emit('active-bands',bands.getBands())

    client.on('disconnect', () =>{ 
        console.log('Cliente desconectado')
    });

    client.on('mensaje',(payload)=>{
        console.log('mensaje',payload);
        io.emit('mensaje',{admin:'nuevo mensaje'});
    });

    client.on('nuevo-mensaje', (payload)=>{
        //io.emit('nuevo-mensaje','hEYY');
        client.broadcast.emit('nuevo-mensaje','hEYY');
    })
    client.on('vote-band', (payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands())
    })
    client.on('add-band', (payload)=>{
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('add-bands',bands.getBands())
    })
    client.on('delete-band', (payload)=>{
       
        bands.deleteBand(payload.id);
        io.emit('delete-band',bands.getBands())
    })
});