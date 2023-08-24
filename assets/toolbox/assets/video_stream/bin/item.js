define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultStation = 'https://theuniverse.club/live/genesisplaza/index.m3u8';
    var Button = (function () {
        function Button() {
            this.channel = '';
            this.video = {};
            this.materials = {};
            this.active = {};
            this.volume = {};
            this.sign = {};
        }
        Button.prototype.init = function () { };
        Button.prototype.toggle = function (entity, value) {
            log('all screens: ', this.video, ' setting: ', entity.name, ' to ', value);
            if (value) {
                if (this.activeScreen && this.activeScreen == entity) {
                    return;
                }
                else if (this.activeScreen) {
                    this.toggle(this.activeScreen, false);
                }
                this.activeScreen = entity;
                this.active[entity.name] = true;
                this.video[entity.name].volume = this.volume[entity.name];
                this.video[entity.name].playing = true;
                engine.removeEntity(this.sign[entity.name]);
            }
            else {
                if (!this.activeScreen || this.activeScreen != entity) {
                    return;
                }
                this.activeScreen = null;
                this.active[entity.name] = false;
                this.video[entity.name].playing = false;
            }
            return;
        };
        Button.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var screen = new Entity(host.name + '-screen');
            screen.setParent(host);
            var scaleMult = 1.55;
            screen.addComponent(new PlaneShape());
            screen.addComponent(new Transform({
                scale: new Vector3(1.92 * scaleMult, 1.08 * scaleMult, 10 * scaleMult),
                position: new Vector3(0, 0.548 * scaleMult, 0),
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
            this.video[screen.name] = new VideoTexture(new VideoClip(this.channel));
            this.materials[screen.name] = new Material();
            this.materials[screen.name].albedoTexture = this.video[screen.name];
            this.materials[screen.name].specularIntensity = 0;
            this.materials[screen.name].roughness = 1;
            this.materials[screen.name].metallic = 0;
            this.materials[screen.name].emissiveTexture = this.video[screen.name];
            this.materials[screen.name].emissiveIntensity = 0.8;
            this.materials[screen.name].emissiveColor = new Color3(1, 1, 1);
            screen.addComponent(this.materials[screen.name]);
            this.sign[screen.name] = new Entity(host.name + '-sign');
            this.sign[screen.name].setParent(screen);
            this.sign[screen.name].addComponent(new PlaneShape());
            this.sign[screen.name].addComponent(new Transform({
                position: new Vector3(0, 0, 0.002),
                rotation: Quaternion.Euler(180, 0, 0),
            }));
            this.volume[screen.name] = props.volume;
            var placeholderMaterial = new Material();
            placeholderMaterial.albedoTexture = new Texture('images/stream.png');
            placeholderMaterial.specularIntensity = 0;
            placeholderMaterial.roughness = 1;
            this.sign[screen.name].addComponent(placeholderMaterial);
            if (props.onClick) {
                this.sign[screen.name].addComponent(new OnPointerDown(function () {
                    channel.sendActions(props.onClick);
                }, {
                    button: ActionButton.POINTER,
                    hoverText: props.onClickText,
                    distance: 6,
                }));
                screen.addComponent(new OnPointerDown(function () {
                    log('clicked');
                    channel.sendActions(props.onClick);
                }, {
                    button: ActionButton.POINTER,
                    hoverText: props.onClickText,
                    distance: 6,
                }));
            }
            if (props.startOn) {
                this.toggle(screen, true);
            }
            else {
                this.toggle(screen, false);
            }
            channel.handleAction('activate', function (_a) {
                var sender = _a.sender;
                _this.toggle(screen, true);
                if (sender === channel.id) {
                    channel.sendActions(props.onActivate);
                }
            });
            channel.handleAction('deactivate', function (_a) {
                var sender = _a.sender;
                _this.toggle(screen, false);
                if (sender === channel.id) {
                    channel.sendActions(props.onDeactivate);
                }
            });
            channel.handleAction('toggle', function (_a) {
                var sender = _a.sender;
                var value = !_this.active[screen.name];
                _this.toggle(screen, value);
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
                return _this.toggle(screen, isActive);
            });
            channel.reply('isActive', function () { return _this.active[screen.name]; });
        };
        return Button;
    }());
    exports.default = Button;
});
