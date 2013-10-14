(function() {

  // config/extend_ext.js
  var root;

  root = this;

  root.def = root.extend;

  // app.js
  var __slice = [].slice;

  angular.module('tbs.BattlePlannerNG', []).run([
    '$rootScope', function($rootScope) {
      $rootScope.log = function() {
        var things;
        things = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return console.log(things);
      };
      return $rootScope.alert = function(something) {
        return alert(something);
      };
    }
  ]);

  // data/unit_data_translator.js
  var STAT_NAME_ENCODED_TO_FULL, STAT_NAME_FULL_TO_ENCODED, UNIT_NAME_ENCODED_TO_FULL, UNIT_NAME_FULL_TO_ENCODED, encodedStatMapper;

  UNIT_NAME_FULL_TO_ENCODED = {
    'raidmaster': 'rm',
    'thrasher': 'th',
    'backbiter': 'bb',
    'bowmaster': 'bm',
    'skystriker': 'ss',
    'siegearcher': 'sg',
    'warmaster': 'wm',
    'warhawk': 'wh',
    'warleader': 'wl',
    'provoker': 'pk',
    'strongarm': 'sa',
    'shieldmaster': 'sm'
  };

  UNIT_NAME_ENCODED_TO_FULL = {
    'rm': 'raidmaster',
    'th': 'thrasher',
    'bb': 'backbiter',
    'bm': 'bowmaster',
    'ss': 'skystriker',
    'sg': 'siegearcher',
    'wm': 'warmaster',
    'wh': 'warhawk',
    'wl': 'warleader',
    'pk': 'provoker',
    'sa': 'strongarm',
    'sm': 'shieldmaster'
  };

  STAT_NAME_FULL_TO_ENCODED = {
    'armor': 'a',
    'strength': 's',
    'willpower': 'w',
    'exertion': 'e',
    'break': 'b'
  };

  STAT_NAME_ENCODED_TO_FULL = {
    'a': 'armor',
    's': 'strength',
    'w': 'willpower',
    'e': 'exertion',
    'b': 'break'
  };

  encodedStatMapper = function(stats) {
    var _this = this;
    return _(stats).map(function(stat) {
      return {
        name: STAT_NAME_ENCODED_TO_FULL[stat[0]],
        current: stat[1],
        min: stat[2],
        max: stat[3]
      };
    });
  };

  def('tbs.data.UnitDataTranslator', {
    serialize: function(units) {
      var output;
      output = [];
      _(units).each(function(u) {
        var stats;
        stats = _(u.stats).map(function(s) {
          return [STAT_NAME_FULL_TO_ENCODED[s.name], s.current, s.min, s.max];
        });
        return output.push([UNIT_NAME_FULL_TO_ENCODED[u.name], u.rank, u.allocated_stat_points, u.max_stat_points, stats]);
      });
      return Base64.encode(JSON.stringify(output));
    },
    deserialize: function(encoded) {
      var models, units;
      units = JSON.parse(Base64.decode(encoded));
      models = [];
      _(units).each(function(unit) {
        if (unit[4] === void 0) {
          return models.push(tbs.core.defaultUnit());
        } else {
          return models.push({
            name: UNIT_NAME_ENCODED_TO_FULL[unit[0]],
            rank: unit[1],
            allocated_stat_points: unit[2],
            max_stat_points: unit[3],
            stats: encodedStatMapper(unit[4])
          });
        }
      });
      return models;
    }
  });

  // data/unit_data.js
  def('tbs.data.UnitStatMapper', function(raw_stats_array) {
    var STATS;
    STATS = ["armor", "strength", "willpower", "exertion", "break"];
    return _(raw_stats_array).map(function(min_max, i) {
      return {
        min: min_max[0],
        max: min_max[1],
        current: min_max[0],
        name: STATS[i]
      };
    });
  });

  def('tbs.data.Units', function() {
    return [
      {
        name: "raider",
        type: "base",
        rank: 0,
        stats: tbs.data.UnitStatMapper([[6, 9], [6, 9], [4, 6], [1, 2], [1, 2]])
      }, {
        name: "raidmaster",
        type: "raider",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[6, 12], [6, 12], [4, 11], [1, 3], [1, 3]])
      }, {
        name: "thrasher",
        type: "raider",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[5, 11], [8, 12], [3, 13], [1, 3], [1, 2]])
      }, {
        name: "backbiter",
        type: "raider",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[5, 12], [8, 10], [4, 13], [0, 3], [1, 3]])
      }, {
        name: "archer",
        type: "base",
        rank: 0,
        stats: tbs.data.UnitStatMapper([[4, 7], [4, 7], [5, 8], [1, 2], [1, 1]])
      }, {
        name: "bowmaster",
        type: "archer",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[4, 9], [4, 8], [5, 12], [1, 3], [1, 2]])
      }, {
        name: "skystriker",
        type: "archer",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[3, 9], [4, 8], [7, 13], [1, 3], [0, 1]])
      }, {
        name: "siegearcher",
        type: "archer",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[4, 9], [4, 7], [6, 13], [1, 3], [0, 2]])
      }, {
        name: "warrior",
        type: "base",
        rank: 0,
        stats: tbs.data.UnitStatMapper([[9, 9], [12, 12], [5, 5], [2, 2], [2, 2]])
      }, {
        name: "warmaster",
        type: "warrior",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[6, 11], [9, 17], [3, 10], [1, 2], [1, 3]])
      }, {
        name: "warhawk",
        type: "warrior",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[7, 12], [10, 16], [2, 11], [0, 2], [1, 2]])
      }, {
        name: "warleader",
        type: "warrior",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[5, 12], [9, 15], [5, 9], [1, 3], [0, 4]])
      }, {
        name: "shieldbanger",
        type: "base",
        rank: 0,
        stats: tbs.data.UnitStatMapper([[9, 14], [8, 10], [2, 4], [1, 1], [1, 2]])
      }, {
        name: "provoker",
        type: "shieldbanger",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[11, 18], [7, 12], [2, 8], [0, 2], [1, 3]])
      }, {
        name: "strongarm",
        type: "shieldbanger",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[9, 15], [9, 15], [2, 9], [0, 2], [1, 2]])
      }, {
        name: "shieldmaster",
        type: "shieldbanger",
        rank: 1,
        stats: tbs.data.UnitStatMapper([[9, 16], [8, 13], [2, 8], [1, 2], [1, 4]])
      }
    ];
  });

  // directives/disable_context_menu.js
  angular.module('tbs.BattlePlannerNG').directive("disableContextMenu", function() {
    return function(scope, element, attributes) {
      return element.bind("contextmenu", function(e) {
        return e.preventDefault();
      });
    };
  });

  // directives/show_if_unit_has_stats_when_hovered.js
  angular.module('tbs.BattlePlannerNG').directive("showIfUnitHasStatsWhenParentIsHovered", function() {
    return function(scope, element, attributes) {
      element.parent().bind("mouseenter", function() {
        if (scope.isChosen(scope.$index) && scope.$index.toString() !== attributes.position) {
          return element.css({
            display: "block"
          });
        }
      });
      return element.parent().bind("mouseleave", function() {
        return element.css({
          display: "none"
        });
      });
    };
  });

  // controllers/character_selector_controller.js
  angular.module('tbs.BattlePlannerNG').controller('CharacterSelector', [
    '$scope', 'UnitGroupings', 'Units', function($scope, UnitGroupings, Units) {
      var nextAvailableLoadoutSlot;
      $scope.unitGroupings = UnitGroupings;
      $scope.$on('edit:unit', function() {
        return $scope.editing = true;
      });
      $scope.$on('choose:unit', function() {
        return $scope.editing = false;
      });
      $scope.assignUnitToNextAvailableLoadoutSlot = function(presetUnit) {
        return _(nextAvailableLoadoutSlot()).extend(angular.copy(presetUnit));
      };
      return nextAvailableLoadoutSlot = function() {
        return _(Units).find(function(u) {
          return _.isEmpty(u.stats);
        }) || _(Units).last();
      };
    }
  ]);

  // controllers/loadout_controller.js
  angular.module('tbs.BattlePlannerNG').controller('Loadout', [
    '$scope', '$location', 'Units', 'AppStateService', function($scope, $location, Units, AppStateService) {
      $scope.units = Units;
      $scope.$watch('units', (function(newUnits) {
        $location.replace();
        return $location.hash(tbs.data.UnitDataTranslator.serialize(newUnits));
      }), true);
      $scope.isChosen = function(index) {
        return !_.isEmpty($scope.units[index].stats);
      };
      $scope.moveUnit = function(unit, from, to, e) {
        var otherUnit;
        e.stopPropagation();
        otherUnit = $scope.units[from + to];
        $scope.units[from + to] = unit;
        return $scope.units[from] = otherUnit;
      };
      $scope.statsOrEmpty = function(unit, name) {
        if (!_.isEmpty(unit.stats)) {
          return _(unit.stats).findWhere({
            name: name
          }).current;
        } else {
          return "";
        }
      };
      $scope.clearUnit = function(unit) {
        _(unit).extend(tbs.core.defaultUnit());
        return AppStateService.choose();
      };
      return $scope.edit = function(unit) {
        if (!_.isEmpty(unit.stats)) {
          return AppStateService.edit(unit);
        }
      };
    }
  ]);

  // controllers/stat_change_controller.js
  angular.module('tbs.BattlePlannerNG').controller('StatChange', [
    '$scope', function($scope) {
      var changeBy;
      $scope.increaseOrDecrease = function(unit, stat, e) {
        e.preventDefault();
        e.stopPropagation();
        switch (e.which) {
          case 1:
            return changeBy(unit, stat, 1);
          case 3:
            return changeBy(unit, stat, -1);
        }
      };
      return changeBy = function(unit, stat, amount) {
        if (!(unit.allocated_stat_points + amount > unit.max_stat_points || unit.allocated_stat_points + amount < 0)) {
          if (!(stat.current + amount < stat.min || stat.current + amount > stat.max)) {
            stat.current += amount;
            return unit.allocated_stat_points += amount;
          }
        }
      };
    }
  ]);

  // controllers/stat_editor_controller.js
  angular.module('tbs.BattlePlannerNG').controller('StatEditor', [
    '$scope', 'AppStateService', function($scope, AppStateService) {
      $scope.doneEditing = function() {
        return AppStateService.choose();
      };
      $scope.$on('edit:unit', function(event, unit) {
        $scope.unit = unit;
        return $scope.editing = true;
      });
      return $scope.$on('choose:unit', function() {
        return $scope.editing = false;
      });
    }
  ]);

  // services/app_state_service.js
  angular.module('tbs.BattlePlannerNG').factory('AppStateService', [
    '$rootScope', function($rootScope) {
      return {
        edit: function(unit) {
          return $rootScope.$broadcast('edit:unit', unit);
        },
        choose: function() {
          return $rootScope.$broadcast('choose:unit');
        }
      };
    }
  ]);

  // services/unit_service.js
  def('tbs.core.defaultUnit', function() {
    return {
      name: "",
      type: "",
      stats: void 0,
      allocated_stat_points: 0,
      max_stat_points: 11
    };
  });

  angular.module('tbs.BattlePlannerNG').factory('Units', [
    '$location', function($location) {
      var hash, units;
      if (hash = $location.hash()) {
        units = tbs.data.UnitDataTranslator.deserialize(hash);
      } else {
        units = _(_.range(0, 6)).map(tbs.core.defaultUnit);
      }
      return units;
    }
  ]);

  angular.module('tbs.BattlePlannerNG').factory('UnitGroupings', function() {
    var maxStatPointsForRank, units;
    maxStatPointsForRank = function(rank) {
      switch (rank) {
        case 0:
          return 10;
        case 1:
          return 11;
        case 2:
          return 12;
        case 3:
          return 13;
      }
    };
    units = _(tbs.data.Units()).map(function(unit) {
      return _(unit).tap(function(u) {
        u.max_stat_points = maxStatPointsForRank(u.rank);
        return u.allocated_stat_points = 0;
      });
    });
    return _(_(units).groupBy("type")).tap(function(grouped) {
      return delete grouped.base;
    });
  });


  // router.js
  angular.module('tbs.BattlePlannerNG').config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/:encoded', {
        controller: "LoadoutController"
      });
    }
  ]);

}());
