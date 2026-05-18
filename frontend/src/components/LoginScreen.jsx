import { useState } from 'react'
import api from '../services/api'

function LoginScreen({ setUserData }) {

    const [dni, setDni] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async () => {

        if (dni.length !== 8) {

            setError('Ingrese un DNI válido')
            return
        }

        try {

            setLoading(true)
            setError('')

            const response = await api.post('/api/dni', {
                dni
            })

            setUserData(response.data.data)

        } catch (err) {

            setError('No se pudo consultar el DNI')

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

            {/* Fondo galaxia */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950 to-black opacity-90" />

            {/* Card */}
            <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-pink-500/20 p-10 rounded-3xl shadow-2xl w-[90%] max-w-md">

                <h1 className="text-4xl font-bold text-center text-pink-400 mb-3">
                    Galaxy Love
                </h1>

                <p className="text-center text-gray-300 mb-8">
                    Ingresa tu DNI para entrar ✨
                </p>

                <input
                    type="text"
                    maxLength={8}
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ingrese su DNI"
                    className="w-full p-4 rounded-xl bg-black/40 border border-pink-500/30 text-white outline-none"
                />

                {error && (

                    <p className="text-red-400 mt-3 text-sm">
                        {error}
                    </p>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full mt-6 bg-pink-600 hover:bg-pink-700 transition-all duration-300 text-white font-bold py-4 rounded-xl"
                >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>

            </div>

        </div>
    )
}

export default LoginScreen