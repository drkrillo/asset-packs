var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define("7280e965-8938-4759-851f-2bd5b9e8b47b/platform", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HorizontalPlatformSystem = exports.HorizontalPlatform = void 0;
    var HorizontalPlatform = (function () {
        function HorizontalPlatform(channel, distance, speed, onReachStart, onReachEnd) {
            if (distance === void 0) { distance = 10; }
            if (speed === void 0) { speed = 5; }
            this.channel = channel;
            this.distance = distance;
            this.speed = speed;
            this.onReachStart = onReachStart;
            this.onReachEnd = onReachEnd;
            this.transition = -1;
            this.delay = -1;
            this.position = 'start';
        }
        HorizontalPlatform = __decorate([
            Component('org.decentraland.TaxiHorizontalPlatform')
        ], HorizontalPlatform);
        return HorizontalPlatform;
    }());
    exports.HorizontalPlatform = HorizontalPlatform;
    var startPosition = new Vector3(0, 0, 0);
    var HorizontalPlatformSystem = (function () {
        function HorizontalPlatformSystem() {
            this.group = engine.getComponentGroup(HorizontalPlatform);
        }
        HorizontalPlatformSystem.prototype.update = function (dt) {
            var e_1, _a;
            try {
                for (var _b = __values(this.group.entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var entity = _c.value;
                    var platform = entity.getComponent(HorizontalPlatform);
                    var transform = entity.getComponent(Transform);
                    var endPosition = new Vector3(0, 0, -platform.distance);
                    var isStart = platform.position === 'start';
                    var start = !isStart ? startPosition : endPosition;
                    var end = !isStart ? endPosition : startPosition;
                    var speed = platform.speed / 20;
                    if (platform.transition >= 0 && platform.transition < 1) {
                        platform.transition += dt * speed;
                        transform.position.copyFrom(Vector3.Lerp(start, end, platform.transition));
                    }
                    else if (platform.transition >= 1) {
                        platform.transition = -1;
                        platform.delay = 0;
                        transform.position.copyFrom(end);
                        if (!isStart && platform.onReachEnd) {
                            platform.channel.sendActions(platform.onReachEnd);
                        }
                        else if (isStart && platform.onReachStart) {
                            platform.channel.sendActions(platform.onReachStart);
                        }
                    }
                    else if (platform.delay >= 0 && platform.delay < 1) {
                        platform.delay += dt;
                    }
                    else if (platform.delay >= 1) {
                        platform.delay = -1;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return HorizontalPlatformSystem;
    }());
    exports.HorizontalPlatformSystem = HorizontalPlatformSystem;
});
define("7280e965-8938-4759-851f-2bd5b9e8b47b/item", ["require", "exports", \"7280e965-8938-4759-851f-2bd5b9e8b47b/platform\"], function (require, exports, platform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Door = (function () {
        function Door() {
        }
        Door.prototype.init = function () {
            engine.addSystem(new platform_1.HorizontalPlatformSystem());
        };
        Door.prototype.move = function (entity, newPosition, useTransition) {
            if (useTransition === void 0) { useTransition = true; }
            var platform = entity.getComponent(platform_1.HorizontalPlatform);
            var isStart = platform.position === 'start';
            if (newPosition === 'end') {
                if (!isStart)
                    return;
                platform.position = 'end';
            }
            else if (newPosition === 'start') {
                if (isStart)
                    return;
                platform.position = 'start';
            }
            if (useTransition) {
                if (platform.transition === -1) {
                    platform.transition = 0;
                }
                else {
                    platform.transition = 1 - platform.transition;
                }
            }
            else {
                platform.transition = 1;
            }
        };
        Door.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var distance = props.distance, speed = props.speed, autoStart = props.autoStart, onReachStart = props.onReachStart, onReachEnd = props.onReachEnd;
            var platform = new Entity(host.name + '-platform');
            platform.setParent(host);
            platform.addComponent(new Transform({ position: new Vector3(0, 0, 0) }));
            platform.addComponent(new GLTFShape('7280e965-8938-4759-851f-2bd5b9e8b47b/models/Flying_Taxi_Available.glb'));
            platform.addComponent(new platform_1.HorizontalPlatform(channel, distance, speed, onReachStart, onReachEnd));
            channel.handleAction('goToEnd', function () { return _this.move(platform, 'end'); });
            channel.handleAction('goToStart', function () { return _this.move(platform, 'start'); });
            channel.request('position', function (position) {
                return _this.move(platform, position, false);
            });
            channel.reply('position', function () { return platform.getComponent(platform_1.HorizontalPlatform).position; });
            if (autoStart !== false) {
                var goToEndAction = {
                    entityName: host.name,
                    actionId: 'goToEnd',
                    values: {}
                };
                channel.sendActions([goToEndAction]);
            }
        };
        return Door;
    }());
    exports.default = Door;
});
