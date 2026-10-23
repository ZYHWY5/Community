/**
 * @desc js 小盾风控接入
 * @tgStorageTime 有效值缓存时间

 * 实际页面取值处理
 * localStorage.getItem('tongdun_black_box') || '';
 */

(function () {
    try {
        var tongdunConfig = {
            cacheTime: 1 * 60 * 60 * 1000, // 缓存1小时
            cacheTimeKey: 'tongdun_black_box_time',
            cacheKey: 'tongdun_black_box',
        }
        var tongdunCore = {
            init: function (success) {
                var tgCurTime = new Date().getTime(); // 当前时间
                var tgPrevTime = localStorage.getItem(tongdunConfig.cacheTimeKey) || ''; // 上次缓存时间
                var tongdunBlackBox = this.getBlackBox();
                // 缓存时间有效
                var isCacheTimeValid  = !!tgPrevTime && tgCurTime - Number(tgPrevTime) < tongdunConfig.cacheTime
                if (!tongdunBlackBox || !isCacheTimeValid) {
                    this.initTongdun(success)
                } else {
                    // 缓存时间有效
                    if (success && success instanceof Function) {
                        success(tongdunBlackBox);
                    }
                }
            },
            initTongdun: function (success) {
                var { partner, appName } = this.getChannelInfo();
                window._fmOpt = {
                    partner,
                    appName,
                    success(data) {
                        // 在成功完成采集后，success 回调中可以获取到 black_box
                        // 这里可以设置客户需求的操作，传输 black_box 等操作
                        // 获取设备指纹黑盒数据，并提交到业务服务器 console.log('black_box: ', data)
                        // 同盾获取完成时间
                        var ableTime = new Date().getTime();
                        // 有效有效black_box
                        if (data && data.length <= 1024) {
                            // localStorage 处理
                            localStorage.setItem(tongdunConfig.cacheTimeKey, ableTime);
                            localStorage.setItem(tongdunConfig.cacheKey, data);
                        } else {
                            console.log("tongdun black_box: ", "当前为降级值");
                            localStorage.removeItem(tongdunConfig.cacheTimeKey);
                            localStorage.setItem(tongdunConfig.cacheKey, data);
                        }
                        // 回调
                        if (success && success instanceof Function) {
                            success(data);
                        }
                    },
                };
                var fm = document.createElement("script");
                fm.type = "text/javascript";
                fm.async = true;
                // var fsrc = (tgEnv == 'online') ? getFullUrl('/app/js/dist/fm.js') : '//nqa.liveme.com/app/js/dist/fm.js';
                var fsrc = "https://static.trustdecision.com/tdfp/us/abe609b4e29f9410320db51f260cbc10/fm.js";
                fm.src = `${fsrc}?t=${(new Date().getTime() / 3600000).toFixed(0)}`;
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(fm, s);
                // fm.onload = () => {
                //     // fm.js加载完成时间
                //     window.TONGDun.time.fmLoaded = new Date().getTime();
                // };
                // 缓存时间有效
            },
            getChannelInfo: function () {
                var tgType = this.getUAType()
                return {
                    partner: 'mars',
                    appName: tgType === 'h5' ? 'mars_h5' : 'mars_web',
                }
            },
            getUAType: function () {
                var UA = window.navigator.userAgent;
                var IsAndroid = /Android|HTC/i.test(UA);
                var IsIPad =
                    !IsAndroid &&
                    (/iPad/i.test(UA) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
                    !window.MSStream;
                var IsIPhone = !IsAndroid && /iPod|iPhone/i.test(UA);
                var tgType = "web";
                if (IsAndroid || IsIPad || IsIPhone) {
                    tgType = "h5";
                }
                return tgType;
            },
            clear: function () {
                localStorage.removeItem(tongdunConfig.cacheKey);
                localStorage.removeItem(tongdunConfig.cacheTimeKey);
            },
            getBlackBox: function () {
                var storage_black_box = localStorage.getItem(tongdunConfig.cacheKey) || "";
                return storage_black_box;
            },
        }
        window.TONGDun = tongdunCore;
        window.TONGDun.init();
    } catch (err) {
        console.log("tongdun-err", err);
    }
})();
