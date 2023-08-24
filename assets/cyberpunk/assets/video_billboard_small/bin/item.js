define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultStation = 'https://theuniverse.club/live/genesisplaza/index.m3u8';
    var Button = (function () {
        function Button() {
            this.channel = '';
            this.data = {};
        }
        Button.prototype.init = function () { };
        Button.prototype.toggle = function (hostName, value) {
            if (value) {
                if (this.activeScreen && this.activeScreen == hostName) {
                    return;
                }
                else if (this.activeScreen) {
                    this.toggle(this.activeScreen, false);
                }
                this.activeScreen = hostName;
                var data = this.data[hostName];
                data.screen1.addComponentOrReplace(data.material);
                data.screen2.addComponentOrReplace(data.material);
                data.active = true;
                data.texture.volume = data.volume;
                data.texture.playing = true;
            }
            else {
                if (!this.activeScreen || this.activeScreen != hostName) {
                    return;
                }
                this.activeScreen = null;
                var data = this.data[hostName];
                data.active = false;
                data.texture.playing = false;
            }
            return;
        };
        Button.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var screen = new Entity(host.name + '-screen');
            screen.setParent(host);
            var scaleMult = 0.55;
            screen.addComponent(new PlaneShape());
            screen.addComponent(new Transform({
                scale: new Vector3(1.92 * scaleMult, 1.08 * scaleMult, 10 * scaleMult),
                position: new Vector3(0, 6.13 * scaleMult, 0.25),
                rotation: Quaternion.Euler(0, 180, 180)
            }));
            var billboard = new Entity();
            billboard.setParent(host);
            billboard.addComponent(new Transform({ position: new Vector3(0, 0, 0) }));
            billboard.addComponent(new GLTFShape('models/Small_Billboard.glb'));
            var screen2 = new Entity(host.name + '-screen2');
            screen2.setParent(host);
            screen2.addComponent(new PlaneShape());
            screen2.addComponent(new Transform({
                scale: new Vector3(1.92 * scaleMult, 1.08 * scaleMult, 10 * scaleMult),
                position: new Vector3(0, 6.13 * scaleMult, -0.25),
                rotation: Quaternion.Euler(0, 0, 180),
            }));
            if (props.customStation) {
                this.channel = props.customStation;
            }
            else if (props.station) {
                this.channel = props.station;
            }
            else {
                this.channel = defaultStation;
            }
            var myTexture = new VideoTexture(new VideoClip(this.channel));
            var myMaterial = new Material();
            myMaterial.albedoTexture = myTexture;
            myMaterial.specularIntensity = 0;
            myMaterial.roughness = 1;
            myMaterial.metallic = 0;
            myMaterial.emissiveTexture = myTexture;
            myMaterial.emissiveIntensity = 0.8;
            myMaterial.emissiveColor = new Color3(1, 1, 1);
            var placeholderMaterial = new Material();
            placeholderMaterial.albedoTexture = new Texture(props.image ? props.image : 'images/stream.png');
            placeholderMaterial.specularIntensity = 0;
            placeholderMaterial.roughness = 1;
            screen.addComponent(placeholderMaterial);
            screen2.addComponent(placeholderMaterial);
            var volume = props.volume;
            if (props.onClick) {
                screen.addComponent(new OnPointerDown(function () {
                    channel.sendActions(props.onClick);
                }, {
                    button: ActionButton.POINTER,
                    hoverText: props.onClickText,
                    distance: 6,
                }));
                screen2.addComponent(new OnPointerDown(function () {
                    channel.sendActions(props.onClick);
                }, {
                    button: ActionButton.POINTER,
                    hoverText: props.onClickText,
                    distance: 6,
                }));
                billboard.addComponent(new OnPointerDown(function () {
                    log('clicked');
                    channel.sendActions(props.onClick);
                }, {
                    button: ActionButton.POINTER,
                    hoverText: props.onClickText,
                    distance: 6,
                }));
            }
            this.data[host.name] = {
                screen1: screen,
                screen2: screen2,
                volume: volume,
                texture: myTexture,
                material: myMaterial,
                active: props.startOn ? true : false,
            };
            if (props.startOn) {
                this.toggle(host.name, true);
            }
            else {
                this.toggle(host.name, false);
            }
            channel.handleAction('activate', function (_a) {
                var sender = _a.sender;
                _this.toggle(host.name, true);
                if (sender === channel.id) {
                    channel.sendActions(props.onActivate);
                }
            });
            channel.handleAction('deactivate', function (_a) {
                var sender = _a.sender;
                _this.toggle(host.name, false);
                if (sender === channel.id) {
                    channel.sendActions(props.onDeactivate);
                }
            });
            channel.handleAction('toggle', function (_a) {
                var sender = _a.sender;
                var value = !_this.data[host.name].active;
                _this.toggle(host.name, value);
                if (sender === channel.id) {
                    if (value) {
                        channel.sendActions(props.onActivate);
                    }
                    else {
                        channel.sendActions(props.onDeactivate);
                    }
                }
            });
            channel.request('isActive', function (isActive) {
                return _this.toggle(host.name, isActive);
            });
            channel.reply('isActive', function () { return _this.data[host.name].active; });
        };
        return Button;
    }());
    exports.default = Button;
});
