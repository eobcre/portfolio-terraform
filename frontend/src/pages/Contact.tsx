import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import Image from "../assets/bg-image-04.png";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    // console.log("data:", data);

    try {
      const res = await fetch(`/api/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Message sent!!!!");
      } else {
        alert("Error sending message.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  return (
    <div className="md:flex md:flex-col xl:grid xl:grid-cols-4 text-main font-custom min-h-screen xl:h-screen">
      {/* left */}
      <div className="flex flex-col gap-4 col-span-2 px-4 py-6">
        {/* back button */}
        <Link to="/" className="self-start">
          <Icon icon="ic:baseline-arrow-back-ios-new" className="cursor-pointer hover:opacity-60 transition-all duration-300 ease-out w-7.5 h-7.5" />
        </Link>
        {/* page title */}
        <div className="relative flex flex-col justify-center items-center flex-1 gap-6 py-20 xl:py-0">
          <img src={Image} alt="Image" className="absolute opacity-10 w-60 xl:w-100" />
          <p className="text-6xl md:text-8xl font-semibold">Contact</p>
          <p className="px-4">Open to new opportunities. Let's connect.</p>
        </div>
      </div>
      {/* right */}
      <div className="grid col-span-2 items-center xl:overflow-y-auto px-6 md:px-20 py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* name */}
          <div className="flex gap-2">
            <label>Name</label>
            {errors.name && <p className="text-sm text-red-500 my-1">{errors.name.message}</p>}
          </div>
          <input type="text" {...register("name", { required: "*" })} className="my-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none" />
          {/* email */}
          <div className="flex gap-2">
            <label>Email</label>
            {errors.email?.message && <p className="text-sm text-red-500 my-1">{errors.email.message}</p>}
          </div>
          <input
            type="text"
            {...register("email", {
              required: "*",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            className="my-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none"
          />
          {/* message */}
          <div className="flex gap-2">
            <label>Message</label>
            {errors.message && <p className="text-sm text-red-500 my-1">{errors.message.message}</p>}
          </div>
          <textarea
            {...register("message", {
              required: "*",
              minLength: {
                value: 10,
                message: "* Message must be at least 10 characters.",
              },
            })}
            className="rounded-lg border border-gray-200 px-3 py-2.5 outline-none resize-none mt-2 w-full h-60"
            placeholder="Write a message..."
          />
          {/* submit */}
          <div className="flex justify-center">
            <button type="submit" className="text-white bg-main rounded-md cursor-pointer hover:opacity-70 transition-all duration-300 ease-out mt-4 py-2.5 w-full ">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Contact;
