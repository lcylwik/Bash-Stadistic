materialAdmin

    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$resource', function ($resource) {
        this.getMessage = function (img, user, text) {
            
            var gmList = $resource("data/messages-notifications.json");

            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])

.service('notificationService', ['$resource', '$localStorage', '$rootScope', function ($resource, $localStorage, $rootScope) {
            return {
                init: function(){
                    $localStorage.Message = [];
                },
                add: function (message){
                    if(!$localStorage.Message){
                        $localStorage.Message = [];
                    }
                    $localStorage.Message.push(message);
                },
                getList: $localStorage.Message ? $localStorage.Message : [],
                delete: function(index){
                    delete $localStorage.Message[index];
                },
                deleteAll: function(){
                    $localStorage.Message = [];
                }
            }
    }])

    // =========================================================================
    // Transacciones Aceptadas, Rechazadas y estadistico
    // =========================================================================

    .service('SERVICIOS', ['$resource', '$http', function ($resource, $http) {
        return {
            getService: function () {
                return $http.get('http://localhost:8084/spring-css/rest/txn').then(function (trans) {
                    return trans;
                });
            },
            getServiceEstadistico: function () {
                return $http.get('http://localhost:8084/spring-css/rest/estadistico').then(function (est) {
                    return est;
                });
            },
        }

    }])

    // =========================================================================
    // Best Selling Widget Data (Home Page)
    // =========================================================================

    .service('bestsellingService', ['$resource', function ($resource) {
        this.getBestselling = function (img, name, range) {
            var gbList = $resource("data/best-selling.json");

            return gbList.get({
                img: img,
                name: name,
                range: range,
            });
        }
    }])


    // =========================================================================
    // Todo List Widget Data
    // =========================================================================

    .service('todoService', ['$resource', function ($resource) {
        this.getTodo = function (todo) {
            var todoList = $resource("data/todo.json");

            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================

    .service('recentitemService', ['$resource', function ($resource) {
        this.getRecentitem = function (id, name, price) {
            var recentitemList = $resource("data/recent-items.json");

            return recentitemList.get({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Recent Posts Widget Data
    // =========================================================================

    .service('recentpostService', ['$resource', function ($resource) {
        this.getRecentpost = function (img, user, text) {
            var recentpostList = $resource("data/messages-notifications.json");

            return recentpostList.get({
                img: img,
                user: user,
                text: text
            })
        }
    }])

    // =========================================================================
    // Data Table
    // =========================================================================

    .service('tableService', [function () {
        this.data = [{
            id: 1,
            transaccionID: 123490856,
            fuente: 12345,
            dia: 1491018278,
            nombre: "liliam",
            apellidos: "Martinez",
            estado: true
        }, {
            id: 2,
            transaccionID: 12553456,
            fuente: 12345,
            dia: 1490931934,
            nombre: "Lianet",
            apellidos: "Perez",
            estado: false
        }, {
            id: 3,
            transaccionID: 12553456,
            fuente: 234,
            dia: 1490931678,
            nombre: "Raul",
            apellidos: "Martinez",
            estado: true
        }, {
            id: 4,
            transaccionID: 12595786,
            fuente: 3456,
            dia: 1490845568,
            nombre: "Amet",
            apellidos: "Martinez",
            estado: true
        }, {
            id: 5,
            transaccionID: 12678956,
            fuente: 234,
            dia: 1490845568,
            nombre: "Lianet",
            apellidos: "Perez",
            estado: false
        }, {
            id: 6,
            transaccionID: 9873456,
            fuente: 3456,
            dia: 1490759189,
            nombre: "Pepe",
            apellidos: "Martinez",
            estado: true
        }, {
            id: 7,
            transaccionID: 987573456,
            fuente: 3456,
            dia: 1490759189,
            nombre: "Pepe",
            apellidos: "Martinez",
            estado: true
        }
        ];
    }])


    // =========================================================================
    // Malihu Scroll - Custom Scroll bars
    // =========================================================================
    .service('scrollService', function () {
        var ss = {};
        ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
            $(selector).mCustomScrollbar({
                theme: theme,
                scrollInertia: 100,
                axis: 'yx',
                mouseWheel: {
                    enable: true,
                    axis: mousewheelaxis,
                    preventDefault: true
                }
            });
        }

        return ss;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function () {
        var gs = {};
        gs.growl = function (message, type) {
            $.growl({
                message: message
            }, {
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500,
                animate: {
                    enter: 'animated bounceIn',
                    exit: 'animated bounceOut'
                },
                offset: {
                    x: 20,
                    y: 85
                }
            });
        }

        return gs;
    })
