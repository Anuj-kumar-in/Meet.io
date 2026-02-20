import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function useSocket(expertId, onSlotBooked, onSlotFreed) {
    const socketRef = useRef(null);
    const bookedHandlerRef = useRef(onSlotBooked);
    const freedHandlerRef = useRef(onSlotFreed);

    // Update refs when handlers change so we always call the latest one
    useEffect(() => {
        bookedHandlerRef.current = onSlotBooked;
        freedHandlerRef.current = onSlotFreed;
    }, [onSlotBooked, onSlotFreed]);

    useEffect(() => {
        if (!expertId) return;

        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            reconnectionAttempts: 5,
        });

        socketRef.current.on("connect", () => {
            // console.log("Connected to socket");
            socketRef.current.emit("join_expert_room", expertId);
        });

        socketRef.current.on("slot_booked", (data) => {
            if (bookedHandlerRef.current) {
                bookedHandlerRef.current(data);
            }
        });

        socketRef.current.on("slot_freed", (data) => {
            if (freedHandlerRef.current) {
                freedHandlerRef.current(data);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit("leave_expert_room", expertId);
                socketRef.current.disconnect();
            }
        };
    }, [expertId]);

    return socketRef;
}
