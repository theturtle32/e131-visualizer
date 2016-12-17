import 'babel-polyfill';
import e131 from 'e131';

module.exports = function(wsServer, universes=[1,2,3]) {
  var server = new e131.Server(universes);
  
  let dumpPacket = (packet) => {
    var sourceName = packet.getSourceName();
    var sequenceNumber = packet.getSequenceNumber();
    var universe = packet.getUniverse();
    var slotsData = packet.getSlotsData();
    
    console.log('source="%s", seq=%d, universe=%d, slots=%d',
    sourceName, sequenceNumber, universe, slotsData.length);
  };
  
  let dumpData = (packet) => {
    var slotsData = packet.getSlotsData();
    console.log(slotsData.toString('hex'));
  }
  
  let handlePacket = (packet, err) => {
    // dumpPacket(packet);
    sendToWebsocket(packet);
  };
  
  let sendToWebsocket = (packet) => {
    wsServer.broadcast(JSON.stringify({
      source: packet.getSourceName(),
      universe: packet.getUniverse(),
      seq: packet.getSequenceNumber(),
      slots: packet.getSlotsData().toJSON().data
    }));
  }
  
  server.on('listening', () => console.log("e131 listening") );
  server.on('packet-error', (packet, err) => { console.log("Received Packet with error") });
  server.on('packet-out-of-order', handlePacket)
  server.on('packet', handlePacket);

};
