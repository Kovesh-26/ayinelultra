export class ChatRoom {
  state: DurableObjectState
  clients: Set<WebSocket>
  constructor(state: DurableObjectState, env: any) {
    this.state = state
    this.clients = new Set()
  }
  async fetch(request: Request) {
    const upgradeHeader = request.headers.get('Upgrade')
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 })
    }
    const pair = new WebSocketPair()
    const [client, server] = Object.values(pair) as [WebSocket, WebSocket]
    server.accept()
    this.clients.add(server)
    server.addEventListener('message', (evt: any) => {
      for (const c of this.clients) try { c.send(evt.data) } catch {}
    })
    server.addEventListener('close', () => this.clients.delete(server))
    return new Response(null, { status: 101, webSocket: client })
  }
}
