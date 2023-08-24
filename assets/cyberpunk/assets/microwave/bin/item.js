define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Door = (function () {
        function Door() {
            this.Clip = new AudioClip("sounds/Microwave.mp3");
            this.active = {};
        }
        Door.prototype.init = function () { };
        Door.prototype.toggle = function (entity) {
            var source = new AudioSource(this.Clip);
            entity.addComponentOrReplace(source);
            source.playing = true;
        };
        Door.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var car = new Entity(host.name + "-button");
            car.setParent(host);
            car.addComponent(new GLTFShape("models/Microwave_Closed.glb"));
            if (props.clickable) {
                car.addComponent(new OnPointerDown(function () {
                    var activateAction = channel.createAction('activate', {});
                    channel.sendActions([activateAction]);
                }));
            }
            channel.handleAction("activate", function (_a) {
                var sender = _a.sender;
                _this.toggle(car);
                if (sender === channel.id) {
                    channel.sendActions(props.onActivate);
                }
            });
        };
        return Door;
    }());
    exports.default = Door;
});
