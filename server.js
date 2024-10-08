const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema y el modelo
const personSchema = new mongoose.Schema({
    name: String,
    number: Number
});
const Person = mongoose.model('Person', personSchema);

// Configurar el middleware para manejar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar el middleware para servir archivos estáticos
app.use(express.static('.'));

// Ruta para obtener los datos
app.get('/data', async (req, res) => {
    try {
        const people = await Person.find().sort({ name: 1 });
        res.json(people);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
});

// Ruta para agregar un nuevo dato
app.post('/data', async (req, res) => {
    const { name, number } = req.body;
    try {
        const newPerson = new Person({ name, number });
        await newPerson.save();
        res.status(201).json(newPerson);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el registro' });
    }
});

// Ruta para actualizar un dato
app.put('/data/:id', async (req, res) => {
    const { id } = req.params;
    const { name, number } = req.body;
    try {
        const updatedPerson = await Person.findByIdAndUpdate(id, { name, number }, { new: true });
        res.json(updatedPerson);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
});

// Ruta para eliminar un dato
app.delete('/data/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Person.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
