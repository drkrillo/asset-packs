define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SignPost = (function () {
        function SignPost() {
        }
        SignPost.prototype.init = function () { };
        SignPost.prototype.spawn = function (host, props, channel) {
            var frame = new Entity();
            frame.setParent(host);
            frame.addComponent(new Transform({
                position: new Vector3(0, 1.5, 0),
                rotation: Quaternion.Euler(0, 180, 0),
            }));
            var nft = 'ethereum://' + props.contract + '/' + props.id;
            frame.addComponent(new NFTShape(nft, {
                color: Color3.FromHexString(props.color),
                style: PictureFrameStyle[props.style],
            }));
            if (props.ui) {
                frame.addComponent(new OnPointerDown(function () {
                    openNFTDialog(nft, props.uiText ? props.uiText : null);
                }, { hoverText: 'Open UI' }));
            }
        };
        return SignPost;
    }());
    exports.default = SignPost;
});
