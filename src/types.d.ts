import type { Socket as NetSocket } from "node:net"
import type { Server as HTTPServer } from "node:http"

interface GlobalSocketExtension {
  htmlServerResponse?: {
    socket?: NetSocket & {
      server?: HTTPServer
    }
  }
}

declare global {
  var htmlServerResponse: GlobalSocketExtension["htmlServerResponse"]
}
