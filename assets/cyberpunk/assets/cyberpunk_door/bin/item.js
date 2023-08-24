define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Button = (function () {
        function Button() {
            this.openClip = new AudioClip('sounds/open.mp3');
            this.closeClip = new AudioClip('sounds/close.mp3');
            this.active = {};
        }
        Button.prototype.init = function () { };
        Button.prototype.toggle = function (entity, value, playSound) {
            if (playSound === void 0) { playSound = true; }
            if (this.active[entity.name] === value)
                return;
            if (playSound) {
                var source = new AudioSource(value ? this.openClip : this.closeClip);
                entity.addComponentOrReplace(source);
                source.playing = true;
            }
            var animator = entity.getComponent(Animator);
            var openClip = animator.getClip('open');
            var closeClip = animator.getClip('close');
            openClip.stop();
            closeClip.stop();
            var clip = value ? openClip : closeClip;
            clip.play();
            this.active[entity.name] = value;
        };
        Button.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var door = new Entity(host.name + '-button');
            door.setParent(host);
            var animator = new Animator();
            var closeClip = new AnimationState('close', { looping: false });
            var openClip = new AnimationState('open', { looping: false });
            animator.addClip(closeClip);
            animator.addClip(openClip);
            door.addComponent(animator);
            openClip.stop();
            door.addComponent(new GLTFShape('models/Cyberpunk_Door_Anim.glb'));
            door.addComponent(new OnPointerDown(function () {
                channel.sendActions(props.onClick);
            }, {
                button: ActionButton.POINTER,
                hoverText: props.onClickText,
                distance: 6,
            }));
            this.active[door.name] = false;
            channel.handleAction('open', function (_a) {
                var sender = _a.sender;
                if (!_this.active[door.name]) {
                    _this.toggle(door, true);
                }
                if (sender === channel.id) {
                    channel.sendActions(props.onOpen);
                }
            });
            channel.handleAction('close', function (_a) {
                var sender = _a.sender;
                if (_this.active[door.name]) {
                    _this.toggle(door, false);
                }
                if (sender === channel.id) {
                    channel.sendActions(props.onClose);
                }
            });
            channel.handleAction('toggle', function (_a) {
                var sender = _a.sender;
                var newValue = !_this.active[door.name];
                _this.toggle(door, newValue);
                if (sender === channel.id) {
                    channel.sendActions(newValue ? props.onOpen : props.onClose);
                }
            });
            channel.request('isOpen', function (isOpen) {
                return _this.toggle(door, isOpen, false);
            });
            channel.reply('isOpen', function () { return _this.active[door.name]; });
        };
        return Button;
    }());
    exports.default = Button;
});
