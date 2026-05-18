import { useState } from 'react'

import LoginScreen from './components/LoginScreen'
import GalaxyScene from './components/GalaxyScene'

function App() {

    const [userData, setUserData] = useState(null)

    return (

        <>
            {
                !userData
                    ? <LoginScreen setUserData={setUserData} />
                    : <GalaxyScene userData={userData} />
            }
        </>
    )
}

export default App