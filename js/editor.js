/**
 * Created by danghongyang on 13-12-7.
 */

angular.module("editor", []);


function Notes($scope,$http, $sce) {
    $scope.notes = data.notes;
    $scope.map = map;
    $scope.current = data.notes.posts[0];


    var editor = UM.getEditor('myEditor');
    editor.setContent($scope.current.content);

    $scope.setCurrent = function(form){
        $scope.current.content = editor.getContent();
        $scope.current = form;
        editor.reset();
        editor.setContent($scope.current.content);
    };
    $scope.add = function(){
        var post = {};
        angular.extend(post, EMPTY_PATH);
        setTypeNum(post);
         var id = "sub" + $scope.notes.posts.length;
        post.id = id;
        $scope.map[id] = post;
        $scope.notes.posts.splice($scope.notes.posts.length -1,0, post );
        $scope.setCurrent(post);
    };
    $scope.remove = function(form){
        if(confirm("确认删除?")) {
            remove(form, function(){
                delete $scope.map[form.id];
                for(var i = 0; i< $scope.notes.posts.length; i++) {
                    if($scope.notes.posts[i] == form) {
                        $scope.notes.posts.splice(i,1);
                    }
                }
            });
        }
    };
    $scope.getTitle = function(form){
        var title ;
        switch (form.type_id) {
            case 3: {
                title =  form.title || "未填写";
                break;
            }
            case 6: {
                title = "实用攻略";
                break;
            }
        }
        return title;
    };

  //  return;
//以下代码只为支持sortable
    var newList, oldList;
    var getTypeNumListByIds = function(list) {
        var r = [];
        for(var i = 0; i< list.length; i++)  {
            r.push($scope.map[list[i]]["type_num"]);
        }
        return r;
    };

    var getIndexByPost = function(post){
        for(var i = 0,len = $scope.notes.posts.length;i<len;i++) {
            if( $scope.notes.posts[i] == post) {
                return i;
            }
        }
        return false;
    };
    var sort = function(newList, movedItem){
        var movedPost = $scope.map[movedItem];
        var pos = getIndexByPost(movedPost);

        $scope.notes.posts.splice(pos,1);
        for(var i = 0,len = newList.length; i<len;i++) {
            if(newList[i] == movedItem) {
                if(i == newList.length -1) {
                    var last = $scope.map[newList[i-1]];
                    pos = getIndexByPost(last);
                    $scope.notes.posts.splice(pos+1,0, movedPost);
                }
                else {
                    var first = $scope.map[newList[i+1]];
                    pos = getIndexByPost(first);
                    $scope.notes.posts.splice(pos,0, movedPost);
                }
            }
        }
        $scope.$apply();
    };
    $(".sortable").sortable({
        items: "li:not(.not-sortable)",
        start: function (event, ui) {
            oldList = ($(this).sortable("toArray"));
        },
        stop: function (event, ui) {
            newList = ($(this).sortable("toArray"));

            var movedItem = $(ui.item).attr("id");

            var oldTypeNums = getTypeNumListByIds(oldList);
            for(var i = 0; i < oldList.length; i++) {
                if(oldList[i] != newList[i]) {
                    $scope.map[newList[i]].type_num = oldTypeNums[i];
                }
            }
            sort(newList,movedItem);
            console.log($scope.notes.posts[$scope.notes.posts.length -1].type_id == 6);

        }
    });
}
