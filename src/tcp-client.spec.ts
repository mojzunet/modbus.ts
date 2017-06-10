/// <reference types="jasmine" />
import { Observable } from "./rx";
import * as pdu from "./pdu";
import { CONNECTION_ERROR, ITcpClientOptions, TcpClient } from "./tcp-client";
import { TcpMockServer } from "./tcp-server-mock";

function create(port = 502, namespace = 1): [TcpMockServer, TcpClient] {
  const server = new TcpMockServer(port, `mbtcps:${namespace}`);
  const options: ITcpClientOptions = { host: "localhost", port };
  const client = new TcpClient(options, `mbtcpc:${namespace}`);
  return [server, client];
}

describe("Modbus TCP Client", () => {

  it("Fails to connect to closed server port after retries", (done) => {
    const [, client] = create(1122, 1);

    client.connect(5, 3)
      .subscribe({
        error: (error) => {
          expect(client.isConnected).toEqual(false);
          expect(error).toEqual(CONNECTION_ERROR);
          done();
        },
        complete: () => {
          fail();
          done();
        },
      });
  });

  it("Connects to open server port", (done) => {
    const [server, client] = create(5022, 2);
    server.open()
      .subscribe(() => {
        client.connect()
          .switchMap(() => {
            expect(client.isConnected).toEqual(true);
            return Observable.forkJoin(
              client.disconnect(),
              server.close(),
            );
          })
          .subscribe({
            error: (error) => {
              fail(error);
              done();
            },
            complete: () => done(),
          });
      });
  });

  it("Reads coils from server", (done) => {
    const [server, client] = create(5023, 3);
    server.open()
      .subscribe(() => {
        client.connect()
          .switchMap(() => {
            return client.readCoils(0x1000, 4);
          })
          .switchMap((response) => {
            const data: pdu.IReadCoils = response.data;
            expect(response.functionCode).toEqual(pdu.FunctionCode.ReadCoils);
            expect(data.bytes).toEqual(1);
            expect(data.values).toEqual([true, false, true, false, false, false, false, false]);
            return Observable.forkJoin(
              client.disconnect(),
              server.close(),
            );
          })
          .subscribe({
            error: (error) => {
              fail(error);
              done();
            },
            complete: () => done(),
          });
      });
  });

});
