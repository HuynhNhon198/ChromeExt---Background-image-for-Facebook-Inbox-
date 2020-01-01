app.controller("messCtrl", function ($scope) {
    $scope.url = $(location).attr("href");
    console.log($scope.url);

    getBGMess();
    $("li._5l-3._1ht1").click(function () {
        getBGMess();
    });

    function getBGMess() {
        var temp = 0;
        var timer = setInterval(function () {
            var $activeUser = $("li._1ht1._6zk9._1ht2 > div._5l-3._1ht5");
            console.log($activeUser.attr("data-testid"));
            let uid = $activeUser.attr("data-testid").match(/\d+/)[0];
            $scope.username = $activeUser.find('span._1ht6._7st9').text();
            if (uid !== temp) {
                clearInterval(timer);
                $(".add-bg").remove();
                $("._fl2._6ymr")
                    .prepend(`<li class="add-bg" title="Background Image For ` + $scope.username + `">
                <a aria-expanded="true" class="_30yy" role="button">
                    <div class="_6yms">
                        <i class="context material-icons" style="font-size: 35px;">photo</i>
                    </div>
                </a>
            </li>`);
                temp = uid;
                chrome.storage.local.get("bgChatMess_HuynhNhon", function (obj) {
                    var bgInfo = obj.bgChatMess_HuynhNhon.find(x => x.uid == uid);
                    if(bgInfo) {
                        setTimeout(function () {
                            $activeUser
                            .parents("._li")
                            .attr(
                                "style",
                                "background: url(" + bgInfo.bgUrl + ");background-size: cover; background-position: center center"
                            );
                        }, 200);
                    }else {
                        let bg = chrome.extension.getURL("/images/bg.jpg");
                        $activeUser
                            .parents("._li")
                            .attr(
                                "style",
                                "background: url(" + bg + ");background-size: cover; background-position: center center"
                            );
                    }
                });
                $(".add-bg").click(function (event) {
                    chrome.storage.local.get("bgChatMess_HuynhNhon", function (obj) {
                        let list = obj.bgChatMess_HuynhNhon || [];

                        let ind = list.findIndex(x => x.uid == uid);
                        if (ind !== -1) {
                            $scope.image_url = list[ind].bgUrl;
                            $scope.history = list[ind].historyBg
                        } else $scope.image_url = "";
                        $scope.id = uid;

                        $scope.$apply();
                        $("#modal_change_bg").modal();
                        $scope.selectImgFromHistory = function (i) {
                            if (i !== $scope.image_url) {
                                $scope.image_url = i;
                            }
                        }
                        $scope.save = function () {
                            let index = list.findIndex(x => x.uid == uid);
                            if ($scope.image_url !== "") {
                                if (index !== -1) {
                                    list[index].historyBg = list[index].historyBg || []
                                    if (!list[index].historyBg.includes(list[index].bgUrl))
                                        list[index].historyBg.push(list[index].bgUrl)
                                    list[index].bgUrl = $scope.image_url;
                                } else
                                    list.push({
                                        uid: $scope.id,
                                        username: $scope.username,
                                        bgUrl: $scope.image_url,
                                        historyBg: []
                                    });
                            } else {
                                if (index !== -1) list.splice(index, 1);
                            }
                            chrome.storage.local.set({
                                    bgChatMess_HuynhNhon: list
                                },
                                function () {
                                    $("#modal_change_bg").modal("hide");
                                    if ($scope.image_url == '') {
                                        location.reload();
                                    } else {
                                        chrome.storage.local.get("bgChatMess_HuynhNhon", function (obj) {
                                            var bgInfo = obj.bgChatMess_HuynhNhon.find(x => x.uid == uid);
                                            if(bgInfo) {
                                                setTimeout(function () {
                                                    $activeUser
                                                    .parents("._li")
                                                    .attr(
                                                        "style",
                                                        "background: url(" + bgInfo.bgUrl + ");background-size: cover; background-position: center center"
                                                    );
                                                }, 200);
                                            }else {
                                                let bg = chrome.extension.getURL("/images/bg.jpg");
                                                $activeUser
                                                    .parents("._li")
                                                    .attr(
                                                        "style",
                                                        "background: url(" + bg + ");background-size: cover; background-position: center center"
                                                    );
                                            }
                                            
                                        });
                                    }

                                }
                            );
                        };
                        $scope.upload = function () {
                            $("#fileInput").unbind('click')
                            $("#fileInput").click();
                        };
                        $("#fileInput").unbind('change')
                        $("#fileInput").on("change", function () {
                            var $files = $(this).get(0).files;
                            var n = new Noty({
                                    layout: "topLeft",
                                    theme: "relax",
                                    type: "warning",
                                    text: "ĐANG UPLOAD..."
                                })
                                .on("afterShow", function () {
                                    var settings = {
                                        async: false,
                                        crossDomain: true,
                                        processData: false,
                                        contentType: false,
                                        type: "POST",
                                        url: "https://api.imgur.com/3/image",
                                        headers: {
                                            Authorization: "Client-ID 1a75998a3de24bd",
                                            Accept: "application/json"
                                        },
                                        mimeType: "multipart/form-data"
                                    };
                                    var formData = new FormData();
                                    formData.append("image", $files[0]);
                                    settings.data = formData;

                                    $.ajax(settings).done(function (response) {
                                        n.close();
                                        var obj = JSON.parse(response);
                                        $scope.image_url = obj.data.link;
                                        $scope.$apply();
                                    });
                                })
                                .show();
                            // Replace ctrlq with your own API key
                        });
                    });
                });
            }
        }, 400);
    }
});