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
            sign.addComponent(new GLTFShape('models/Game_Cube_F.glb'));
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
                position: new Vector3(-0.608, 1.6, -0.3),
                rotation: Quaternion.Euler(180, -90, 0),
                scale: new Vector3(.58, .58, .58),
            }));
            var QRPlane2 = new Entity();
            QRPlane2.setParent(host);
            QRPlane2.addComponent(new PlaneShape());
            QRPlane2.addComponent(QRMaterial);
            QRPlane2.addComponent(new Transform({
                position: new Vector3(-0.03, 1.6, -0.3),
                rotation: Quaternion.Euler(180, 90, 0),
                scale: new Vector3(.58, .58, .58),
            }));
            var QRPlane3 = new Entity();
            QRPlane3.setParent(host);
            QRPlane3.addComponent(new PlaneShape());
            QRPlane3.addComponent(QRMaterial);
            QRPlane3.addComponent(new Transform({
                position: new Vector3(-0.3, 1.6, -0.02),
                rotation: Quaternion.Euler(180, 0, 0),
                scale: new Vector3(.58, .58, .58),
            }));
            var QRPlane4 = new Entity();
            QRPlane4.setParent(host);
            QRPlane4.addComponent(new PlaneShape());
            QRPlane4.addComponent(QRMaterial);
            QRPlane4.addComponent(new Transform({
                position: new Vector3(-0.3, 1.6, -0.61),
                rotation: Quaternion.Euler(180, 180, 0),
                scale: new Vector3(.58, .58, .58),
            }));
        };
        return SignPost;
    }());
    exports.default = SignPost;
});
