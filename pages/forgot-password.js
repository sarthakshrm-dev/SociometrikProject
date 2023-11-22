import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loader from '../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

function ForgotPassword() {
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
      emailId: '',
    },
  });

  const onSubmit = async (data) => {
    setLoader(true);
    const res = await fetch(
      publicRuntimeConfig.API_ROOT_URL + 'users/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({
          email: data.emailId,
        }),
        headers: {
          'content-type': 'application/json',
        },
        redirect: 'follow',
      },
    );
    setLoader(false);
    if (res.ok) {
      const response = await res.json();
      router.push(response.redirect);
    } else {
      toast.error('User is not exist!');
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
            <h1 className="mt-4 mb-1 text-2xl font-medium">Forgot Password</h1>
            <p className="text-lg opacity-50">
              Please enter your registered email ID.
            </p>
            <form
              className="grid grid-cols-1 pt-5 gap-7"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="block pb-2 text-lg font-medium">
                  Email ID
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-transparent border rounded-lg"
                  placeholder="Enter your email ID"
                  {...register('emailId', {
                    required: true,
                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/i,
                  })}
                />
                {errors?.emailId?.type === 'required' && (
                  <p className="error">This field is required</p>
                )}
                {errors?.emailId?.type === 'pattern' && (
                  <p className="error">
                    You have entered an invalid email address!
                  </p>
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

  return {
    props: { session },
  };
}
