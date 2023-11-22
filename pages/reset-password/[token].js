import React, { useEffect, useState } from 'react';
import Image from 'next/image';
const { base64decode } = require('nodejs-base64');
import { useForm } from 'react-hook-form';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loader from '../../components/Loader';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword({ userId }) {
  const router = useRouter();
  const [error, setError] = useState();
  const [loader, setLoader] = useState(false);
  const { date: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (data) => {
    setLoader(true);
    debugger;
    const res = await fetch(
      publicRuntimeConfig.API_ROOT_URL + 'users/reset-password',
      {
        method: 'PATCH',
        body: JSON.stringify({
          password: data.password,
          userId: parseInt(userId),
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      },
    );
    setLoader(false);
    if (res.ok) {
      toast.success('Password changed successfully!');
      router.push('/login');
    } else {
      toast.error('Server Error!');
    }
  };

  return (
    <>
      {loader && <Loader />}
      <ToastContainer position="top-center" theme="colored" />
      <div className="flex min-h-screen">
        <div className="flex items-center justify-center p-12 basis-1/2">
          <div className="w-3/5">
            <Image
              width={'66'}
              height={'42'}
              src={'/images/logoLg.png'}
              alt="logo"
            />
            <h1 className="mt-4 mb-1 text-2xl font-medium">Reset Password</h1>
            <p className="text-lg opacity-50">
              Please enter your new password.
            </p>
            <form
              className="grid grid-cols-1 pt-5 gap-7"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="block pb-2 text-lg font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full p-4 bg-transparent border rounded-lg"
                  placeholder="Enter your password"
                  name="password"
                  {...register('password', {
                    required: true,
                    minLength: 6,
                    maxLength: 15,
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                  })}
                />
                {errors?.password?.type === 'required' && (
                  <p className="error">This field is required</p>
                )}
                {errors?.password?.type === 'minLength' && (
                  <p className="error">Password need minimum 6 characters</p>
                )}
                {errors?.password?.type === 'maxLength' && (
                  <p className="error">Password can not exceed 15 characters</p>
                )}
                {errors?.password?.type === 'pattern' && (
                  <p className="error">
                    password contain at least one numeric digit, one uppercase
                    and one lowercase letter
                  </p>
                )}
              </div>

              <div>
                <label className="block pb-2 text-lg font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full p-4 bg-transparent border rounded-lg"
                  placeholder="Enter your password"
                  name="confirmPassword"
                  {...register('confirmPassword', {
                    required: true,
                    validate: (val) => {
                      return watch('password') === val;
                    },
                  })}
                />
                {errors?.confirmPassword?.type === 'required' && (
                  <p className="error">This field is required</p>
                )}
                {errors?.confirmPassword?.type === 'validate' && (
                  <p className="error">Password is not matched</p>
                )}
              </div>

              {error && <p className="error">{error}</p>}
              <div>
                <button className="table w-full p-4 mt-3 text-lg rounded-lg bg-primary1">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className='basis-1/2 bg-[url("/images/loginReg.png")] bg-no-repeat bg-contain bg-center'></div>
      </div>
    </>
  );
}

export default ForgotPassword;

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
  const token = params.token;
  if (!token) {
    return {
      redirect: {
        destination: '/forgot-password',
        permanent: false,
      },
    };
  }
  const validity = base64decode(token.split('-')[1]);
  const now = Math.floor(Date.now() / 1000);
  if (now > validity) {
    return {
      redirect: {
        destination: '/forgot-password',
        permanent: false,
      },
    };
  }
  const userId = base64decode(token.split('-')[0]);

  return {
    props: { userId },
  };
}
