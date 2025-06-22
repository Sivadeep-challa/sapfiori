sap.ui.define(["jquery.sap.global"],
	function(jQuery) {
		"use strict";
		var persoService = {
			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
						id: "demo-Tablepo-Column1",
						order: 0,
						text: "MPO ID",

						visible: true
					}, {
						id: "demo-Tablepo-Column2",
						order: 1,
						text: "Show Number",

						visible: true
					}, {
						id: "demo-Tablepo-Column3",
						order: 2,
						text: "booth",

						visible: true
					}, {
						id: "demo-Tablepo-Column4",
						order: 3,
						text: "primaryIndicator",

						visible: true
					}, {
						id: "demo-Tablepo-Column5",
						order: 4,
						text: "last4Digits",
						visible: true

					}, {
						id: "demo-Tablepo-Column6",
						order: 5,
						text: "cardHolderName",
						visible: true

					},
					{
						id: "demo-Tablepo-Column6",
						order: 6,
						text: "cardType",
						visible: true

					},
					{
						id: "demo-Tablepo-Column6",
						order: 7,
						text: "expiration",
						visible: true

					},
						{
						id: "demo-Tablepo-Column6",
						order: 8,
						text: "notes",
						visible: true

					},
						{
						id: "demo-Tablepo-Column6",
						order: 9,
						text: "changedBy",
						visible: true

					},
						{
						id: "demo-Tablepo-Column6",
						order: 10,
						text: "paymentType",
						visible: true

					}

				]
			},
			getPersData: function() {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					// oBundle
				}
				var oBundle = this._oBundle;
				oDeferred.resolve(oBundle);
				return oDeferred.promise();
			},
			setPersData: function(oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			}
		};
		return persoService;
	}, true
);