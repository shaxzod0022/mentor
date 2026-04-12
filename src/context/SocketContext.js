"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import authService from "@/services/auth.service";
import notificationRepository from "@/repositories/notification.repository";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) return;

    // Fetch initial notifications
    const fetchInitialData = async () => {
      try {
        const data = await notificationRepository.getAll();
        const unread = await notificationRepository.getUnreadCount();
        setNotifications(data);
        setUnreadCount(unread.count);
      } catch (err) {
        console.error("Initial notifications fetch error:", err);
      }
    };
    fetchInitialData();

    const newSocket = io("http://localhost:8080"); // Adjust for production
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("authenticate", user._id);
    });

    newSocket.on("NOTIFICATION_RECEIVED", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => newSocket.close();
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationRepository.markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationRepository.markAllAsRead();
      setUnreadCount(0);
      setNotifications([]); // Clear history from dropdown as requested
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
        markAsRead,
        markAllRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
