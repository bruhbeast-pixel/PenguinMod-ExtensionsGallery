// ██╗░░░██╗░█████╗░██╗░░██╗██╗░██████╗
// ██║░░░██║██╔══██╗╚██╗██╔╝██║██╔════╝
// ╚██╗░██╔╝██║░░██║░╚███╔╝░██║╚█████╗░
// ░╚████╔╝░██║░░██║░██╔██╗░██║░╚═══██╗
// ░░╚██╔╝░░╚█████╔╝██╔╝╚██╗██║██████╔╝
// ░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝╚═╝╚═════╝░
// By Dictive - Console
// Now, there's no need for AI. All written by myself.
// This extension needs to be unsandboxed to run! Until I find a way for dealing stupid code.
// Best ran in PenguinMod or TurboWarp!
//
class Extension {
    constructor() {
        this.isMicrophoneGranted = false;
        this.recognizing = false;
        this.speechRecognition = null;
        this.speechText = '';
    }

    getInfo() {
        return {
            id: 'bruhbeastvoxis',
            name: 'Voxis',
            color1: '#008080', // Teal color - I found this in Google
            blocks: [
                {
                    opcode: 'setupMicrophone',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'setup microphone',
                },
                {
                    opcode: 'microphonePermissionGranted',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'microphone granted?',
                },
                {
                    opcode: 'startRecording',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'record and wait',
                },
                {
                    opcode: 'getSpeechText',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get speech text',
                },
                {
                    opcode: 'stopRecording',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'stop recording',
                },
                {
                    opcode: 'clearSpeechText',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clear recognized text',
                },
            ],
        };
    }

    async setupMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.isMicrophoneGranted = true;
            stream.getTracks().forEach(track => track.stop());
        } catch (err) {
            this.isMicrophoneGranted = false;
            console.error('Microphone permission denied:', err);
        }
    }

    microphonePermissionGranted() {
        return this.isMicrophoneGranted;
    }

    async startRecording() {
        if (!this.speechRecognition) {
            if ('SpeechRecognition' in window) {
                this.speechRecognition = new window.SpeechRecognition();
            } else if ('webkitSpeechRecognition' in window) {
                this.speechRecognition = new window.webkitSpeechRecognition();
            } else {
                console.error('SpeechRecognition is not supported in this browser.');
                return;
            }

            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;

            this.speechRecognition.onresult = (event) => {
                if (event.results.length > 0) {
                    this.speechText = event.results[0][0].transcript;
                }
                this.recognizing = false;
            };

            this.speechRecognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.recognizing = false;
            };

            this.speechRecognition.onend = () => {
                this.recognizing = false;
            };
        }

        if (!this.recognizing) {
            this.recognizing = true;
            return new Promise((resolve) => {
                this.speechRecognition.onend = () => {
                    this.recognizing = false;
                    resolve();
                };
                this.speechRecognition.start();
            });
        }
    }

    stopRecording() {
        if (this.speechRecognition && this.recognizing) {
            this.speechRecognition.stop();
        }
    }

    clearSpeechText() {
        this.speechText = '';
    }

    getSpeechText() {
        return this.speechText || '';
    }
}

// Register the extension
Scratch.extensions.register(new Extension());
