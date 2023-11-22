import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getConfig from 'next/config';
import { useState } from 'react';
const { publicRuntimeConfig } = getConfig();

function ExistingUser({ users, fetchUsers, superAdmin }) {
  const [loader, setLoader] = useState();

  const deleteUser = async (userId) => {
    setLoader(userId);
    let raw = {
      id: userId,
    };
    const res = await fetch(
      publicRuntimeConfig.API_ROOT_URL + 'users/delete/',
      {
        method: 'POST',
        body: JSON.stringify(raw),
        headers: {
          'content-type': 'applicaation/json',
        },
        redirect: 'follow',
      },
    );

    if (res.ok) {
      setLoader(userId);
      fetchUsers();
      toast.success('User deleted successfully!');
    } else {
      setLoader();
      toast.error('Unable to delete user!');
    }
  };
  return (
    <div>
      <ToastContainer position="top-center" theme="colored" />
      {users.length ? (
        users.map((user, index) => (
          <div
            key={index}
            className="flex items-center pb-2 mb-2 border-b border-white/20 last:border-0 last:mb-0"
          >
            <div
              className={`grid w-full gap-3  ${
                superAdmin ? 'grid-cols-5' : 'grid-cols-2'
              }
              `}
            >
              <div>{user.full_name}</div>
              <div>{user.email}</div>
              <div>{user.designation}</div>
              <div>
                {user.level === 1
                  ? 'Super Admin'
                  : user.level === 2
                  ? 'Admin'
                  : 'Employee'}
              </div>
              <div>{user.phone}</div>
            </div>

            <div
              className={
                'text-right transition-all ' +
                (loader === user.id ? 'opacity-0' : '')
              }
            >
              <span
                className="text-red-300 cursor-pointer icon-cancel hover:text-red-500"
                title="Delete User"
                onClick={() => deleteUser(user.id)}
              ></span>
            </div>
          </div>
        ))
      ) : (
        <p className="p-2 mb-2">No user found</p>
      )}
    </div>
  );
}

export default ExistingUser;
