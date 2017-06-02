materialAdmin
    .controller('emisorController', function ($sce, $document, ngTableParams, tableService, $scope, $rootScope, SERVICIOS, notificationService, $filter, $timeout, $localStorage) {
        var tctrl = this;
        var emisorColumn = 'fiidEmisor';

        $rootScope.messages = [];

        $scope.filters = {
            firstDate: moment().subtract(15, 'days').format('YYYY-MM-DD'),
            lastDate: moment().format('YYYY-MM-DD')
        };
        $scope.onTimeSet = function (newDate, oldDate, field) {
            $scope[field] = !$scope[field];
        }

        $scope.datos = SERVICIOS.getService().then(function (trans) {
            $scope.datos = trans.data;
            $scope.temp = $scope.datosTrans;
            tctrl.initCatalogo();

            $scope.tableParams = tctrl.generateTableParams();

            tctrl.generateData();
            tctrl.generateChart();


        });
        tctrl.estadisticos = SERVICIOS.getServiceEstadistico().then(function (data) {
            tctrl.estadisticos = data.data;
            $scope.dataReady = true;
        });

        tctrl.initCatalogo = function () {
            var obj = $scope.datos[0];
            $scope.catalogo = {};
            Object.getOwnPropertyNames(obj).forEach(function (val, idx, array) {
                $scope.catalogo[val] = tctrl.getElementsFromArray($scope.datos, val);
            });
        }

        tctrl.getElementsFromArray = function (array, columnaAcomparar) {
            var emisor = [];
            angular.forEach(array, function (element) {
                if (emisor.indexOf(element[columnaAcomparar].toString()) == -1) {
                    emisor.push(element[columnaAcomparar].toString());
                }
            })
            return emisor;
        }


        tctrl.getColumnas = function (emisor) {

            var firstDate = $scope.filters.firstDate,
                columnas = [], totalXEmisor = 0, total = "TotalDeTotal";

            var data = $scope.datos.filter(tctrl.filterFunction);

            while (moment(firstDate).isBefore(moment($scope.filters.lastDate))) {
                var day = moment(firstDate).format("D-MM-YY");
                var cant = tctrl.getCantTransacciones(emisorColumn, emisor, day, 'prtProcDte', data);
                $scope.arrayTotal[day] = $scope.arrayTotal[day] != undefined ? $scope.arrayTotal[day] + cant : cant;
                $scope.arrayTotal[total] = $scope.arrayTotal[total] != undefined ? $scope.arrayTotal[total] + cant : cant;
                totalXEmisor += cant;
                var obj = {
                    title: day,
                    field: day,
                    cantidad: cant //TODO: aki se cambian los literales de las columnas
                }
                columnas.push(obj);
                firstDate = moment(firstDate).add(1, 'days');
            }
            columnas.push({
                title: 'Total',
                field: 'Total',
                cantidad: totalXEmisor,
            });
            $scope.columnas = columnas;

            return columnas;
        }


        tctrl.getCantTransacciones = function (columna, valor, dia, nombreColumnaFecha, data) {
            var cant = 0;
            angular.forEach(data, function (value) {
                if (value[columna] == valor && $filter('date')(value[nombreColumnaFecha], 'd-MM-yy') == dia) {
                    cant++;
                }
            });
            return cant;
        }

        tctrl.filterFunction = function (el) {
            var rtn = true;
            if (!$scope.filters.all) {
                return rtn;
            }
            Object.getOwnPropertyNames($scope.filters.all).forEach(function (val, idx, array) {

                if ($scope.filters.all[val] && $scope.filters.all[val] != "" && $scope.filters.all[val] instanceof Array) {
                    var temp = false;
                    angular.forEach($scope.filters.all[val], function (value) {
                        if (el[val] == value) {
                            temp = true;
                        }
                    });
                    rtn = rtn && temp;
                } else if ($scope.filters.all[val] && $scope.filters.all[val] != "" && typeof $scope.filters.all[val] === "string") {
                    if (el[val].indexOf($scope.filters.all[val]) === -1) {
                        rtn = false;
                    }
                }
            });

            return rtn;
        }


        //para los filtros
        $scope.$watch('filters', function () {
            $scope.tableParams = tctrl.generateTableParams();
            tctrl.generateData();
            tctrl.generateChart();
        }, true);


        // tabla con filtro por emisor de respuesta
        tctrl.generateTableParams = function () {
            return new ngTableParams({
                    page: 1,
                    count: 10


                },
                {
                    total: $scope.catalogo ? $scope.catalogo[emisorColumn].length : 0,
                    //Funcion para el paginador
                    getData: function ($defer, params) {

                        var data = [];
                        $scope.arrayTotal = {};

                        angular.forEach($scope.catalogo[emisorColumn], function (emisor) {
                            var obj = {
                                title: emisor,
                                dias: tctrl.getColumnas(emisor)
                            }

                            data.push(obj);
                        })

                        data = params.sorting() ?
                            $filter('orderBy')(data, params.orderBy()) :
                            data;

                        $scope.tableData = data;
                        params.total(data.length); // set total for recalc pagination
                        data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        $defer.resolve(data);
                    }
                });
        };

        // métodos para la gráfica
        tctrl.generateData = function () {
            var data = [];
            $scope.arrayTotal = {};
            if ($scope.catalogo) {
                angular.forEach($scope.catalogo[emisorColumn], function (emisor) {
                    var obj = {
                        title: emisor,
                        dias: tctrl.getColumnas(emisor)
                    }
                    data.push(obj);
                })
                $scope.tableData = data;
            }
        }


        tctrl.findCantByDay = function (array, day) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].title == day && array[i].title != "Total") {
                    return array[i].cantidad;
                }
            }
            return 0;
        }
        tctrl.getDaysByEmisor = function (array, emisor) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].title == emisor) {
                    return array[i].dias;
                }
            }
            return 0;
        }

        //Notificaciones

        tctrl.getClass = function (cantidad, emisor, fecha) {
            var alfa = 2.575;
            var estadistico = tctrl.estadisticos.filter(function (element) {
                return moment(element.fecha).format('YYYY-MM') == moment(fecha, 'd-MM-YY').subtract(1, 'months').format('YYYY-MM') && emisor == element.fiidEmisor;
            })[0];
            //$rootScope.cant = $rootScope.cant ? $rootScope.cant + 1 : 1;
            if (estadistico && cantidad > (estadistico.media + estadistico.desviacion * alfa)) {
                //$rootScope.messages.push({
                //    img: "",
                //    type: "Sobrepasado",
                //    text: "El d�a '" + fecha + "' se realizaron m�s transacciones"
                //});

                return 'color-danger';
            } else if (estadistico && cantidad < (estadistico.media - estadistico.desviacion * alfa)) {
                //$rootScope.messages.push({
                //    img: "",
                //    type: "Por Debajo",
                //    text: "El d�a '" + fecha + "' se realizaron menos transacciones"
                //});
                return 'color-primary';
            } else {
                return 'red';
            }
        }


        // Gráfica Line Chart

        tctrl.generateChart = function () {

            $scope.myChartObject = {};

            $scope.myChartObject.type = "LineChart";
            $scope.myChartObject.data = {cols: [], rows: []};

            $scope.myChartObject.data.cols.push({
                "id": "date",
                "label": "Fecha",
                "type": "string",
                "p": {}
            });


            if ($scope.catalogo) {
                angular.forEach($scope.catalogo[emisorColumn], function (value) {

                    $scope.myChartObject.data.cols.push({
                        "id": value,
                        "label": value,
                        "type": "number",
                        "p": {}
                    });

                });
            }
            angular.forEach($scope.columnas, function (object) {
                if (object.title != "Total") {
                    var objRows = [{v: object.title}];
                    angular.forEach($scope.catalogo[emisorColumn], function (value) {
                        var dias = tctrl.getDaysByEmisor($scope.tableData, value);
                        objRows.push({
                            v: tctrl.findCantByDay(dias, object.title)
                        })
                    });
                    $scope.myChartObject.data.rows.push({
                        c: objRows
                    });
                }

            });
            $scope.myChartObject.options = {
                "title": "Transacciones por Código de Respuesta",
                "isStacked": "true",
                "fill": 20,
                'is3D': 'true',
                "displayExactValues": true,
                "vAxis": {
                    "title": "Cant. Transacciones",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Fecha"
                }
            }

        }

    })

