const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class Strip {
    constructor(device) {
        this.device = device;
        this.server = null
        this.service = null
        this.colorMode = false
        this.polling = false
        this.lastColorCommand = null
        this.currentColor = null
        this.syncMode = false
        this.segmentDuration = 0
        this.createServer()
    }
    async createServer() {
        let { device } = this;
        try {
            this.server = await device.gatt.connect();
            await this.server.connect();

            this.service = await this.server.getPrimaryService(
                "00010203-0405-0607-0809-0a0b0c0d1910"
            );
            this.characteristic = await this.service.getCharacteristic(
                "00010203-0405-0607-0809-0a0b0c0d2b11"
            );
        } catch (ex) {
            console.log(`[CreateServer]: Error creating server`, ex)
            await sleep(100)
            return this.createServer()
        }


        while (this.server) {
            //reconnect if disconnected
            if (!this.server.connected) {
                console.log(`[CreateServer]: Reconnecting`)
                return this.createServer()

            }
            try {
                await this.keepAlive();
            } catch (e) {
                console.log(`[CreateServer]: keepAlive failed`, e)
            }
            await sleep(2000);
        }
    }
    async turnOn() {
        this.colorMode = false
        await this.characteristic.writeValue(commands.get("turnOn"));
    }
    async turnOff() {
        this.colorMode = false
        await this.characteristic.writeValue(commands.get("turnOff"));
    }
    async keepAlive() {
        // console.log(`keeping alive`)
        await this.characteristic.writeValueWithoutResponse(commands.get("keepAlive"));
    }
    async setMusic(command) {
        //seems to have to set to "music" mode first
        this.colorMode = false
        await this.runStringCommand("a3000102413207ff0000ff7f00ffff0000ff0054")
        await this.runStringCommand("a3ff0000ff00ffff8b00ff0300610000000000b5")

        await this.runStringCommand(commands[command])
    }
    async setColorMode() {
        if (this.colorMode) return;
        await this.runStringCommand("3305150100000000000000000000000000000022")
        this.colorMode = true
    }
    async setSegments(segData) {
        for (let segNum in segData) {
            let color = segData[segNum]
            await this.setSegment(segNum, color)
        }
    }
    async setScene(command) {
        this.colorMode = false
        await this.runStringCommand(commands[command])
    }
    async setSegment(segNum, color) {
        await this.setColorMode()
        let segCode = segmentsMap[segNum]
        //set color mode if not in color mode
        color = color.slice(1)
        let hexBytes = `33051501${color}0000000000${segCode}0000000000`
        hexBytes += this.getChecksum(hexBytes)
        await this.runStringCommand(hexBytes)
        return hexBytes
    }
    /**
     * 
     * @param {Number} value  brightness 0 -100
     */
    async setBrightness(value) {
        //convert to  8 bit - previously Math.floor(value / 100 * 255)
        let eightbit = Math.floor(value / 100 * 100)
        let hex = eightbit.toString(16).padStart(2, '0')

        let hexBytes = `3304${hex}00000000000000000000000000000000`
        hexBytes += this.getChecksum(hexBytes)
        await this.runStringCommand(hexBytes)
        return hexBytes
    }
    async setColor(hexColor) {
        await this.setColorMode()

        this.lastColorCommand = hexColor

        if (this.polling) return
        try {
            //prevents gatt operation already in progress errors - only send the most recent color
            while (this.lastColorCommand !== this.currentColor || this.currentColor == null) {
                this.polling = true
                this.currentColor = this.lastColorCommand
                hexColor = this.lastColorCommand
                //add hex color to bytes
                hexColor = hexColor.slice(1)
                let hexBytes = `33051501${hexColor}0000000000ff7f0000000000`
                hexBytes += this.getChecksum(hexBytes)
                await this.runStringCommand(hexBytes)

            }

        } catch (ex) {
            console.log(`[setColor]: Error`, ex)
        }

        this.polling = false


    }
    stopSync() {
        this.syncMode = false
    }
    async consumeSegData() {
        let cap = window.cap
        this.syncMode = true

        while (this.syncMode) {
            //sample seg data
            try {
                let start = Date.now()
                await this.setSegments(cap.segData)
                this.segmentDuration = Date.now() - start
            } catch (ex) {
                console.warn(ex)
            }
            await sleep(400) //looks like controller cant handle many requets per second, the commands are queued at the controller making it have delay.
        }

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
        await this.characteristic.writeValueWithoutResponse(commands.convert(string));
    }
}
let segmentsMap = {
    1: "0100",
    2: "0200",
    3: "0400",
    4: "0800",

    5: "1000",
    6: "2000",
    7: "4000",
    8: "8000",

    9: "0001",
    10: "0002",
    11: "0004",
    12: "0008",

    13: "0010",
    14: "0020",
    15: "0040",


}
let commands = {
    "turnOn": "3301010000000000000000000000000000000033",
    "turnOff": "3301000000000000000000000000000000000032",
    "keepAlive": "aa010000000000000000000000000000000000ab",
    //music
    "energetic": "3305130563000000000000000000000000000043",
    "spectrum": "3305130463000000000000000000000000000042",
    "rythm": "3305130363000000000000000000000000000045",
    "separation": "3305133263000000000000000000000000000074",
    "rolling": "3305130663000000000000000000000000000040",

    //scenes
    "sunrise": "3305040000000000000000000000000000000032",
    "sunset": "3305040100000000000000000000000000000033",
    "movie": "3305040400000000000000000000000000000036",
    "dating": "3305040500000000000000000000000000000037",
    "romantic": "3305040700000000000000000000000000000035",
    "blinking": "330504080000000000000000000000000000003a",
    "candlelight": "330504090000000000000000000000000000003b",
    "snowflake": "3305040f0000000000000000000000000000003d",
    "rainbow": "3305041600000000000000000000000000000024",


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