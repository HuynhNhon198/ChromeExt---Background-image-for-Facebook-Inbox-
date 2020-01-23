'use strict';
// const rootURL = 'https://us-central1-btlweb-dev.cloudfunctions.net/api/'
const rootURL = 'http://localhost:5000/background-image-for-fb-inbox/us-central1/api/'
var app = angular.module("myapp", []);

app.config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});
app.filter('num', function () {
    return function (input) {
        return parseInt(input, 10);
    }
});
app.service('setInfo', function () {
    this.set = (id) => {
        return new Promise(r => {
            chrome.storage.local.set({
                info_own: {
                    id,
                    mtime: (new Date()).getTime()
                }
            }, () => r());
        })
    }
})

app.service('storeImage', function () {

    this.save = (source, from, to, imgUrl, username, history, iddoc) => {
        return new Promise(r => {
            var n = new Noty({
                    layout: "topLeft",
                    theme: "relax",
                    type: "warning",
                    text: "ĐANG LƯU NHÉ..."
                })
                .on("afterShow", function () {
                    const url = rootURL + "set_data";
                    const body = {
                        source,
                        from,
                        to,
                        imgUrl,
                        username,
                        history,
                        iddoc
                    };
                    fetch(url, {
                        method: "POST",
                        body: JSON.stringify(body),
                    }).then(
                        response => {
                            response.json().then((d) => {
                                n.close();
                                r();
                            })

                        }
                    )
                }).show()

        })
    }

    this.upload = (file, source, uid) => {
        return new Promise(r => {
            var n = new Noty({
                    layout: "topLeft",
                    theme: "relax",
                    type: "warning",
                    text: "ĐANG UPLOAD..."
                })
                .on("afterShow", function () {
                    if (file.size < (10 * 1024 * 1024)) {
                        let data = new FormData(document.getElementById('fileupload'));
                        var opts = {
                            url: rootURL + 'upload',
                            type: 'POST',
                            data: data,
                            processData: false,
                            contentType: false,
                            success: function (re) {
                                n.close();
                                r(re);
                            },
                            error: function (r) {
                                console.log('error', r);
                            }
                        };
                        jQuery.ajax(opts);
                        
                    } else {
                        n.close();
                        alert('size of image must be < 10 Mb')
                    }
                })
                .show();
        })
        // Replace ctrlq with your own API key
    }

    this.getData = (col, from, to) => {
        return new Promise(re => {
            fetch(rootURL + 'get_data/' + col + '?ids=' + from + ',' + to)
                .then(async r => {
                    if (r.status === 200) {
                        re(await r.json());
                    }
                })
                .catch(e => console.error('Boo...' + e));
        })

    }
})