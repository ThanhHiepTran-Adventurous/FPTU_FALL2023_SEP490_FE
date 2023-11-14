import ManageReportIntermediate from '@/views/staff/ManageReportIntermediate.vue'
import ManageReportImmediate from '@/views/staff/ManageReportImmediate.vue'
import ManageShipRequest from '@/views/staff/ManageShipRequest.vue'
import AllReports from '@/views/staff/UnassignedReports.vue'

const staff_router = [
  {
    name: 'staff-report-intermediate',
    path: '/staff/report/intermediate',
    component: ManageReportIntermediate,
  },
  {
    name: 'staff-report-immediate',
    path: '/staff/report/immediate',
    component: ManageReportImmediate,
  },
  {
    name: 'staff-manage-ship-request',
    path: '/staff/manage-ship-request',
    component: ManageShipRequest,
  },
  {
    name: 'all-reports',
    path: '/staff/report/unassigned',
    component: AllReports,
  },
]

export default staff_router
