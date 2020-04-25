$(function () {
    // ---------------  获取所有的文章，并渲染到页面中 ---------------
    // 文章列表获取，定义请求参数
    let data = {
        pagenum: 1, // 页码值，1表示获取第1页的数据
        pagesize: 2, // 每页显示多少条数据
        // cate_id: , // 分类的id
        // state: '', // 文章的状态，可选 已发布 草稿
    };
    renderArticle();
    function renderArticle() {
        $.ajax({
            url: '/my/article/list',
            data: data,
            success: function (res) {
                console.log(res);
                if (res.status === 0) {
                    let str = template('list', res);
                    $('tbody').html(str);
                    // ajax请求成功之后，调用显示分页的函数
                    renderPage(res.total);
                }
            }
        });
    }

    var laypage = layui.laypage;
    // 实现分页的函数
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: data.pagesize, // 每页显示多少条
            limits: [2, 3, 5, 10], // 下拉框，可以切换每页显示的条数
            curr: data.pagenum, // 默认显示第页码（有背景色）
            // groups: 3, // 连续出现的页码个数
            layout: ['prev', 'page', 'next', 'limit', 'count', 'skip'],
            // 点击页码之后，触发的函数是下面的jump函数
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // console.log(first);
                // 首次不执行
                if (!first) {
                    //do something
                    // 改变 data.pagenum = obj.curr;
                    data.pagenum = obj.curr;
                    data.pagesize = obj.limit;
                    renderArticle();
                }
            }
        });
    }

    // ----------------  定义过滤器函数，处理时间 ------------------
    // template.defaults.imports.函数名 = function (value) { // value 就是使用过滤器的值 }
    template.defaults.imports.formatDate = function (value) {
        let date = new Date(value);
        let year = date.getFullYear();
        let month = addZero(date.getMonth() + 1);
        let day = addZero(date.getDate());
        let hour = addZero(date.getHours());
        let minute = addZero(date.getMinutes());
        let second = addZero(date.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }
    // 创建一个补零函数
    function addZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // -----------  删除文章 ----------------------
    $('body').on('click', '.delete', function () {
        let id = $(this).attr('data-id');
        // 询问是否要删除
        layer.confirm('是否要删除呢？', function (index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status === 0) {
                        // 重新渲染页面
                        renderArticle();
                    }
                }
            });
            layer.close(index);
        });

    });
});