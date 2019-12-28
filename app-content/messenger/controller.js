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
            var $nameElement = $("span._3oh- a");
            let uid = $nameElement.attr("uid");
            $scope.username = $nameElement.text();
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
                chrome.storage.local.get("bgChat_HuynhNhon", function (obj) {
                    var bgInfo = obj.bgChat_HuynhNhon.find(x => x.uid == uid);
                    if (bgInfo !== undefined) {
                        setTimeout(function () {
                            $nameElement
                                .parents("._20bp")
                                .find("._4_j4")
                                .attr(
                                    "style",
                                    "background-image: url('" + bgInfo.bgUrl + "') !important;"
                                );
                        }, 200);
                    }
                });
                $(".add-bg").click(function (event) {
                    chrome.storage.local.get("bgChat_HuynhNhon", function (obj) {
                        let list = obj.bgChat_HuynhNhon || [];
                        console.log(list);
                        let ind = list.findIndex(x => x.uid == uid);
                        if (ind !== -1) {
                            $scope.image_url = list[ind].bgUrl;
                        } else $scope.image_url = "";
                        $scope.id = uid;

                        $scope.$apply();
                        $("#modal_change_bg").modal();
                        $scope.save = function () {
                            let index = list.findIndex(x => x.uid == uid);
                            if ($scope.image_url !== "") {
                                if (index !== -1) list[index].bgUrl = $scope.image_url;
                                else
                                    list.push({
                                        uid: $scope.id,
                                        username: $scope.username,
                                        bgUrl: $scope.image_url
                                    });
                            } else {
                                if (index !== -1) list.splice(index, 1);
                            }
                            chrome.storage.local.set({
                                    bgChat_HuynhNhon: list
                                },
                                function () {
                                    $("#modal_change_bg").modal("hide");
                                    if ($scope.image_url == '') {
                                        location.reload();
                                    } else {
                                        chrome.storage.local.get("bgChat_HuynhNhon", function (obj) {
                                            var bgInfo = obj.bgChat_HuynhNhon.find(x => x.uid == uid);
                                            setTimeout(function () {
                                                $nameElement
                                                    .parents("._20bp")
                                                    .find("._4_j4")
                                                    .attr(
                                                        "style",
                                                        "background-image: url('" + bgInfo.bgUrl + "') !important;"
                                                    );
                                            }, 200);
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