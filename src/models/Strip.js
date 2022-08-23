const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class Strip {
    constructor(device) {
        this.device = device;
        this.server = null
        this.service = null
        this.createServer()
    }
    async createServer() {
        let { device } = this;
        this.server = await device.gatt.connect();
        await this.server.connect();

        this.service = await this.server.getPrimaryService(
            "00010203-0405-0607-0809-0a0b0c0d1910"
        );
        this.characteristic = await this.service.getCharacteristic(
            "00010203-0405-0607-0809-0a0b0c0d2b11"
        );
        //keep alive
        while (this.server) {
            // console.log(`this server is still alive`, this.server.connected)
            await this.keepAlive();
            await sleep(2000);
        }
    }
    async turnOn() {
        await this.characteristic.writeValue(commands.get("turnOn"));
    }
    async turnOff() {
        await this.characteristic.writeValue(commands.get("turnOff"));
    }
    async keepAlive() {
        // console.log(`keeping alive`)
        await this.characteristic.writeValue(commands.get("keepAlive"));
    }
    async setColor(hexColor) {
        //add hex color to bytes
        hexColor = hexColor.slice(1)
        let hexBytes = `33051501${hexColor}0000000000ff7f0000000000`
        hexBytes += this.getChecksum(hexBytes)
        await this.runStringCommand(hexBytes)
        return hexBytes
    }
    getChecksum(bytes) {
        let numChunks = bytes.length / 2
        let xor = "00"
        for (let i = 0; i < numChunks; i++) {
            let chunk = bytes.slice(i * 2, (i + 1) * 2)

            const buf1 = Buffer.from(xor, 'hex');
            const buf2 = Buffer.from(chunk, 'hex');
            const bufResult = buf1.map((b, i) => b ^ buf2[i]);
            xor = bufResult.toString('hex');

        }
        return xor
    }
    async runStringCommand(string) {
        await this.characteristic.writeValue(commands.convert(string));
    }
}
let commands = {
    "turnOn": "3301010000000000000000000000000000000033",
    "turnOff": "3301000000000000000000000000000000000032",
    "keepAlive": "aa010000000000000000000000000000000000ab",
    get(command) {
        let hex = this[command];

        return new Uint8Array(
            hex.match(/[\da-f]{2}/gi).map(function (h) {
                return parseInt(h, 16);
            })
        );

    },
    convert(string) {
        return new Uint8Array(
            string.match(/[\da-f]{2}/gi).map(function (h) {
                return parseInt(h, 16);
            })
        );
    }

}

export default Strip