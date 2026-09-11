import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Workflows from "../pages/Workflows";
import WorkflowBuilder from "../pages/WorkflowBuilder";
import DashboardLayout from "../layouts/DashboardLayout";
import Executions from "../pages/Executions";
import Templates from "../pages/Templates";
import Jobs from "../pages/Jobs";
import Candidates from "../pages/Candidates";
import Integrations from "../pages/Integrations";
import Settings from "../pages/Settings";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<DashboardLayout />}>
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/workflows"
                    element={<Workflows />}
                />

                <Route
                    path="/workflows/new"
                    element={<WorkflowBuilder />}
                />

                <Route path="/workflows/:id" element={<WorkflowBuilder />} />
                

                <Route path="/executions" element={<Executions />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route
                    path="/integrations"
                    element={<Integrations />}
                />
                <Route path="/settings" element={<Settings />} />

            </Route>

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    );
};

export default AppRoutes;