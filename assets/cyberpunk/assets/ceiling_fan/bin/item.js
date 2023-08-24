define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Button = (function () {
        function Button() {
            this.clip = new AudioClip('sounds/Fan_Loop.mp3');
            this.active = {};
        }
        Button.prototype.init = function () { };
        Button.prototype.toggle = function (entity, value) {
            if (this.active[entity.name] === value)
                return;
            if (value) {
                var source = new AudioSource(this.clip);
                entity.addComponentOrReplace(source);
                source.loop = true;
                source.playing = true;
            }
            else {
                var source = entity.getComponent(AudioSource);
                if (source) {
                    source.playing = false;
                }
            }
            var animator = entity.getComponent(Animator);
            var activateClip = animator.getClip('Play');
            var deactivateClip = animator.getClip('Stop');
            activateClip.stop();
            deactivateClip.stop();
            var clip = value ? activateClip : deactivateClip;
            clip.play();
            this.active[entity.name] = value;
        };
        Button.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var transmitter = new Entity(host.name + '-button');
            transmitter.setParent(host);
            var animator = new Animator();
            var deactivateClip = new AnimationState('Stop', { looping: true });
            var activateClip = new AnimationState('Play', { looping: true });
            animator.addClip(deactivateClip);
            animator.addClip(activateClip);
            transmitter.addComponent(animator);
            deactivateClip.play();
            transmitter.addComponent(new GLTFShape('models/Ceiling_Fan.glb'));
            transmitter.addComponent(new OnPointerDown(function () {
                var value = !_this.active[transmitter.name];
                var action = channel.createAction(value ? 'activate' : 'deactivate', {});
                channel.sendActions([action]);
            }, {
                button: ActionButton.POINTER,
                hoverText: 'On/Off',
                distance: 6
            }));
            this.active[transmitter.name] = false;
            channel.handleAction('activate', function (_a) {
                var sender = _a.sender;
                _this.toggle(transmitter, true);
                if (sender === channel.id) {
                    channel.sendActions(props.onActivate);
                }
            });
            channel.handleAction('deactivate', function (_a) {
                var sender = _a.sender;
                _this.toggle(transmitter, false);
                if (sender === channel.id) {
                    channel.sendActions(props.onDeactivate);
                }
            });
            channel.request('isActive', function (isActive) {
                return _this.toggle(transmitter, isActive);
            });
            channel.reply('isActive', function () { return _this.active[transmitter.name]; });
        };
        return Button;
    }());
    exports.default = Button;
});
