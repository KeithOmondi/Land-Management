import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import parcelReducer from "../redux/parcel/parcelSlice"
import transferReducer from "../redux/parcel/transferSlice"
import disputeReducer from "../redux/parcel/disputeSlice"
import documentReducer from "../redux/parcel/documentSlice"
import dashboardRouter from "../redux/parcel/dashboardSlice"
import adminDashboardRouter from "../redux/parcel/adminDashboardSlice"
import surveyReducer from "../redux/parcel/surveyorSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    parcel: parcelReducer,
    transfer: transferReducer,
    disputes: disputeReducer,
    documents: documentReducer,
    dashboard: dashboardRouter,
    adminDashboard: adminDashboardRouter,
    surveyor: surveyReducer, 
  },
});
