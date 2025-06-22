sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Sorter",
    "sap/ui/core/Fragment",
    "sap/m/TablePersoController",
    "../model/paymentperso",
    "sap/m/Input",
    "sap/m/CheckBox"
], function (Controller, JSONModel, Filter, FilterOperator, formatter, Sorter, Fragment, TablePersoController, paymentperso,
    Input, CheckBox) {
    "use strict";

    return Controller.extend("zdata.controller.View1", {
        formatter: formatter,
        onInit: function () {
            var that = this;
            // that.tablePersonalization();
            var oViewModel = new JSONModel({
                tfc: "",
                showNumber: "",
                booth: "",
                mpoId: "",
                last4Digits: ""
            });
            that.getView().setModel(oViewModel, "ViewModel");

            var showModel = new JSONModel("/model/showNumber.json");
            that.getView().setModel(showModel, "showModel");

            var tfcModel = new JSONModel("/model/tfc.json");
            that.getView().setModel(tfcModel, "tfcModel");

            var headerrModel = new sap.ui.model.json.JSONModel({

                "date": new Date().toLocaleDateString(),
                "time": new Date().toLocaleTimeString()

            });
            this.getView().setModel(headerrModel, "headerModel");

            setInterval(function () {
                var currentDate = new Date();

                headerrModel.setProperty("/date", currentDate.toLocaleDateString());
                headerrModel.setProperty("/time", currentDate.toLocaleTimeString());
            }, 1000);
            var tableModel = new JSONModel("/model/data.json");
            this.getView().setModel(tableModel, "tabModel");

        },
        onCopy: function () {
            var that = this;
            var oTable = that.getView().byId("Table");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                sap.m.MessageBox.warning("Please select a record to copy.");
                return;
            }

            var oModel = that.getView().getModel("tabModel");
            var sPath = oSelectedItem.getBindingContext("tabModel").getPath();
            var oSelectedData = oModel.getProperty(sPath);

            // Create a deep copy of the selected data
            var oCopiedData = JSON.parse(JSON.stringify(oSelectedData));

            // Get the index of the selected item
            var iIndex = parseInt(sPath.split("/").pop(), 10);

            // Insert the copied data into the model at the position below the selected item
            var aItems = oModel.getProperty("/results");
            aItems.splice(iIndex + 1, 0, oCopiedData);
            oModel.setProperty("/results", aItems);

            // Clear selection to avoid confusion
            oTable.removeSelections(true);
        },

        ValueHelp: function () {
            var that = this;
            if (!that.oDialog) {
                that.oDialog = sap.ui.xmlfragment("zdata.fragments.showNumber", that);
                that.getView().addDependent(that.oDialog);
            }
            that.oDialog.open();
            that.ValueHelp();
        },
        onSelectShowNumber: function (oEvent) {
            var that = this;

            var oSelectedItem = oEvent.getSource();
            var sShowNumber = oSelectedItem.getBindingContext("showModel").getProperty("showNumber");

            that.getView().getModel("ViewModel").setProperty("/showNumber", sShowNumber);

            if (!that.oDialog) {
                that.oDialog.close();
                that.oDialog.destroy();
                that.oDialog = null;
            }
        },
        onSelecttfc: function (oEvent) {
            var that = this;

            var oSelectedItem = oEvent.getSource();
            var sTfc = oSelectedItem.getBindingContext("tfcModel").getProperty("tfc");

            that.getView().getModel("ViewModel").setProperty("/tfc", sTfc);

            if (!that.oDialog) {
                that.oDialog.close();
                that.oDialog.destroy();
                that.oDialog = null;
            }
        },

        tfcHelp: function () {
            var that = this;
            if (!that.oDialog) {
                that.oDialog = sap.ui.xmlfragment("zdata.fragments.tfc", that);
                that.getView().addDependent(that.oDialog);
            }
            that.oDialog.open();
            that.tfcHelp();
        },
        onCloseShowNumber: function () {
            var that = this;
            that.oDialog.close();
            that.oDialog.destroy();
            that.oDialog = null;
        },
        onClosetfc: function () {
            var that = this;
            that.oDialog.close();
            that.oDialog.destroy();
            that.oDialog = null;
        },

        onLivSearch: function (oEvent) {
            var srchVal = oEvent.getSource().getValue();
            var oTable = this.getView().byId("Table");
            var tabItems = oTable.getBinding("items");

            var oFilter = new Filter("mpoId", "Contains", srchVal);
            var oFilter1 = new Filter("showNumber", "Contains", srchVal);
            var oFilter2 = new Filter("tfc", "EQ", srchVal);
            var oFilter3 = new Filter("booth", "Contains", srchVal);
            var oFilter4 = new Filter("last4Digits", "Contains", srchVal);
            var oFilter5 = new Filter("cardHolderName", "Contains", srchVal);
            var oFilter6 = new Filter("cardType", "EQ", srchVal);
            var oFilter7 = new Filter("notes", "EQ", srchVal);
            var oFilter8 = new Filter("expiration", "EQ", srchVal);
            var oFilter9 = new Filter("changedBy", "Contains", srchVal);
            var oFilter10 = new Filter("paymentType", "Contains", srchVal);
            var filterArray = [oFilter, oFilter1, oFilter2, oFilter3, oFilter4, oFilter5, oFilter6, oFilter7, oFilter8, oFilter9, oFilter10];
            var finalFilter = new Filter(filterArray, false);
            if (srchVal.length > 0) {
                tabItems.filter(finalFilter);
            } else {
                tabItems.filter(null);

            }

        },

        onSort: function (oEvent) {
            if (!this.Sorted) {
                this.Sorted = sap.ui.xmlfragment("zdata.fragments.sort", this);

                this.getView().addDependent(this.Sorted);
            }
            this.Sorted.open();

        },
        handleSortDialogConfirm: function (oEvent) {
            var oTable = this.byId("Table");
            var mParams = oEvent.getParameters();

            var oBinding = oTable.getBinding("items");
            var aSorters = [];
            var sPath = mParams.sortItem.getKey();

            var bDescending = mParams.sortDescending;
            // console.log(bDescending);
            aSorters.push(new Sorter(sPath, bDescending));

            oBinding.sort(aSorters);
        },
        tablePersonalization: function () {
            var that = this;

            that.matTable = new TablePersoController({
                table: that.getView().byId("Table"),

                componentName: "demo",
                persoService: paymentperso
            }).activate();
        },
        onPersonalizationPress: function () {
            var that = this;

            that.matTable.openDialog();

        },

        onDelete: function () {
            var that = this;
            var oTable = that.getView().byId("Table");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                sap.m.MessageBox.warning("Please select a record to delete.");
                return;
            }

            // add the CSS class before deleting the item
            oSelectedItem.addStyleClass("highlighted-row");

        },

        onSearch: function () {
            var oView = this.getView();
            var oViewModel = oView.getModel("ViewModel");
            var aFilters = [];

            var sShowNumber = oViewModel.getProperty("/showNumber");
            if (sShowNumber) {
                aFilters.push(new Filter("showNumber", FilterOperator.Contains, sShowNumber));
            }

            var sTfc = oViewModel.getProperty("/tfc");
            if (sTfc) {
                aFilters.push(new Filter("tfc", FilterOperator.Contains, sTfc));
            }

            var sBooth = oViewModel.getProperty("/booth");
            if (sBooth) {
                aFilters.push(new Filter("booth", FilterOperator.Contains, sBooth));
            }

            var sLast4Digits = oViewModel.getProperty("/last4Digits");
            if (sLast4Digits) {
                aFilters.push(new Filter("last4Digits", FilterOperator.Contains, sLast4Digits));
            }

            var sMpoId = oViewModel.getProperty("/mpoId");
            if (sMpoId) {
                aFilters.push(new Filter("mpoId", FilterOperator.Contains, sMpoId));
            }

            var oTable = oView.byId("Table");
            var oBinding = oTable.getBinding("items");

            if (aFilters.length > 0) {
                oBinding.filter(aFilters);
            } else {
                oBinding.filter([]);
            }
        },
        onEdit: function() {
        	var oTable = this.byId("Table");
        	var oSelectedItem = oTable.getSelectedItem();
        	if (oSelectedItem) {
        		var oCells = oSelectedItem.getCells();
        		oCells.forEach(function(oCell, iIndex) {
        			var sPath = oCell.getBindingContext("tabModel").getPath();
        			var sProperty = oCell.getBindingPath("text");

        			// Hide the original Text cell
        			oCell.setVisible(false);

        			// Insert a new Input control bound to the same property
        			oSelectedItem.insertCell(new Input({
        				value: "{tabModel>" + sPath + "/" + sProperty + "}"
        			}), iIndex);
        		});
        	} else {
        		sap.m.MessageBox.warning("Please select a row to edit.");

        	}
        },
        onEdit: function () {
            var oTable = this.byId("Table");
            var oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {
                var oCells = oSelectedItem.getCells();
                var aEditableColumns = ["showNumber", "tfc", "mpoId", "booth", "cardHolderName"];

                // Create a new array of cells
                var aNewCells = oCells.map(function (oCell, iIndex) {
                    var sPath = oCell.getBindingContext("tabModel").getPath();
                    var sProperty = oCell.getBindingPath("text");

                    // Check if the property should be editable
                    if (aEditableColumns.includes(sProperty)) {
                        // Replace the text cell with an input cell
                        return new sap.m.Input({
                            value: "{tabModel>" + sPath + "/" + sProperty + "}"
                        });
                    } else {
                        // Keep the existing cell
                        return oCell;
                    }
                });

                // Replace the cells of the selected item with the new cells
                oSelectedItem.removeAllCells();
                aNewCells.forEach(function (oNewCell) {
                    oSelectedItem.addCell(oNewCell);
                });
            } else {
                sap.m.MessageBox.warning("Please select a row to edit.");
            }
        }

    });
});
