/**
 * Created by danghongyang on 13-12-7.
 */

angular.module("editor", ["ui.sortable"]);


function Notes($scope, $http, $sce) {
    $scope.notes = data.notes;
    $scope.map = map;
    $scope.type_num_list = type_num_list;
    $scope.current = data.notes.posts[0];

    var editor = UM.getEditor('myEditor');
    editor.setContent($scope.current.content);

    var editorEvent = function () {
        $scope.current.content = this.getContent();
        $scope.current.is_published = 0;

        //触发一次
        $scope.$apply();
    };
    $scope.setCurrent = function (form) {
        editor.removeListener("contentChange", editorEvent);
        $scope.current.content = editor.getContent();
        $scope.current = form;
        editor.reset();
        editor.setContent($scope.current.content);
        editor.addListener("contentChange", editorEvent);
    };

    var delete_type_num = function (t) {
        for (var i = 0, len = $scope.type_num_list.length; i < len; i++) {
            if ($scope.type_num_list[i] == t) {
                $scope.type_num_list.splice(i, 1);
            }
        }
    };
    var add_type_num = function (t) {
        $scope.type_num_list.push(t);
    };
    var reset_type_num = function () {
        //这里需要setTimeout 0来喘息
        setTimeout(function () {
            var j = 0;
            for (var i = 0; i < $scope.notes.posts.length; i++) {
                if ($scope.notes.posts[i].type_id == 3) {
                    if ($scope.notes.posts[i].type_num != $scope.type_num_list[j]) {
                        $scope.notes.posts[i].type_num = $scope.type_num_list[j];
                        //标记已经修改
                        $scope.notes.posts[i].is_published = 0;
                        j++;
                    }
                }
            }
            //强制生效一次
            $scope.$apply();
        }, 0);
    };
    $scope.add = function () {
        var post = {};
        angular.extend(post, EMPTY_PATH);
        setTypeNum(post);
        var id = "sub" + $scope.notes.posts.length;
        post.id = id;
        $scope.map[id] = post;
        $scope.notes.posts.splice($scope.notes.posts.length - 1, 0, post);
        add_type_num(post.type_num);
        $scope.setCurrent(post);
    };
    $scope.remove = function (form) {
        if (confirm("确认删除?")) {
            remove(form, function () {
                var type_num = form.type_num;
                delete $scope.map[form.id];
                for (var i = 0; i < $scope.notes.posts.length; i++) {
                    if ($scope.notes.posts[i] == form) {
                        $scope.notes.posts.splice(i, 1);
                    }
                }
                delete_type_num(type_num);
            });
        }
    };
    $scope.getTitle = function (form) {
        var title;
        switch (form.type_id) {
            case 3:
            {
                title = form.title || "未填写";
                break;
            }
            case 6:
            {
                title = "实用攻略";
                break;
            }
        }
        return title;
    };
    $scope.sortableOptions = {
        items: "li:not(.not-sortable)",
        update: function (e, ui) {
            reset_type_num();
        }
    };
    $scope.isModified = function (post) {
        var isBlank = function (p) {
            return p.title == EMPTY_PATH.title && (p.content == EMPTY_PATH.content || p.content == "");
        };
        return post.is_published == 0 && !isBlank(post);
    };

    $scope.save = function(){
        console.log($scope.notes.posts);
        $scope.update_time = new Date();
        $scope.$apply();
    };
    $scope.publish = function(){
        var publishPosts = [];
        for (var i = 0; i < $scope.notes.posts.length; i++) {
            if ($scope.isModified($scope.notes.posts[i])) {
              publishPosts.push($scope.notes.posts[i]);
            }
        }
        console.log(publishPosts);
    };

    setInterval(function(){
        $scope.save();
    }, 30000);
}
