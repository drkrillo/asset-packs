define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlainText = (function () {
        function PlainText() {
        }
        PlainText.prototype.init = function () { };
        PlainText.prototype.spawn = function (host, props, channel) {
            var signText = new Entity();
            signText.setParent(host);
            var text = new TextShape(props.text);
            text.fontSize = 1;
            text.color = Color3.FromHexString(props.color);
            text.hTextAlign = 'bottom';
            switch (props.font) {
                case 'SF':
                    text.font = new Font(Fonts.SanFrancisco);
                    break;
                case 'SF_Heavy':
                    text.font = new Font(Fonts.SanFrancisco_Heavy);
                    break;
            }
            text.width = 5;
            text.height = 1;
            signText.addComponent(text);
            signText.addComponent(new Transform({
                position: new Vector3(0, 0.09, 0),
                rotation: Quaternion.Euler(0, 180, 0),
                scale: new Vector3(2, 2, 2),
            }));
        };
        return PlainText;
    }());
    exports.default = PlainText;
});
