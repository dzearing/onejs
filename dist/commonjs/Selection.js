var EventGroup = require('./EventGroup');

var Selection = (function () {
    function Selection(isMultiSelectEnabled) {
        this.selectedKey = null;
        this._selectedItems = {};
        this._selectedCount = 0;
        this.isMultiSelectEnabled = true;
        this._isAllSelected = false;
        this._events = new EventGroup(this);
        this._events.declare('change');

        this.isMultiSelectEnabled = isMultiSelectEnabled;
    }
    Selection.prototype.clear = function () {
        this._selectedItems = {};
        this._selectedCount = 0;
    };

    Selection.prototype.getSelectedKeys = function () {
        var selected = [];

        for (var key in this._selectedItems) {
            selected.push(this._selectedItems[key]);
        }

        return selected;
    };

    Selection.prototype.toggle = function (key) {
        this.setSelected(key, !this.isSelected(key));
    };

    Selection.prototype.toggleAllSelected = function () {
        if (this._selectedCount == 0) {
            this._isAllSelected = !this._isAllSelected;
        } else {
            this._isAllSelected = true;
        }

        this.clear();
        this.change();
    };

    Selection.prototype.setSelected = function (key, isSelected) {
        isSelected = (isSelected === false) ? false : true;

        if (!key) {
            throw "Items used with Selection must have keys.";
        }

        if (!this.isMultiSelectEnabled) {
            this.clear();
        }

        if ((this._isAllSelected && !isSelected) || (!this._isAllSelected && isSelected)) {
            if (!this._selectedItems[key]) {
                this.selectedKey = this._selectedItems[key] = key;
                this._selectedCount++;
            }
        } else {
            if (this._selectedItems[key]) {
                delete this._selectedItems[key];
                this._selectedCount--;
            }
        }

        this.change();
    };

    Selection.prototype.isAllSelected = function () {
        return !!(this._isAllSelected && (this._selectedCount == 0));
    };

    Selection.prototype.isSelected = function (key) {
        return !!((this._isAllSelected && !this._selectedItems[key]) || (!this._isAllSelected && this._selectedItems[key]));
    };

    Selection.prototype.change = function () {
        this._events.raise('change');
    };
    return Selection;
})();

module.exports = Selection;
