/*
 * A simple client side pagination module.
 *
 * By Guido Krömer <mail@cacodaemon.de>
 * */
angular.module('caco.ClientPaginate', [])

.filter('paginate', function(Paginator) {
    return function(input, rowsPerPage) {
        if (!input) {
            return input;
        }

        if (rowsPerPage) {
            Paginator.rowsPerPage = rowsPerPage;
        }

        Paginator.itemCount = input.length;
        var firstItem = parseInt(Paginator.page * Paginator.rowsPerPage);
        if (Paginator.itemCount > 0) {
            Paginator.firstItemOnPage = firstItem + 1;
        } else {
            Paginator.firstItemOnPage = 0;
        }
        Paginator.lastItemOnPage = parseInt((Paginator.page + 1) * Paginator.rowsPerPage + 1) - 1;
        if (Paginator.lastItemOnPage > Paginator.itemCount) {
            Paginator.lastItemOnPage = Paginator.itemCount;
        }
        return input.slice(firstItem, Paginator.lastItemOnPage);
    }
})

.filter('forLoop', function() {
    return function(input, start, end) {
        input = new Array(end - start);
        for (var i = 0; start < end; start++, i++) {
            input[i] = start;
        }

        return input;
    }
})

.service('Paginator', function($rootScope) {
    this.page = 0;
    this.rowsPerPage = 50;
    this.itemCount = 0;
    this.limitPerPage = 5;
    this.firstItemOnPage = 0;
    this.lastItemOnPage = 0;

    this.setPage = function(page) {
        if (page > this.pageCount()) {
            return;
        }
        this.page = page;
    };

    this.nextPage = function() {
        if (this.isLastPage()) {
            return;
        }

        this.page++;
    };

    this.perviousPage = function() {
        if (this.isFirstPage()) {
            return;
        }

        this.page--;
    };

    this.firstPage = function() {
        this.page = 0;
    };

    this.lastPage = function() {
        this.page = this.pageCount() - 1;
    };

    this.isFirstPage = function() {
        return this.page == 0;
    };

    this.isLastPage = function() {
        return this.page == this.pageCount() - 1;
    };

    this.pageCount = function() {
        return Math.ceil(parseInt(this.itemCount) / parseInt(this.rowsPerPage));
    };

    this.lowerLimit = function() {
        var pageCountLimitPerPageDiff = this.pageCount() - this.limitPerPage;

        if (pageCountLimitPerPageDiff < 0) {
            return 0;
        }

        if (this.page > pageCountLimitPerPageDiff + 1) {
            return pageCountLimitPerPageDiff;
        }

        var low = this.page - (Math.ceil(this.limitPerPage / 2) - 1);

        return Math.max(low, 0);
    };
})

.directive('paginator', function factory() {
    return {
        restrict: 'A',
        controller: function($scope, Paginator) {
            $scope.paginator = Paginator;
        },
        templateUrl: 'templates/pagination.html'
    };
});