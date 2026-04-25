import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema
const schema = yup.object({
  email: yup.string().email("Enter valid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
  fname: yup.string().required("First name required"),
  lname: yup.string().required("Last name required"),
  mobile: yup.string().required("Mobile required"),
  course: yup.string().required("Select course"),
  subCourse: yup.string().required("Select subcourse"),
});

const RegisterPage = () => {
  const [courses, setCourses] = useState([]);
  const [subCourses, setSubCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSubCourses, setLoadingSubCourses] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedCourse = watch("course");

  // =========================
  // Fetch Courses
  // =========================
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/public/courses`
        );
        const data = await res.json();
        console.log(data)
        setCourses(data.data || []);
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // =========================
  // Fetch SubCourses
  // =========================
  useEffect(() => {
    const fetchSubCourses = async () => {
      if (!selectedCourse) {
        setSubCourses([]);
        return;
      }

      setLoadingSubCourses(true);
      console.log("Selected Course ID:", selectedCourse);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/public/courses/${selectedCourse.data._id}/subcourses`
        );
        const data = await res.json();
        setSubCourses(data.data || []);
      } catch (err) {
        console.error(err);
        setSubCourses([]);
      } finally {
        setLoadingSubCourses(false);
      }
    };

    // reset subcourse
    setValue("subCourse", "");
    fetchSubCourses();
  }, [selectedCourse, setValue]);

  // =========================
  // Submit
  // =========================
  const onSubmit = async (formData) => {
    console.log("Form Data:", formData);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      alert("Registration successful!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Email */}
          <input
            placeholder="Email"
            {...register("email")}
            className="input"
          />
          <p className="error">{errors.email?.message}</p>

          {/* First Name */}
          <input
            placeholder="First Name"
            {...register("fname")}
            className="input"
          />
          <p className="error">{errors.fname?.message}</p>

          {/* Last Name */}
          <input
            placeholder="Last Name"
            {...register("lname")}
            className="input"
          />
          <p className="error">{errors.lname?.message}</p>

          {/* Mobile */}
          <input
            placeholder="Mobile"
            {...register("mobile")}
            className="input"
          />
          <p className="error">{errors.mobile?.message}</p>

          {/* Course */}
          <select {...register("course")} className="input">
            <option value="">Select Course</option>
            {loadingCourses ? (
              <option disabled>Loading...</option>
            ) : (
              courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseName}
                </option>
              ))
            )}
          </select>
          <p className="error">{errors.course?.message}</p>

          {/* SubCourse */}
          <select {...register("subCourse")} className="input">
            <option value="">Select SubCourse</option>

            {!selectedCourse ? (
              <option disabled>Select course first</option>
            ) : loadingSubCourses ? (
              <option disabled>Loading...</option>
            ) : subCourses.length === 0 ? (
              <option disabled>No subcourses</option>
            ) : (
              subCourses.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.subCourseName}
                </option>
              ))
            )}
          </select>
          <p className="error">{errors.subCourse?.message}</p>

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="input"
          />
          <p className="error">{errors.password?.message}</p>

          {/* Submit */}
          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;