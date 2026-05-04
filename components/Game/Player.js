import { useFrame, useThree } from "@react-three/fiber"
import { useSphere } from "@react-three/cannon"
import { useEffect, useRef, useState } from "react"
import { Vector3, Raycaster } from "three"
import { MathUtils } from 'three'
import { useKeyboard } from "@/hooks/useKeyboard"

import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';
import SpacesuitModel from '@/components/Models/Spacesuit';
import { useStore } from "@/hooks/useStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useSearchParams } from "next/navigation"

const { degToRad } = MathUtils
const JUMP_FORCE = 4;
const SPEED = 4;
const THIRD_PERSON_MIN_DISTANCE = 2;
const THIRD_PERSON_MAX_DISTANCE = 20;
const THIRD_PERSON_DEFAULT_DISTANCE = 6;
const THIRD_PERSON_HEIGHT = 0.5;
const GROUND_Y = -1;
const CAMERA_GROUND_OFFSET = 0.3;
const SCROLL_SENSITIVITY = 0.5;

export const Player = () => {
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift, crouch, cameraView } = useKeyboard()

    const [currentAnimation, setCurrentAnimation] = useState('Idle')
    const modelRef = useRef()
    const prevCameraView = useRef(false)
    const cameraDistanceRef = useRef(THIRD_PERSON_DEFAULT_DISTANCE)

    const isThirdPerson = useAssetGalleryStore(state => state.isThirdPerson)
    const setIsThirdPerson = useAssetGalleryStore(state => state.setIsThirdPerson)
    const cameraDistance = useAssetGalleryStore(state => state.cameraDistance)
    const setCameraDistance = useAssetGalleryStore(state => state.setCameraDistance)
    const setPlayerLocation = useAssetGalleryStore(state => state.setPlayerLocation)
    const lastLocationRef = useRef(new Vector3())
    const isThirdPersonRef = useRef(isThirdPerson)
    useEffect(() => {
        isThirdPersonRef.current = isThirdPerson
    }, [isThirdPerson])

    const socket = useSocketStore(state => state.socket)
    const connected = useSocketStore(state => state.connected)

    // Sync store cameraDistance (changed by menu slider) into the ref used by useFrame
    useEffect(() => {
        cameraDistanceRef.current = cameraDistance
    }, [cameraDistance])

    const controlType = useStore(state => state.controlType)
    const touchTarget = useAssetGalleryStore(state => state.touchTarget)
    const setTouchTarget = useAssetGalleryStore(state => state.setTouchTarget)
    const touchCameraYaw = useAssetGalleryStore(state => state.touchCameraYaw)
    const touchCameraPitch = useAssetGalleryStore(state => state.touchCameraPitch)
    const jumpRequested = useAssetGalleryStore(state => state.jumpRequested)
    const clearJump = useAssetGalleryStore(state => state.clearJump)

    const { camera } = useThree()

    const [ref, api] = useSphere(() => ({
        mass: 1,
        type: 'Dynamic',
        position: [0, 1, 0],
        onCollide: () => { canJump.current = true },
    }))

    const setPlayer = useAssetGalleryStore((state) => state.setPlayer);
    const setPosition = useAssetGalleryStore((state) => state.setPosition);
    const position = useAssetGalleryStore((state) => state.position);

    const lastSentPosRef = useRef({ x: 0, y: 0, z: 0, rotation: 0, action: '' })

    useEffect(() => {
        // Save ref and api to the store
        setPlayer(ref, api);

        // Subscribe to the position updates
        const unsubscribe = api.position.subscribe((position) => {
            setPosition([...position]); // Update position in the store
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [ref, api, setPlayer, setPosition, currentAnimation]);

    const vel = useRef([0, 0, 0])
    const canJump = useRef(true)
    useEffect(() => {
        api.velocity.subscribe((v) => vel.current = v)
    }, [api.velocity])

    const pos = useRef([0, 0, 0])

    useEffect(() => {

        api.position.subscribe((p) => pos.current = p)

    }, [api.position])

    useEffect(() => {
        console.log("Shift", shift)
    }, [shift])

    // Toggle third person view with V key (only on key press, not release)
    useEffect(() => {
        if (cameraView && !prevCameraView.current) {
            setIsThirdPerson(!isThirdPerson)
        }
        prevCameraView.current = cameraView
    }, [cameraView, isThirdPerson, setIsThirdPerson])

    // Scroll wheel to adjust camera distance
    useEffect(() => {
        const handleWheel = (e) => {
            cameraDistanceRef.current = Math.min(
                THIRD_PERSON_MAX_DISTANCE,
                Math.max(
                    THIRD_PERSON_MIN_DISTANCE,
                    cameraDistanceRef.current + e.deltaY * SCROLL_SENSITIVITY * 0.01
                )
            )
            setCameraDistance(cameraDistanceRef.current)
        }
        document.addEventListener('wheel', handleWheel, { passive: true })
        return () => document.removeEventListener('wheel', handleWheel)
    }, [setCameraDistance])

    // useEffect(() => {
    // 	console.log("pos", pos.current)
    // }, [pos.current])

    useFrame(() => {

        // Touch mode: tap-to-move + drag-to-look (FP and TP)
        if (controlType === "Touch") {
            // Apply drag-look angles to camera rotation so the TP orbit logic below can reuse them
            camera.rotation.order = 'YXZ';
            camera.rotation.y = touchCameraYaw;
            camera.rotation.x = touchCameraPitch;

            if (isThirdPerson) {
                const playerCenter = new Vector3(pos.current[0], pos.current[1] + THIRD_PERSON_HEIGHT, pos.current[2]);
                const forward = new Vector3(0, 0, -1).applyEuler(camera.rotation);
                let desiredDistance = cameraDistanceRef.current;
                const cameraPos = playerCenter.clone().sub(forward.clone().multiplyScalar(desiredDistance));
                const minY = GROUND_Y + CAMERA_GROUND_OFFSET;
                if (cameraPos.y < minY) {
                    const dir = forward.clone().negate().normalize();
                    if (dir.y < 0) {
                        const t = (playerCenter.y - minY) / -dir.y;
                        desiredDistance = Math.min(desiredDistance, t);
                    }
                    cameraPos.copy(playerCenter.clone().sub(forward.clone().multiplyScalar(desiredDistance)));
                    cameraPos.y = Math.max(cameraPos.y, minY);
                }
                camera.position.copy(cameraPos);
                camera.lookAt(playerCenter);
            } else {
                camera.position.set(pos.current[0], pos.current[1], pos.current[2]);
            }

            if (touchTarget) {
                const dx = touchTarget[0] - pos.current[0];
                const dz = touchTarget[2] - pos.current[2];
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist > 0.3) {
                    api.velocity.set((dx / dist) * SPEED, vel.current[1], (dz / dist) * SPEED);
                    setCurrentAnimation('Walk');
                } else {
                    api.velocity.set(0, vel.current[1], 0);
                    setTouchTarget(null);
                    setCurrentAnimation('Idle');
                }
            } else {
                api.velocity.set(0, vel.current[1], 0);
                setCurrentAnimation('Idle');
            }

            if (jumpRequested && canJump.current) {
                api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
                canJump.current = false;
                clearJump();
            }

            // Update model position in Touch mode
            if (modelRef.current) {
                modelRef.current.position.set(pos.current[0], pos.current[1] - 1, pos.current[2]);
                if (touchTarget) {
                    const dx = touchTarget[0] - pos.current[0];
                    const dz = touchTarget[2] - pos.current[2];
                    if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
                        modelRef.current.rotation.y = Math.atan2(dx, dz);
                    }
                }
            }

            return;
        }

        // Determine current animation based on movement state
        const isMoving = moveForward || moveBackward || moveLeft || moveRight
        const isRunning = isMoving && shift
        const isWalking = isMoving && !shift

        if (jump && Math.abs(vel.current[1]) > 0.05) {
            setCurrentAnimation('Jump')
        } else if (isRunning) {
            setCurrentAnimation('Run')
        } else if (isWalking) {
            setCurrentAnimation('Walk')
        } else {
            setCurrentAnimation('Idle')
        }

        // Update camera position
        if (isThirdPerson) {
            // Player center (target the camera looks at)
            const playerCenter = new Vector3(position[0], position[1] + THIRD_PERSON_HEIGHT, position[2])

            // Get camera's forward direction (where the player is looking)
            const forward = new Vector3(0, 0, -1).applyEuler(camera.rotation)

            // Desired camera position at full scroll distance
            let desiredDistance = cameraDistanceRef.current
            const cameraPos = playerCenter.clone().sub(forward.clone().multiplyScalar(desiredDistance))

            // Prevent camera from going below ground
            const minY = GROUND_Y + CAMERA_GROUND_OFFSET
            if (cameraPos.y < minY) {
                // Push camera closer to player until it clears the ground
                const dir = forward.clone().negate().normalize()
                if (dir.y < 0) {
                    // Calculate max distance before hitting ground
                    const t = (playerCenter.y - minY) / -dir.y
                    desiredDistance = Math.min(desiredDistance, t)
                }
                cameraPos.copy(playerCenter.clone().sub(forward.clone().multiplyScalar(desiredDistance)))
                cameraPos.y = Math.max(cameraPos.y, minY)
            }

            camera.position.copy(cameraPos)
            camera.lookAt(playerCenter)
        } else {
            // First-person camera: position at player's eyes
            camera.position.copy(
                new Vector3(
                    position[0],
                    // position[1] / (crouch ? 2 : 1),
                    position[1] - 0.15,
                    position[2]
                )
            )
        }

        // Update player model position and rotation
        if (modelRef.current) {
            modelRef.current.position.set(position[0], position[1] - 1, position[2])

            // Calculate model rotation based on movement direction
            if (isMoving) {
                const frontVector = new Vector3(
                    0,
                    0,
                    (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
                )
                const sideVector = new Vector3(
                    (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
                    0,
                    0
                )

                const moveDirection = new Vector3()
                moveDirection
                    .subVectors(frontVector, sideVector)
                    .normalize()
                    .applyEuler(camera.rotation)

                if (moveDirection.length() > 0) {
                    const targetRotation = Math.atan2(moveDirection.x, moveDirection.z)
                    modelRef.current.rotation.y = targetRotation
                }
            }
        }

        const direction = new Vector3()

        const frontVector = new Vector3(
            0,
            0,
            (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
        )

        const sideVector = new Vector3(
            (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
            0,
            0,
        )

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .applyEuler(camera.rotation)

        // Zero out Y and re-normalize so looking up/down doesn't slow horizontal movement
        direction.y = 0
        direction.normalize().multiplyScalar(SPEED * (shift ? 2 : 1))

        api.velocity.set(direction.x, vel.current[1], direction.z)

        // Only jump if grounded (canJump reset on collision)
        if (jump && canJump.current) {
            api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2])
            canJump.current = false
        }

        // Unified socket emit (TP uses model rotation, FP uses camera yaw)
        if (connected && socket) {
            const [px, py, pz] = pos.current
            let yaw
            if (isThirdPerson) {
                yaw = modelRef.current?.rotation.y || 0
            } else {
                // Project camera forward onto XZ plane and derive yaw with atan2,
                // matching the same formula used for the TP model rotation
                const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
                yaw = Math.atan2(forward.x, forward.z)
            }
            const last = lastSentPosRef.current
            const hasChanged =
                px.toFixed(2) !== last.x.toFixed(2) ||
                py.toFixed(2) !== last.y.toFixed(2) ||
                pz.toFixed(2) !== last.z.toFixed(2) ||
                yaw.toFixed(2) !== last.rotation.toFixed(2) ||
                currentAnimation !== last.action
            if (hasChanged) {
                socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:move`, {
                    server: server || 1,
                    x: px,
                    y: py,
                    z: pz,
                    action: currentAnimation,
                    rotation: [0, yaw, 0]
                })
                lastSentPosRef.current = { x: px, y: py, z: pz, rotation: yaw, action: currentAnimation }
            }
        }

        // const [posX, posY, posZ] = pos.current;
        // const newLocation = new Vector3(posX, posY, posZ)

        // setPlayerLocation(newLocation)

        // if (JSON.stringify(lastLocationRef.current) !== JSON.stringify(newLocation)) {
        //     // console.log(newLocation, lastLocationRef.current)
        //     setPlayerLocation(newLocation)

        //     if (connected) {
        //         socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:move`, {
        //             server: server || 1,
        //             x: newLocation.x,
        //             y: newLocation.y,
        //             z: newLocation.z,
        //             action: currentAnimation,
        //             rotation: [0, degToRad(modelRef.current?.rotation.y || 0), 0]
        //         })
        //     }

        //     lastLocationRef.current = newLocation
        // }

    })

    return (
        <>
            <mesh ref={ref}></mesh>

            <group ref={modelRef}>
                {isThirdPerson && (<SpacesuitModel
                    action={currentAnimation}
                    speed={shift ? 1.5 : 1}
                    scale={0.5}
                />)}
            </group>
            
        </>
    )
}