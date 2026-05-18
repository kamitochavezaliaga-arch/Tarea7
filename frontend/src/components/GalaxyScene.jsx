import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function GalaxyScene({ userData }) {

    const mountRef = useRef(null)

    const [mostrarCarta, setMostrarCarta] = useState(false)

    useEffect(() => {

        const currentMount = mountRef.current

        /* ================= ESCENA ================= */

        const scene = new THREE.Scene()

        /* ================= TAMAÑOS ================= */

        let sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        /* ================= CAMARA ================= */

        const camera = new THREE.PerspectiveCamera(
            75,
            sizes.width / sizes.height,
            0.1,
            1000
        )

        camera.position.set(10, 10, 20)

        scene.add(camera)

        /* ================= RENDER ================= */

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })

        renderer.setSize(sizes.width, sizes.height)

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        currentMount.appendChild(renderer.domElement)

        /* ================= CONTROLES ================= */

        const controls = new OrbitControls(
            camera,
            renderer.domElement
        )

        controls.enableDamping = true

        /* ================= ESTRELLAS ================= */

        const starsGeometry = new THREE.BufferGeometry()

        const starCount = 5000

        const starPositions = new Float32Array(starCount * 3)

        for (let i = 0; i < starCount * 3; i++) {

            starPositions[i] = (Math.random() - 0.5) * 500
        }

        starsGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(starPositions, 3)
        )

        const starsMaterial = new THREE.PointsMaterial({
            color: '#ffffff',
            size: 0.7,
            transparent: true
        })

        const stars = new THREE.Points(
            starsGeometry,
            starsMaterial
        )

        scene.add(stars)

        /* ================= GALAXIA ================= */

        const galaxyGeometry = new THREE.BufferGeometry()

        const galaxyCount = 80000

        const galaxyPositions = new Float32Array(galaxyCount * 3)

        const galaxyColors = new Float32Array(galaxyCount * 3)

        const insideColor = new THREE.Color('#ff1493')

        const outsideColor = new THREE.Color('#3000ff')

        for (let i = 0; i < galaxyCount; i++) {

            const i3 = i * 3

            const radius = Math.random() * 6

            const spinAngle = radius * 1

            const branchAngle =
                ((i % 4) / 4) * Math.PI * 2

            const randomX =
                (Math.random() - 0.5) * 0.2 * radius

            const randomY =
                (Math.random() - 0.5) * 0.2 * radius

            const randomZ =
                (Math.random() - 0.5) * 0.2 * radius

            galaxyPositions[i3] =
                Math.cos(branchAngle + spinAngle) *
                radius +
                randomX

            galaxyPositions[i3 + 1] = randomY

            galaxyPositions[i3 + 2] =
                Math.sin(branchAngle + spinAngle) *
                radius +
                randomZ

            const mixedColor = insideColor
                .clone()
                .lerp(outsideColor, radius / 6)

            galaxyColors[i3] = mixedColor.r
            galaxyColors[i3 + 1] = mixedColor.g
            galaxyColors[i3 + 2] = mixedColor.b
        }

        galaxyGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(galaxyPositions, 3)
        )

        galaxyGeometry.setAttribute(
            'color',
            new THREE.BufferAttribute(galaxyColors, 3)
        )

        const galaxyMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        const galaxy = new THREE.Points(
            galaxyGeometry,
            galaxyMaterial
        )

        scene.add(galaxy)

        /* ================= CORAZON ================= */

        const heartGeometry = new THREE.BufferGeometry()

        const heartPositions = []

        const heartColors = []

        for (let i = 0; i < 4000; i++) {

            const t = Math.random() * Math.PI * 2

            const s = Math.random() * 0.6 + 0.4

            let x = 16 * Math.pow(Math.sin(t), 3)

            let y =
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t)

            let z = (Math.random() - 0.5) * 1

            x *= s * 0.15
            y *= s * 0.15
            z *= s * 0.15

            heartPositions.push(x, y + 2, z)

            const color = new THREE.Color()

            color.setHSL(
                0.95 + Math.random() * 0.05,
                1,
                0.65
            )

            heartColors.push(
                color.r,
                color.g,
                color.b
            )
        }

        heartGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(
                heartPositions,
                3
            )
        )

        heartGeometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(
                heartColors,
                3
            )
        )

        const heartMaterial = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true
        })

        const heart = new THREE.Points(
            heartGeometry,
            heartMaterial
        )

        scene.add(heart)

        /* ================= LUCES ================= */

        const ambientLight = new THREE.AmbientLight(
            '#ffffff',
            2
        )

        scene.add(ambientLight)

        /* ================= CLICK ================= */

        const raycaster = new THREE.Raycaster()

        const mouse = new THREE.Vector2()

        const handleClick = (event) => {

            mouse.x =
                (event.clientX / window.innerWidth) * 2 - 1

            mouse.y =
                -(event.clientY / window.innerHeight) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            const intersects =
                raycaster.intersectObject(heart)

            if (intersects.length > 0) {

                setMostrarCarta(true)
            }
        }

        window.addEventListener('click', handleClick)

        /* ================= ANIMACION ================= */

        const clock = new THREE.Clock()

        let animationId

        const animate = () => {

            animationId = requestAnimationFrame(animate)

            const elapsed = clock.getElapsedTime()

            galaxy.rotation.y += 0.001

            heart.rotation.y += 0.003

            heart.rotation.z =
                Math.sin(elapsed * 1.7) * 0.08

            controls.update()

            renderer.render(scene, camera)
        }

        animate()

        /* ================= RESIZE ================= */

        const handleResize = () => {

            sizes = {
                width: window.innerWidth,
                height: window.innerHeight
            }

            camera.aspect =
                sizes.width / sizes.height

            camera.updateProjectionMatrix()

            renderer.setSize(
                sizes.width,
                sizes.height
            )
        }

        window.addEventListener(
            'resize',
            handleResize
        )

        /* ================= CLEAN ================= */

        return () => {

            cancelAnimationFrame(animationId)

            window.removeEventListener(
                'resize',
                handleResize
            )

            window.removeEventListener(
                'click',
                handleClick
            )

            controls.dispose()

            renderer.dispose()

            if (
                currentMount &&
                renderer.domElement &&
                currentMount.contains(renderer.domElement)
            ) {
                currentMount.removeChild(renderer.domElement)
            }
        }

    }, [])

    return (

        <div className="w-full h-screen bg-black overflow-hidden relative">

            {/* TEXTO */}

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center">

                <h1 className="text-pink-400 text-5xl font-bold drop-shadow-lg">

                    Con mucho cariño para ✨

                </h1>

                <p className="text-white text-2xl mt-4">

                    {userData?.nombres}

                </p>

                <p className="text-pink-300 text-lg">

                    {userData?.apellidoPaterno} {userData?.apellidoMaterno}

                </p>

                <p className="text-pink-500 mt-4 animate-pulse">

                    💖 Toca el corazón 💖

                </p>

            </div>

            {/* ESCENA */}

            <div
                ref={mountRef}
                className="w-full h-full"
            />

            {/* MODAL */}

            {
                mostrarCarta && (

                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

                        <div className="bg-pink-100 p-8 rounded-3xl max-w-lg shadow-2xl border-2 border-pink-300 text-center">

                            <h2 className="text-3xl font-bold text-pink-600 mb-4">

                                💌 Para ti

                            </h2>

                            <p className="text-pink-700 leading-8 text-lg">

                                {userData?.nombres},

                                desde que existes,
                                el universo brilla diferente ✨

                            </p>

                            <button
                                onClick={() => setMostrarCarta(false)}
                                className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full transition-all"
                            >

                                Cerrar

                            </button>

                        </div>

                    </div>
                )
            }

        </div>
    )
}

export default GalaxyScene