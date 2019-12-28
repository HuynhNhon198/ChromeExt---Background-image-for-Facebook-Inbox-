app.controller("facebookCtrl", function ($scope) {
    $scope.url = $(location).attr("href");
    $scope.image_url = "";

    var num = 0;
    setInterval(function () {
        if ($("._5qi9._5qib:not(._3001)").length !== num) {
            num = $("._5qi9._5qib:not(._3001)").length;
            setBg();
            setOption();
        }
    }, 1000);

    function setOption() {
        console.log('set+op');
        $("._461_").unbind("click");
        $("._461_").click(function (event) {
            console.log("click");
            let a_el = $(this)
                .parents("._5qi9._5qib")
                .find("._4jeg a");
            let id = a_el
                .attr("data-hovercard")
                .toString()
                .match(/\d+/);
            setTimeout(function () {
                $("li.add-bg").remove();
                $("ul._2pi2._6ff6").prepend(
                    `<li class="add-bg" aria-disabled="false" role="menuitem" tabindex="0" class="_8l9y" id="` +
                    id[0] +
                    `" title="click để chọn hình nền (chỉ mình tôi): ` +
                    id +
                    `">
                      <div class="_6ff7" style="letter-spacing: normal; color: rgb(29, 33, 41); font-size: 12px; font-weight: 600; font-family: Arial, sans-serif; line-height: 16px; min-height: 26px;">
                          <div class="_6pdg">
                          <i class="context material-icons">photo</i>
                          <span class="_6ng4">Background Image</span>
                          </div>
                      </div>
                  </li>`
                );
                $(".add-bg").click(function (event) {
                    chrome.storage.local.get("bgChat_HuynhNhon", function (obj) {
                        let list = obj.bgChat_HuynhNhon || [];
                        console.log(list);
                        let ind = list.findIndex(x => x.uid == id);
                        if (ind !== -1) {
                            $scope.image_url = list[ind].bgUrl;
                        } else $scope.image_url = "";
                        $scope.id = id[0];
                        $scope.username = a_el.text();
                        $scope.$apply();
                        $("#modal_change_bg").modal();
                        $scope.save = function () {
                            let index = list.findIndex(x => x.uid == id);
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

                            console.log(list);
                            chrome.storage.local.set({
                                    bgChat_HuynhNhon: list
                                },
                                function () {
                                    $("#modal_change_bg").modal("hide");
                                    setBg();
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
            }, 500);
        });
    }



    function setBg() {
        console.log('set_bg');
        chrome.storage.local.get("bgChat_HuynhNhon", function (obj) {
            if (obj.bgChat_HuynhNhon.length > 0) {
                obj.bgChat_HuynhNhon.forEach(val => {
                    var $tabChat = $("._5qi9._5qib");
                    var chatWindow = $tabChat.find(
                        "a._2yg8[data-hovercard = '/ajax/hovercard/chat.php?id=" +
                        val.uid +
                        "&type=chat']:eq(0)"
                    );
                    var colortext = chatWindow
                        .parents("._6vu5._6z9d.fbNubFlyoutInner._6vu1")
                        .find("._1ia._2sz2")
                        .css("background-color");
                    chatWindow
                        .parents("._6vu5._6z9d.fbNubFlyoutInner._6vu1")
                        .find("._1i6a")
                        .attr(
                            "style",
                            "background-image : url('" + val.bgUrl + "') !important"
                        );
                    chatWindow
                        .parents("._6vu5._6z9d.fbNubFlyoutInner._6vu1")
                        .attr(
                            "style",
                            "border: " +
                            colortext +
                            " solid 1px !important; border-bottom:none !important"
                        );
                    chatWindow
                        .parents("._6vu5._6z9d.fbNubFlyoutInner._6vu1")
                        .find("._510g._510e.seen ._510f")
                        .attr(
                            "style",
                            "color: #fff !important;background: #0c1;padding: 3px 5px;margin-bottom: 5px;border-radius: 25px;"
                        );
                    chatWindow
                        .parents("._6vu5._6z9d.fbNubFlyoutInner._6vu1")
                        .find("._5w-5 ._5w-6")
                        .attr("style", "color: #e2dbdb !important;");
                });
            }
        });
    }
});