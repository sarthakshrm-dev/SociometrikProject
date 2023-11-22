import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { getSession, signIn, useSession } from 'next-auth/react';
import Loader from '../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

function Register({ data }) {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { date: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    if (data.password) {
      router.push('/login');
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      emailId: data.email,
      password: '',
      phoneNo: '',
      designation: 'Select designation',
      department: 'Select department',
    },
  });

  const onSubmit = async (data) => {
    setLoader(true);
    const res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        email: data.emailId,
        full_name: data.fullName,
        password: data.password,
        phone: data.phoneNo,
        designation: data.designation,
        department: data.department,
      }),
      headers: {
        'content-type': 'application/json',
      },
      redirect: 'follow',
    });
    if (res.ok) {
      setLoader(false);
      toast.success('Registerd successfully!');
      await signIn('credentials', {
        redirect: false,
        email: data.emailId,
        password: data.password,
      });
    }
  };

  return (
    <>
      {loader && <Loader />}
      <ToastContainer position='top-center' theme='colored' />
      <div className='flex min-h-screen'>
        <div className='flex items-center justify-center p-12 basis-1/2'>
          <div className='w-4/5'>
            <Image
              width={'66'}
              height={'42'}
              src={'/images/logoLg.png'}
              alt='logo'
            />
            <h1 className='mt-4 mb-1 text-2xl font-medium'>Registration</h1>
            <p className='text-lg opacity-50'>Kindly fill in your details </p>
            <form
              className='grid grid-cols-2 pt-5 gap-7'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className='block pb-2 text-lg font-medium'>Name</label>
                <input
                  type='text'
                  className='w-full p-4 bg-transparent border rounded-lg'
                  placeholder='Enter your full name'
                  {...register('fullName', {
                    required: true,
                    maxLength: 30,
                    pattern: /^[A-Za-z ]+$/i,
                  })}
                />
                {errors?.fullName?.type === 'required' && (
                  <p className='error'>This field is required</p>
                )}
                {errors?.fullName?.type === 'maxLength' && (
                  <p className='error'>
                    First name cannot exceed 30 characters
                  </p>
                )}
                {errors?.fullName?.type === 'pattern' && (
                  <p className='error'>Alphabetical characters only</p>
                )}
              </div>
              <div>
                <label className='block pb-2 text-lg font-medium'>
                  Email ID
                </label>
                <input
                  type='text'
                  className='w-full p-4 bg-transparent border rounded-lg'
                  value={data.email}
                  disabled
                />
              </div>
              <div>
                <label className='block pb-2 text-lg font-medium'>
                  Phone Number
                </label>
                <input
                  type='text'
                  className='w-full p-4 bg-transparent border rounded-lg'
                  placeholder='Enter your phone number'
                  {...register('phoneNo', {
                    required: true,
                    pattern: /^\d{10}$/,
                  })}
                />
                {errors?.phoneNo?.type === 'required' && (
                  <p className='error'>This field is required</p>
                )}
                {errors?.phoneNo?.type === 'pattern' && (
                  <p className='error'>Not a valid Phone Number.</p>
                )}
              </div>
              <div>
                <label className='block pb-2 text-lg font-medium'>
                  Password
                </label>
                <input
                  type='password'
                  className='w-full p-4 bg-transparent border rounded-lg'
                  placeholder='Enter your password'
                  {...register('password', {
                    required: true,
                    minLength: 6,
                    maxLength: 15,
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                  })}
                />
                {errors?.password?.type === 'required' && (
                  <p className='error'>This field is required</p>
                )}
                {errors?.password?.type === 'minLength' && (
                  <p className='error'>Password need minimum 6 characters</p>
                )}
                {errors?.password?.type === 'maxLength' && (
                  <p className='error'>Password can not exceed 15 characters</p>
                )}
                {errors?.password?.type === 'pattern' && (
                  <p className='error'>
                    password contain at least one numeric digit, one uppercase
                    and one lowercase letter
                  </p>
                )}
              </div>
              <div>
                <label className='block pb-2 text-lg font-medium'>
                  Department
                </label>
                <select
                  className='w-full p-4 bg-transparent border rounded-lg'
                  {...register('department', {
                    required: true,
                  })}
                >
                  <option>Select department</option>
                  <option>Strategy</option>
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>Operations</option>
                  <option>Finance</option>
                  <option>Business Development</option>
                  <option>Management</option>
                  <option>Others</option>
                </select>
                {errors?.department?.type === 'required' && (
                  <p className='error'>This field is required</p>
                )}
              </div>
              <div>
                <label className='block pb-2 text-lg font-medium'>
                  Designation
                </label>
                <select
                  className='w-full p-4 bg-transparent border rounded-lg'
                  {...register('designation', {
                    required: true,
                  })}
                >
                  <option>Select designation</option>
                  <option>Strategy Head</option>
                  <option>Sales Head</option>
                  <option>Sales Manager</option>
                  <option>Sales Executive</option>
                  <option>Business Analyst</option>
                  <option>Growth Specialist</option>
                  <option>Marketing Head</option>
                  <option>Others</option>
                </select>
                {errors?.designation?.type === 'required' && (
                  <p className='error'>This field is required</p>
                )}
              </div>
              <div className='col-span-2'>
                <button className='table w-full p-4 mt-3 text-lg rounded-lg bg-primary1'>
                  Register
                </button>
                <p className='mt-5'>
                  Already an user?{' '}
                  <Link href='/login'>
                    <span className='cursor-pointer text-primary1'>
                      Login to your account
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className='basis-1/2 bg-[url("/images/loginReg.png")] bg-no-repeat bg-contain bg-center'></div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const { params } = context;
  console.log(params.registerID);
  // Fetch data from external API
  const res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'users/', {
    method: 'POST',
    body: JSON.stringify({
      _token: params.registerID,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
  });

  if (!res.ok) {
    return { notFound: true };
  }

  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default Register;
