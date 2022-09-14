import { io } from 'socket.io-client';

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const socket = io(SERVER_URL);

export const sendData = (userId: string, guess: string) => {
  const payload = {
    userId,
    guess,
  };

  socket.emit('guess', payload);
};

export default socket;