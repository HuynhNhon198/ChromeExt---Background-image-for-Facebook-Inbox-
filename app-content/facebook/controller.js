app.controller("facebookCtrl", async function ($scope, setInfo, storeImage) {
    $scope.url = $(location).attr("href");
    $scope.image_url = "";
    var id_own = $('img._2qgu._7ql._1m6h.img').attr('id').match(/(\d+)/)[0];
    await setInfo.set(id_own);
    
    var num = 0;
    var datas = [];

    chrome.storage.local.get("facebookBG", function (obj) {
        datas = obj.facebookBG || [];
    });

    chrome.storage.onChanged.addListener(function (changes) {
        if (changes.facebookBG) {
            datas = changes.facebookBG.newValue;
            setBg()
        }
    })

    setInterval(function () {
        if ($("._5qi9._5qib:not(._3001)").length !== num) {
            num = $("._5qi9._5qib:not(._3001)").length;
            setBg();
            setOption();
        }
    }, 1000);

    function setOption() {

        $("._461_").unbind("click");
        $("._461_").click(function (event) {

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
                    $("#modal_change_bg").modal();
                    storeImage.getData('facebookBG',id_own,$scope.id ).then(data=>{
                        $scope.history = [];
                        $scope.docid = '';
                        if (!jQuery.isEmptyObject(data) ) {
                            $scope.docid = data.id
                            $scope.history = data.history
                            $scope.image_url = data.imgUrl;
                        } else $scope.image_url = "";
                        $scope.$apply();
                        
                        $scope.selectImgFromHistory = function (i) {
                            if (i !== $scope.image_url) {
                                $scope.image_url = i;
                            }
                        }
                        $scope.save = function () {
                            storeImage.save('facebookBG', id_own, $scope.id, $scope.image_url, $scope.username, $scope.history, $scope.docid).then(() => {
                                $("#modal_change_bg").modal("hide");
                                setBg();
                            })
                        };
                        $scope.upload = function () {
                            $("#fileInput").unbind('click')
                            $("#fileInput").click();
                        };
                        $("#fileInput").unbind('change')
                        $("#fileInput").on("change", function () {
                            var $files = $(this).get(0).files;
                            storeImage.upload($files[0], 'facebook', id_own).then(url => {
                                $scope.image_url = url;
                                $scope.$apply();
                            });
                        });
                    })
                    
                });
            }, 500);
        });
    }

    function setBg() {

        // setTimeout(function () {
        if (datas.length > 0) {
            $('._5qi9._5qib > div.opened').each(function () {

                let id = $(this).attr('class').toString().split(':')[1];
                storeImage.getData('facebookBG',id_own, id ).then(data=>{
                    if (!jQuery.isEmptyObject(data)) {
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
                                'background-image : url("' + data.imgUrl + '") !important; background-position: center center!important; background-size: cover!important'
                            )
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
                
            })
        }
        // }, 1000)

    }
});