import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Loader from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExistingUser from './ExistingUser';
import { useState, useEffect } from 'react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

function AdminProfile({ user, close }) {
  const [isLoading, setIsLoading] = useState(false);
  const [memberTab, setMemberTab] = useState('addNewMember');
  const [existingUsers, setExistingUsers] = useState('');

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    let allUsers = await (
      await fetch(publicRuntimeConfig.API_ROOT_URL + 'users')
    ).json();
    setExistingUsers(allUsers);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailId: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    let raw = {
      email: data.emailId,
    };
    const res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'users/add/', {
      method: 'POST',
      body: JSON.stringify(raw),
      headers: {
        'content-type': 'application/json',
      },
      redirect: 'follow',
    });

    setIsLoading(false);
    if (res.ok) {
      toast.success('Request has been sent successfully!');
      await reset({
        emailId: '',
      });
    } else {
      const response = await res.json();
      toast.error(response.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <ToastContainer position="top-center" theme="colored" />
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-dark2 ">
        <div className="container max-w-3xl max-h-screen p-5 overflow-auto">
          <div className="flex justify-between mb-5 font-medium text-primary1">
            <button onClick={close} className="flex items-center">
              <span className="mr-2 text-sm icon-back-arrow"></span> Back to
              main view{' '}
            </button>
            <button
              onClick={() =>
                signOut({
                  callbackUrl: '/login',
                })
              }
            >
              Logout
            </button>
          </div>
          <div className="border p-7 border-primary1 rounded-2xl">
            <div className="flex items-center w-full mb-7">
              <div className="relative mr-3 border rounded-full w-11 h-11 border-primary1">
                <Image
                  layout="fill"
                  src="/images/profilePicture.png"
                  alt="Profile"
                />
              </div>
              <div>
                <div className="text-lg font-medium">{user.full_name}</div>
                <div>Admin</div>
              </div>
            </div>
            <div className="flex mb-9">
              <ul className="">
                <li className="mb-9">
                  <div className="mb-1 text-2xl icon-email text-primary1"></div>
                  <div className="font-medium">{user.email}</div>
                </li>
                <li className="mb-9">
                  <div className="mb-1 text-2xl icon-call text-primary1"></div>
                  <div className="font-medium">{user.phone}</div>
                </li>
                <li className="mb-9">
                  <div className="mb-1 text-2xl icon-group text-primary1"></div>
                  <div className="font-medium">{user.department}</div>
                </li>
                <li>
                  <div className="mb-1 text-2xl icon-bag text-primary1"></div>
                  <div className="font-medium">{user.designation}</div>
                </li>
              </ul>
              <div className="w-px bg-primary1 mx-9"></div>
              <div className="w-full">
                <ul className="flex mb-6 text-base font-medium text-primary1">
                  <li
                    className={
                      memberTab !== 'addNewMember'
                        ? 'opacity-50 cursor-pointer mr-8'
                        : 'mr-8'
                    }
                    onClick={() => setMemberTab('addNewMember')}
                  >
                    Add a new member
                  </li>
                  <li
                    className={
                      memberTab !== 'existingMember'
                        ? 'opacity-50 cursor-pointer'
                        : ''
                    }
                    onClick={() => setMemberTab('existingMember')}
                  >
                    Existing member
                  </li>
                </ul>
                {memberTab === 'addNewMember' && (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="mb-6 text-base font-medium">
                      Provide email ID of the user
                    </h2>
                    <div className="grid grid-cols-6 gap-3">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Email ID"
                          className="form-control"
                          {...register('emailId', {
                            required: true,
                            pattern:
                              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/i,
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
                      <div className="col-span-2">
                        <button className="btn-secondary">
                          Send an invite
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                {memberTab === 'existingMember' && (
                  <ExistingUser
                    users={existingUsers}
                    fetchUsers={() => getAllUsers()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminProfile;
