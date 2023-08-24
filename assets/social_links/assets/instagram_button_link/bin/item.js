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
define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseURL = void 0;
    var siteName = 'instagram';
    var siteURL = 'instagram.com';
    var defaulthover = 'Instagram Page';
    var stringsToReplace = [
        'http://',
        'https://',
        'http:',
        'https:',
        'www.',
        siteURL,
        '/',
    ];
    var SMedia_Link = (function () {
        function SMedia_Link() {
            this.clip = new AudioClip('sounds/click.mp3');
        }
        SMedia_Link.prototype.init = function () { };
        SMedia_Link.prototype.push = function (entity) {
            var source = new AudioSource(this.clip);
            entity.addComponentOrReplace(source);
            source.playing = true;
            var animator = entity.getComponent(Animator);
            var clip = animator.getClip('Action');
            clip.looping = false;
            clip.stop();
            clip.play();
        };
        SMedia_Link.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var link = new Entity();
            link.setParent(host);
            if (props.bnw) {
                link.addComponent(new GLTFShape('models/instagram_bnw.glb'));
            }
            else {
                link.addComponent(new GLTFShape('models/instagram.glb'));
            }
            var url = parseURL(props.url);
            var locationString = props.name ? props.name : defaulthover;
            link.addComponent(new OnPointerDown(function () {
                var pushAction = channel.createAction('push', {});
                channel.sendActions([pushAction]);
                openExternalURL(url);
            }, {
                button: ActionButton.PRIMARY,
                hoverText: locationString,
            }));
            link.addComponent(new Animator());
            channel.handleAction('push', function (_a) {
                var sender = _a.sender;
                _this.push(link);
            });
        };
        return SMedia_Link;
    }());
    exports.default = SMedia_Link;
    function parseURL(url) {
        var e_1, _a;
        var newURL = url.trim();
        try {
            for (var stringsToReplace_1 = __values(stringsToReplace), stringsToReplace_1_1 = stringsToReplace_1.next(); !stringsToReplace_1_1.done; stringsToReplace_1_1 = stringsToReplace_1.next()) {
                var str = stringsToReplace_1_1.value;
                if (newURL.substr(0, str.length) == str) {
                    newURL = newURL.substring(str.length).trim();
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (stringsToReplace_1_1 && !stringsToReplace_1_1.done && (_a = stringsToReplace_1.return)) _a.call(stringsToReplace_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var finalURL = 'https://www.' + siteURL + '/' + newURL;
        return finalURL;
    }
    exports.parseURL = parseURL;
});
