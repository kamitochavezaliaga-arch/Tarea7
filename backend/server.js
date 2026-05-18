require('dotenv').config()

const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/dni', async (req, res) => {

    try {

        const { dni } = req.body

        if (!dni || dni.length !== 8) {

            return res.status(400).json({
                success: false,
                message: 'DNI inválido'
            })
        }

        const response = await axios.post(

            'https://apiperu.dev/api/dni',

            {
                dni: dni
            },

            {
                headers: {
                    Authorization: `Bearer ${process.env.APIPERU_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        res.json({
            success: true,
            data: response.data.data
        })

    } catch (error) {

        console.log('ERROR API:')
        console.log(error.response?.data || error.message)

        res.status(500).json({
            success: false,
            message: 'Error al consultar DNI'
        })
    }
})

app.listen(3000, () => {

    console.log('Servidor backend activo 🚀')
    console.log('http://localhost:3000')
})