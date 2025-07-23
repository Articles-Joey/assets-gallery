import { useEffect, useRef, useState, useLayoutEffect, useMemo } from 'react';

import { useAssetGalleryStore } from '@/hooks/useAssetGalleryStore';

import { useControlsStore } from '@/hooks/useGameStore';

import ArticlesButton from '@/components/UI/Button';

export default function TouchControls(props) {

    const {
        touchControlsEnabled,
    } = props;

    const [nippleCreated, setNippleCreated] = useState(false)

    const [nStart, setnStart] = useState(false)
    const [nDirection, setnDirection] = useState(false)

    const {
        touchControls, setTouchControls
    } = useControlsStore()

    const {
        ref,
        // api, 
        // position 
    } = useAssetGalleryStore();

    const [movementInterval, setMovementInterval] = useState(null);

    useEffect(() => {
        // Start the movement interval when nStart is true
        if (nStart) {
            const intervalId = setInterval(() => {
                console.log("Checking direction")

                const position = useAssetGalleryStore.getState().position;
                const api = useAssetGalleryStore.getState().api;

                console.log("zustPos", position)

                // api.position.set(position[0], position[1], position[2] + 0.5);

                // return 

                if (nDirection === 'up') {
                    // Move forward (decrease Z position)
                    const forwardPosition = position[2] - 0.2;
                    api.position.set(position[0], position[1], forwardPosition);
                }
                else if (nDirection === 'down') {
                    // Move backward (increase Z position)
                    const backwardPosition = position[2] + 0.2;
                    api.position.set(position[0], position[1], backwardPosition);
                }
                // else if (nDirection === 'left') {
                //     // Move left (decrease X position)
                //     const leftPosition = position[0] - 0.1;
                //     api.position.set(leftPosition, position[1], position[2]);
                // } 
                // else if (nDirection === 'right') {
                //     // Move right (increase X position)
                //     const rightPosition = position[0] + 0.1;
                //     api.position.set(rightPosition, position[1], position[2]);
                // }
            }, 100); // Update every 100ms

            setMovementInterval(intervalId); // Save the interval ID for cleanup
        } else if (movementInterval) {
            // Clean up the interval if nStart becomes false
            clearInterval(movementInterval);
            setMovementInterval(null); // Reset the interval ID
        }

        // Clean up the interval on component unmount or when nStart changes
        return () => {
            if (movementInterval) {
                clearInterval(movementInterval);
            }
        };
    }, [nStart, nDirection]);

    function startNipple() {

        // console.log("n", nipplejs)

        // return

        var options = {
            zone: document.getElementById('zone_joystick'),
            // threshold: 0.5
            // lockX: true,
        };

        // var manager = nipplejs.create(options);
        var manager = require('nipplejs').create(options);

        setNippleCreated(true)

        let dragDistance
        let dragDirection

        manager.on('start end', function (evt, data) {
            // dump(evt.type);
            // debug(data);
            console.log("1", evt.type)

            if (evt.type == 'start') {
                setnStart(true)
            } else if (evt.type == 'end') {
                setnStart(false)
                setnDirection(false)
                dragDistance = 0
                dragDirection = false
                setTouchControls({
                    ...touchControls,
                    left: false,
                    right: false
                })
            }

        })
            .on('move', function (evt, data) {

                // debug(data);
                dragDistance = data.distance
                console.log("2", dragDistance)

                if (dragDistance > 15 && dragDirection) {

                    if (dragDirection == 'left') setTouchControls({
                        ...touchControls,
                        left: true,
                        right: false
                    })

                    if (dragDirection == 'right') setTouchControls({
                        ...touchControls,
                        left: false,
                        right: true
                    })

                } else {
                    setTouchControls({
                        ...touchControls,
                        left: false,
                        right: false
                    })
                }

            })
            .on(' ' +
                'dir:up plain:up dir:left plain:left dir:down ' +
                'plain:down dir:right plain:right',
                async function (evt, data) {

                    if (evt.type == 'move') {
                        dragDistance = data.distance
                    }

                    // dump(evt.type);
                    console.log("3", evt.type, dragDistance)

                    // api.applyImpulse([0, 5, 0], [0, 0, 0]);
                    // const cannonPosition = await api.position

                    // console.log("cannonPosition", cannonPosition)
                    // console.log("cannonPositionTest",
                    //     api.position.subscribe((p) => {
                    //         console.log(p)
                    //     })
                    // )

                    const position = useAssetGalleryStore.getState().position;
                    const api = useAssetGalleryStore.getState().api;

                    console.log("zustPos", position)

                    // const currentPosition = ref.current?.position.toArray(); // Convert to array [x, y, z]
                    // console.log('Position from ref:', currentPosition);

                    // api.position.set(position[0], position[1], position[2] + 0.5);

                    if (evt.type == 'dir:up') {
                        setnDirection('up')
                    }

                    if (evt.type == 'dir:down') {
                        setnDirection('down')
                    }

                    if (evt.type == 'dir:left') {
                        dragDirection = 'left'
                        // setnDirection('left')
                        // setTouchControls({
                        //     ...touchControls,
                        //     left: true,
                        //     right: false
                        // })
                    }

                    if (evt.type == 'dir:right') {
                        dragDirection = 'right'
                        // setnDirection('right')
                        // setTouchControls({
                        //     ...touchControls,
                        //     left: false,
                        //     right: true
                        // })
                    }

                }
            )
            .on('pressure', function (evt, data) {
                // debug({
                //   pressure: data
                // });
            });
    }

    useEffect(() => {

        if (!nippleCreated) {
            console.log("Load nipple")
            startNipple()
        }

    }, []);

    return (
        <div className={`touch-controls-area ${!touchControlsEnabled && 'd-none'}`}>

            <div className='d-flex'>

                <div>
                    {/* <ArticlesButton
                    onClick={() => {
                        setTouchControls({
                            left: true
                        })
                    }}
                >
                    Left
                </ArticlesButton>
                <ArticlesButton
                    onClick={() => {
                        setTouchControls({
                            right: true
                        })
                    }}
                >
                    Right
                </ArticlesButton> */}
                    <div style={{
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'black'
                    }} id="zone_joystick"></div>
                </div>

                <div className='ms-2'>

                    <ArticlesButton
                        small
                        onClick={() => {
                            // api.velocity.set(direction.x, vel.current[1], direction.z)
                            // api.applyImpulse([0, 5, 0], [0, 0, 0]);
                            console.log("Button Press")
                            const api = useAssetGalleryStore.getState().api;
                            api.position.set(0, 5, 10);
                        }}
                    >
                        Jump
                    </ArticlesButton>

                    <div className='d-none d-lg-block'>
                        <div>Active: {nStart ? 'True' : 'False'}</div>
                        <div>Direction: {nDirection ? nDirection : 'None'}</div>
                        <div>Touch: {JSON.stringify(touchControls)}</div>
                    </div>

                </div>

            </div>

            {/* <JumpButton /> */}

        </div>
    )
}