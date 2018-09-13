import io from 'socket.io-client'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'

const socket = io(window.location.host, {
  transports: ['websocket'],
})

const app = feathers()
app.configure(socketio(socket))

export default app
