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
define("src/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RadioDelayManager = exports.Delay = void 0;
    var Delay = (function () {
        function Delay(timer, action) {
            this.timer = timer / 1000;
            this.action = action;
        }
        Delay = __decorate([
            Component('org.decentraland.radioDelay')
        ], Delay);
        return Delay;
    }());
    exports.Delay = Delay;
    var RadioDelayManager = (function () {
        function RadioDelayManager() {
            this.group = engine.getComponentGroup(Delay);
        }
        RadioDelayManager.prototype.update = function (dt) {
            var e_1, _a;
            try {
                for (var _b = __values(this.group.entities), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var entity = _c.value;
                    var delay = entity.getComponent(Delay);
                    delay.timer -= dt;
                    if (delay.timer < 0) {
                        delay.action();
                        entity.removeComponent(Delay);
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
        return RadioDelayManager;
    }());
    exports.RadioDelayManager = RadioDelayManager;
});
define("src/item", ["require", "exports", "src/utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultStation = 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3';
    var Button = (function () {
        function Button() {
            this.clip = new AudioClip('sounds/click.mp3');
            this.station = '';
            this.active = {};
            this.volume = {};
        }
        Button.prototype.init = function () {
            engine.addSystem(new utils_1.RadioDelayManager());
        };
        Button.prototype.toggle = function (entity, value, silent) {
            if (!silent) {
                var source = new AudioSource(this.clip);
                entity.addComponentOrReplace(source);
                source.playing = true;
            }
            var animator = entity.getComponent(Animator);
            var switchClip = animator.getClip('Speaker_Action');
            var lightClip = animator.getClip('Click_Action');
            if (value) {
                lightClip.stop();
                switchClip.stop();
                switchClip.play();
                entity.addComponent(new utils_1.Delay(500, function () {
                    switchClip.stop();
                    lightClip.stop();
                    lightClip.play();
                }));
                var musicStream = new AudioStream(this.station);
                entity.addComponentOrReplace(musicStream);
                musicStream.playing = true;
                musicStream.volume = this.volume[entity.name];
            }
            else {
                lightClip.stop();
                switchClip.stop();
                switchClip.play();
                if (entity.hasComponent(AudioStream)) {
                    entity.getComponent(AudioStream).playing = false;
                }
            }
        };
        Button.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var button = new Entity(host.name + '-radio');
            button.setParent(host);
            button.addComponent(new GLTFShape('models/Radio_Anim.glb'));
            var animator = new Animator();
            var switchClip = new AnimationState('Speaker_Action', { looping: false });
            var lightClip = new AnimationState('Click_Action', { looping: true });
            animator.addClip(switchClip);
            animator.addClip(lightClip);
            button.addComponent(animator);
            if (props.customStation) {
                this.station = props.customStation;
            }
            else if (props.station) {
                this.station = props.station;
            }
            else {
                this.station = defaultStation;
            }
            if (props.onClick) {
                button.addComponent(new OnPointerDown(function () {
                    channel.sendActions(props.onClick);
                }, {
                    button: ActionButton.POINTER,
                    hoverText: props.onClickText,
                    distance: 6,
                }));
            }
            this.volume[button.name] = props.volume;
            if (props.startOn) {
                this.toggle(button, true, true);
                this.active[button.name] = true;
            }
            else {
                this.active[button.name] = false;
            }
            channel.handleAction('activate', function (_a) {
                var sender = _a.sender;
                _this.active[button.name] = true;
                _this.toggle(button, true);
                if (sender === channel.id) {
                    channel.sendActions(props.onActivate);
                }
            });
            channel.handleAction('deactivate', function (_a) {
                var sender = _a.sender;
                _this.active[button.name] = false;
                _this.toggle(button, false);
                if (sender === channel.id) {
                    channel.sendActions(props.onDeactivate);
                }
            });
            channel.handleAction('toggle', function (_a) {
                var sender = _a.sender;
                var value = !_this.active[button.name];
                _this.active[button.name] = value;
                _this.toggle(button, value);
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
                return _this.toggle(button, isActive, true);
            });
            channel.reply('isActive', function () { return _this.active[button.name]; });
        };
        return Button;
    }());
    exports.default = Button;
});
