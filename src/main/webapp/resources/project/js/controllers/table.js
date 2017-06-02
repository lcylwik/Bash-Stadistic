materialAdmin
    .controller('tableCtrl', function ($filter, $sce, $document, ngTableParams, tableService, $scope, SERVICIOS, $timeout) {
        var data = tableService.data;
        var tctrl = this;
        $scope.getFuentes = [];
        $scope.filters = {};

        $scope.init = function () {
            $scope.datosTrans = SERVICIOS.getService().then(function (trans) {
                $scope.datosTrans = trans.data;
                $scope.temp = $scope.datosTrans;
                $scope.initCatalogo();
                $scope.tableParams = tctrl.generateTableParams();


                $scope.generateFuentes();

            });
        }
        $scope.init();

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

        //para los filtros
        $scope.$watch('filters', function () {
            $scope.tableParams = tctrl.generateTableParams();
        }, true);

        $scope.cerrar = true;

        $scope.filtrarCheck = false;

        $scope.onTimeSet = function (newDate, oldDate, field) {
            $scope[field] = !$scope[field];
            $scope.datepickerShowed = false;
            document.removeEventListener('keydown', $scope.closeCalendar);
        }

        //
        //$scope.filtrarTrans = function () {
        //    var total = $scope.temp;
        //
        //    //filtrando selects
        //    for (var property in $scope.filter) {
        //        if ($scope.filter.hasOwnProperty(property)) {
        //            if ($scope.filter[property] != undefined && $scope.filter[property] != "") {
        //                total = total.filter(function (el) {
        //                    var temp = false;
        //                    angular.forEach($scope.filter[property], function (data) {
        //                        temp = el[property] == data.name ? true : temp;
        //                    });
        //                    return temp;
        //                })
        //            }
        //        }
        //    }
        //
        //    //filtrando fechas
        //    console.log($scope.datesfilters);
        //    for (var property in $scope.datesfilters) {
        //        if ($scope.datesfilters.hasOwnProperty(property)) {
        //            if ($scope.datesfilters[property].start != "") {
        //                total = total.filter(function (el) {
        //                    return el[property] >= moment($scope.datesfilters[property].start).format('x');
        //                })
        //            }
        //            if ($scope.datesfilters[property].end != "") {
        //                total = total.filter(function (el) {
        //                    return el[property] <= moment($scope.datesfilters[property].end).format('x');
        //                })
        //            }
        //        }
        //    }
        //
        //    $scope.datosTrans = total;
        //
        //    //angular.forEach($scope.filter, function(value){
        //    //   console.log(value);
        //    //});
        //}


        $scope.cantDias = 5;

        $scope.getColumnas = function () {

            var cantAMostrar = 0,
                columnas = [];
            while (cantAMostrar < $scope.cantDias) {
                columnas.push(moment().subtract(cantAMostrar, 'days').format("DD/MM/YYYY"));
                cantAMostrar++;
            }

            return columnas;
        };


        $scope.getCantTransacciones = function (fuente, dia) {
            var cant = 0;
            angular.forEach($scope.datosTrans, function (value) {
                if (value.prtFilename == fuente && $filter('date')(value.prtProcDte, 'dd/MM/yyyy') == dia) {
                    cant++;
                }
            });
            return cant;
        }
        $scope.generateFuentes = function () {
            var result = $scope.datosTrans.map(function (a) {
                return a.prtFilename;
            });
            $scope.getFuentes = result.filter(function (item, pos) {
                return result.indexOf(item) == pos;
            })
        };


        this.tableFilterXdias = new ngTableParams({
            page: 1, // show first page
            count: 5           // count per page
        }, {
            total: $scope.getFuentes.length, // length of data
            getData: function ($defer, params) {

                $defer.resolve($scope.getFuentes.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        })

// tabla con filtro de las transacciones
        tctrl.generateTableParams = function () {
            return new ngTableParams({
                page: 1,
                count: 10

            }, {
                counts: [], //Oculta el contador de paginas
                // $scope.data ? $scope.data.length :
                total: $scope.datosTrans.length,
                //Funcion para el paginador
                getData: function ($defer, params) {


                    var orderedData = $scope.datosTrans.filter(tctrl.filterFunction);


                    //  $scope.data = $scope.datosTrans.filter(vm.filtrar);
                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;

                    params.total(orderedData.length); // set total for recalc pagination
                    orderedData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve(orderedData);

                    // $scope.data = params.sorting() ? $filter('orderBy')($scope.datosTrans, params.orderBy()) : $scope.datosTrans;
                    // params.total($scope.data.length);
                    // $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    // $defer.resolve($scope.data);
                    //
                }
            });
        };

    })
