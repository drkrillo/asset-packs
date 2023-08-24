define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Button = (function () {
        function Button() {
            this.clip = new AudioClip('sounds/click.mp3');
        }
        Button.prototype.init = function () { };
        Button.prototype.play = function (entity) {
            var source = new AudioSource(this.clip);
            entity.addComponentOrReplace(source);
            source.playing = true;
            var animator = entity.getComponent(Animator);
            var clip = animator.getClip('trigger');
            clip.stop();
            clip.play();
        };
        Button.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var button = new Entity();
            button.setParent(host);
            button.addComponent(new GLTFShape('models/Pink_Fantasy_Button.glb'));
            var animator = new Animator();
            var clip = new AnimationState('trigger', { looping: false });
            animator.addClip(clip);
            button.addComponent(animator);
            button.addComponent(new OnPointerDown(function () {
                var pushAction = channel.createAction('push', {});
                channel.sendActions([pushAction]);
            }, {
                button: ActionButton.POINTER,
                hoverText: 'Press',
                distance: 6,
            }));
            channel.handleAction('push', function (_a) {
                var sender = _a.sender;
                _this.play(button);
                if (sender === channel.id) {
                    channel.sendActions(props.onClick);
                }
            });
        };
        return Button;
    }());
    exports.default = Button;
});
