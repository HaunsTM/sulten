# Available endpoints

/availableAreas
/menus/areaId/:areaId/weekNumber/:weekNumber
	/** http://localhost:8080/menus/areaId/1/weekNumber/201943 */
	
/admin/initializeAndSetupDb
/admin/performMenuFetching/all
/admin/performMenuFetching/areaId/:areaId
	/** http://localhost:8080/admin/performMenuFetching/areaId/1 */

---

# Set up database on development computer
1. `yarn`
1. `yarn dev`
1. Browse http://localhost:8080/admin/initializeAndSetupDb