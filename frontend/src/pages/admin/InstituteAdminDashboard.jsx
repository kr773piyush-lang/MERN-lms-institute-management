import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import { createCourse, fetchCourses } from "../../features/courses/coursesSlice";
import { createBatch, fetchBatches } from "../../features/batches/batchesSlice";
import { fetchUsers } from "../../features/users/usersSlice";

const courseSchema = yup.object({
  courseName: yup.string().required("Course name required"),
  description: yup.string().optional(),
  duration: yup.number().typeError("Duration must be a number").optional(),
  level: yup.string().oneOf(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).required("Level required"),
});

const batchSchema = yup.object({
  courseId: yup.string().required("Course is required"),
  subCourseId: yup.string().required("Sub-course ID is required"),
  batchName: yup.string().required("Batch name required"),
  startDate: yup.string().required("Start date required"),
  endDate: yup.string().optional(),
  capacity: yup.number().typeError("Capacity must be a number").optional(),
});

const navItems = [
  { label: "Overview", path: "/institute-admin", end: true },
  { label: "Users", path: "/institute-admin/users" },
  { label: "Courses", path: "/institute-admin/courses" },
  { label: "Batches", path: "/institute-admin/batches" },
];

const InstituteAdminDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.users.list);
  const courses = useSelector((state) => state.courses.list);
  const batches = useSelector((state) => state.batches.list);
  const courseForm = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: { courseName: "", description: "", duration: "", level: "BEGINNER" },
  });
  const batchForm = useForm({
    resolver: yupResolver(batchSchema),
    defaultValues: {
      courseId: "",
      subCourseId: "",
      batchName: "",
      startDate: "",
      endDate: "",
      capacity: "",
    },
  });

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCourses());
    dispatch(fetchBatches());
  }, [dispatch]);

  return (
    <Routes>
      <Route
        element={<DashboardLayout navItems={navItems} title="Institute Admin" user={user} />}
      >
        <Route
          index
          element={
            <section className="rounded-xl bg-white p-5">
              <h3 className="text-xl font-semibold text-slate-900">Institute Operations</h3>
              <p className="mt-2 text-slate-600">
                Create courses and batches, and manage users in your institute.
              </p>
            </section>
          }
        />
        <Route
          path="users"
          element={
            <DataTable
              columns={[
                { key: "name", title: "Name" },
                { key: "email", title: "Email" },
                { key: "role", title: "Role" },
                { key: "status", title: "Status" },
              ]}
              rows={users}
            />
          }
        />
        <Route
          path="courses"
          element={
            <div className="space-y-5">
              <form
                onSubmit={courseForm.handleSubmit((values) => {
                  dispatch(
                    createCourse({
                      courseName: values.courseName,
                      description: values.description || undefined,
                      duration: values.duration ? Number(values.duration) : undefined,
                      level: values.level,
                    }),
                  );
                  courseForm.reset();
                })}
                className="grid gap-3 rounded-xl bg-white p-5 md:grid-cols-4"
              >
                <input
                  placeholder="Course name"
                  {...courseForm.register("courseName")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Description"
                  {...courseForm.register("description")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Duration (hours)"
                  {...courseForm.register("duration")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <select
                  {...courseForm.register("level")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
                <button className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                  Create Course
                </button>
              </form>
              <DataTable
                columns={[
                  { key: "courseName", title: "Course" },
                  { key: "description", title: "Description" },
                  { key: "level", title: "Level" },
                  { key: "duration", title: "Duration" },
                ]}
                rows={courses}
              />
            </div>
          }
        />
        <Route
          path="batches"
          element={
            <div className="space-y-5">
              <form
                onSubmit={batchForm.handleSubmit((values) => {
                  dispatch(
                    createBatch({
                      courseId: values.courseId,
                      subCourseId: values.subCourseId,
                      batchName: values.batchName,
                      startDate: values.startDate,
                      endDate: values.endDate || undefined,
                      capacity: values.capacity ? Number(values.capacity) : undefined,
                    }),
                  );
                  batchForm.reset();
                })}
                className="grid gap-3 rounded-xl bg-white p-5 md:grid-cols-6"
              >
                <input
                  placeholder="Batch name"
                  {...batchForm.register("batchName")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Course ID"
                  {...batchForm.register("courseId")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Sub-course ID"
                  {...batchForm.register("subCourseId")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  {...batchForm.register("startDate")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  {...batchForm.register("endDate")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Capacity"
                  {...batchForm.register("capacity")}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <button className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                  Create Batch
                </button>
              </form>
              <DataTable
                columns={[
                  { key: "batchName", title: "Batch" },
                  { key: "courseId", title: "Course ID" },
                  { key: "subCourseId", title: "Sub-course ID" },
                  { key: "capacity", title: "Capacity" },
                ]}
                rows={batches}
              />
            </div>
          }
        />
      </Route>
    </Routes>
  );
};

export default InstituteAdminDashboard;
