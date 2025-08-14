import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
    const [duration, setDuration] = useState(20);
    const [time, setTime] = useState(20);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [loop, setLoop] = useState(false);
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const alarmRef = useRef(null);

    useEffect(() => {
        let timer;
        if (running && !paused && time > 0) {
            timer = setInterval(() => setTime((t) => t - 1), 1000);
        } else if (running && !paused && time === 0) {
            setPaused(true);

            if (audioUnlocked) {
                alarmRef.current?.play().catch(err =>
                    console.warn("Audio playback blocked:", err)
                );
            }

            setTimeout(() => {
                alarmRef.current?.pause();
                alarmRef.current.currentTime = 0;
                if (loop) {
                    setTime(duration);
                    setPaused(false);
                } else {
                    setRunning(false);
                }
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [running, paused, time, loop, duration, audioUnlocked]);

    const formatTime = (seconds) =>
        `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? "0" : ""}${seconds % 60}`;

    // Unlock audio context on first user interaction
    const unlockAudio = () => {
        if (!audioUnlocked) {
            alarmRef.current
                ?.play()
                .then(() => {
                    alarmRef.current.pause();
                    alarmRef.current.currentTime = 0;
                    setAudioUnlocked(true);
                    console.log("Audio unlocked");
                })
                .catch((err) => console.warn("Audio unlock failed:", err));
        }
    };

    return (
        <div
            className="app"
            onClick={unlockAudio} // any first click unlocks audio
        >
            <h1 className="header">♠ Rummy Timer ♥</h1>

            <div className="card">
                <label className="label">Seconds per round</label>
                <input
                    className="input"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    disabled={running}
                />

                <div className="timer">{formatTime(time)}</div>

                <div className="buttons">
                    {!running && (
                        <button
                            className="primary"
                            onClick={() => {
                                setTime(duration);
                                setLoop(true);
                                setRunning(true);
                                setPaused(false);
                            }}
                        >
                            Start
                        </button>
                    )}
                    {running && !paused && (
                        <button className="secondary" onClick={() => setPaused(true)}>
                            Pause
                        </button>
                    )}
                    {running && paused && (
                        <button className="secondary" onClick={() => setPaused(false)}>
                            Resume
                        </button>
                    )}
                    <button
                        className="danger"
                        onClick={() => {
                            setLoop(false);
                            setRunning(false);
                            setPaused(false);
                        }}
                    >
                        Stop
                    </button>
                </div>

                <p className="hint">Your timer will reset automatically when looping</p>
            </div>

            {/* Corrected audio path usage */}
            <audio
                ref={alarmRef}
                src={`${import.meta.env.BASE_URL}alarm.mp3`}
                preload="auto"
            ></audio>
        </div>
    );
}
