import ManageReportIntermediate from '@/views/staff/ManageReportIntermediate.vue'
import ManageReportImmediate from '@/views/staff/ManageReportImmediate.vue'
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
    name: 'all-reports',
    path: '/staff/report/unassigned',
    component: AllReports,
  },
]

export default staff_router
