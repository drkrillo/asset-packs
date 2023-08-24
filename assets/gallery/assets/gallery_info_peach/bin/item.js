define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.splitTextIntoLines = void 0;
    var PlainText = (function () {
        function PlainText() {
        }
        PlainText.prototype.init = function () { };
        PlainText.prototype.spawn = function (host, props, channel) {
            var signText = new Entity();
            signText.setParent(host);
            var text = new TextShape(splitTextIntoLines(props.text, (28 * 5) / props.fontSize));
            text.fontSize = props.fontSize;
            text.color = Color3.FromHexString(props.color);
            switch (props.font) {
                case 'SF':
                    text.font = new Font(Fonts.SanFrancisco);
                    break;
                case 'SF_Heavy':
                    text.font = new Font(Fonts.SanFrancisco_Heavy);
                    break;
            }
            text.height = 10;
            text.width = 10;
            text.lineSpacing = "50px";
            text.paddingBottom = 0;
            text.paddingTop = 0;
            text.paddingLeft = 0;
            text.paddingRight = 0;
            text.zIndex = 1;
            text.lineCount = 10;
            text.hTextAlign = 'center';
            text.vTextAlign = 'center';
            text.textWrapping = false;
            signText.addComponent(text);
            signText.addComponent(new Transform({
                position: new Vector3(-1, 2, 0.05),
                rotation: Quaternion.Euler(0, 180, 0),
                scale: new Vector3(0.2, 0.2, 0.2),
            }));
            var wall = new Entity();
            wall.setParent(host);
            wall.addComponentOrReplace(new GLTFShape('models/PeachGalleryInfo.glb'));
        };
        return PlainText;
    }());
    exports.default = PlainText;
    function splitTextIntoLines(text, maxLenght, maxLines) {
        var finalText = '';
        for (var i = 0; i < text.length; i++) {
            var lines = finalText.split('\n');
            if (lines[lines.length - 1].length >= maxLenght && i !== text.length) {
                if (finalText[finalText.length - 1] !== ' ') {
                    if (maxLines && lines.length >= maxLines) {
                        finalText = finalText.concat('...');
                        return finalText;
                    }
                    else {
                        finalText = finalText.concat('-');
                    }
                }
                finalText = finalText.concat('\n');
                if (text[i] === ' ') {
                    continue;
                }
            }
            finalText = finalText.concat(text[i]);
        }
        return finalText;
    }
    exports.splitTextIntoLines = splitTextIntoLines;
});
