sap.ui.define([], function() {
	"use strict";

	return {
		formatDate: function(sValue) {
			if (sValue !== null && sValue !== "0000-00-00" && sValue !== undefined) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "EEEE, MMMM d, yyyy"
				});
				return oDateFormat.format(new Date(sValue));
			} else {
				return "";
			}
		},

		getAvailableCardsLabelText: function(aItems) {
			if (aItems) {
				var iCount = aItems.length;
				return "Available Cards by Show: (" + iCount + ")";
			} else {
				return "Available Cards by Show";
			}
		}
	};
});