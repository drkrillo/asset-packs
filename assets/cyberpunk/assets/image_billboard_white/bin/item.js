define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SignPost = (function () {
        function SignPost() {
        }
        SignPost.prototype.init = function () { };
        SignPost.prototype.spawn = function (host, props, channel) {
            var sign = new Entity();
            sign.setParent(host);
            sign.addComponent(new GLTFShape('models/Billboard_White.glb'));
            sign.addComponent(new Transform({}));
            var url = props.image;
            var QRTexture = new Texture(url);
            var QRMaterial = new Material();
            QRMaterial.metallic = 0;
            QRMaterial.roughness = 1;
            QRMaterial.specularIntensity = 0;
            QRMaterial.albedoTexture = QRTexture;
            var QRPlane = new Entity();
            QRPlane.setParent(host);
            QRPlane.addComponent(new PlaneShape());
            QRPlane.addComponent(QRMaterial);
            QRPlane.addComponent(new Transform({
                position: new Vector3(0, 3.85, 0.21),
                rotation: Quaternion.Euler(180, 0, 0),
                scale: new Vector3(2.3, 2.3, 2.3),
            }));
            var QRPlane2 = new Entity();
            QRPlane2.setParent(host);
            QRPlane2.addComponent(new PlaneShape());
            QRPlane2.addComponent(QRMaterial);
            QRPlane2.addComponent(new Transform({
                position: new Vector3(0, 3.85, -0.21),
                rotation: Quaternion.Euler(180, 180, 0),
                scale: new Vector3(2.3, 2.3, 2.3),
            }));
        };
        return SignPost;
    }());
    exports.default = SignPost;
});
