import type { NextPage } from 'next'
import Image from 'next/image'
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Datetime from "react-datetime";
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  roomNumber: string,
  datetime: Date
}

type Option = {
  label: React.ReactNode;
  value: string | number | string[];
};

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & { options: Option[] };

// eslint-disable-next-line react/display-name
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, ...props }, ref) => (
    <select ref={ref} {...props}>
      {options.map(({ label, value }) => (
        <option key={1} value={value}>{label}</option>
      ))}
    </select>
  )
);

const validateDate = (current: { isAfter: (arg0: moment.Moment) => any; }) => {
  return current.isAfter(moment());
};

const Home: NextPage = () => {
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

  

  const onSubmit = async (data: any) => {
    try{
      const response = await fetch('https://v1.nocodeapi.com/srotti/google_sheets/khfesFSyFZrBGMXc?tabId=Sheet1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'   
        },
        body: JSON.stringify([[data.firstName, data.lastName, data.email, data.service, data.roomNumber, data.datetime]])
      });
      await response.json();
      toast.success('Submitted Successfully 🚀🚀', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } catch(err){
      toast.error('Something went wrong...', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } finally {
      reset({
        firstName: null,
        lastName: null,
        email: null,
        service: 'cleaner',
        roomNumber: null,
        datetime: moment().add(1, 'day')
      });
    }
  };

  return (
      <div className="App">
        <div className="app__header">
          <h1>Complaint Form</h1>
          <Image alt="icon" src="/icon.png" width="70" height="70"/>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>First Name</label>
            <input {...register("firstName", {required:true})} placeholder="Alice" />
            {errors?.firstName && errors.firstName.type === 'required' && <p>Please enter the first name.</p>}
          </div>
  
          <div>
            <label>Last Name</label>
            <input {...register("lastName", {required:true})} placeholder="Joe" />
            {errors?.lastName && errors.lastName.type === 'required' && <p>Please enter the last name.</p>}
          </div>
  
          <div>
            <label htmlFor="email">Email</label>
            <input
              {...register("email", {required:true})}
              placeholder="alice_joe@example.com"
              type="email"
            />
            {errors?.email && errors.email.type === 'required' && <p>Please enter the email.</p>}
          </div>

          <div>
            <label>Room Number</label>
            <input {...register("roomNumber", {required:true})} placeholder="D103" />
            {errors?.roomNumber && errors.roomNumber.type === 'required' && <p>Please enter the room number.</p>}
          </div>
          <div>
          <label>Service</label>
          <Controller
           control={control}
           name="service"
           defaultValue={null}
           render={({field}) => (
          <Select
          onChange={(e) => field.onChange(e)}
            options={[
              { label: "Cleaner", value: "cleaner" },
              { label: "Plumber", value: "plumber" },
              { label: "Carpenter", value: "carpenter" },
              { label: "Electrician", value: "Electrician"}
            ]}
            />
            )}
          />
          {errors?.service && errors.service.type === 'required' && <p>Please select a service.</p>}
          </div>

          <div>
          <label>Pick Date and Time</label>
          <Controller
            control={control}
            name="datetime"
            defaultValue={null}
            render={({field}) => (
              <Datetime
                inputProps={{ placeholder: "Datetime Picker Here", required: true }}
                onChange={(e) => field.onChange(e)}
                isValidDate={validateDate}
              />
            )}
          />
          {errors?.datetime && errors.datetime.type === 'required' && <p>Please select date and time.</p>}
          </div>
  
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
            {/* Same as */}
            <ToastContainer />
          <input type="submit" />
        </form>
      </div>
  )
}

export default Home