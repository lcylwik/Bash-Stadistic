materialAdmin
    .controller('fuenteByDayController', function ($filter, $sce, $document, ngTableParams, tableService, $scope, SERVICIOS, $timeout) {
        var data = tableService.data;
        var tctrl = this;
        var file = 'prtFilename';

        $scope.getFuentes = [];
        $scope.filters = {};

        $scope.init = function () {
            $scope.datosTrans = SERVICIOS.getService().then(function (trans) {
                $scope.datosTrans = trans.data;
                $scope.temp = $scope.datosTrans;
                $scope.initCatalogo();
                $scope.getColumnas();
                $scope.generateFuentes();
                $scope.tableFuente = tctrl.generateTableParams();
                $scope.chart =tctrl.generateChart();


            });
        }
        $scope.init();

        //para que se actualice cada cierto tiempo
        $scope.intervalFunction = function () {
            $timeout(function () {
                $scope.init();
                $scope.intervalFunction();
            }, 300000)
        };
        $scope.intervalFunction();

        $scope.initCatalogo = function () {
            var obj = $scope.datosTrans[0];
            $scope.catalogo = {};
            Object.getOwnPropertyNames(obj).forEach(function (val, idx, array) {
                $scope.catalogo[val] = $scope.getElementsFromArray($scope.datosTrans, val);
            });
        }
        $scope.getElementsFromArray = function (array, columnaAcomparar) {
            var codigos = [];
            angular.forEach(array, function (element) {
                if (codigos.indexOf(element[columnaAcomparar].toString()) == -1) {
                    codigos.push(element[columnaAcomparar].toString());
                }
            })
            return codigos;
        }
        tctrl.filterFunction = function (el) {
            var rtn = true;
            if (!$scope.filters || !$scope.filters.all) {
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

        //para los filtros toy inflando!!´pera
        $scope.$watch('filters', function () {
            $scope.tableFuente = tctrl.generateTableParams();
            $scope.chart =tctrl.generateChart();

        }, true);


        $scope.cantDias = 5;

        $scope.getColumnas = function () {

            var cantAMostrar = 0,
                columnas = [];
            while (cantAMostrar < $scope.cantDias) {
                columnas.push(moment().subtract(cantAMostrar, 'days').format("DD/MM/YYYY"));
                cantAMostrar++;
            }
            return columnas;
        }


        $scope.getCantTransacciones = function (fuente, dia) {
            var cant = 0;
            var data = $scope.datosTrans.filter(tctrl.filterFunction);
            angular.forEach(data, function (value) {
                if (value.prtFilename == fuente && $filter('date')(value.prtProcDte, 'dd/MM/yyyy') == dia) {
                    cant++;
                }
            });
            return cant;
        };

        $scope.generateFuentes = function () {
            var result = $scope.datosTrans.filter(tctrl.filterFunction);
            result = result.map(function (a) {
                return a.prtFilename;
            });
            $scope.getFuentes = result.filter(function (item, pos) {
                return result.indexOf(item) == pos;
            })
        };

        tctrl.generateTableParams = function () {
            var columnas = $scope.getColumnas();
            $scope.generateFuentes();

            return new ngTableParams({
                page: 1, // show first page
                count: 5           // count per page
            }, {
                total: $scope.getFuentes.length, // length of data
                getData: function ($defer, params) {
                    var data = [];

                    angular.forEach($scope.getFuentes, function (fuente, key) {
                        var obj = {
                            fuente: fuente,
                            days: [],
                            total:0
                        }
                        angular.forEach(columnas, function (dia, pos) {
                            obj.days.push({id: dia, value: $scope.getCantTransacciones(fuente, dia)});
                        })
                        data.push(obj);
                    });


                    data = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;


                    params.total(data.length); // set total for recalc pagination
                    data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve(data);
                }
            })
        }
        //mètodos Grafica




        // Gráfica Line Chart

        tctrl.generateChart = function () {

            var columnas = $scope.getColumnas();

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
                angular.forEach($scope.catalogo[file], function (value) {

                    $scope.myChartObject.data.cols.push({
                        "id": value,
                        "label": value,
                        "type": "number",
                        "p": {}
                    });

                });
            }
            angular.forEach(columnas, function (object) {
                if (object != "Total") {
                    var objRows = [{v: object}];
                    angular.forEach($scope.catalogo[file], function (value) {
                        objRows.push({
                            v: $scope.getCantTransacciones(value, object)
                        })
                    });
                    $scope.myChartObject.data.rows.push({
                        c: objRows
                    });
                }

            });
            $scope.myChartObject.options = {
                "title": "Transacciones por Fuente",
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



