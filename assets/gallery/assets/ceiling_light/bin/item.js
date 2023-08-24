define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Lamp = (function () {
        function Lamp() {
            this.clip = new AudioClip('sounds/Click.mp3');
            this.active = {};
            this.onModels = {};
            this.offModels = {};
            this.AudioSources = {};
        }
        Lamp.prototype.init = function () { };
        Lamp.prototype.toggle = function (entityName, value) {
            if (this.active[entityName] === value)
                return;
            this.AudioSources[entityName].playOnce();
            if (value) {
                this.onModels[entityName].visible = true;
                this.offModels[entityName].visible = false;
            }
            else {
                this.onModels[entityName].visible = false;
                this.offModels[entityName].visible = true;
            }
            this.active[entityName] = value;
        };
        Lamp.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var lampOff = new Entity(host.name + '-off');
            lampOff.setParent(host);
            lampOff.addComponent(new Transform());
            var offModel = new GLTFShape('models/CeilingLight_Off.glb');
            lampOff.addComponent(offModel);
            var lampOn = new Entity(host.name + '-on');
            lampOn.setParent(host);
            lampOn.addComponent(new Transform());
            var onModel = new GLTFShape('models/CeilingLight_On.glb');
            lampOn.addComponent(onModel);
            if (props.startOn) {
                offModel.visible = false;
            }
            else {
                onModel.visible = false;
            }
            if (props.clickable) {
                lampOff.addComponent(new OnPointerDown(function () {
                    var value = !_this.active[host.name];
                    var action = channel.createAction(value ? 'activate' : 'deactivate', {});
                    channel.sendActions([action]);
                }, {
                    button: ActionButton.POINTER,
                    hoverText: 'Switch',
                    distance: 6,
                }));
                lampOn.addComponent(new OnPointerDown(function () {
                    var value = !_this.active[host.name];
                    var action = channel.createAction(value ? 'activate' : 'deactivate', {});
                    channel.sendActions([action]);
                }, {
                    button: ActionButton.POINTER,
                    hoverText: 'Switch',
                    distance: 6,
                }));
            }
            var source = new AudioSource(this.clip);
            lampOn.addComponent(source);
            this.active[host.name] = props.startOn;
            this.onModels[host.name] = onModel;
            this.offModels[host.name] = offModel;
            this.AudioSources[host.name] = source;
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
            channel.request('isActive', function (isActive) {
                return _this.toggle(host.name, isActive);
            });
            channel.reply('isActive', function () { return _this.active[host.name]; });
        };
        return Lamp;
    }());
    exports.default = Lamp;
});
