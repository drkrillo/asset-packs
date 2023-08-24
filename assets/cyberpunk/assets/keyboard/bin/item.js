define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Button = (function () {
        function Button() {
            this.clip = new AudioClip('sounds/Keyboard.mp3');
        }
        Button.prototype.init = function () { };
        Button.prototype.play = function (entity) {
            var source = new AudioSource(this.clip);
            entity.addComponentOrReplace(source);
            source.playing = true;
            var animator = entity.getComponent(Animator);
            var clip = animator.getClip('Keyboard');
            clip.stop();
            clip.play();
        };
        Button.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var button = new Entity();
            button.setParent(host);
            button.addComponent(new GLTFShape('models/Keyboard_Anim.glb'));
            var animator = new Animator();
            var clip = new AnimationState('Keyboard', { looping: false });
            animator.addClip(clip);
            button.addComponent(animator);
            button.addComponent(new OnPointerDown(function () {
                _this.play(button);
                channel.sendActions(props.onClick);
            }, {
                button: ActionButton.POINTER,
                hoverText: 'Type',
                distance: 6
            }));
        };
        return Button;
    }());
    exports.default = Button;
});
