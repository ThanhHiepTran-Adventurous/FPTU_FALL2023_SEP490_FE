import ManageReport from '@/views/staff/ManageReport.vue'
import ManageShipRequest from '@/views/staff/ManageShipRequest.vue'

const staff_router = [
  {
    name: 'staff-report',
    path: '/staff/manage-report',
    component: ManageReport,
  },
  {
    name: 'staff-manage-ship-request',
    path: '/staff/manage-ship-request',
    component: ManageShipRequest,
  },
]

export default staff_router
