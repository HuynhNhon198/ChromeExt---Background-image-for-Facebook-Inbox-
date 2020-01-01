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
                .parents("._5qi9._5qib > div")
            let id = a_el.attr('class').split(':')[1].toString();
            $scope.username = a_el.find('._66n2 ._1ogo').text();
            $scope.id = id;
            setTimeout(function () {
                $("li.add-bg").remove();
                $("ul._2pi2._6ff6").prepend(
                    `<li class="add-bg" aria-disabled="false" role="menuitem" tabindex="0" class="_8l9y" id="` +
                    id +
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
                        let ind = list.findIndex(x => x.uid == id);
                        if (ind !== -1) {
                            $scope.history = list[ind].historyBg
                            $scope.image_url = list[ind].bgUrl;
                        } else $scope.image_url = "";


                        $scope.$apply();
                        $("#modal_change_bg").modal();
                        $scope.selectImgFromHistory = function(i){
                            if(i !== $scope.image_url) {
                                $scope.image_url = i;
                            }
                        }
                        $scope.save = function () {
                            let index = list.findIndex(x => x.uid == id);
                            if ($scope.image_url !== "") {
                                
                                if (index !== -1) {
                                    list[index].historyBg = list[index].historyBg || []
                                    if(!list[index].historyBg.includes(list[index].bgUrl))
                                        list[index].historyBg.push(list[index].bgUrl)
                                    list[index].bgUrl = $scope.image_url;
                                }
                                else
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
                                bgChat_HuynhNhon: list
                            });
                            $("#modal_change_bg").modal("hide");
                            setBg();
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
        // setTimeout(function () {
        chrome.storage.local.get("bgChat_HuynhNhon", function (obj) {
            if (obj.bgChat_HuynhNhon.length > 0) {

                // obj.bgChat_HuynhNhon.forEach(val => {

                // });

                $('._5qi9._5qib > div.opened').each(function () {
                    console.log($(this).attr('class'));
                    let id = $(this).attr('class').toString().split(':')[1];
                    let data = obj.bgChat_HuynhNhon.find(x => x.uid == id);
                    if (data) {
                        var chatWindow = $(this).find(
                            "a._2yg8"
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
                                "background-image : url('" + data.bgUrl + "') !important"
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
                    }
                })
            }
        });
        // }, 1000)

    }
});