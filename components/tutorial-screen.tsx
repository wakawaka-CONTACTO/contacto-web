"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {motion, AnimatePresence, PanInfo} from "framer-motion"

const tutorialSteps = [
    {
        id: "start",
        content: (
            <motion.div
                initial={{scale: 0.8, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{duration: 0.5}}
                className="text-center"
            >
                <h1 className="text-6xl md:text-8xl font-mono text-white"
                    style={{fontFamily: "Press Start 2P, monospace"}}>
                    LET&#39;S
                </h1>
                <h1
                    className="text-6xl md:text-8xl font-mono text-white mt-4"
                    style={{fontFamily: "Press Start 2P, monospace"}}
                >
                    START
                </h1>
            </motion.div>
        ),
    },
    {
        id: "swipe-tutorial",
        content: (
            <div className="relative w-full aspect-[3/4] bg-[#c8c8c8]">
                <motion.div
                    initial={{"x": 0, "rotate": 0}}
                    animate={{
                        x: [0, 200, 0, -200, 0],
                        rotate: [0, 15, 0, -15, 0],
                        opacity: [1, 0, 1, 0, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 1,
                        times: [0, 0.3, 0.5, 0.8, 1],
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-white"
                >
                    <div className="text-center">
                        <motion.div
                            animate={{
                                opacity: [1, 1, 0, 1, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 1,
                                times: [0, 0.3, 0.5, 0.8, 1],
                            }}
                        >
                            <p className="text-2xl font-mono text-white mb-4">SWIPE</p>
                            <motion.p
                                animate={{
                                    opacity: [1, 1, 0, 0, 1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 1,
                                    times: [0, 0.3, 0.5, 0.8, 1],
                                }}
                                className="text-4xl font-mono text-white"
                            >
                                RIGHT
                            </motion.p>
                            <motion.p
                                animate={{
                                    opacity: [0, 0, 0, 1, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 1,
                                    times: [0, 0.3, 0.5, 0.8, 1],
                                }}
                                className="text-4xl font-mono text-white"
                            >
                                LEFT
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        ),
    },
    {
        id: "click-areas",
        content: (
            <div className="relative w-full aspect-[3/4]">
                <div className="absolute inset-0 flex">
                    <motion.div
                        className="w-1/2 h-full bg-black flex items-center justify-center cursor-pointer"
                        whileHover={{backgroundColor: "#ff4444"}}
                    >
                        <div className="text-center">
                            <p className="text-white font-mono mb-2">Left Click</p>
                            <p className="text-sm text-gray-400 font-mono">PREVIOUS PICTURE</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className="w-1/2 h-full bg-black flex items-center justify-center cursor-pointer"
                        whileHover={{backgroundColor: "#44ff44"}}
                    >
                        <div className="text-center">
                            <p className="text-white font-mono mb-2">Right Click</p>
                            <p className="text-sm text-gray-400 font-mono">NEXT PICTURE</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        ),
    },
    {
        id: "interaction-demo",
        content: (
            <div className="relative w-full aspect-[3/4]">
                <div className="absolute inset-0">
                    <div className="relative h-full">
                        <div className="absolute bottom-0 inset-x-0 flex justify-between p-4 z-10">
                            <motion.button
                                className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl"
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                            >
                                ✕
                            </motion.button>
                            <motion.button
                                className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl"
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                            >
                                O
                            </motion.button>
                        </div>
                        <div
                            className="absolute inset-0 flex items-center justify-center text-white font-mono text-center">
                            <div>
                                <p className="mb-4">Click buttons or swipe</p>
                                <p>✕ = Nope</p>
                                <p>O = I like it!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
]

export function TutorialScreen() {
    const [currentStep, setCurrentStep] = useState(0)
    const router = useRouter()

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep((prev) => prev + 1)
        } else {
            router.push("/main")
        }
    }

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 100) {
            handleNext()
        }
    }

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <div className="bg-[#2ea7e0] p-4">
                <h1 className="text-center text-white font-mono uppercase">View Profile</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{opacity: 0, x: 100}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -100}}
                        transition={{type: "spring", stiffness: 300, damping: 30}}
                        drag="x"
                        dragConstraints={{left: 0, right: 0}}
                        dragElastic={0.8}
                        onDragEnd={handleDragEnd}
                        className="w-full max-w-md"
                    >
                        {tutorialSteps[currentStep].content}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-center space-x-2">
                    {tutorialSteps.map((_, index) => (
                        <div key={index}
                             className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-white" : "bg-gray-600"}`}/>
                    ))}
                </div>
            </div>

            <div className="p-4 flex justify-between items-center border-t border-gray-800">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-mono text-white">CT</span>
                </div>
                <div className="flex space-x-4">
                    <button className="text-white">📷</button>
                    <button className="text-white">💾</button>
                    <button className="text-white">☰</button>
                </div>
            </div>
        </div>
    )
}