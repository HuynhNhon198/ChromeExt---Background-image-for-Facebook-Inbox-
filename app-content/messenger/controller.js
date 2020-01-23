app.controller("messCtrl", async function ($scope, setInfo, storeImage ) {
    $scope.url = $(location).attr("href");
    var id_own = ''
    await new Promise(r => {
        
        if ($scope.url.indexOf('https://www.messenger.com/') > -1) {
            chrome.storage.local.get('info_own', function (obj) {
                if (Object.keys(obj).length === 0) {
                    alert('Bạn yêu ơi mở trang facebook.com lên xong quay lại trang messenger này là được nhé');
                    window.location.replace("https://www.facebook.com/");
                } else {
                    id_own = obj.info_own.id
                    r()
                }
            })
        } else {
            id_own = $('img._2qgu._7ql._1m6h.img').attr('id').match(/(\d+)/)[0];
            r();
        }
    })

    await setInfo.set(id_own);

    chrome.storage.local.get("messengerBG", function (obj) {
        datas = obj.messengerBG || [];
        getBGMess();
    });

    chrome.storage.onChanged.addListener(function (changes) {
        if (changes.messengerBG) {
            datas = changes.messengerBG.newValue;
            getBGMess()
        }
    })

    let bg = chrome.extension.getURL("/images/bg.jpg");
    $("._li")
        .attr(
            "style",
            "background: url(" + bg + ");background-size: cover; background-position: center center"
        );
    
    $("li._5l-3._1ht1").click(function () {
        getBGMess();
    });

    function getBGMess() {
        var temp = 0;
        var timer = setInterval(function () {
            var $activeUser = $("li._1ht1._6zk9._1ht2 > div._5l-3._1ht5");

            if ($activeUser.attr("data-testid")) {
                let uid = $activeUser.attr("data-testid").match(/\d+/)[0];
                $scope.username = $activeUser.find('span._1ht6._7st9').text();
                if (uid !== temp) {
                    clearInterval(timer);
                    $(".add-bg").remove();
                    $("._fl2._6ymr")
                        .prepend(`<li class="add-bg" title="Background Image Messenger For ` + $scope.username + `">
                    <a aria-expanded="true" class="_30yy" role="button">
                        <div class="_6yms">
                            <i class="context material-icons" style="font-size: 35px;">photo</i>
                        </div>
                    </a>
                </li>`);
                    temp = uid;
                    storeImage.getData('messengerBG',id_own, uid ).then(bgInfo=>{
                        // console.log(bgInfo);
                        if (Object.keys(bgInfo).length !== 0 && bgInfo.imgUrl !== '') {
                            // console.log(bgInfo.imgUrl);
                            setTimeout(function () {
                                $activeUser
                                    .parents("._li")
                                    .attr(
                                        "style",
                                        "background: url('" + bgInfo.imgUrl + "');background-size: cover; background-position: center center"
                                    );
                            }, 200);
                        } else {
                            let bg = chrome.extension.getURL("/images/bg.jpg");
                            $activeUser
                                .parents("._li")
                                .attr(
                                    "style",
                                    "background: url(" + bg + ");background-size: cover; background-position: center center"
                                );
                        }
                        $(".add-bg").click(function (event) {

                            storeImage.getData('messengerBG',id_own, uid ).then(bgInfo2=>{
                                $scope.history = [];
                                $scope.docid = '';
                                let data = bgInfo2;
                                if (data) {
                                    $scope.docid = data.id;
                                    $scope.image_url = data.imgUrl;
                                    $scope.history = data.history
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
                                    storeImage.save('messengerBG', id_own, $scope.id, $scope.image_url, $scope.username, $scope.history, $scope.docid).then(() => {
                                        $("#modal_change_bg").modal("hide");
                                        if ($scope.image_url == '') {
                                            location.reload();
                                        } else {
                                            storeImage.getData('messengerBG',id_own, uid ).then(bgInfo1=>{
                                                if (Object.keys(bgInfo1).length !== 0   && bgInfo.imgUrl !== '') {
                                                    setTimeout(function () {
                                                        $activeUser
                                                            .parents("._li")
                                                            .attr(
                                                                "style",
                                                                "background: url('" + bgInfo1.imgUrl + "');background-size: cover; background-position: center center"
                                                            );
                                                    }, 200);
                                                } else {
                                                    let bg = chrome.extension.getURL("/images/bg.jpg");
                                                    $activeUser
                                                        .parents("._li")
                                                        .attr(
                                                            "style",
                                                            "background: url(" + bg + ");background-size: cover; background-position: center center"
                                                        );
                                                }
                                            })
                                            
                                        }
                                    })
        
                                };
                                $scope.upload = function () {
                                    $("#fileInput").unbind('click')
                                    $("#fileInput").click();
                                };
                                $("#fileInput").unbind('change')
                                $("#fileInput").on("change", function () {
                                    var $files = $(this).get(0).files;
                                    
                                    storeImage.upload($files[0], 'messenger', id_own).then(url => {
                                        $scope.image_url = url;
                                        $scope.$apply();
                                    });
                                    // Replace ctrlq with your own API key
                                });
                            })

                            
                        });
                    })
                    
                    
                }
            }

        }, 400);
    }
});