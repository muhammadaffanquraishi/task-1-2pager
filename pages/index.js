import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormContext } from "../context/FormContext";
import SideMenu from "../components/SideMenu";
import { toast } from "react-toastify";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    phone: yup
      .string()
      .matches(/^\d+$/, "Phone number must be numeric")
      .required("Phone number is required"),
    age: yup
      .number()
      .min(18, "You must be at least 18")
      .required("Age is required"),
  })
  .required();

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { setFormData } = useFormContext();

  const onSubmit = (data) => {
    try {
      setFormData(data);
      // Redirect to data page
      window.location.href = "/data";
    } catch (error) {
      toast.error("An error occurred while saving the data.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      <main style={{ padding: "20px", flex: 1 }}>
        <h1>Form Page</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Email:</label>
            <input type="email" {...register("email")} />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div>
            <label>Username:</label>
            <input type="text" {...register("username")} />
            {errors.username && <p>{errors.username.message}</p>}
          </div>
          <div>
            <label>Phone:</label>
            <input type="text" {...register("phone")} />
            {errors.phone && <p>{errors.phone.message}</p>}
          </div>
          <div>
            <label>Age:</label>
            <input type="number" {...register("age")} />
            {errors.age && <p>{errors.age.message}</p>}
          </div>
          <button type="submit">Save Data</button>
        </form>
      </main>
    </div>
  );
}
